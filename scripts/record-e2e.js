const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");

const ROOT = path.resolve(__dirname, "..");
const BASE_URL = "http://127.0.0.1:4173";
const APP_URL = `${BASE_URL}?e2e=1`;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.join(ROOT, "artifacts", "e2e-recording");
const FRAME_DIR = path.join(OUT_DIR, "frames");
const VIDEO_PATH = path.join(OUT_DIR, "arcade-e2e.mp4");
const WIDTH = 1280;
const HEIGHT = 900;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  return response.json();
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
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
      }
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.nextId;
    this.nextId += 1;
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`Timed out waiting for ${method}`));
        }
      }, 120000);
    });
    this.ws.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result.value;
  }
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
    if (response.ok) return null;
  } catch {}
  const server = spawn(process.execPath, ["server.js"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true
  });
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(APP_URL);
      if (response.ok) return server;
    } catch {}
    await wait(250);
  }
  throw new Error("Local server did not start");
}

async function launchChrome() {
  const port = 9600 + Math.floor(Math.random() * 300);
  const userDataDir = path.join(os.tmpdir(), `arcade-record-${Date.now()}`);
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    `--window-size=${WIDTH},${HEIGHT}`,
    APP_URL
  ], { stdio: "ignore", windowsHide: true });

  let page;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const pages = await fetchJson(`http://127.0.0.1:${port}/json`);
      page = pages.find((item) => item.url.includes("127.0.0.1:4173")) || pages.find((item) => item.type === "page");
      if (page) break;
    } catch {}
    await wait(100);
  }
  if (!page) {
    throw new Error("Chrome did not expose a debuggable page");
  }
  const cdp = new CdpClient(page.webSocketDebuggerUrl);
  await cdp.send("Runtime.enable");
  await cdp.send("Page.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: false
  });
  await wait(600);
  return { chrome, cdp, userDataDir };
}

async function captureFrame(cdp, label, frames) {
  await cdp.evaluate(`
    (() => {
      let badge = document.querySelector("#e2eRecorderBadge");
      if (!badge) {
        badge = document.createElement("div");
        badge.id = "e2eRecorderBadge";
        badge.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:99999;padding:10px 14px;border-radius:10px;background:#111827;color:#fff;font:800 16px/1.2 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.28)";
        document.body.append(badge);
      }
      badge.textContent = ${JSON.stringify(label)};
    })()
  `);
  await wait(120);
  const screenshot = await cdp.send("Page.captureScreenshot", { format: "png" });
  const fileName = `frame-${String(frames.length + 1).padStart(4, "0")}.png`;
  await fs.writeFile(path.join(FRAME_DIR, fileName), Buffer.from(screenshot.data, "base64"));
  frames.push(fileName);
}

async function click(cdp, selector) {
  await cdp.evaluate(`
    (() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) throw new Error("Missing selector: ${selector.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}");
      el.click();
    })()
  `);
  await wait(80);
}

async function selectLevel(cdp, selector, index) {
  await cdp.evaluate(`
    (() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      el.value = String(${index});
      el.dispatchEvent(new Event("change"));
    })()
  `);
  await wait(120);
}

async function getText(cdp, selector) {
  return cdp.evaluate(`
    (() => document.querySelector(${JSON.stringify(selector)})?.textContent.trim() || "")()
  `);
}

async function expectMessage(cdp, selector, expected, context) {
  const text = await getText(cdp, selector);
  if (!text.includes(expected)) {
    throw new Error(`${context}: expected "${expected}" in "${text}"`);
  }
}

function squareToIndex(square, size) {
  const col = square.charCodeAt(0) - 97;
  const row = Number(square.slice(1)) - 1;
  return row * size + col;
}

