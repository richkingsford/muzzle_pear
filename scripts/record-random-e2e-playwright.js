const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "artifacts", "playwright-runtime", "node_modules");
const { chromium } = require(path.join(RUNTIME_DIR, "playwright-core"));
const ffmpegPath = require(path.join(RUNTIME_DIR, "@ffmpeg-installer", "ffmpeg")).path;
const sudokuCore = require(path.join(ROOT, "src", "sudoku-core.js"));

const BASE_URL = "http://127.0.0.1:4173";
const APP_URL = `${BASE_URL}?e2e=1&record=random`;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.join(ROOT, "artifacts", "full-e2e-playwright");
const FRAME_DIR = path.join(OUT_DIR, "frames");
const VIDEO_PATH = path.join(OUT_DIR, "arcade-random-moves-e2e.mp4");
const MANIFEST_PATH = path.join(OUT_DIR, "manifest.json");
const WIDTH = 1120;
const HEIGHT = 820;
const MOVES_PER_LEVEL = 3;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

const random = makeRandom(0xc0ffee);

function pick(items) {
  if (!items.length) {
    throw new Error("Cannot pick from an empty list");
  }
  return items[Math.floor(random() * items.length)];
}

function shuffle(items) {
  const copy = items.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function extractConstArray(source, name) {
  const start = source.indexOf(`const ${name} = [`);
  if (start < 0) {
    throw new Error(`Cannot find ${name}`);
  }
  const arrayStart = source.indexOf("[", start);
  let depth = 0;
  for (let index = arrayStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "[") depth += 1;
    if (char === "]") depth -= 1;
    if (depth === 0) {
      return Function(`return ${source.slice(arrayStart, index + 1)};`)();
    }
  }
  throw new Error(`Cannot parse ${name}`);
}

async function ensureServer() {
  try {
    const response = await fetch(APP_URL);
    if (response.ok) {
      return null;
    }
  } catch {
    // Start a local server below.
  }

  const server = spawn(process.execPath, ["server.js"], {
    cwd: ROOT,
    stdio: "ignore",
    windowsHide: true
  });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(APP_URL);
      if (response.ok) {
        return server;
      }
    } catch {
      // Keep waiting while the server boots.
    }
    await wait(250);
  }

  throw new Error("Local server did not start");
}

function squareToIndex(square, size) {
  const col = square.charCodeAt(0) - 97;
  const row = Number(square.slice(1)) - 1;
  return row * size + col;
}

async function setBadge(page, label) {
  await page.evaluate((text) => {
    let badge = document.querySelector("#e2eRecorderBadge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "e2eRecorderBadge";
      badge.style.cssText = [
        "position:fixed",
        "left:14px",
        "bottom:14px",
        "z-index:99999",
        "max-width:calc(100vw - 28px)",
        "padding:9px 12px",
        "border-radius:10px",
        "background:rgba(17,24,39,.92)",
        "color:#fff",
        "font:800 14px/1.25 system-ui, sans-serif",
        "box-shadow:0 10px 28px rgba(0,0,0,.28)",
        "pointer-events:none"
      ].join(";");
      document.body.append(badge);
    }
    badge.textContent = text;
  }, label);
}

async function captureFrame(page, frames, label) {
  await setBadge(page, label);
  await page.waitForTimeout(90);
  const name = `frame-${String(frames.length + 1).padStart(5, "0")}.jpg`;
  await page.screenshot({
    path: path.join(FRAME_DIR, name),
    type: "jpeg",
    quality: 74,
    fullPage: false
  });
  frames.push({ name, label });
}

async function ensureTheme(page, theme) {
  await page.locator("#homeThemeToggle").waitFor({ state: "visible" });
  const isDark = await page.evaluate(() => document.body.classList.contains("dark"));
  if ((theme === "dark") !== isDark) {
    await page.locator("#homeThemeToggle").click();
    await page.waitForTimeout(160);
  }
}

async function goHome(page) {
  await page.evaluate(() => {
    const visibleHomeButton = Array.from(document.querySelectorAll("button[id$='HomeButton'], #homeButton"))
      .find((button) => {
        const shell = button.closest(".app-shell");
        return shell && !shell.hidden;
      });
    if (visibleHomeButton) {
      visibleHomeButton.click();
    }
  });
  await page.locator("#homeShell").waitFor({ state: "visible" });
}

