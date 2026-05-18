(function startSudokuApp() {
  "use strict";

  const {
    DIGITS,
    EMPTY,
    PUZZLES,
    parseBoard,
    rowOf,
    colOf,
    boxOf,
    formatCell,
    getCandidates,
    evaluateBoard,
    getHintPattern
  } = window.SudokuCore;

  let puzzle = PUZZLES[PUZZLES.length - 1];
  let givens = parseBoard(puzzle.givens);
  let solution = parseBoard(puzzle.solution);

  const boardEl = document.querySelector("#board");
  const homeShellEl = document.querySelector("#homeShell");
  const appShellEl = document.querySelector("#appShell");
  const homeButtonEl = document.querySelector("#homeButton");
  const gameButtons = Array.from(document.querySelectorAll(".game-card"));
  const numberPadEl = document.querySelector(".number-pad");
  const levelSelectEl = document.querySelector("#levelSelect");
  const autoNotesEl = document.querySelector("#autoNotes");
  const pencilToggleEl = document.querySelector("#pencilToggle");
  const noteOnceEl = document.querySelector("#noteOnce");
  const themeToggleEl = document.querySelector("#themeToggle");
  const checkPuzzleEl = document.querySelector("#checkPuzzle");
  const clearCellEl = document.querySelector("#clearCell");
  const resetPuzzleEl = document.querySelector("#resetPuzzle");
  const chemistryLinkEl = document.querySelector("#chemistryLink");
  const chemistryPopupEl = document.querySelector("#chemistryPopup");
  const chemistryCloseEl = document.querySelector("#chemistryClose");
  const progressTextEl = document.querySelector("#progressText");
  const hintPanelEl = document.querySelector("#hintPanel");
  const messagePanelEl = document.querySelector("#messagePanel");
  const difficultyPillEl = document.querySelector("#difficultyPill");
  const hintButtons = Array.from(document.querySelectorAll(".hint-button"));

  const gameMessages = {
    chess: "Chess is still polishing its crown.",
    "grid-logic": "Grid Logic Game is drawing suspicious little charts.",
    "spider-solitaire": "Spider Solitaire is shuffling dramatically.",
    minesweeper: "Minesweeper is planting mysteries for later.",
    mastermind: "Mastermind is mixing a secret code.",
    "wordle-like": "Glyph Guess is choosing deliciously odd letters.",
    arithmettle: "Arithmettle is sharpening its plus signs."
  };

  const state = {
    board: givens.slice(),
    selected: givens.findIndex((value) => value === EMPTY),
    autoNotes: true,
    noteMode: false,
    oneShotNote: false,
    shiftNoteActive: false,
    checked: false,
    activeTechnique: null,
    manualNotes: createEmptyNotes(),
    message: "Pick a cell and start solving."
  };

  const fallbackHints = {
    pair: {
      title: "Naked pair",
      line1: "A naked pair is two cells in one row, column, or box that share the exact same two candidates.",
      line2: "Example: If two highlighted cells in a row can only be 2 or 6, those two digits belong in those cells and can be erased from the rest of the row."
    },
    trio: {
      title: "Naked trio",
      line1: "A naked trio happens when three open cells in the same row, column, or box are limited to the same three digits between them.",
      line2: "Example: If three highlighted cells in a box can only use 2, 5, and 8 in total, those digits are reserved for those cells. One cell may show only two of the digits."
    },
    "hidden-single": {
      title: "Hidden single",
      line1: "A hidden single means one digit has only one possible cell in a row, column, or box.",
      line2: "Example: If 7 can fit in only one cell in a row, that cell must be 7 even if it has other notes."
    },
    pointing: {
      title: "Pointing pair/triple",
      line1: "A pointing pair or triple happens when a digit's candidates inside one box all sit in the same row or column.",
      line2: "Example: If every possible 4 in a box is in the same row, erase 4 from the rest of that row outside the box."
    },
    xwing: {
      title: "X-Wing",
      line1: "An X-Wing locks one digit into the same two rows and columns, forming four corners.",
      line2: "Example: If columns 2 and 3 can place 5 only on rows 4 and 9, other 5s on those rows can be erased."
    }
  };

  function createEmptyNotes() {
    return Array.from({ length: 81 }, () => new Set());
  }

  function isGiven(index) {
    return givens[index] !== EMPTY;
  }

  function currentNoteModeActive() {
    return state.noteMode || state.oneShotNote || state.shiftNoteActive;
  }

  function disableAutoNotesForManualEntry() {
    if (state.autoNotes) {
      state.autoNotes = false;
      autoNotesEl.checked = false;
    }
  }

  function createBoard() {
    boardEl.innerHTML = "";

    for (let index = 0; index < 81; index += 1) {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.type = "button";
      cell.dataset.index = String(index);
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", formatCell(index));

      if (colOf(index) === 2 || colOf(index) === 5) {
        cell.classList.add("edge-right");
      }

      if (rowOf(index) === 2 || rowOf(index) === 5) {
        cell.classList.add("edge-bottom");
      }

      const value = document.createElement("span");
      value.className = "value";
      cell.append(value);

      const notes = document.createElement("span");
      notes.className = "notes";
      DIGITS.forEach((digit) => {
        const note = document.createElement("span");
        note.dataset.digit = String(digit);
        notes.append(note);
      });
      cell.append(notes);

      cell.addEventListener("click", () => {
        state.selected = index;
        state.message = isGiven(index) ? "That one is locked in." : `Selected ${formatCell(index)}.`;
        render();
      });

      boardEl.append(cell);
    }
  }

  function createNumberPad() {
    numberPadEl.innerHTML = "";

    DIGITS.forEach((digit) => {
      const button = document.createElement("button");
      button.className = "number-button";
      button.type = "button";
      button.textContent = String(digit);
      button.addEventListener("click", () => setSelectedCell(digit));
      numberPadEl.append(button);
    });
  }

  function createLevelSelect() {
    levelSelectEl.innerHTML = "";

    PUZZLES.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Level ${item.level}: ${item.name} (${item.difficulty})`;
      levelSelectEl.append(option);
    });

    levelSelectEl.value = String(PUZZLES.length - 1);
  }

  function setSelectedCell(value) {
    if (state.selected === null || state.selected < 0) {
      state.message = "Select an open cell first.";
      render();
      return;
    }

    if (isGiven(state.selected)) {
      state.message = "Given cells cannot be changed.";
      render();
      return;
    }

    if (value !== EMPTY && currentNoteModeActive()) {
      toggleManualNote(value);
      return;
    }

    state.board[state.selected] = value;
    state.manualNotes[state.selected].clear();
    state.checked = false;
    state.message = value === EMPTY ? `Cleared ${formatCell(state.selected)}.` : `Placed ${value} at ${formatCell(state.selected)}.`;
    render();
  }

  function toggleManualNote(value) {
    if (state.board[state.selected] !== EMPTY) {
      state.message = "Clear the cell before adding notes.";
      state.oneShotNote = false;
      render();
      return;
    }

    disableAutoNotesForManualEntry();

    const notes = state.manualNotes[state.selected];
    if (notes.has(value)) {
      notes.delete(value);
      state.message = `Removed note ${value} from ${formatCell(state.selected)}.`;
    } else {
      notes.add(value);
      state.message = `Added note ${value} to ${formatCell(state.selected)}.`;
    }

    state.oneShotNote = false;
    render();
  }

  function moveSelection(rowOffset, colOffset) {
    const current = state.selected >= 0 ? state.selected : 0;
    const nextRow = Math.max(0, Math.min(8, rowOf(current) + rowOffset));
    const nextCol = Math.max(0, Math.min(8, colOf(current) + colOffset));
    state.selected = nextRow * 9 + nextCol;
    render();
  }

  function getActivePattern() {
    if (!state.activeTechnique) {
      return null;
    }

    return getHintPattern(state.board, state.activeTechnique);
  }

  function getHintSets(pattern) {
    const sets = {
      unit: new Set(),
      anchors: new Set(),
      removals: new Set(),
      corners: new Set(),
      blocked: new Set(),
      digitsByCell: new Map()
    };

    if (!pattern) {
      return sets;
    }

    if (pattern.unit) {
      pattern.unit.cells.forEach((index) => sets.unit.add(index));
    }

    if (pattern.cells) {
      pattern.cells.forEach((cell) => {
        sets.anchors.add(cell.index);
        sets.digitsByCell.set(cell.index, pattern.type === "hidden-single" ? [pattern.digit] : cell.candidates.slice());
      });
    }

    if (pattern.eliminations) {
      pattern.eliminations.forEach((removal) => {
        if (typeof removal === "number") {
          sets.removals.add(removal);
          sets.digitsByCell.set(removal, [pattern.digit]);
        } else {
          sets.removals.add(removal.index);
          sets.digitsByCell.set(removal.index, removal.digits.slice());
        }
      });
    }

    if (pattern.corners) {
      pattern.corners.forEach((index) => {
        sets.corners.add(index);
        sets.digitsByCell.set(index, [pattern.digit]);
      });
    }

    if (pattern.blockedCells) {
      pattern.blockedCells.forEach((index) => sets.blocked.add(index));
    }

    return sets;
  }

  function getVisibleNotes(index, value, hintSets) {
    if (value !== EMPTY) {
      return [];
    }

    if (
      state.autoNotes ||
      hintSets.anchors.has(index) ||
      hintSets.removals.has(index) ||
      hintSets.corners.has(index) ||
      hintSets.blocked.has(index)
    ) {
      return getCandidates(state.board, index);
    }

    return Array.from(state.manualNotes[index]).sort((a, b) => a - b);
  }

  function renderBoard(pattern) {
    const selectedValue = state.selected >= 0 ? state.board[state.selected] : EMPTY;
    const review = evaluateBoard(state.board, solution);
    const hintSets = getHintSets(pattern);

    Array.from(boardEl.children).forEach((cell) => {
      const index = Number(cell.dataset.index);
      const value = state.board[index];
      const row = rowOf(index);
      const col = colOf(index);
      const selectedRow = state.selected >= 0 ? rowOf(state.selected) : -1;
      const selectedCol = state.selected >= 0 ? colOf(state.selected) : -1;
      const isSelected = index === state.selected;
      const isSameBox = state.selected >= 0 && boxOf(index) === boxOf(state.selected);
      const visibleNotes = getVisibleNotes(index, value, hintSets);
      const highlightedDigits = hintSets.digitsByCell.get(index) || [];

      cell.classList.toggle("given", isGiven(index));
      cell.classList.toggle("filled", value !== EMPTY);
      cell.classList.toggle("selected", isSelected);
      cell.classList.toggle("peer-row", !isSelected && state.selected >= 0 && row === selectedRow);
      cell.classList.toggle("peer-col", !isSelected && state.selected >= 0 && col === selectedCol);
      cell.classList.toggle("peer-box", !isSelected && isSameBox && row !== selectedRow && col !== selectedCol);
      cell.classList.toggle("same-number", selectedValue !== EMPTY && value === selectedValue && !isSelected);
      cell.classList.toggle("conflict", review.conflicts.includes(index));
      cell.classList.toggle("mistake", state.checked && review.mistakes.includes(index));
      cell.classList.toggle("hint-unit", hintSets.unit.has(index));
      cell.classList.toggle("hint-anchor", hintSets.anchors.has(index));
      cell.classList.toggle("hint-removal", hintSets.removals.has(index));
      cell.classList.toggle("hint-corner", hintSets.corners.has(index));
      cell.classList.toggle("hint-blocked", hintSets.blocked.has(index));
      cell.setAttribute("aria-selected", String(isSelected));
      cell.setAttribute("aria-readonly", String(isGiven(index)));

      cell.querySelector(".value").textContent = value === EMPTY ? "" : String(value);

      const noteSpans = Array.from(cell.querySelectorAll(".notes span"));
      noteSpans.forEach((span) => {
        const digit = Number(span.dataset.digit);
        span.textContent = visibleNotes.includes(digit) ? String(digit) : "";
        span.classList.toggle("candidate-hit", highlightedDigits.includes(digit));
      });
    });
  }

  function renderHintPanel(pattern) {
    hintButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.technique === state.activeTechnique);
      button.setAttribute("aria-pressed", String(button.dataset.technique === state.activeTechnique));
    });

    if (!state.activeTechnique) {
      hintPanelEl.innerHTML = `
        <h2>Learning lens</h2>
        <p class="quiet">Choose an overlay to color the board around a live solving pattern.</p>
      `;
      return;
    }

    const fallback = fallbackHints[state.activeTechnique];

    if (!pattern) {
      hintPanelEl.innerHTML = `
        <h2>${fallback.title}</h2>
        <p>${fallback.line1}</p>
        <p>${fallback.line2}</p>
        <p class="quiet">No live version of this pattern is visible after the current moves.</p>
      `;
      return;
    }

    const removalCount = pattern.eliminations ? pattern.eliminations.length : 0;
    const targetWord = removalCount === 1 ? "candidate" : "candidates";
    const patternSwatch = pattern.type === "xwing" ? "corner" : "anchor";
    const patternLabels = {
      "hidden-single": `place ${pattern.digit} here`,
      pointing: "pointing cells",
      xwing: "X-Wing corners"
    };
    const patternLabel = patternLabels[pattern.type] || "pattern cells";
    const removalLegend =
      removalCount > 0 ? `<span><b class="swatch removal"></b>${targetWord} to erase</span>` : "";
    const blockedLegend =
      pattern.type === "hidden-single" && pattern.blockedCells && pattern.blockedCells.length > 0
        ? `<span><b class="swatch blocked"></b>${pattern.digit} ruled out</span>`
        : "";

    hintPanelEl.innerHTML = `
      <h2>${pattern.title}</h2>
      <p>${pattern.explanation.line1}</p>
      <p>${pattern.explanation.line2}</p>
      <div class="legend" aria-label="Overlay legend">
        <span><b class="swatch ${patternSwatch}"></b>${patternLabel}</span>
        ${blockedLegend}
        ${removalLegend}
      </div>
    `;
  }

  function renderModeControls() {
    const noteActive = currentNoteModeActive();
    pencilToggleEl.classList.toggle("active", state.noteMode);
    noteOnceEl.classList.toggle("active", state.oneShotNote || state.shiftNoteActive);
    pencilToggleEl.setAttribute("aria-pressed", String(state.noteMode));
    noteOnceEl.setAttribute("aria-pressed", String(state.oneShotNote));
    numberPadEl.classList.toggle("note-entry", noteActive);
  }

  function renderMessage() {
    const review = evaluateBoard(state.board, solution);
    progressTextEl.textContent = `${review.filled} filled`;
    difficultyPillEl.textContent = `Level ${puzzle.level}: ${puzzle.difficulty}`;
    messagePanelEl.textContent = state.message;
  }

  function render() {
    const pattern = getActivePattern();
    renderBoard(pattern);
    renderHintPanel(pattern);
    renderModeControls();
    renderMessage();
  }

  function checkPuzzle() {
    const review = evaluateBoard(state.board, solution);
    state.checked = true;

    if (review.solved) {
      state.message = "Solved cleanly. Gorgeous work.";
    } else if (review.conflicts.length > 0) {
      const noun = review.conflicts.length === 1 ? "cell" : "cells";
      const verb = review.conflicts.length === 1 ? "needs" : "need";
      state.message = `${review.conflicts.length} conflicting ${noun} ${verb} attention.`;
    } else if (review.mistakes.length > 0) {
      const noun = review.mistakes.length === 1 ? "cell" : "cells";
      const verb = review.mistakes.length === 1 ? "does" : "do";
      state.message = `${review.mistakes.length} filled ${noun} ${verb} not match the solution.`;
    } else {
      state.message = "No mistakes in the filled cells.";
    }

    render();
  }

  function loadPuzzle(index, message) {
    puzzle = PUZZLES[index];
    givens = parseBoard(puzzle.givens);
    solution = parseBoard(puzzle.solution);
    state.board = givens.slice();
    state.selected = givens.findIndex((value) => value === EMPTY);
    state.checked = false;
    state.activeTechnique = null;
    state.noteMode = false;
    state.oneShotNote = false;
    state.shiftNoteActive = false;
    state.manualNotes = createEmptyNotes();
    state.message = message;
    levelSelectEl.value = String(index);
    render();
  }

  function resetPuzzle() {
    loadPuzzle(Number(levelSelectEl.value), "Puzzle reset.");
  }

  function setTheme(isDark) {
    document.body.classList.toggle("dark", isDark);
    themeToggleEl.textContent = isDark ? "Light" : "Dark";
    localStorage.setItem("sudoku-theme", isDark ? "dark" : "light");
  }

  function toggleChemistryPopup(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : chemistryPopupEl.hidden;
    chemistryPopupEl.hidden = !shouldOpen;
    chemistryLinkEl.setAttribute("aria-expanded", String(shouldOpen));
  }

  function showHome() {
    homeShellEl.hidden = false;
    appShellEl.hidden = true;
    document.body.classList.remove("playing");
  }

  function showSudoku() {
    homeShellEl.hidden = true;
    appShellEl.hidden = false;
    document.body.classList.add("playing");
  }

  function bindEvents() {
    homeButtonEl.addEventListener("click", showHome);

    gameButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.game === "sudoku") {
          showSudoku();
          return;
        }

        const message = button.querySelector(".game-tag") || document.createElement("span");
        message.className = "game-tag";
        message.textContent = gameMessages[button.dataset.game] || "Coming soon.";
        if (!button.querySelector(".game-tag")) {
          button.append(message);
        }
      });
    });

    levelSelectEl.addEventListener("change", () => {
      const nextPuzzle = PUZZLES[Number(levelSelectEl.value)];
      loadPuzzle(Number(levelSelectEl.value), `Loaded Level ${nextPuzzle.level}: ${nextPuzzle.name}.`);
    });

    autoNotesEl.addEventListener("change", () => {
      state.autoNotes = autoNotesEl.checked;
      state.message = state.autoNotes ? "Auto notes are on." : "Auto notes are off.";
      render();
    });

    pencilToggleEl.addEventListener("click", () => {
      state.noteMode = !state.noteMode;
      state.oneShotNote = false;

      if (state.noteMode) {
        disableAutoNotesForManualEntry();
      }

      state.message = state.noteMode ? "Pencil mode is on." : "Pencil mode is off.";
      render();
    });

    noteOnceEl.addEventListener("click", () => {
      state.oneShotNote = !state.oneShotNote;

      if (state.oneShotNote) {
        disableAutoNotesForManualEntry();
      }

      state.message = state.oneShotNote ? "The next number will be a note." : "One-note mode cleared.";
      render();
    });

    themeToggleEl.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });

    checkPuzzleEl.addEventListener("click", checkPuzzle);
    clearCellEl.addEventListener("click", () => setSelectedCell(EMPTY));
    resetPuzzleEl.addEventListener("click", resetPuzzle);

    chemistryLinkEl.addEventListener("click", () => toggleChemistryPopup());
    chemistryCloseEl.addEventListener("click", () => toggleChemistryPopup(false));

    hintButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const technique = button.dataset.technique;
        state.activeTechnique = state.activeTechnique === technique ? null : technique;
        if (!state.activeTechnique) {
          state.message = "Overlay cleared.";
        }
        render();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (event.key === "Shift" && !event.repeat) {
        disableAutoNotesForManualEntry();
        state.shiftNoteActive = true;
        state.message = "Temporary pencil mode is on.";
        render();
        return;
      }

      if (DIGITS.includes(Number(event.key))) {
        if (event.shiftKey) {
          disableAutoNotesForManualEntry();
          state.shiftNoteActive = true;
        }
        setSelectedCell(Number(event.key));
        event.preventDefault();
      } else if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
        setSelectedCell(EMPTY);
        event.preventDefault();
      } else if (event.key === "ArrowUp") {
        moveSelection(-1, 0);
        event.preventDefault();
      } else if (event.key === "ArrowDown") {
        moveSelection(1, 0);
        event.preventDefault();
      } else if (event.key === "ArrowLeft") {
        moveSelection(0, -1);
        event.preventDefault();
      } else if (event.key === "ArrowRight") {
        moveSelection(0, 1);
        event.preventDefault();
      } else if (event.key.toLowerCase() === "n") {
        state.noteMode = !state.noteMode;
        if (state.noteMode) {
          disableAutoNotesForManualEntry();
        }
        state.message = state.noteMode ? "Pencil mode is on." : "Pencil mode is off.";
        render();
        event.preventDefault();
      } else if (event.key === "Escape" && !chemistryPopupEl.hidden) {
        toggleChemistryPopup(false);
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "Shift") {
        state.shiftNoteActive = false;
        render();
      }
    });
  }

  function init() {
    const savedTheme = localStorage.getItem("sudoku-theme");
    if (savedTheme === "dark") {
      setTheme(true);
    } else {
      setTheme(false);
    }

    createBoard();
    createNumberPad();
    createLevelSelect();
    bindEvents();
    render();
  }

  init();
})();
