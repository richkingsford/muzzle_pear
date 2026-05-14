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
      for (const technique of ['pair', 'trio', 'xwing']) {
        document.querySelector('[data-technique="' + technique + '"]').click();
        out[technique] = {
          anchors: document.querySelectorAll('.hint-anchor').length,
          removals: document.querySelectorAll('.hint-removal').length,
          corners: document.querySelectorAll('.hint-corner').length,
          panel: document.querySelector('#hintPanel').textContent.replace(/\\s+/g, ' ').trim()
        };
      }
      return out;
    })()`);
    assert(overlays.pair.anchors === 2 && overlays.pair.removals === 1, "Pair overlay should still work on level 7", overlays.pair);
    assert(overlays.trio.anchors === 3 && overlays.trio.removals === 3, "Trio overlay should still work on level 7", overlays.trio);
    assert(overlays.xwing.corners === 4 && overlays.xwing.removals === 1, "X-Wing overlay should still work on level 7", overlays.xwing);

    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, sessionId);
    const mobile = await evalPage(`(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      windowWidth: window.innerWidth,
      visibleCells: Array.from(document.querySelectorAll('.cell')).filter((cell) => cell.getBoundingClientRect().width > 0).length,
      board: Math.round(document.querySelector('.sudoku-board').getBoundingClientRect().width)
    }))()`);
    assert(mobile.scrollWidth <= mobile.windowWidth + 1 && mobile.visibleCells === 81 && mobile.board > 300, "Mobile layout should fit and show all cells", mobile);

    await wait(250);
    assert(browserIssues.length === 0, "Browser should have no console warnings or errors", browserIssues);

    if (failures.length) {
      console.error("BROWSER_CHECK_FAILED");
      failures.forEach((failure) => console.error(`- ${failure}`));
      process.exitCode = 1;
    } else {
      console.log("BROWSER_CHECK_PASSED");
      console.log(JSON.stringify({ initial, manual, levelsAndChem, overlays, mobile, browserIssues }, null, 2));
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