async function selectLevel(page, selector, index) {
  await page.locator(selector).selectOption(String(index));
  await page.waitForTimeout(130);
}

async function clickIndexed(page, selector, index) {
  await page.locator(selector).nth(index).click({ force: true });
}

async function runSudoku(page, frames, theme) {
  await goHome(page);
  await page.locator('[data-game="sudoku"]').click();
  await page.locator("#appShell").waitFor({ state: "visible" });

  for (let level = 0; level < sudokuCore.PUZZLES.length; level += 1) {
    await selectLevel(page, "#levelSelect", level);
    const puzzle = sudokuCore.PUZZLES[level];
    const openIndexes = puzzle.givens
      .split("")
      .map((value, index) => value === "." || value === "0" ? index : null)
      .filter((value) => value !== null);
    const moves = shuffle(openIndexes).slice(0, MOVES_PER_LEVEL);

    for (let move = 0; move < moves.length; move += 1) {
      const index = moves[move];
      const digit = String(1 + Math.floor(random() * 9));
      await page.locator(`.cell[data-index="${index}"]`).click({ force: true });
      await page.keyboard.press(digit);
      const row = Math.floor(index / 9) + 1;
      const col = index % 9 + 1;
      await captureFrame(page, frames, `${theme} | Sudoku L${level + 1} | random move ${move + 1}/3 | R${row}C${col}=${digit}`);
    }
  }
}

async function runLogic(page, frames, theme, levels) {
  await goHome(page);
  await page.locator('[data-game="grid-logic"]').click();
  await page.locator("#logicShell").waitFor({ state: "visible" });

  for (let level = 0; level < levels.length; level += 1) {
    await selectLevel(page, "#logicLevelSelect", level);
    const count = await page.locator(".logic-play-cell").count();
    const moves = shuffle(Array.from({ length: count }, (_, index) => index)).slice(0, MOVES_PER_LEVEL);

    for (let move = 0; move < moves.length; move += 1) {
      const label = await page.locator(".logic-play-cell").nth(moves[move]).getAttribute("aria-label");
      await clickIndexed(page, ".logic-play-cell", moves[move]);
      await captureFrame(page, frames, `${theme} | Grid Logic L${level + 1} | random move ${move + 1}/3 | ${label}`);
    }
  }
}

async function runChemistry(page, frames, theme, levels) {
  await goHome(page);
  await page.locator('[data-game="chem-search"]').click();
  await page.locator("#chemSearchShell").waitFor({ state: "visible" });

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  for (let level = 0; level < levels.length; level += 1) {
    await selectLevel(page, "#chemSearchLevelSelect", level);
    const size = levels[level].size;

    for (let move = 0; move < MOVES_PER_LEVEL; move += 1) {
      let start = 0;
      let end = 0;
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const row = Math.floor(random() * size);
        const col = Math.floor(random() * size);
        const [rowStep, colStep] = pick(directions);
        const length = 2 + Math.floor(random() * Math.min(4, size - 1));
        const endRow = row + rowStep * (length - 1);
        const endCol = col + colStep * (length - 1);
        if (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size) {
          start = row * size + col;
          end = endRow * size + endCol;
          break;
        }
      }
      await clickIndexed(page, ".chem-search-cell", start);
      await clickIndexed(page, ".chem-search-cell", end);
      await captureFrame(page, frames, `${theme} | Chemistry Word Search L${level + 1} | random line ${move + 1}/3 | ${start}->${end}`);
    }
  }
}

