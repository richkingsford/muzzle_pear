const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const appUrl = "http://127.0.0.1:4173";
const port = 9500 + Math.floor(Math.random() * 300);
const userDataDir = path.join(os.tmpdir(), `sudoku-cdp-${Date.now()}`);
const failures = [];
const browserIssues = [];

function assert(condition, message, details) {
  if (!condition) {
    failures.push(details ? `${message}: ${JSON.stringify(details)}` : message);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CdpClient {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = [];
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) {
          pending.reject(new Error(message.error.message));
        } else {
          pending.resolve(message.result || {});
        }
      } else {
        this.listeners.slice().forEach((listener) => listener(message));
      }
    });
  }

  async send(method, params = {}, sessionId) {
    await this.ready;
    const id = this.nextId;
    this.nextId += 1;
    const payload = { id, method, params };
    if (sessionId) {
      payload.sessionId = sessionId;
    }

    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`Timed out waiting for ${method}`));
        }
      }, 10000);
    });

    this.ws.send(JSON.stringify(payload));
    return promise;
  }

  waitFor(method, sessionId) {
    return new Promise((resolve, reject) => {
      let cleanup;
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Timed out waiting for ${method}`));
      }, 10000);
      const listener = (message) => {
        if (message.method === method && message.sessionId === sessionId) {
          cleanup();
          resolve(message.params || {});
        }
      };
      cleanup = () => {
        clearTimeout(timer);
        this.listeners = this.listeners.filter((item) => item !== listener);
      };
      this.listeners.push(listener);
    });
  }

  on(listener) {
    this.listeners.push(listener);
  }

  close() {
    this.ws.close();
  }
}

async function waitForJson(url) {
  for (let index = 0; index < 60; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch {
      // Try again while Chrome is opening the DevTools socket.
    }
    await wait(250);
  }

  throw new Error("Chrome DevTools did not start");
}

async function main() {
  await fs.mkdir(userDataDir, { recursive: true });
  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-extensions",
      "--no-first-run",
      "--no-default-browser-check",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      "about:blank"
    ],
    { stdio: "ignore" }
  );

  let cdp;
  try {
    const version = await waitForJson(`http://127.0.0.1:${port}/json/version`);
    cdp = new CdpClient(version.webSocketDebuggerUrl);
    await cdp.ready;
    cdp.on((message) => {
      if (message.method === "Runtime.exceptionThrown") {
        browserIssues.push(message.params.exceptionDetails.text);
      }
      if (message.method === "Log.entryAdded" && ["error", "warning"].includes(message.params.entry.level)) {
        browserIssues.push(`${message.params.entry.level}: ${message.params.entry.text}`);
      }
      if (message.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(message.params.type)) {
        browserIssues.push(`console.${message.params.type}`);
      }
    });

    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    await cdp.send("Runtime.enable", {}, sessionId);
    await cdp.send("Log.enable", {}, sessionId);
    await cdp.send("Page.enable", {}, sessionId);
    const loaded = cdp.waitFor("Page.loadEventFired", sessionId);
    await cdp.send("Page.navigate", { url: appUrl }, sessionId);
    await loaded;

    async function evalPage(expression) {
      const result = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, sessionId);
      if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.text || "Evaluation failed");
      }
      return result.result.value;
    }

    const home = await evalPage(`(async () => {
      const sudoku = document.querySelector('[data-game="sudoku"]');
      const chemistry = document.querySelector('[data-game="chem-search"]');
      const featured = document.querySelector('.game-card.featured');
      const homeThemeButtonStyle = getComputedStyle(document.querySelector('#homeThemeToggle'));
      const featuredStyle = getComputedStyle(featured);
      const featuredTitleStyle = getComputedStyle(featured.querySelector('.game-title'));
      const featuredTagStyle = getComputedStyle(featured.querySelector('.game-tag'));
      const sudokuTagStyle = getComputedStyle(sudoku.querySelector('.game-tag'));
      const chemistryStyle = getComputedStyle(chemistry);
      const chemistryTitleStyle = getComputedStyle(chemistry.querySelector('.game-title'));
      const chemistryAccentStyle = getComputedStyle(chemistry, '::after');
      const chemistryArtStyle = getComputedStyle(document.querySelector('.chem-search-art'));
      const chemistryArtCellStyle = getComputedStyle(document.querySelector('.chem-search-art span'));
      const sudokuArtStyle = getComputedStyle(document.querySelector('.sudoku-art'));
      const sudokuArtCellStyle = getComputedStyle(document.querySelector('.sudoku-art span'));
      const masterArtStyle = getComputedStyle(document.querySelector('.master-art'));
      const masterCodeLidStyle = getComputedStyle(document.querySelector('.code-lid'));
      const before = {
        homeHidden: document.querySelector('#homeShell').hidden,
        appHidden: document.querySelector('#appShell').hidden,
        title: document.querySelector('.home-hero h1').textContent,
        gameCount: document.querySelectorAll('.game-card').length,
        firstGame: document.querySelector('.game-gallery .game-card')?.dataset.game,
        featuredGame: featured?.dataset.game,
        featuredTitle: featured.querySelector('.game-title')?.textContent,
        featuredStyle: {
          backgroundImage: featuredStyle.backgroundImage,
          titleColor: featuredTitleStyle.color,
          tagColor: featuredTagStyle.color
        },
        homeThemeText: document.querySelector('#homeThemeToggle').textContent,
        homeThemeButtonStyle: {
          backgroundColor: homeThemeButtonStyle.backgroundColor,
          borderColor: homeThemeButtonStyle.borderColor,
          boxShadow: homeThemeButtonStyle.boxShadow
        },
        chessCards: document.querySelectorAll('[data-game="chess"]').length,
        chessPieces: document.querySelectorAll('.chess-piece').length,
        chemistryTitle: chemistry.querySelector('.game-title').textContent,
        chemistryArtCells: document.querySelectorAll('.chem-search-art span').length,
        chemistryTile: getComputedStyle(chemistry).getPropertyValue('--tile').trim(),
        chemistryStyle: {
          backgroundImage: chemistryStyle.backgroundImage,
          titleColor: chemistryTitleStyle.color,
          accentBackground: chemistryAccentStyle.backgroundImage
        },
        lightArtStyle: {
          chemistryArtBackground: chemistryArtStyle.backgroundImage,
          chemistryCellColor: chemistryArtCellStyle.color,
          sudokuArtBackground: sudokuArtStyle.backgroundImage,
          sudokuCellColor: sudokuArtCellStyle.color,
          masterArtBackground: masterArtStyle.backgroundImage,
          masterCodeLidColor: masterCodeLidStyle.color
        },
        sudokuTagColor: sudokuTagStyle.color,
        spiderCards: document.querySelectorAll('.playing-card').length,
        webSpider: document.querySelectorAll('.web-spider').length,
        mastermindRows: document.querySelectorAll('.master-art .guess-row').length,
        mastermindFeedback: document.querySelectorAll('.master-art .feedback span').length,
        logicRevealMarks: document.querySelectorAll('.logic-cell.reveal-mark').length,
        wordRows: document.querySelectorAll('.word-art .word-row').length,
        wordTitle: document.querySelector('[data-game="wordle-like"] .game-title').textContent,
        mathCards: document.querySelectorAll('[data-game="arithmettle"]').length,
        logicPeople: document.querySelectorAll('.logic-icon.person').length,
        logicPets: document.querySelectorAll('.logic-icon.pet').length,
        logicEmpty: document.querySelectorAll('.logic-empty').length,
        sudokuTitle: sudoku.querySelector('.game-title').textContent
      };
      document.querySelector('#homeThemeToggle').click();
      const homeThemeAfterClick = {
        dark: document.body.classList.contains('dark'),
        homeText: document.querySelector('#homeThemeToggle').textContent
      };
      document.querySelector('#homeThemeToggle').click();
      chemistry.click();
      const chemLevelSelect = document.querySelector('#chemSearchLevelSelect');
      const allChemLevels = Array.from(chemLevelSelect.options).map((option, index) => {
        chemLevelSelect.value = String(index);
        chemLevelSelect.dispatchEvent(new Event('change', { bubbles: true }));
        return {
          label: option.textContent,
          cells: document.querySelectorAll('.chem-search-cell').length,
          words: document.querySelectorAll('.chem-search-word').length
        };
      });
      chemLevelSelect.value = "0";
      chemLevelSelect.dispatchEvent(new Event('change', { bubbles: true }));
      const chemGameBoardStyle = getComputedStyle(document.querySelector('.chem-search-board'));
      const chemGameCellStyle = getComputedStyle(document.querySelector('.chem-search-cell'));
      const chemGameThemeStyle = {
        boardBackground: chemGameBoardStyle.backgroundImage,
        boardBorder: chemGameBoardStyle.borderColor,
        cellColor: chemGameCellStyle.color
      };
      const chemCells = Array.from(document.querySelectorAll('.chem-search-cell'));
      const chemSize = Math.sqrt(chemCells.length);
      const directions = [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]];
      const visibleWords = Array.from(document.querySelectorAll('.chem-search-word')).map((word) => word.textContent);
      const findWord = (word) => {
        for (let row = 0; row < chemSize; row += 1) {
          for (let col = 0; col < chemSize; col += 1) {
            for (const [rowStep, colStep] of directions) {
              const path = [];
              let text = "";
              for (let offset = 0; offset < word.length; offset += 1) {
                const nextRow = row + rowStep * offset;
                const nextCol = col + colStep * offset;
                if (nextRow < 0 || nextRow >= chemSize || nextCol < 0 || nextCol >= chemSize) {
                  break;
                }
                const index = nextRow * chemSize + nextCol;
                path.push(index);
                text += chemCells[index].textContent;
              }
              if (text === word) {
                return path;
              }
            }
          }
        }
        return [];
      };
      const findInvalidPath = () => {
        for (let row = 0; row < chemSize; row += 1) {
          for (let col = 0; col < chemSize; col += 1) {
            for (const [rowStep, colStep] of directions) {
              const path = [];
              let text = "";
              for (let offset = 0; offset < 4; offset += 1) {
                const nextRow = row + rowStep * offset;
                const nextCol = col + colStep * offset;
                if (nextRow < 0 || nextRow >= chemSize || nextCol < 0 || nextCol >= chemSize) {
                  break;
                }
                const index = nextRow * chemSize + nextCol;
                path.push(index);
                text += chemCells[index].textContent;
              }
              const reversed = text.split("").reverse().join("");
              if (path.length === 4 && !visibleWords.includes(text) && !visibleWords.includes(reversed)) {
                return path;
              }
            }
          }
        }
        return [];
      };
      document.querySelector('#chemSearchHint').click();
      const hintCell = document.querySelector('.chem-search-cell.hint');
      const hintState = {
        cells: document.querySelectorAll('.chem-search-cell.hint').length,
        animationName: hintCell ? getComputedStyle(hintCell).animationName : ""
      };
      const invalidPath = findInvalidPath();
      if (invalidPath.length) {
        document.querySelectorAll('.chem-search-cell')[invalidPath[0]].click();
        document.querySelectorAll('.chem-search-cell')[invalidPath[invalidPath.length - 1]].click();
      }
      const invalidDuring = {
        bars: document.querySelectorAll('.chem-search-bar.invalid').length,
        animationName: document.querySelector('.chem-search-bar.invalid')
          ? getComputedStyle(document.querySelector('.chem-search-bar.invalid')).animationName
          : ""
      };
      await new Promise((resolve) => setTimeout(resolve, 1300));
      const invalidAfter = document.querySelectorAll('.chem-search-bar.invalid').length;
      const atomPath = findWord("ATOM");
      const clickChemPath = (path) => {
        const liveCells = document.querySelectorAll('.chem-search-cell');
        liveCells[path[0]].click();
        liveCells[path[path.length - 1]].click();
      };
      if (atomPath.length) {
        clickChemPath(atomPath);
      }
      const foundAtom = document.querySelector('.chem-search-word.found')?.textContent === 'ATOM';
      const solvedWords = [];
      visibleWords
        .filter((word) => word !== "ATOM")
        .forEach((word) => {
          const path = findWord(word);
          if (path.length) {
            clickChemPath(path);
            solvedWords.push(word);
          }
        });
      const celebrationDuring = {
        hidden: document.querySelector('#arcadeCelebration').hidden,
        confetti: document.querySelectorAll('#arcadeCelebration .arcade-confetti span').length,
        countdown: document.querySelector('#arcadeCelebration .arcade-countdown')?.textContent || "",
        levelValue: document.querySelector('#chemSearchLevelSelect').value
      };
      await new Promise((resolve) => setTimeout(resolve, 3250));
      const celebrationAfter = {
        hidden: document.querySelector('#arcadeCelebration').hidden,
        levelValue: document.querySelector('#chemSearchLevelSelect').value,
        cells: document.querySelectorAll('.chem-search-cell').length,
        words: document.querySelectorAll('.chem-search-word').length
      };
      const chemistryScreen = {
        title: document.querySelector('#chemSearchShell h1').textContent,
        cells: document.querySelectorAll('.chem-search-cell').length,
        levelOptions: document.querySelectorAll('#chemSearchLevelSelect option').length,
        wordCount: document.querySelectorAll('.chem-search-word').length,
        allLevels: allChemLevels,
        checkButtons: document.querySelectorAll('#chemSearchCheck').length,
        lessonPanels: document.querySelectorAll('#chemSearchLessonPanel').length,
        messagePanels: document.querySelectorAll('#chemSearchMessagePanel').length,
        themeStyle: chemGameThemeStyle,
        hintState,
        invalidDuring,
        invalidAfter,
        foundAtom,
        solvedWords,
        celebrationDuring,
        celebrationAfter,
        homeHidden: document.querySelector('#homeShell').hidden,
        shellHidden: document.querySelector('#chemSearchShell').hidden
      };
      document.querySelector('#chemSearchHomeButton').click();
      document.querySelector('[data-game="mastermind"]').click();
      const masterGameBoardStyle = getComputedStyle(document.querySelector('.master-board-play'));
      const masterGamePaletteStyle = getComputedStyle(document.querySelector('.master-palette'));
      const masterGamePegStyle = getComputedStyle(document.querySelector('.master-code-peg'));
      const mastermindScreen = {
        boardBackground: masterGameBoardStyle.backgroundImage,
        boardBorder: masterGameBoardStyle.borderColor,
        paletteBackground: masterGamePaletteStyle.backgroundImage,
        paletteBackgroundColor: masterGamePaletteStyle.backgroundColor,
        pegBackground: masterGamePegStyle.backgroundImage,
        pegBorder: masterGamePegStyle.borderColor
      };
      document.querySelector('#masterHomeButton').click();
      document.querySelector('#homeThemeToggle').click();
      document.querySelector('[data-game="minesweeper"]').click();
      const minesGameBoardStyle = getComputedStyle(document.querySelector('.mines-board'));
      const minesGameCellStyle = getComputedStyle(document.querySelector('.mines-cell'));
      const minesweeperDarkScreen = {
        dark: document.body.classList.contains('dark'),
        boardBackground: minesGameBoardStyle.backgroundImage,
        boardBackgroundColor: minesGameBoardStyle.backgroundColor,
        boardBorder: minesGameBoardStyle.borderColor,
        cellBackground: minesGameCellStyle.backgroundImage,
        cellColor: minesGameCellStyle.color
      };
      document.querySelector('#minesHomeButton').click();
      document.querySelector('#homeThemeToggle').click();
      sudoku.click();
      return {
        ...before,
        homeThemeAfterClick,
        chemistryScreen,
        mastermindScreen,
        minesweeperDarkScreen,
        afterHomeHidden: document.querySelector('#homeShell').hidden,
        afterAppHidden: document.querySelector('#appShell').hidden
      };
    })()`);
    assert(home.homeHidden === false && home.appHidden === true, "Home screen should show before entering Sudoku", home);
    assert(home.title === "Choose Your Brain Spark" && home.gameCount === 7, "Home screen should show the active launchers", home);
    assert(
      home.firstGame === "grid-logic" &&
        home.featuredGame === "grid-logic" &&
        home.featuredTitle === "Grid Logic Game",
      "Grid Logic should be the large first homepage launcher",
      home
    );
    assert(
      home.featuredStyle.backgroundImage.includes("rgb(255, 255, 255)") &&
        home.featuredStyle.titleColor === "rgb(20, 33, 58)" &&
        home.featuredStyle.tagColor === "rgb(71, 86, 114)" &&
        home.sudokuTagColor === "rgb(71, 86, 114)",
      "Light homepage cards should use light surfaces with readable dark text",
      home.featuredStyle
    );
    assert(
      home.lightArtStyle.chemistryArtBackground.includes("rgb(255, 255, 255)") &&
        home.lightArtStyle.sudokuArtBackground.includes("rgb(255, 255, 255)") &&
        home.lightArtStyle.masterArtBackground.includes("rgb(255, 255, 255)") &&
        home.lightArtStyle.chemistryCellColor === "rgb(20, 33, 58)" &&
        home.lightArtStyle.sudokuCellColor === "rgb(20, 33, 58)" &&
        home.lightArtStyle.masterCodeLidColor === "rgb(111, 29, 85)",
      "Light homepage launcher art should avoid dark-mode panels inside the buttons",
      home.lightArtStyle
    );
    assert(home.homeThemeText === "Dark" && home.homeThemeAfterClick.dark && home.homeThemeAfterClick.homeText === "Light", "Home theme toggle should switch dark/light mode", home);
    assert(
      home.homeThemeButtonStyle.backgroundColor !== "rgba(0, 0, 0, 0)" &&
        home.homeThemeButtonStyle.boxShadow !== "none",
      "Light mode ghost buttons should have a visible polished surface",
      home.homeThemeButtonStyle
    );
    assert(home.chessCards === 0 && home.chessPieces === 0, "Chess launcher should be commented out", home);
    assert(
      home.chemistryTitle === "Chemistry Word Search" &&
        home.chemistryArtCells === 16 &&
        home.chemistryStyle.backgroundImage.includes("rgb(255, 255, 255)") &&
        home.chemistryStyle.titleColor === "rgb(20, 33, 58)" &&
        home.chemistryStyle.accentBackground.includes("linear-gradient"),
      "Chemistry Word Search launcher should use the light homepage button style",
      home
    );
    assert(
      home.chemistryScreen.title === "Chemistry Word Search" &&
        home.chemistryScreen.cells === 49 &&
        home.chemistryScreen.levelOptions === 12 &&
        home.chemistryScreen.wordCount === 4 &&
        home.chemistryScreen.allLevels.length === 12 &&
        home.chemistryScreen.allLevels.every((level) => level.cells >= 36 && level.words >= 4) &&
        home.chemistryScreen.checkButtons === 0 &&
        home.chemistryScreen.lessonPanels === 0 &&
        home.chemistryScreen.messagePanels === 0 &&
        home.chemistryScreen.themeStyle.boardBackground.includes("rgb(255, 255, 255)") &&
        !home.chemistryScreen.themeStyle.boardBackground.includes("rgb(16, 24, 39)") &&
        home.chemistryScreen.themeStyle.cellColor === "rgb(20, 33, 58)" &&
        home.chemistryScreen.hintState.cells === 1 &&
        home.chemistryScreen.hintState.animationName === "chem-search-letter-wiggle" &&
        home.chemistryScreen.invalidDuring.bars === 1 &&
        home.chemistryScreen.invalidDuring.animationName === "chem-search-wrong-line" &&
        home.chemistryScreen.invalidAfter === 0 &&
        home.chemistryScreen.foundAtom &&
        home.chemistryScreen.solvedWords.length === 3 &&
        home.chemistryScreen.celebrationDuring.hidden === false &&
        home.chemistryScreen.celebrationDuring.confetti === 32 &&
        home.chemistryScreen.celebrationDuring.countdown === "Next level in 3" &&
        home.chemistryScreen.celebrationDuring.levelValue === "0" &&
        home.chemistryScreen.celebrationAfter.hidden === true &&
        home.chemistryScreen.celebrationAfter.levelValue === "1" &&
        home.chemistryScreen.celebrationAfter.cells === 49 &&
        home.chemistryScreen.homeHidden &&
        !home.chemistryScreen.shellHidden,
      "Chemistry Word Search should launch, celebrate a win, and advance",
      home.chemistryScreen
    );
    assert(
      home.mastermindScreen.boardBackground.includes("rgb(255, 255, 255)") &&
        home.mastermindScreen.paletteBackground.includes("255, 255, 255") &&
        home.mastermindScreen.paletteBackgroundColor === "rgb(255, 255, 255)" &&
        !home.mastermindScreen.boardBackground.includes("rgb(21, 28, 49)") &&
        !home.mastermindScreen.paletteBackgroundColor.includes("31, 41, 66"),
      "Light Mastermind screen should use light board and palette surfaces",
      home.mastermindScreen
    );
    assert(
      home.minesweeperDarkScreen.dark &&
        home.minesweeperDarkScreen.boardBackgroundColor === "rgb(17, 24, 39)" &&
        home.minesweeperDarkScreen.cellBackground.includes("rgb(38, 50, 76)") &&
        !home.minesweeperDarkScreen.cellBackground.includes("rgb(120, 227, 218)") &&
        !home.minesweeperDarkScreen.cellBackground.includes("rgb(66, 194, 198)"),
      "Dark Minesweeper screen should use dark board cells instead of light aqua tiles",
      home.minesweeperDarkScreen
    );
    assert(home.logicPeople === 3 && home.logicPets === 3 && home.logicEmpty === 1, "Grid Logic launcher should keep one invisible corner plus people and pets", home);
    assert(home.logicRevealMarks === 3, "Grid Logic launcher should hide some marks until hover", home);
    assert(home.spiderCards === 3 && home.webSpider === 1, "Spider launcher should show three SVG playing cards and one dangling spider", home);
    assert(home.mastermindRows === 3 && home.mastermindFeedback === 12, "Mastermind launcher should simulate guesses and feedback pegs", home);
    assert(home.wordRows === 3 && home.wordTitle === "Word Vault" && home.mathCards === 0, "Word Vault should remain and Arithmettle should be removed", home);
    assert(home.sudokuTitle === "Sudoku", "Sudoku game title should be present", home);
    assert(home.afterHomeHidden === true && home.afterAppHidden === false, "Sudoku launcher should enter the app", home);

    const initial = await evalPage(`(() => {
      const topCells = Array.from(document.querySelectorAll('.cell')).slice(0, 27).map((cell) => {
        const rect = cell.getBoundingClientRect();
        return { width: rect.width, height: rect.height, top: rect.top };
      });
      const heights = topCells.map((rect) => Math.round(rect.height * 100) / 100);
      const widths = topCells.map((rect) => Math.round(rect.width * 100) / 100);
      return {
        cells: document.querySelectorAll('.cell').length,
        levelOptions: document.querySelectorAll('#levelSelect option').length,
        selectedLevel: document.querySelector('#levelSelect').value,
        difficulty: document.querySelector('#difficultyPill').textContent,
        progress: document.querySelector('#progressText').textContent,
        autoNotes: document.querySelector('#autoNotes').checked,
        r1c6Notes: document.querySelector('[data-index="5"] .notes').textContent.replace(/\\s/g, ''),
        heightSpread: Math.max(...heights) - Math.min(...heights),
        widthSpread: Math.max(...widths) - Math.min(...widths),
        rowTops: [...new Set(topCells.map((rect) => Math.round(rect.top)))].length
      };
    })()`);
    assert(initial.cells === 81, "Board should render 81 cells", initial);
    assert(initial.levelOptions === 7, "Level selector should have seven levels", initial);
    assert(initial.selectedLevel === "6", "Default should open the hardest non-master training level", initial);
    assert(initial.difficulty === "Level 7: Expert", "Difficulty pill should show level and difficulty", initial);
    assert(initial.progress === "25 filled", "Default level should start with 25 givens", initial);
    assert(initial.autoNotes === true && initial.r1c6Notes === "28", "Auto notes should still render on the default level", initial);
    assert(initial.heightSpread <= 1 && initial.widthSpread <= 1 && initial.rowTops === 3, "Top three boxes should have equal cell geometry", initial);

    const manual = await evalPage(`(() => {
      document.querySelector('[data-index="1"]').click();
      document.querySelector('#pencilToggle').click();
      Array.from(document.querySelectorAll('.number-button')).find((button) => button.textContent === '4').click();
      const sticky = {
        autoNotes: document.querySelector('#autoNotes').checked,
        pencilActive: document.querySelector('#pencilToggle').classList.contains('active'),
        value: document.querySelector('[data-index="1"] .value').textContent,
        notes: document.querySelector('[data-index="1"] .notes').textContent.replace(/\\s/g, '')
      };
      document.querySelector('#pencilToggle').click();
      document.querySelector('#noteOnce').click();
      Array.from(document.querySelectorAll('.number-button')).find((button) => button.textContent === '6').click();
      const once = {
        oneShotActive: document.querySelector('#noteOnce').classList.contains('active'),
        notes: document.querySelector('[data-index="1"] .notes').textContent.replace(/\\s/g, '')
      };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', bubbles: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: '8', shiftKey: true, bubbles: true }));
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift', bubbles: true }));
      const shift = {
        oneShotActive: document.querySelector('#noteOnce').classList.contains('active'),
        notes: document.querySelector('[data-index="1"] .notes').textContent.replace(/\\s/g, '')
      };
      return { sticky, once, shift };
    })()`);
    assert(manual.sticky.autoNotes === false, "Pencil mode should turn off auto notes for manual notes", manual);
    assert(manual.sticky.pencilActive === true, "Sticky pencil mode should activate from the left half", manual);
    assert(manual.sticky.value === "" && manual.sticky.notes === "4", "Sticky pencil mode should add a note without filling the cell", manual);
    assert(manual.once.oneShotActive === false && manual.once.notes === "46", "One-shot pencil half should add one note and disarm", manual);
    assert(manual.shift.oneShotActive === false && manual.shift.notes === "468", "Holding Shift should add a temporary note", manual);

    const levelsAndChem = await evalPage(`(() => {
      const select = document.querySelector('#levelSelect');
      select.value = '0';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      const level = {
        value: select.value,
        progress: document.querySelector('#progressText').textContent,
        difficulty: document.querySelector('#difficultyPill').textContent,
        label: select.options[select.selectedIndex].textContent
      };
      document.querySelector('#chemistryLink').click();
      const popup = document.querySelector('#chemistryPopup');
      const chemistry = {
        hidden: popup.hidden,
        paragraphs: popup.querySelectorAll('p').length,
        text: popup.textContent.replace(/\\s+/g, ' ').trim(),
        expanded: document.querySelector('#chemistryLink').getAttribute('aria-expanded')
      };
      document.querySelector('#chemistryClose').click();
      chemistry.closed = popup.hidden;
      return { level, chemistry };
    })()`);
    assert(levelsAndChem.level.value === "0" && levelsAndChem.level.progress === "47 filled", "Level selector should load level 1", levelsAndChem.level);
    assert(!/master/i.test(levelsAndChem.level.label), "Level labels should not call anything master", levelsAndChem.level);
    assert(levelsAndChem.chemistry.hidden === false && levelsAndChem.chemistry.paragraphs === 2, "Chemistry link should open a two-line popup", levelsAndChem.chemistry);
    assert(levelsAndChem.chemistry.text.includes("constraint thinking") && levelsAndChem.chemistry.closed === true, "Chemistry popup should explain and close", levelsAndChem.chemistry);

    const overlays = await evalPage(`(() => {
      const select = document.querySelector('#levelSelect');
      select.value = '6';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      const out = {};
      for (const technique of ['pair', 'trio', 'hidden-single', 'pointing', 'xwing']) {
        document.querySelector('[data-technique="' + technique + '"]').click();
        out[technique] = {
          anchors: document.querySelectorAll('.hint-anchor').length,
          removals: document.querySelectorAll('.hint-removal').length,
          corners: document.querySelectorAll('.hint-corner').length,
          blocked: document.querySelectorAll('.hint-blocked').length,
          anchorBadges: document.querySelectorAll('.hint-anchor .candidate-hit, .hint-corner .candidate-hit').length,
          removalBadges: document.querySelectorAll('.hint-removal .candidate-hit').length,
          panel: document.querySelector('#hintPanel').textContent.replace(/\\s+/g, ' ').trim()
        };
      }
      return out;
    })()`);
    assert(overlays.pair.anchors === 2 && overlays.pair.removals === 1, "Pair overlay should still work on level 7", overlays.pair);
    assert(overlays.trio.anchors === 3 && overlays.trio.removals === 3, "Trio overlay should still work on level 7", overlays.trio);
    assert(overlays["hidden-single"].anchors === 1 && overlays["hidden-single"].removals === 0, "Hidden single overlay should show one target cell", overlays["hidden-single"]);
    assert(overlays["hidden-single"].blocked === 9, "Hidden single overlay should show related cells where the digit is ruled out", overlays["hidden-single"]);
    assert(overlays.pointing.anchors === 2 && overlays.pointing.removals === 1, "Pointing overlay should show pointing cells and removals", overlays.pointing);
    assert(overlays.xwing.corners === 4 && overlays.xwing.removals === 1, "X-Wing overlay should still work on level 7", overlays.xwing);
    assert(overlays.trio.anchorBadges === 8 && overlays.trio.removalBadges === 4, "Trio pattern cells should highlight only their visible candidates", overlays.trio);
    assert(
      overlays["hidden-single"].anchorBadges === 1 &&
        overlays["hidden-single"].panel.includes("only one possible cell") &&
        overlays["hidden-single"].panel.includes("5 ruled out"),
      "Hidden single panel should explain the forced digit and ruled-out cells",
      overlays["hidden-single"]
    );
    assert(overlays.pointing.panel.includes("same row or column") && overlays.pointing.panel.includes("outside that box"), "Pointing panel should explain box-to-line elimination", overlays.pointing);
    assert(!/R\d+C\d+/.test(Object.values(overlays).map((overlay) => overlay.panel).join(" ")), "Hint panels should avoid compact cell references", overlays);
    assert(overlays.trio.panel.includes("three open cells") && overlays.trio.panel.includes("may show only two"), "Trio explanation should clarify subset candidates", overlays.trio);

    const darkHintBadge = await evalPage(`(() => {
      document.querySelector('#themeToggle').click();
      document.querySelector('[data-technique="trio"]').click();
      const badge = document.querySelector('.candidate-hit');
      const style = getComputedStyle(badge);
      return {
        color: style.color,
        background: style.backgroundColor,
        text: badge.textContent
      };
    })()`);
    assert(darkHintBadge.color === "rgb(17, 24, 39)", "Dark-mode highlighted candidates should use dark text", darkHintBadge);
    assert(darkHintBadge.background === "rgb(255, 209, 102)", "Dark-mode highlighted candidates should stay yellow", darkHintBadge);

    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, sessionId);
    const mobile = await evalPage(`(() => {
      document.querySelector('#homeButton').click();
      if (document.body.classList.contains('dark')) {
        document.querySelector('#homeThemeToggle').click();
      }
      const themeToggleRect = document.querySelector('#homeThemeToggle').getBoundingClientRect();
      const heroTitleRect = document.querySelector('.home-hero h1').getBoundingClientRect();
      const chemistryTitleRect = document.querySelector('.chem-search-card .game-title').getBoundingClientRect();
      const chemistryCardRect = document.querySelector('.chem-search-card').getBoundingClientRect();
      const home = {
        scrollWidth: document.documentElement.scrollWidth,
        windowWidth: window.innerWidth,
        gameCards: document.querySelectorAll('.game-card').length,
        firstCardWidth: Math.round(document.querySelector('.game-card').getBoundingClientRect().width),
        heroButtonOverlapsTitle: !(
          themeToggleRect.right < heroTitleRect.left ||
          themeToggleRect.left > heroTitleRect.right ||
          themeToggleRect.bottom < heroTitleRect.top ||
          themeToggleRect.top > heroTitleRect.bottom
        ),
        chemistryBarBottomGap: Math.round(chemistryCardRect.bottom - chemistryTitleRect.bottom)
      };
      document.querySelector('[data-game="sudoku"]').click();
      return {
        home,
        app: {
          scrollWidth: document.documentElement.scrollWidth,
          windowWidth: window.innerWidth,
          visibleCells: Array.from(document.querySelectorAll('.cell')).filter((cell) => cell.getBoundingClientRect().width > 0).length,
          board: Math.round(document.querySelector('.sudoku-board').getBoundingClientRect().width)
        }
      };
    })()`);
    assert(
      mobile.home.scrollWidth <= mobile.home.windowWidth + 1 &&
        mobile.home.gameCards === 7 &&
        mobile.home.firstCardWidth > 300 &&
        !mobile.home.heroButtonOverlapsTitle &&
        mobile.home.chemistryBarBottomGap >= 24,
      "Mobile light homepage layout should fit, stack game cards, and keep controls/text clear",
      mobile.home
    );
    assert(mobile.app.scrollWidth <= mobile.app.windowWidth + 1 && mobile.app.visibleCells === 81 && mobile.app.board > 300, "Mobile app layout should fit and show all cells", mobile.app);

    await wait(250);
    assert(browserIssues.length === 0, "Browser should have no console warnings or errors", browserIssues);

    if (failures.length) {
      console.error("BROWSER_CHECK_FAILED");
      failures.forEach((failure) => console.error(`- ${failure}`));
      process.exitCode = 1;
    } else {
      console.log("BROWSER_CHECK_PASSED");
      console.log(JSON.stringify({ home, initial, manual, levelsAndChem, overlays, mobile, browserIssues }, null, 2));
    }

    await cdp.send("Browser.close");
  } finally {
    if (cdp) {
      cdp.close();
    }
    chrome.kill("SIGTERM");
    await wait(250);
    await fs.rm(userDataDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