async function playSpiderUntilSettled(cdp, frames, maxTurns = 40) {
  let moves = 0;
  let deals = 0;
  for (let turn = 0; turn < maxTurns; turn += 1) {
    const result = await cdp.evaluate(`
      (() => {
        const hint = document.querySelector("#spiderHint");
        hint.click();
        const message = document.querySelector("#spiderMessagePanel")?.textContent || "";
        const from = document.querySelector(".spider-card-play.hint-from");
        const to = document.querySelector(".spider-card-play.hint-to");
        const targetMatch = message.match(/to column (\\d+)/);
        const targetColumn = targetMatch ? document.querySelectorAll(".spider-column")[Number(targetMatch[1]) - 1] : null;
        if (from && message.startsWith("Hint:") && (to || targetColumn)) {
          from.click();
          (to || targetColumn).click();
          return { action: "move", message: document.querySelector("#spiderMessagePanel")?.textContent || "" };
        }
        const stock = document.querySelector("#spiderStock");
        if (stock && !stock.disabled && !message.startsWith("No more stock")) {
          stock.click();
          return { action: "deal", message: document.querySelector("#spiderMessagePanel")?.textContent || "" };
        }
        return { action: "done", message };
      })()
    `);

    if (result.action === "move") {
      moves += 1;
      if (moves <= 8 || moves % 6 === 0) {
        await captureFrame(cdp, `Spider Solitaire: legal move ${moves}`, frames);
      }
    } else if (result.action === "deal") {
      deals += 1;
      await captureFrame(cdp, `Spider Solitaire: stock deal ${deals}`, frames);
    } else {
      await captureFrame(cdp, `Spider Solitaire: settled after ${moves} moves, ${deals} deals`, frames);
      return { moves, deals, message: result.message };
    }
    await wait(80);
  }
  await captureFrame(cdp, `Spider Solitaire: paused after ${moves} moves, ${deals} deals`, frames);
  return { moves, deals, message: "turn limit reached" };
}