async function runSpider(page, frames, theme) {
  await goHome(page);
  await page.locator('[data-game="spider-solitaire"]').click();
  await page.locator("#spiderShell").waitFor({ state: "visible" });

  for (let move = 0; move < MOVES_PER_LEVEL; move += 1) {
    const action = await page.evaluate(() => {
      document.querySelector("#spiderHint").click();
      const message = document.querySelector("#spiderMessagePanel")?.textContent || "";
      const from = document.querySelector(".spider-card-play.hint-from");
      const to = document.querySelector(".spider-card-play.hint-to");
      const targetMatch = message.match(/to column (\d+)/);
      const targetColumn = targetMatch ? document.querySelectorAll(".spider-column")[Number(targetMatch[1]) - 1] : null;
      if (from && message.startsWith("Hint:") && (to || targetColumn)) {
        from.click();
        (to || targetColumn).click();
        return "hint move";
      }
      const stock = document.querySelector("#spiderStock");
      if (stock && !stock.disabled) {
        stock.click();
        return "stock deal";
      }
      const faceUp = Array.from(document.querySelectorAll(".spider-card-play:not(.face-down)"));
      if (faceUp.length) {
        faceUp[Math.floor(Math.random() * faceUp.length)].click();
        return "face-up selection";
      }
      return "no available move";
    });
    await page.waitForTimeout(180);
    await captureFrame(page, frames, `${theme} | Spider Solitaire | random move ${move + 1}/3 | ${action}`);
  }
}

async function runMines(page, frames, theme, levels) {
  await goHome(page);
  await page.locator('[data-game="minesweeper"]').click();
  await page.locator("#minesShell").waitFor({ state: "visible" });

  for (let level = 0; level < levels.length; level += 1) {
    await selectLevel(page, "#minesLevelSelect", level);
    const mineIndexes = new Set(levels[level].mines.map((square) => squareToIndex(square, levels[level].size)));

    for (let move = 0; move < MOVES_PER_LEVEL; move += 1) {
      const hiddenSafe = await page.$$eval(".mines-cell", (cells, mines) => {
        const mineSet = new Set(mines);
        return cells
          .map((cell, index) => ({ cell, index }))
          .filter(({ cell, index }) => !mineSet.has(index) && !cell.classList.contains("revealed"))
          .map(({ index }) => index);
      }, Array.from(mineIndexes));

      if (!hiddenSafe.length) {
        await captureFrame(page, frames, `${theme} | Minesweeper L${level + 1} | random move ${move + 1}/3 | no hidden safe cells`);
        continue;
      }

      const index = pick(hiddenSafe);
      await clickIndexed(page, ".mines-cell", index);
      await captureFrame(page, frames, `${theme} | Minesweeper L${level + 1} | random safe reveal ${move + 1}/3 | cell ${index + 1}`);
    }
  }
}

async function runMastermind(page, frames, theme, levels) {
  await goHome(page);
  await page.locator('[data-game="mastermind"]').click();
  await page.locator("#masterShell").waitFor({ state: "visible" });

  for (let level = 0; level < levels.length; level += 1) {
    await selectLevel(page, "#masterLevelSelect", level);

    for (let move = 0; move < MOVES_PER_LEVEL; move += 1) {
      const enabledIndexes = await page.$$eval(".master-palette-peg", (buttons) => buttons
        .map((button, index) => ({ button, index }))
        .filter(({ button }) => !button.disabled)
        .map(({ index }) => index));
      const index = pick(enabledIndexes);
      const label = await page.locator(".master-palette-peg").nth(index).getAttribute("aria-label");
      await clickIndexed(page, ".master-palette-peg", index);
      await captureFrame(page, frames, `${theme} | Mastermind L${level + 1} | random color ${move + 1}/3 | ${label}`);
    }
  }
}

async function runWord(page, frames, theme, levels) {
  await goHome(page);
  await page.locator('[data-game="wordle-like"]').click();
  await page.locator("#wordShell").waitFor({ state: "visible" });

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let level = 0; level < levels.length; level += 1) {
    await selectLevel(page, "#wordLevelSelect", level);

    for (let move = 0; move < MOVES_PER_LEVEL; move += 1) {
      const letter = letters[Math.floor(random() * letters.length)];
      await page.locator(`.word-key[data-letter="${letter}"]`).click({ force: true });
      await captureFrame(page, frames, `${theme} | Word Vault L${level + 1} | random letter ${move + 1}/3 | ${letter}`);
    }
  }
}

async function encodeVideo(frames) {
  await fs.writeFile(path.join(FRAME_DIR, "frames.txt"), frames
    .map((frame) => `file '${frame.name}'\nduration 0.38`)
    .join("\n") + `\nfile '${frames[frames.length - 1].name}'\n`);

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", path.join(FRAME_DIR, "frames.txt"),
      "-vf", `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2,format=yuv420p`,
      "-movflags", "+faststart",
      "-r", "30",
      VIDEO_PATH
    ], {
      cwd: FRAME_DIR,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    });

    let stderr = "";
    ffmpeg.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    ffmpeg.on("error", reject);
    ffmpeg.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited ${code}\n${stderr}`));
      }
    });
  });
}

async function run() {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(FRAME_DIR, { recursive: true });

  const appSource = await fs.readFile(path.join(ROOT, "src", "app.js"), "utf8");
  const levels = {
    sudoku: sudokuCore.PUZZLES,
    logic: extractConstArray(appSource, "LOGIC_LEVELS"),
    chemistry: extractConstArray(appSource, "CHEM_SEARCH_LEVELS"),
    spider: [{}],
    mines: extractConstArray(appSource, "MINES_LEVELS"),
    mastermind: extractConstArray(appSource, "MASTER_LEVELS"),
    word: extractConstArray(appSource, "WORD_LEVELS")
  };

  const expectedMoves = Object.values(levels)
    .reduce((total, gameLevels) => total + gameLevels.length * MOVES_PER_LEVEL, 0) * 2;
  const server = await ensureServer();
  const browserIssues = [];
  const frames = [];
  const moves = [];

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--disable-gpu", "--no-first-run", "--no-default-browser-check"]
  });

  try {
    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
      reducedMotion: "no-preference"
    });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        browserIssues.push(`${message.type()}: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => {
      browserIssues.push(`pageerror: ${error.message}`);
    });

    await page.goto(APP_URL, { waitUntil: "load" });
    await page.waitForTimeout(500);
    const activeGames = await page.$$eval(".game-card", (cards) => cards.map((card) => card.dataset.game));
    if (activeGames.includes("chess")) {
      throw new Error("Chess launcher is active, but this recorder expects chess to stay commented out.");
    }

    for (const theme of ["light", "dark"]) {
      await page.goto(APP_URL, { waitUntil: "load" });
      await page.waitForTimeout(400);
      await ensureTheme(page, theme);
      await captureFrame(page, frames, `${theme} | Home | active games: ${activeGames.join(", ")}`);
      const beforeFrameCount = frames.length;

      await runLogic(page, frames, theme, levels.logic);
      await runChemistry(page, frames, theme, levels.chemistry);
      await runSudoku(page, frames, theme);
      await runSpider(page, frames, theme);
      await runMines(page, frames, theme, levels.mines);
      await runMastermind(page, frames, theme, levels.mastermind);
      await runWord(page, frames, theme, levels.word);

      moves.push({
        theme,
        frames: frames.length - beforeFrameCount,
        expectedMoveFrames: expectedMoves / 2
      });
    }

    if (browserIssues.length) {
      throw new Error(`Browser warnings/errors detected:\n${browserIssues.join("\n")}`);
    }

    await encodeVideo(frames);
    const videoStats = await fs.stat(VIDEO_PATH);
    await fs.writeFile(MANIFEST_PATH, JSON.stringify({
      createdAt: new Date().toISOString(),
      tool: "playwright-core",
      browser: "system Chrome",
      themes: ["light", "dark"],
      movesPerLevel: MOVES_PER_LEVEL,
      activeGames,
      skippedGames: ["chess launcher is commented out"],
      levelCounts: Object.fromEntries(Object.entries(levels).map(([game, gameLevels]) => [game, gameLevels.length])),
      expectedRandomMoves: expectedMoves,
      capturedFrames: frames.length,
      themeRuns: moves,
      video: path.relative(ROOT, VIDEO_PATH).replaceAll("\\", "/"),
      videoBytes: videoStats.size,
      browserIssues,
      frames: frames.map((frame) => frame.label)
    }, null, 2));

    console.log(JSON.stringify({
      video: VIDEO_PATH,
      manifest: MANIFEST_PATH,
      expectedRandomMoves: expectedMoves,
      capturedFrames: frames.length,
      videoBytes: videoStats.size
    }, null, 2));
  } finally {
    await browser.close().catch(() => {});
    if (server) {
      server.kill();
    }
  }
}

run().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