async function runRecorder() {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(FRAME_DIR, { recursive: true });

  const appSource = await fs.readFile(path.join(ROOT, "src", "app.js"), "utf8");
  const sudokuCore = require(path.join(ROOT, "src", "sudoku-core.js"));
  const logicLevels = extractConstArray(appSource, "LOGIC_LEVELS");
  const chessLevels = extractConstArray(appSource, "CHESS_LEVELS");
  const minesLevels = extractConstArray(appSource, "MINES_LEVELS");
  const masterLevels = extractConstArray(appSource, "MASTER_LEVELS");
  const wordLevels = extractConstArray(appSource, "WORD_LEVELS");

  const server = await ensureServer();
  const { chrome, cdp, userDataDir } = await launchChrome();
  const frames = [];

  try {
    const step = (message) => console.log(`[record] ${message}`);
    await captureFrame(cdp, "Home: all arcade games", frames);

    step("Sudoku");
    await click(cdp, '[data-game="sudoku"]');
    for (let level = 0; level < sudokuCore.PUZZLES.length; level += 1) {
      step(`Sudoku L${level + 1}`);
      await selectLevel(cdp, "#levelSelect", level);
      await captureFrame(cdp, `Sudoku L${level + 1}: loaded`, frames);
      const puzzle = sudokuCore.PUZZLES[level];
      await cdp.evaluate(`
        (async () => {
          const solution = ${JSON.stringify(puzzle.solution)};
          const givens = ${JSON.stringify(puzzle.givens)};
          const tick = () => new Promise((resolve) => requestAnimationFrame(resolve));
          for (let index = 0; index < solution.length; index += 1) {
            if (givens[index] !== "." && givens[index] !== "0") {
              continue;
            }
            document.querySelector('.cell[data-index="' + index + '"]').click();
            await tick();
            document.dispatchEvent(new KeyboardEvent("keydown", { key: solution[index], bubbles: true }));
            await tick();
          }
          document.querySelector("#checkPuzzle").click();
        })()
      `);
      await expectMessage(cdp, "#messagePanel", "Solved cleanly", `Sudoku L${level + 1}`);
      await captureFrame(cdp, `Sudoku L${level + 1}: solved check`, frames);
    }

    step("Grid Logic");
    await click(cdp, "#homeButton");
    await click(cdp, '[data-game="grid-logic"]');
    for (let level = 0; level < logicLevels.length; level += 1) {
      step(`Grid Logic L${level + 1}`);
      await selectLevel(cdp, "#logicLevelSelect", level);
      await captureFrame(cdp, `Grid Logic L${level + 1}: loaded`, frames);
      const puzzle = logicLevels[level];
      await cdp.evaluate(`
        (() => {
          const solution = ${JSON.stringify(puzzle.solution)};
          Object.entries(solution).forEach(([person, cats]) => {
            Object.entries(cats).forEach(([category, option]) => {
              const button = [...document.querySelectorAll(".logic-play-cell")].find((cell) =>
                cell.dataset.person === person && cell.dataset.category === category && cell.dataset.option === option
              );
              if (button && !button.classList.contains("mark-yes")) button.click();
            });
          });
          document.querySelector("#logicCheck").click();
        })()
      `);
      await expectMessage(cdp, "#logicMessagePanel", "Correct", `Grid Logic L${level + 1}`);
      await captureFrame(cdp, `Grid Logic L${level + 1}: solved check`, frames);
    }

    step("Chess");
    await click(cdp, "#logicHomeButton");
    await click(cdp, '[data-game="chess"]');
    for (let level = 0; level < chessLevels.length; level += 1) {
      step(`Chess L${level + 1}`);
      await selectLevel(cdp, "#chessLevelSelect", level);
      await captureFrame(cdp, `Chess L${level + 1}: loaded`, frames);
      await click(cdp, `[data-square="${chessLevels[level].answer.from}"]`);
      await click(cdp, `[data-square="${chessLevels[level].answer.to}"]`);
      await expectMessage(cdp, "#chessMessagePanel", "Correct", `Chess L${level + 1}`);
      await captureFrame(cdp, `Chess L${level + 1}: tactic solved`, frames);
    }

    step("Spider Solitaire");
    await click(cdp, "#chessHomeButton");
    await click(cdp, '[data-game="spider-solitaire"]');
    await captureFrame(cdp, "Spider Solitaire: initial deal", frames);
    const spiderResult = await playSpiderUntilSettled(cdp, frames, 12);
    step(`Spider sampled ${spiderResult.moves} legal moves and ${spiderResult.deals} stock deals`);
    await cdp.evaluate(`
      (() => {
        if (!window.arcadeE2E?.prepareSpiderFinalRun) {
          throw new Error("Missing Spider E2E hook");
        }
        window.arcadeE2E.prepareSpiderFinalRun();
      })()
    `);
    await captureFrame(cdp, "Spider Solitaire: final run prepared", frames);
    await cdp.evaluate(`
      (() => {
        const ace = document.querySelector('.spider-column[data-column="1"] .spider-card-play:last-child');
        const two = document.querySelector('.spider-column[data-column="0"] .spider-card-play:last-child');
        if (!ace || !two) throw new Error("Missing final Spider cards");
        ace.click();
        two.click();
        document.querySelector("#spiderCheck").click();
      })()
    `);
    await expectMessage(cdp, "#spiderMessagePanel", "Correct", "Spider Solitaire");
    await captureFrame(cdp, "Spider Solitaire: final run cleared", frames);

    step("Minesweeper");
    await click(cdp, "#spiderHomeButton");
    await click(cdp, '[data-game="minesweeper"]');
    for (let level = 0; level < minesLevels.length; level += 1) {
      step(`Minesweeper L${level + 1}`);
      await selectLevel(cdp, "#minesLevelSelect", level);
      await captureFrame(cdp, `Minesweeper L${level + 1}: loaded`, frames);
      const mineIndexes = new Set(minesLevels[level].mines.map((square) => squareToIndex(square, minesLevels[level].size)));
      const safeIndexes = [];
      for (let index = 0; index < minesLevels[level].size * minesLevels[level].size; index += 1) {
        if (!mineIndexes.has(index)) {
          safeIndexes.push(index);
        }
      }
      await cdp.evaluate(`
        (() => {
          const safeIndexes = ${JSON.stringify(safeIndexes)};
          safeIndexes.forEach((index) => {
            const cell = document.querySelectorAll(".mines-cell")[index];
            if (cell && !cell.classList.contains("revealed")) cell.click();
          });
          document.querySelector("#minesCheck")?.click();
        })()
      `);
      await expectMessage(cdp, "#minesMessagePanel", "Correct", `Minesweeper L${level + 1}`);
      await captureFrame(cdp, `Minesweeper L${level + 1}: board cleared`, frames);
    }

    step("Mastermind");
    await click(cdp, "#minesHomeButton");
    await click(cdp, '[data-game="mastermind"]');
    for (let level = 0; level < masterLevels.length; level += 1) {
      step(`Mastermind L${level + 1}`);
      await selectLevel(cdp, "#masterLevelSelect", level);
      await captureFrame(cdp, `Mastermind L${level + 1}: loaded`, frames);
      await cdp.evaluate(`
        (() => {
          const secret = ${JSON.stringify(masterLevels[level].secret)};
          const colors = ${JSON.stringify(masterLevels[level].secret)};
          colors.forEach((color) => {
            const index = ${JSON.stringify(masterLevels[level].secret)}.indexOf(color);
          });
          const palette = [...document.querySelectorAll(".master-palette-peg")];
          const colorIds = ${JSON.stringify(masterLevels[level].secret)};
          const ids = ${JSON.stringify(["red", "blue", "yellow", "teal", "purple", "green"])};
          colorIds.forEach((color) => palette[ids.indexOf(color)].click());
        })()
      `);
      await expectMessage(cdp, "#masterMessagePanel", "Correct", `Mastermind L${level + 1}`);
      await captureFrame(cdp, `Mastermind L${level + 1}: code cracked`, frames);
    }

    step("Word Vault");
    await click(cdp, "#masterHomeButton");
    await click(cdp, '[data-game="wordle-like"]');
    for (let level = 0; level < wordLevels.length; level += 1) {
      step(`Word Vault L${level + 1}`);
      await selectLevel(cdp, "#wordLevelSelect", level);
      await captureFrame(cdp, `Word Vault L${level + 1}: loaded`, frames);
      await cdp.evaluate(`
        (() => {
          ${JSON.stringify(wordLevels[level].answer)}.split("").forEach((key) => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
          });
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        })()
      `);
      await expectMessage(cdp, "#wordMessagePanel", "Correct", `Word Vault L${level + 1}`);
      await captureFrame(cdp, `Word Vault L${level + 1}: word solved`, frames);
    }
    step("Encoding MP4");
    await encodeFramesToMp4(cdp, frames);
  } finally {
    chrome.kill();
    if (server) server.kill();
    await fs.rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function encodeFramesToMp4(cdp, frames) {
  const encoderPath = path.join(OUT_DIR, "encoder.html");
  await fs.writeFile(encoderPath, `<!doctype html><meta charset="utf-8"><title>encoder</title><canvas id="c" width="${WIDTH}" height="${HEIGHT}"></canvas>`);
  await cdp.send("Page.navigate", { url: `${BASE_URL}/artifacts/e2e-recording/encoder.html` });
  await wait(800);
  const result = await cdp.evaluate(`
    (async () => {
      const frames = ${JSON.stringify(frames)};
      const canvas = document.querySelector("#c");
      const ctx = canvas.getContext("2d");
      const supported = MediaRecorder.isTypeSupported('video/mp4;codecs="avc1.42E01E"') ? 'video/mp4;codecs="avc1.42E01E"' : (MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" : "");
      if (!supported) throw new Error("Chrome MediaRecorder cannot encode MP4");
      const recorder = new MediaRecorder(canvas.captureStream(3), { mimeType: supported, videoBitsPerSecond: 2500000 });
      const chunks = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      const done = new Promise((resolve) => recorder.onstop = resolve);
      recorder.start();
      for (const frame of frames) {
        const img = new Image();
        img.src = "/artifacts/e2e-recording/frames/" + frame;
        await img.decode();
        for (let repeat = 0; repeat < 2; repeat += 1) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          await new Promise((resolve) => setTimeout(resolve, 333));
        }
      }
      recorder.stop();
      await done;
      const blob = new Blob(chunks, { type: "video/mp4" });
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      return { dataUrl, type: blob.type, size: blob.size };
    })()
  `);
  const base64 = result.dataUrl.split(",")[1];
  await fs.writeFile(VIDEO_PATH, Buffer.from(base64, "base64"));
  await fs.writeFile(path.join(OUT_DIR, "manifest.json"), JSON.stringify({
    createdAt: new Date().toISOString(),
    frameCount: frames.length,
    video: path.relative(ROOT, VIDEO_PATH).replaceAll("\\", "/"),
    mimeType: result.type,
    bytes: result.size
  }, null, 2));
}

runRecorder().then(() => {
  console.log(`Recorded ${VIDEO_PATH}`);
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
