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
  const e2eMode = new URLSearchParams(window.location.search).has("e2e");

  const boardEl = document.querySelector("#board");
  const homeShellEl = document.querySelector("#homeShell");
  const appShellEl = document.querySelector("#appShell");
  const homeButtonEl = document.querySelector("#homeButton");
  const homeThemeToggleEl = document.querySelector("#homeThemeToggle");
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
  const logicShellEl = document.querySelector("#logicShell");
  const logicHomeButtonEl = document.querySelector("#logicHomeButton");
  const logicThemeToggleEl = document.querySelector("#logicThemeToggle");
  const logicBoardEl = document.querySelector("#logicBoard");
  const logicLevelSelectEl = document.querySelector("#logicLevelSelect");
  const logicDifficultyPillEl = document.querySelector("#logicDifficultyPill");
  const logicProgressTextEl = document.querySelector("#logicProgressText");
  const logicHintPanelEl = document.querySelector("#logicHintPanel");
  const logicCluePanelEl = document.querySelector("#logicCluePanel");
  const logicMessagePanelEl = document.querySelector("#logicMessagePanel");
  const logicCheckEl = document.querySelector("#logicCheck");
  const logicResetEl = document.querySelector("#logicReset");
  const logicHintButtonsEl = document.querySelector("#logicHintButtons");
  const chemSearchShellEl = document.querySelector("#chemSearchShell");
  const chemSearchHomeButtonEl = document.querySelector("#chemSearchHomeButton");
  const chemSearchThemeToggleEl = document.querySelector("#chemSearchThemeToggle");
  const chemSearchBoardEl = document.querySelector("#chemSearchBoard");
  const chemSearchLevelSelectEl = document.querySelector("#chemSearchLevelSelect");
  const chemSearchDifficultyPillEl = document.querySelector("#chemSearchDifficultyPill");
  const chemSearchProgressTextEl = document.querySelector("#chemSearchProgressText");
  const chemSearchWordListEl = document.querySelector("#chemSearchWordList");
  const chemSearchHintEl = document.querySelector("#chemSearchHint");
  const chemSearchResetEl = document.querySelector("#chemSearchReset");
  const chessShellEl = document.querySelector("#chessShell");
  const chessHomeButtonEl = document.querySelector("#chessHomeButton");
  const chessThemeToggleEl = document.querySelector("#chessThemeToggle");
  const chessBoardEl = document.querySelector("#chessBoard");
  const chessLevelSelectEl = document.querySelector("#chessLevelSelect");
  const chessDifficultyPillEl = document.querySelector("#chessDifficultyPill");
  const chessTurnTextEl = document.querySelector("#chessTurnText");
  const chessLessonPanelEl = document.querySelector("#chessLessonPanel");
  const chessMessagePanelEl = document.querySelector("#chessMessagePanel");
  const chessHintEl = document.querySelector("#chessHint");
  const chessCheckEl = document.querySelector("#chessCheck");
  const chessResetEl = document.querySelector("#chessReset");
  const spiderShellEl = document.querySelector("#spiderShell");
  const spiderHomeButtonEl = document.querySelector("#spiderHomeButton");
  const spiderThemeToggleEl = document.querySelector("#spiderThemeToggle");
  const spiderStockEl = document.querySelector("#spiderStock");
  const spiderFoundationsEl = document.querySelector("#spiderFoundations");
  const spiderTableauEl = document.querySelector("#spiderTableau");
  const spiderHintEl = document.querySelector("#spiderHint");
  const spiderCheckEl = document.querySelector("#spiderCheck");
  const spiderResetEl = document.querySelector("#spiderReset");
  const spiderDifficultyPillEl = document.querySelector("#spiderDifficultyPill");
  const spiderProgressTextEl = document.querySelector("#spiderProgressText");
  const spiderLessonPanelEl = document.querySelector("#spiderLessonPanel");
  const spiderMessagePanelEl = document.querySelector("#spiderMessagePanel");
  const minesShellEl = document.querySelector("#minesShell");
  const minesHomeButtonEl = document.querySelector("#minesHomeButton");
  const minesThemeToggleEl = document.querySelector("#minesThemeToggle");
  const minesBoardEl = document.querySelector("#minesBoard");
  const minesLevelSelectEl = document.querySelector("#minesLevelSelect");
  const minesDifficultyPillEl = document.querySelector("#minesDifficultyPill");
  const minesProgressTextEl = document.querySelector("#minesProgressText");
  const minesLessonPanelEl = document.querySelector("#minesLessonPanel");
  const minesMessagePanelEl = document.querySelector("#minesMessagePanel");
  const minesRevealModeEl = document.querySelector("#minesRevealMode");
  const minesFlagModeEl = document.querySelector("#minesFlagMode");
  const minesHintEl = document.querySelector("#minesHint");
  const minesCheckEl = document.querySelector("#minesCheck");
  const minesResetEl = document.querySelector("#minesReset");
  const masterShellEl = document.querySelector("#masterShell");
  const masterHomeButtonEl = document.querySelector("#masterHomeButton");
  const masterThemeToggleEl = document.querySelector("#masterThemeToggle");
  const masterBoardEl = document.querySelector("#masterBoard");
  const masterPaletteEl = document.querySelector("#masterPalette");
  const masterSubmitEl = document.querySelector("#masterSubmit");
  const masterEraseEl = document.querySelector("#masterErase");
  const masterHintEl = document.querySelector("#masterHint");
  const masterCheckEl = document.querySelector("#masterCheck");
  const masterResetEl = document.querySelector("#masterReset");
  const masterLevelSelectEl = document.querySelector("#masterLevelSelect");
  const masterDifficultyPillEl = document.querySelector("#masterDifficultyPill");
  const masterProgressTextEl = document.querySelector("#masterProgressText");
  const masterLessonPanelEl = document.querySelector("#masterLessonPanel");
  const masterMessagePanelEl = document.querySelector("#masterMessagePanel");
  const wordShellEl = document.querySelector("#wordShell");
  const wordHomeButtonEl = document.querySelector("#wordHomeButton");
  const wordThemeToggleEl = document.querySelector("#wordThemeToggle");
  const wordBoardEl = document.querySelector("#wordBoard");
  const wordKeyboardEl = document.querySelector("#wordKeyboard");
  const wordEnterEl = document.querySelector("#wordEnter");
  const wordDeleteEl = document.querySelector("#wordDelete");
  const wordHintEl = document.querySelector("#wordHint");
  const wordCheckEl = document.querySelector("#wordCheck");
  const wordNextEl = document.querySelector("#wordNext");
  const wordResetEl = document.querySelector("#wordReset");
  const wordLevelSelectEl = document.querySelector("#wordLevelSelect");
  const wordDifficultyPillEl = document.querySelector("#wordDifficultyPill");
  const wordProgressTextEl = document.querySelector("#wordProgressText");
  const wordLessonPanelEl = document.querySelector("#wordLessonPanel");
  const wordMessagePanelEl = document.querySelector("#wordMessagePanel");
  const arcadeCelebrationEl = document.querySelector("#arcadeCelebration");

  const gameMessages = {
    "grid-logic": "Grid Logic Game is drawing suspicious little charts."
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

  const arcadeWinState = {
    active: false,
    timer: null,
    token: 0,
    countdown: 0,
    label: "",
    onAdvance: null
  };

  const CHESS_FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const CHESS_RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const CHESS_PIECES = {
    white: { king: "♔", queen: "♕", rook: "♖", bishop: "♗", knight: "♘", pawn: "♙" },
    black: { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" }
  };

  const CHESS_LEVELS = [
    {
      level: 1,
      name: "Rook Ladder",
      difficulty: "Beginner",
      side: "white",
      goal: "Use the rook to give check along the open file.",
      tactic: "Rooks move in straight lines. If the file is clear, a rook can travel all the way to the king.",
      hint: "Select the white rook on e1, then move it up the e-file.",
      answer: { from: "e1", to: "e8", notation: "Re8#" },
      pieces: [
        { square: "g1", color: "white", type: "king" },
        { square: "e1", color: "white", type: "rook" },
        { square: "g8", color: "black", type: "king" }
      ]
    },
    {
      level: 2,
      name: "Back Rank Queen",
      difficulty: "Easy",
      side: "white",
      goal: "Find the queen move that attacks the boxed-in king.",
      tactic: "A queen can move like a rook. On the back rank, she can attack across the row.",
      hint: "The d-file is open. Put the queen on the back rank.",
      answer: { from: "d1", to: "d8", notation: "Qd8#" },
      pieces: [
        { square: "g1", color: "white", type: "king" },
        { square: "d1", color: "white", type: "queen" },
        { square: "a1", color: "white", type: "rook" },
        { square: "g8", color: "black", type: "king" },
        { square: "f7", color: "black", type: "pawn" },
        { square: "g7", color: "black", type: "pawn" },
        { square: "h7", color: "black", type: "pawn" }
      ]
    },
    {
      level: 3,
      name: "Knight Fork",
      difficulty: "Moderate",
      side: "white",
      goal: "Use the knight to win the queen.",
      tactic: "Knights jump in an L shape. A fork attacks two valuable targets at once.",
      hint: "The knight on e5 can jump to the queen on d7.",
      answer: { from: "e5", to: "d7", notation: "Nxd7" },
      pieces: [
        { square: "g1", color: "white", type: "king" },
        { square: "e5", color: "white", type: "knight" },
        { square: "g8", color: "black", type: "king" },
        { square: "d7", color: "black", type: "queen" }
      ]
    },
    {
      level: 4,
      name: "Rook Capture",
      difficulty: "Medium",
      side: "black",
      goal: "Black can win White's queen with one straight move.",
      tactic: "Rooks attack along ranks and files. Capturing a loose queen is usually worth it.",
      hint: "The black rook on e8 can travel down the e-file.",
      answer: { from: "e8", to: "e2", notation: "Rxe2" },
      pieces: [
        { square: "g8", color: "black", type: "king" },
        { square: "e8", color: "black", type: "rook" },
        { square: "g1", color: "white", type: "king" },
        { square: "e2", color: "white", type: "queen" }
      ]
    },
    {
      level: 5,
      name: "Bishop Strike",
      difficulty: "Intermediate",
      side: "white",
      goal: "Use the bishop diagonal to take a rook with check.",
      tactic: "Bishops move diagonally. A capture can also be check if the bishop lands beside the king's diagonal.",
      hint: "The bishop on c4 has a clear diagonal to f7.",
      answer: { from: "c4", to: "f7", notation: "Bxf7+" },
      pieces: [
        { square: "g1", color: "white", type: "king" },
        { square: "c4", color: "white", type: "bishop" },
        { square: "g8", color: "black", type: "king" },
        { square: "f7", color: "black", type: "rook" }
      ]
    },
    {
      level: 6,
      name: "Queen Arrival",
      difficulty: "Advanced",
      side: "white",
      goal: "Move the queen onto the back rank for mate.",
      tactic: "A queen can switch from diagonal travel to rank pressure after she lands.",
      hint: "From h5, the queen has a clear diagonal to e8.",
      answer: { from: "h5", to: "e8", notation: "Qe8#" },
      pieces: [
        { square: "g1", color: "white", type: "king" },
        { square: "h5", color: "white", type: "queen" },
        { square: "g8", color: "black", type: "king" },
        { square: "g7", color: "black", type: "pawn" },
        { square: "h7", color: "black", type: "pawn" }
      ]
    },
    {
      level: 7,
      name: "Queen Finish",
      difficulty: "Expert",
      side: "black",
      goal: "Black has a forcing queen move against the exposed king.",
      tactic: "Queens are strongest near the king. A diagonal queen move can create immediate mate threats.",
      hint: "The queen on d4 can land next to the white king's diagonal.",
      answer: { from: "d4", to: "f2", notation: "Qf2#" },
      pieces: [
        { square: "g8", color: "black", type: "king" },
        { square: "d4", color: "black", type: "queen" },
        { square: "g1", color: "white", type: "king" },
        { square: "g2", color: "white", type: "pawn" },
        { square: "h2", color: "white", type: "pawn" }
      ]
    }
  ];

  const chessState = {
    levelIndex: 0,
    pieces: [],
    selected: null,
    legalTargets: new Set(),
    hintStep: 0,
    solved: false,
    lastMove: null,
    message: "Choose a tactic level, then find the best move."
  };

  const CHEM_SEARCH_DIRECTIONS = {
    easy: [[0, 1], [1, 0]],
    diagonal: [[0, 1], [1, 0], [1, 1]],
    mixed: [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0]],
    hard: [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]]
  };

  const CHEM_SEARCH_FILLER = "CHEMISTRYLABELEMENTSREACTIONBONDORBITALMOLECULEPLASMAVALENCE";

  const CHEM_SEARCH_LEVELS = [
    {
      level: 1,
      difficulty: "Easy",
      size: 6,
      directionSet: "easy",
      words: ["ATOM", "ION", "PH", "GAS"]
    },
    {
      level: 2,
      difficulty: "Easy",
      size: 7,
      directionSet: "easy",
      words: ["ACID", "BASE", "SALT", "MOLE"]
    },
    {
      level: 3,
      difficulty: "Easy",
      size: 8,
      directionSet: "diagonal",
      words: ["WATER", "SOLID", "METAL", "HELIUM"]
    },
    {
      level: 4,
      difficulty: "Moderate",
      size: 9,
      directionSet: "diagonal",
      words: ["CARBON", "OXYGEN", "PROTON", "NEUTRON"]
    },
    {
      level: 5,
      difficulty: "Moderate",
      size: 10,
      directionSet: "mixed",
      words: ["ELECTRON", "ISOTOPE", "PLASMA", "NUCLEUS"]
    },
    {
      level: 6,
      difficulty: "Moderate",
      size: 11,
      directionSet: "mixed",
      words: ["CATALYST", "SOLVENT", "SOLUTE", "REACTION"]
    },
    {
      level: 7,
      difficulty: "Medium",
      size: 11,
      directionSet: "mixed",
      words: ["POLYMER", "CRYSTAL", "ALKALI", "HALOGEN", "BONDING"]
    },
    {
      level: 8,
      difficulty: "Medium",
      size: 12,
      directionSet: "hard",
      words: ["MOLARITY", "COVALENT", "IONIC", "TITRATE", "BUFFER"]
    },
    {
      level: 9,
      difficulty: "Hard",
      size: 13,
      directionSet: "hard",
      words: ["EQUILIBRIUM", "OXIDATION", "REDUCTION", "ENTROPY", "ENTHALPY"]
    },
    {
      level: 10,
      difficulty: "Hard",
      size: 14,
      directionSet: "hard",
      words: ["STOICHIOMETRY", "ELECTROLYTE", "PRECIPITATE", "CHROMATOGRAPHY"]
    },
    {
      level: 11,
      difficulty: "Expert",
      size: 15,
      directionSet: "hard",
      words: ["THERMODYNAMICS", "SPECTROSCOPY", "KINETICS", "LIGAND", "BUFFER", "PHOTON"]
    },
    {
      level: 12,
      difficulty: "Expert",
      size: 16,
      directionSet: "hard",
      words: ["CRYSTALLOGRAPHY", "POLYMERIZATION", "INTERMOLECULAR", "ELECTROCHEMISTRY", "RADIOCHEMISTRY"]
    }
  ];

  const chemSearchState = {
    levelIndex: 0,
    grid: [],
    wordPaths: new Map(),
    foundWords: new Set(),
    selectedCells: [],
    selectionStart: null,
    dragStart: null,
    dragActive: false,
    dragMoved: false,
    skipNextClick: false,
    hintCell: null,
    invalidPath: [],
    invalidToken: 0,
    message: "Find every chemistry term in the grid."
  };

  const SPIDER_RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const SPIDER_DEAL_COUNTS = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5];

  const spiderState = {
    columns: [],
    stock: [],
    completed: 0,
    selected: null,
    dragging: null,
    animatedCards: new Set(),
    foundationPulse: false,
    hintMove: null,
    message: "Build descending same-suit runs from King down to Ace."
  };

  const MINES_LEVELS = [
    { level: 1, name: "First Dig", difficulty: "Beginner", size: 6, mines: ["b2", "e2", "c5", "f5"] },
    { level: 2, name: "Corner Clues", difficulty: "Easy", size: 7, mines: ["b2", "f2", "d4", "b6", "f6"] },
    { level: 3, name: "Quiet Middle", difficulty: "Moderate", size: 8, mines: ["b2", "e2", "g3", "c5", "f6", "b7", "h7", "d8"] },
    { level: 4, name: "Flag Practice", difficulty: "Medium", size: 8, mines: ["a2", "d2", "g2", "c4", "f5", "b7", "e7", "h7", "g8"] },
    { level: 5, name: "Narrow Paths", difficulty: "Intermediate", size: 9, mines: ["b2", "e2", "h2", "c4", "g4", "a6", "d6", "f7", "i8", "c9", "h9"] },
    { level: 6, name: "Pressure Grid", difficulty: "Advanced", size: 9, mines: ["a1", "d1", "h1", "b3", "f3", "i3", "c5", "g5", "a7", "e7", "h8", "d9", "i9"] },
    { level: 7, name: "Expert Sweep", difficulty: "Expert", size: 10, mines: ["b1", "f1", "i1", "d3", "h3", "a5", "e5", "j5", "c7", "g7", "b9", "f9", "i9", "d10", "j10"] }
  ];

  const minesState = {
    levelIndex: 0,
    cells: [],
    mode: "reveal",
    status: "playing",
    hintIndex: null,
    resetTimer: null,
    resetCountdown: 0,
    message: "Reveal safe cells and flag every mine."
  };

  const MASTER_COLORS = [
    { id: "red", label: "Red", value: "#ff5d6c" },
    { id: "blue", label: "Blue", value: "#5a8cff" },
    { id: "yellow", label: "Yellow", value: "#ffd166" },
    { id: "teal", label: "Magenta", value: "#f15bb5" },
    { id: "purple", label: "Purple", value: "#9b7bff" },
    { id: "green", label: "Green", value: "#57d68d" }
  ];

  const MASTER_LEVELS = [
    { level: 1, name: "First Code (No repeats)", difficulty: "Beginner", secret: ["red", "blue", "yellow", "teal"], guesses: 8, allowRepeats: false },
    { level: 2, name: "Color Shuffle (No repeats)", difficulty: "Easy", secret: ["teal", "red", "blue", "yellow"], guesses: 8, allowRepeats: false },
    { level: 3, name: "Repeat Signal", difficulty: "Moderate", secret: ["green", "red", "green", "blue"], guesses: 9 },
    { level: 4, name: "Double Trouble", difficulty: "Medium", secret: ["purple", "yellow", "purple", "teal"], guesses: 9 },
    { level: 5, name: "Mirror Code", difficulty: "Intermediate", secret: ["blue", "green", "green", "blue"], guesses: 10 },
    { level: 6, name: "Near Miss", difficulty: "Advanced", secret: ["yellow", "purple", "red", "green"], guesses: 10 },
    { level: 7, name: "Vault Lock", difficulty: "Expert", secret: ["teal", "purple", "blue", "red"], guesses: 10 }
  ];

  const masterState = {
    levelIndex: 0,
    guesses: [],
    current: [],
    selectedSlot: 0,
    pickerSlot: null,
    status: "playing",
    hintStep: 0,
    message: "Choose colors to crack the hidden code."
  };

  const WORD_LEVELS = [
    { level: 1, name: "Spark", difficulty: "Beginner", answer: "SPARK", hint: "A tiny flash of energy or an idea." },
    { level: 2, name: "Bloom", difficulty: "Beginner", answer: "BLOOM", hint: "A flower opening up." },
    { level: 3, name: "Dream", difficulty: "Beginner", answer: "DREAM", hint: "A story your sleeping mind tells." },
    { level: 4, name: "Crane", difficulty: "Beginner", answer: "CRANE", hint: "A machine that lifts heavy things." },
    { level: 5, name: "Glyph", difficulty: "Beginner", answer: "GLYPH", hint: "A carved or written symbol." },
    { level: 6, name: "Trace", difficulty: "Beginner", answer: "TRACE", hint: "A faint path, mark, or sign left behind." },
    { level: 7, name: "Vault", difficulty: "Easy", answer: "VAULT", hint: "A secure room, or a leap." },
    { level: 8, name: "Prism", difficulty: "Easy", answer: "PRISM", hint: "A shape that splits light into colors." },
    { level: 9, name: "Flare", difficulty: "Easy", answer: "FLARE", hint: "A sudden bright burst." },
    { level: 10, name: "Quest", difficulty: "Easy", answer: "QUEST", hint: "A search with a purpose." },
    { level: 11, name: "Rhyme", difficulty: "Easy", answer: "RHYME", hint: "Words that share a sound." },
    { level: 12, name: "Mirth", difficulty: "Easy", answer: "MIRTH", hint: "Joy or laughter." },
    { level: 13, name: "Brisk", difficulty: "Moderate", answer: "BRISK", hint: "Quick and energetic." },
    { level: 14, name: "Clove", difficulty: "Moderate", answer: "CLOVE", hint: "A small aromatic spice." },
    { level: 15, name: "Frost", difficulty: "Moderate", answer: "FROST", hint: "Ice crystals on a cold surface." },
    { level: 16, name: "Shard", difficulty: "Moderate", answer: "SHARD", hint: "A sharp broken piece." },
    { level: 17, name: "Plume", difficulty: "Moderate", answer: "PLUME", hint: "A feather or rising trail." },
    { level: 18, name: "Orbit", difficulty: "Moderate", answer: "ORBIT", hint: "A path around a planet or star." },
    { level: 19, name: "Ember", difficulty: "Medium", answer: "EMBER", hint: "A small glowing coal." },
    { level: 20, name: "Woven", difficulty: "Medium", answer: "WOVEN", hint: "Made by crossing threads." },
    { level: 21, name: "Latch", difficulty: "Medium", answer: "LATCH", hint: "A small fastener on a door." },
    { level: 22, name: "Nerve", difficulty: "Medium", answer: "NERVE", hint: "Courage, or a body signal wire." },
    { level: 23, name: "Haven", difficulty: "Medium", answer: "HAVEN", hint: "A safe place." },
    { level: 24, name: "Quilt", difficulty: "Medium", answer: "QUILT", hint: "A stitched blanket." },
    { level: 25, name: "Rivet", difficulty: "Intermediate", answer: "RIVET", hint: "A metal fastener." },
    { level: 26, name: "Sonar", difficulty: "Intermediate", answer: "SONAR", hint: "Finding things with sound waves." },
    { level: 27, name: "Tidal", difficulty: "Intermediate", answer: "TIDAL", hint: "Related to ocean tides." },
    { level: 28, name: "Yearn", difficulty: "Intermediate", answer: "YEARN", hint: "To want deeply." },
    { level: 29, name: "Zesty", difficulty: "Intermediate", answer: "ZESTY", hint: "Full of bright flavor or energy." },
    { level: 30, name: "Amber", difficulty: "Intermediate", answer: "AMBER", hint: "Golden fossil resin." },
    { level: 31, name: "Basil", difficulty: "Advanced", answer: "BASIL", hint: "A leafy kitchen herb." },
    { level: 32, name: "Crypt", difficulty: "Advanced", answer: "CRYPT", hint: "A secret code." },
    { level: 33, name: "Delta", difficulty: "Advanced", answer: "DELTA", hint: "A river mouth shape or change symbol." },
    { level: 34, name: "Elbow", difficulty: "Advanced", answer: "ELBOW", hint: "A bent arm joint." },
    { level: 35, name: "Fable", difficulty: "Advanced", answer: "FABLE", hint: "A short story with a lesson." },
    { level: 36, name: "Grace", difficulty: "Advanced", answer: "GRACE", hint: "Smoothness, kindness, or poise." },
    { level: 37, name: "Honey", difficulty: "Expert", answer: "HONEY", hint: "Sweet food made by bees." },
    { level: 38, name: "Ivory", difficulty: "Expert", answer: "IVORY", hint: "A creamy white material or color." },
    { level: 39, name: "Jolly", difficulty: "Expert", answer: "JOLLY", hint: "Cheerful and playful." },
    { level: 40, name: "Knack", difficulty: "Expert", answer: "KNACK", hint: "A special skill." }
  ];

  const WORD_KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  const wordState = {
    levelIndex: 0,
    guesses: [],
    current: "",
    status: "playing",
    hintStep: 0,
    message: "Type a five-letter guess."
  };
  const LOGIC_LEVELS = [
    {
      level: 1,
      name: "Pet Parade",
      difficulty: "Beginner",
      theme: "Match each kid to a pet.",
      people: ["Ava", "Ben", "Cleo"],
      categories: [{ id: "pet", name: "Pets", options: ["Cat", "Dog", "Bird"] }],
      solution: { Ava: { pet: "Cat" }, Ben: { pet: "Dog" }, Cleo: { pet: "Bird" } },
      clues: ["Ava does not have the dog.", "Ben has the dog.", "Cleo does not have the cat."],
      directClueIndexes: [0, 1, 2],
      directMarks: [["Ava", "pet", "Dog"], ["Ben", "pet", "Dog"], ["Cleo", "pet", "Cat"]],
      hintOrder: ["exclude"],
      hints: {
        direct: {
          title: "Direct clue",
          line1: "The clue says Ben has the dog, so that yes mark can go straight into Ben's row.",
          line2: "Once a yes is placed, the other pets in Ben's row and the other kids in Dog's column can be crossed out.",
          anchors: [["Ben", "pet", "Dog"]],
          removals: [["Ben", "pet", "Cat"], ["Ben", "pet", "Bird"], ["Ava", "pet", "Dog"], ["Cleo", "pet", "Dog"]]
        },
        exclude: {
          title: "Exclusion",
          line1: "Ava does not have the dog, so Dog can be crossed out for Ava.",
          line2: "Small no marks are the rails of a logic grid: they keep later yes marks from drifting.",
          anchors: [["Ava", "pet", "Dog"]],
          inferred: [["Ava", "pet", "Cat"]]
        },
      }
    },
    {
      level: 2,
      name: "Snack Switch",
      difficulty: "Easy",
      theme: "Match each friend to a snack.",
      people: ["Iris", "Jude", "Kai"],
      categories: [{ id: "snack", name: "Snacks", options: ["Apple", "Pretzel", "Muffin"] }],
      solution: { Iris: { snack: "Pretzel" }, Jude: { snack: "Muffin" }, Kai: { snack: "Apple" } },
      clues: ["Jude brought the muffin.", "Kai did not bring the pretzel.", "Iris did not bring the apple."],
      directClueIndexes: [0, 1, 2],
      directMarks: [["Jude", "snack", "Muffin"], ["Kai", "snack", "Pretzel"], ["Iris", "snack", "Apple"]],
      hintOrder: ["exclude"],
      hints: {
        direct: {
          title: "Direct clue",
          line1: "Jude brought the muffin, which gives you one clean yes mark.",
          line2: "Use that yes to cross out the rest of Jude's snack row and the rest of the Muffin column.",
          anchors: [["Jude", "snack", "Muffin"]],
          removals: [["Jude", "snack", "Apple"], ["Jude", "snack", "Pretzel"], ["Iris", "snack", "Muffin"], ["Kai", "snack", "Muffin"]]
        },
        exclude: {
          title: "Exclusion",
          line1: "Iris did not bring the apple. That cell is a no.",
          line2: "Pair it with Kai not bringing the pretzel, and the remaining openings start to narrow quickly.",
          anchors: [["Iris", "snack", "Apple"], ["Kai", "snack", "Pretzel"]],
          inferred: [["Kai", "snack", "Apple"]]
        },
      }
    },
    {
      level: 3,
      name: "Festival Seats",
      difficulty: "Moderate",
      theme: "Match friends to seats and drinks.",
      people: ["Lena", "Milo", "Nia"],
      categories: [
        { id: "seat", name: "Seats", options: ["Front", "Middle", "Back"] },
        { id: "drink", name: "Drinks", options: ["Tea", "Juice", "Cocoa"] }
      ],
      solution: {
        Lena: { seat: "Middle", drink: "Tea" },
        Milo: { seat: "Back", drink: "Juice" },
        Nia: { seat: "Front", drink: "Cocoa" }
      },
      clues: ["Nia sat in front.", "The person in the back drank juice.", "Lena did not drink cocoa.", "Milo was not in the middle."],
      directClueIndexes: [0, 2, 3],
      directMarks: [["Nia", "seat", "Front"], ["Lena", "drink", "Cocoa"], ["Milo", "seat", "Middle"]],
      hintOrder: ["exclude", "chain"],
      hints: {
        direct: {
          title: "Direct clue",
          line1: "Nia sat in front, so the Nia and Front cell is a yes.",
          line2: "That yes removes the other seats from Nia and the other people from Front.",
          anchors: [["Nia", "seat", "Front"]],
          removals: [["Nia", "seat", "Middle"], ["Nia", "seat", "Back"], ["Lena", "seat", "Front"], ["Milo", "seat", "Front"]]
        },
        exclude: {
          title: "Exclusion",
          line1: "Lena did not drink cocoa and Milo was not in the middle.",
          line2: "These are simple no marks, but together they make the next forced cells visible.",
          anchors: [["Lena", "drink", "Cocoa"], ["Milo", "seat", "Middle"]],
          inferred: [["Milo", "seat", "Back"]]
        },
        chain: {
          title: "Chain clue",
          line1: "The back seat belongs with juice.",
          line2: "Once Milo is known to be in back, the back-juice clue points to Milo's drink.",
          supports: [["Milo", "seat", "Back"]],
          inferred: [["Milo", "drink", "Juice"]]
        },
      }
    },
    {
      level: 4,
      name: "Studio Clues",
      difficulty: "Medium",
      theme: "Match makers to colors and tools.",
      people: ["Omar", "Pia", "Quinn", "Rae"],
      categories: [
        { id: "color", name: "Colors", options: ["Blue", "Green", "Red", "Yellow"] },
        { id: "tool", name: "Tools", options: ["Brush", "Camera", "Clay", "Pen"] }
      ],
      solution: {
        Omar: { color: "Green", tool: "Camera" },
        Pia: { color: "Yellow", tool: "Brush" },
        Quinn: { color: "Blue", tool: "Pen" },
        Rae: { color: "Red", tool: "Clay" }
      },
      clues: [
        "The camera artist used green.",
        "Pia used the brush.",
        "Rae did not use yellow.",
        "Quinn was not the clay artist.",
        "Omar did not choose blue.",
        "Quinn chose blue.",
        "Rae used clay."
      ],
      directClueIndexes: [1, 2, 3, 4, 5, 6],
      directMarks: [
        ["Pia", "tool", "Brush"],
        ["Rae", "color", "Yellow"],
        ["Quinn", "tool", "Clay"],
        ["Omar", "color", "Blue"],
        ["Quinn", "color", "Blue"],
        ["Rae", "tool", "Clay"]
      ],
      hintOrder: ["chain", "exclude", "pair"],
      hints: {
        direct: {
          title: "Direct clue",
          line1: "Pia used the brush, Quinn chose blue, and Rae used clay.",
          line2: "These plain clues give the level enough structure for the thinking clues.",
          anchors: [["Pia", "tool", "Brush"]],
          removals: [["Omar", "tool", "Brush"], ["Quinn", "tool", "Brush"], ["Rae", "tool", "Brush"], ["Pia", "tool", "Camera"]]
        },
        exclude: {
          title: "Exclusion",
          line1: "Pia used the brush and Rae used clay.",
          line2: "Once Quinn is also not Camera, Camera has only one row left.",
          supports: [["Omar", "tool", "Brush"], ["Pia", "tool", "Camera"], ["Quinn", "tool", "Camera"], ["Rae", "tool", "Camera"]],
          inferred: [["Omar", "tool", "Camera"]],
          proof: "3 of the 4 cells in this Camera column are x's"
        },
        pair: {
          title: "Pair lock",
          line1: "The camera artist used green.",
          line2: "Once Omar is the camera artist, the linked color must be green.",
          supports: [["Omar", "tool", "Camera"]],
          inferred: [["Omar", "color", "Green"]]
        },
        chain: {
          title: "Chain clue",
          line1: "The camera artist used green.",
          line2: "If Camera always travels with Green, anyone who is not Green cannot be Camera.",
          supports: [["Quinn", "color", "Green"]],
          inferred: [["Quinn", "tool", "Camera"]]
        },
      }
    },
    {
      level: 5,
      name: "Market Morning",
      difficulty: "Intermediate",
      theme: "Match shoppers to stalls and baskets.",
      people: ["Sage", "Theo", "Uma", "Vale"],
      categories: [
        { id: "stall", name: "Stalls", options: ["Bakery", "Flowers", "Fruit", "Spices"] },
        { id: "basket", name: "Baskets", options: ["Berries", "Bread", "Lilies", "Pepper"] }
      ],
      solution: {
        Sage: { stall: "Flowers", basket: "Lilies" },
        Theo: { stall: "Bakery", basket: "Bread" },
        Uma: { stall: "Spices", basket: "Pepper" },
        Vale: { stall: "Fruit", basket: "Berries" }
      },
      clues: [
        "The fruit shopper carried berries.",
        "The bakery shopper carried bread.",
        "Sage visited flowers.",
        "Uma visited spices.",
        "Vale carried berries.",
        "Uma did not buy lilies."
      ],
      directClueIndexes: [2, 3, 4, 5],
      directMarks: [["Sage", "stall", "Flowers"], ["Uma", "stall", "Spices"], ["Vale", "basket", "Berries"], ["Uma", "basket", "Lilies"]],
      hintOrder: ["chain", "exclude", "chain2", "exclude2", "exclude3"],
      hints: {
        direct: {
          title: "Direct clue",
          line1: "Sage visited flowers, Uma visited spices, Vale carried berries, and Uma did not buy lilies.",
          line2: "These plain clues put the first check and x marks on the grid.",
          anchors: [["Sage", "stall", "Flowers"], ["Uma", "stall", "Spices"], ["Vale", "basket", "Berries"], ["Uma", "basket", "Lilies"]]
        },
        exclude: {
          title: "Exclusion 1",
          line1: "Sage visited flowers, Uma visited spices, and Vale visited fruit.",
          line2: "Those three stalls are already taken, so Theo has only one stall left.",
          supports: [["Sage", "stall", "Flowers"], ["Uma", "stall", "Spices"], ["Vale", "stall", "Fruit"]],
          inferred: [["Theo", "stall", "Bakery"]],
          proof: "Flowers, Spices, and Fruit are already taken"
        },
        chain: {
          title: "Chain clue 1",
          line1: "The fruit shopper carried berries.",
          line2: "Vale carried berries, so Vale must have visited fruit.",
          supports: [["Vale", "basket", "Berries"]],
          inferred: [["Vale", "stall", "Fruit"]]
        },
        chain2: {
          title: "Chain clue 2",
          line1: "The bakery shopper carried bread.",
          line2: "Theo visited the bakery, so Theo must have carried bread.",
          supports: [["Theo", "stall", "Bakery"]],
          inferred: [["Theo", "basket", "Bread"]]
        },
        exclude2: {
          title: "Exclusion 2",
          kind: "exclude",
          line1: "Vale carried berries, Theo carried bread, and Uma did not buy lilies.",
          line2: "That leaves only one person who can have lilies.",
          supports: [["Vale", "basket", "Berries"], ["Theo", "basket", "Bread"], ["Uma", "basket", "Lilies"]],
          inferred: [["Sage", "basket", "Lilies"]],
          proof: "Berries and Bread are already taken, and Uma is not Lilies"
        },
        exclude3: {
          title: "Exclusion 3",
          kind: "exclude",
          line1: "Uma cannot have berries, bread, or lilies.",
          line2: "When three basket cells in Uma's row are x's, the last basket is forced.",
          supports: [["Uma", "basket", "Berries"], ["Uma", "basket", "Bread"], ["Uma", "basket", "Lilies"]],
          inferred: [["Uma", "basket", "Pepper"]],
          proof: "3 of the 4 cells in Uma's basket row are x's"
        },
      }
    },
    {
      level: 6,
      name: "Observatory Night",
      difficulty: "Advanced",
      theme: "Match astronomers to telescopes and targets.",
      people: ["Wren", "Xavi", "Yara", "Zed"],
      categories: [
        { id: "scope", name: "Scopes", options: ["Comet", "Lunar", "Nebula", "Solar"] },
        { id: "target", name: "Targets", options: ["Aurora", "Crater", "Meteor", "Orion"] }
      ],
      solution: {
        Wren: { scope: "Nebula", target: "Orion" },
        Xavi: { scope: "Solar", target: "Aurora" },
        Yara: { scope: "Lunar", target: "Crater" },
        Zed: { scope: "Comet", target: "Meteor" }
      },
      clues: [
        "The comet scope tracked the meteor.",
        "Yara used the lunar scope.",
        "Xavi did not observe Orion.",
        "Wren did not use the solar scope.",
        "The nebula scope did not track the crater.",
        "Yara observed the crater.",
        "Zed used the comet scope."
      ],
      directClueIndexes: [1, 2, 3, 5, 6],
      directMarks: [
        ["Yara", "scope", "Lunar", { autoPeers: false }],
        ["Xavi", "target", "Orion"],
        ["Wren", "scope", "Solar"],
        ["Yara", "target", "Crater"],
        ["Zed", "scope", "Comet", { autoPeers: false }]
      ],
      hintOrder: ["chain", "chain2", "exclude", "exclude2", "exclude3", "exclude4"],
      hints: {
        direct: {
          title: "Direct clue",
          line1: "Yara used the lunar scope, Yara observed the crater, and Zed used the comet scope.",
          line2: "These plain clues give the linked clues a place to land.",
          anchors: [["Yara", "scope", "Lunar"]],
          removals: [["Wren", "scope", "Lunar"], ["Xavi", "scope", "Lunar"], ["Zed", "scope", "Lunar"], ["Yara", "scope", "Comet"]]
        },
        exclude: {
          title: "Exclusion 1",
          line1: "Xavi did not observe Orion.",
          line2: "After Yara has Crater and Zed has Meteor, Xavi has only one target left.",
          supports: [["Xavi", "target", "Orion"], ["Xavi", "target", "Crater"], ["Xavi", "target", "Meteor"]],
          inferred: [["Xavi", "target", "Aurora"]],
          proof: "3 of the 4 cells in Xavi's target row are x's"
        },
        chain: {
          title: "Chain clue 1",
          line1: "The comet scope tracked the meteor.",
          line2: "Zed used the comet scope, so Zed's target must be Meteor.",
          supports: [["Zed", "scope", "Comet"]],
          inferred: [["Zed", "target", "Meteor"]]
        },
        chain2: {
          title: "Chain clue 2",
          line1: "The nebula scope did not track the crater.",
          line2: "Yara observed the crater, so Yara could not have used the nebula scope.",
          supports: [["Yara", "target", "Crater"]],
          inferred: [["Yara", "scope", "Nebula"]]
        },
        exclude2: {
          title: "Exclusion 2",
          kind: "exclude",
          line1: "Wren did not use the solar scope.",
          line2: "Yara has Lunar, Zed has Comet, and Wren is not Solar, so Wren has only one scope left.",
          supports: [["Yara", "scope", "Lunar"], ["Zed", "scope", "Comet"], ["Wren", "scope", "Solar"]],
          inferred: [["Wren", "scope", "Nebula"]],
          proof: "Lunar and Comet are already taken, and Wren is not Solar"
        },
        exclude3: {
          title: "Exclusion 3",
          kind: "exclude",
          line1: "Yara, Zed, and Wren each have a scope.",
          line2: "Once Lunar, Comet, and Nebula are taken, Xavi has only one scope left.",
          supports: [["Yara", "scope", "Lunar"], ["Zed", "scope", "Comet"], ["Wren", "scope", "Nebula"]],
          inferred: [["Xavi", "scope", "Solar"]],
          proof: "Lunar, Comet, and Nebula are already taken"
        },
        exclude4: {
          title: "Exclusion 4",
          kind: "exclude",
          line1: "Yara observed Crater, Zed observed Meteor, and Xavi observed Aurora.",
          line2: "Those three targets are taken, so Wren has only one target left.",
          supports: [["Yara", "target", "Crater"], ["Zed", "target", "Meteor"], ["Xavi", "target", "Aurora"]],
          inferred: [["Wren", "target", "Orion"]],
          proof: "Crater, Meteor, and Aurora are already taken"
        },
      }
    },
    {
      level: 7,
      name: "Expert Deduction Lab",
      difficulty: "Expert",
      theme: "Match researchers to labs, samples, and times.",
      people: ["Aria", "Bram", "Cyra", "Dax"],
      categories: [
        { id: "lab", name: "Labs", options: ["Crystal", "Fusion", "Marine", "Robotics"] },
        { id: "sample", name: "Samples", options: ["Alloy", "Coral", "Laser", "Sensor"] },
        { id: "time", name: "Times", options: ["8 AM", "10 AM", "1 PM", "3 PM"] }
      ],
      solution: {
        Aria: { lab: "Marine", sample: "Coral", time: "10 AM" },
        Bram: { lab: "Crystal", sample: "Alloy", time: "8 AM" },
        Cyra: { lab: "Robotics", sample: "Sensor", time: "3 PM" },
        Dax: { lab: "Fusion", sample: "Laser", time: "1 PM" }
      },
      clues: [
        "The marine lab handled coral.",
        "The fusion lab ran at 1 PM.",
        "Bram worked at 8 AM.",
        "Bram was not in robotics.",
        "Dax did not handle alloy.",
        "The sensor sample was later than 1 PM.",
        "Aria worked in the marine lab.",
        "Dax worked in the fusion lab.",
        "Cyra handled the sensor sample."
      ],
      directClueIndexes: [2, 3, 4, 6, 7, 8],
      directMarks: [
        ["Bram", "time", "8 AM"],
        ["Bram", "lab", "Robotics"],
        ["Dax", "sample", "Alloy"],
        ["Aria", "lab", "Marine", { autoPeers: false }],
        ["Dax", "lab", "Fusion", { autoPeers: false }],
        ["Cyra", "sample", "Sensor", { autoPeers: false }]
      ],
      hintOrder: ["chain", "chain2", "chain3", "exclude", "exclude2", "exclude3", "exclude4", "exclude5"],
      hints: {
        direct: {
          title: "Direct clue",
          line1: "Bram worked at 8 AM, Bram was not Robotics, Dax was not Alloy, Aria was Marine, Dax was Fusion, and Cyra handled Sensor.",
          line2: "These plain clues set up the linked clues.",
          anchors: [["Bram", "time", "8 AM"], ["Bram", "lab", "Robotics"], ["Dax", "sample", "Alloy"], ["Aria", "lab", "Marine"], ["Dax", "lab", "Fusion"], ["Cyra", "sample", "Sensor"]]
        },
        chain: {
          title: "Chain clue 1",
          line1: "The marine lab handled coral.",
          line2: "Aria worked in the marine lab, so Aria handled coral.",
          supports: [["Aria", "lab", "Marine"]],
          inferred: [["Aria", "sample", "Coral"]]
        },
        chain2: {
          title: "Chain clue 2",
          line1: "The fusion lab ran at 1 PM.",
          line2: "Dax worked in the fusion lab, so Dax worked at 1 PM.",
          supports: [["Dax", "lab", "Fusion"]],
          inferred: [["Dax", "time", "1 PM"]]
        },
        chain3: {
          title: "Chain clue 3",
          line1: "The sensor sample was later than 1 PM.",
          line2: "Cyra handled the sensor sample, so Cyra worked at 3 PM.",
          supports: [["Cyra", "sample", "Sensor"]],
          inferred: [["Cyra", "time", "3 PM"]]
        },
        exclude: {
          title: "Exclusion 1",
          kind: "exclude",
          line1: "Aria worked in Marine, Dax worked in Fusion, and Bram was not Robotics.",
          line2: "Those facts leave only one lab for Bram.",
          supports: [["Aria", "lab", "Marine"], ["Dax", "lab", "Fusion"], ["Bram", "lab", "Robotics"]],
          inferred: [["Bram", "lab", "Crystal"]],
          proof: "Marine and Fusion are already taken, and Bram is not Robotics"
        },
        exclude2: {
          title: "Exclusion 2",
          kind: "exclude",
          line1: "Aria, Bram, and Dax each have a lab.",
          line2: "Once Marine, Crystal, and Fusion are taken, Cyra has only one lab left.",
          supports: [["Aria", "lab", "Marine"], ["Bram", "lab", "Crystal"], ["Dax", "lab", "Fusion"]],
          inferred: [["Cyra", "lab", "Robotics"]],
          proof: "Marine, Crystal, and Fusion are already taken"
        },
        exclude3: {
          title: "Exclusion 3",
          kind: "exclude",
          line1: "Aria handled coral, Cyra handled sensor, and Dax did not handle alloy.",
          line2: "Those facts leave Alloy for only one researcher.",
          supports: [["Aria", "sample", "Coral"], ["Cyra", "sample", "Sensor"], ["Dax", "sample", "Alloy"]],
          inferred: [["Bram", "sample", "Alloy"]],
          proof: "Coral and Sensor are already taken, and Dax is not Alloy"
        },
        exclude4: {
          title: "Exclusion 4",
          kind: "exclude",
          line1: "Aria, Bram, and Cyra each have a sample.",
          line2: "Once Coral, Alloy, and Sensor are taken, Dax has only one sample left.",
          supports: [["Aria", "sample", "Coral"], ["Bram", "sample", "Alloy"], ["Cyra", "sample", "Sensor"]],
          inferred: [["Dax", "sample", "Laser"]],
          proof: "Coral, Alloy, and Sensor are already taken"
        },
        exclude5: {
          title: "Exclusion 5",
          kind: "exclude",
          line1: "Bram worked at 8 AM, Dax worked at 1 PM, and Cyra worked at 3 PM.",
          line2: "Those three times are taken, so Aria has only one time left.",
          supports: [["Bram", "time", "8 AM"], ["Dax", "time", "1 PM"], ["Cyra", "time", "3 PM"]],
          inferred: [["Aria", "time", "10 AM"]],
          proof: "8 AM, 1 PM, and 3 PM are already taken"
        },
      }
    }
  ];

  const logicState = {
    puzzleIndex: LOGIC_LEVELS.length - 1,
    marks: new Map(),
    autoMarks: new Map(),
    activeHint: null,
    showClueKinds: false,
    revealedHints: new Set(),
    checked: false,
    checkStatus: null,
    message: "Read a clue, choose a mark, and start crossing the grid."
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
    if (review.solved) {
      startArcadeWinSequence({
        label: "Sudoku solved",
        onAdvance: () => {
          const nextIndex = getNextLevelIndex(levelSelectEl.selectedIndex, PUZZLES);
          const nextPuzzle = PUZZLES[nextIndex];
          loadPuzzle(nextIndex, `Level ${nextPuzzle.level}: ${nextPuzzle.name}.`);
        }
      });
    }
  }

  function loadPuzzle(index, message) {
    clearArcadeWinSequence();
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
    homeThemeToggleEl.textContent = isDark ? "Light" : "Dark";
    themeToggleEl.textContent = isDark ? "Light" : "Dark";
    logicThemeToggleEl.textContent = isDark ? "Light" : "Dark";
    chemSearchThemeToggleEl.textContent = isDark ? "Light" : "Dark";
    if (chessThemeToggleEl) {
      chessThemeToggleEl.textContent = isDark ? "Light" : "Dark";
    }
    spiderThemeToggleEl.textContent = isDark ? "Light" : "Dark";
    minesThemeToggleEl.textContent = isDark ? "Light" : "Dark";
    masterThemeToggleEl.textContent = isDark ? "Light" : "Dark";
    wordThemeToggleEl.textContent = isDark ? "Light" : "Dark";
    localStorage.setItem("sudoku-theme", isDark ? "dark" : "light");
  }

  function toggleChemistryPopup(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : chemistryPopupEl.hidden;
    chemistryPopupEl.hidden = !shouldOpen;
    chemistryLinkEl.setAttribute("aria-expanded", String(shouldOpen));
  }

  function setPageTitle(gameTitle = "") {
    document.title = gameTitle ? `${gameTitle} | Brain Spark Arcade` : "Brain Spark Arcade";
  }

  function setHiddenIfPresent(element, isHidden) {
    if (element) {
      element.hidden = isHidden;
    }
  }

  function getNextLevelIndex(currentIndex, levels) {
    return (currentIndex + 1) % levels.length;
  }

  function renderArcadeCelebration() {
    if (!arcadeCelebrationEl) {
      return;
    }

    arcadeCelebrationEl.innerHTML = "";
    arcadeCelebrationEl.hidden = false;

    const confettiEl = document.createElement("div");
    confettiEl.className = "arcade-confetti";
    confettiEl.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 32; index += 1) {
      const piece = document.createElement("span");
      piece.style.setProperty("--i", String(index));
      confettiEl.append(piece);
    }

    const cardEl = document.createElement("div");
    cardEl.className = "arcade-celebration-card";

    const titleEl = document.createElement("strong");
    titleEl.textContent = arcadeWinState.label;

    const countdownEl = document.createElement("span");
    countdownEl.className = "arcade-countdown";
    countdownEl.textContent = `Next level in ${arcadeWinState.countdown}`;

    cardEl.append(titleEl, countdownEl);
    arcadeCelebrationEl.append(confettiEl, cardEl);
  }

  function clearArcadeWinSequence() {
    if (arcadeWinState.timer) {
      clearInterval(arcadeWinState.timer);
    }
    arcadeWinState.active = false;
    arcadeWinState.timer = null;
    arcadeWinState.countdown = 0;
    arcadeWinState.label = "";
    arcadeWinState.onAdvance = null;
    arcadeWinState.token += 1;
    if (arcadeCelebrationEl) {
      arcadeCelebrationEl.hidden = true;
      arcadeCelebrationEl.innerHTML = "";
    }
  }

  function startArcadeWinSequence({ label, onAdvance }) {
    if (arcadeWinState.active) {
      return;
    }
    if (!arcadeCelebrationEl) {
      onAdvance?.();
      return;
    }

    arcadeWinState.active = true;
    arcadeWinState.countdown = 3;
    arcadeWinState.label = label;
    arcadeWinState.onAdvance = onAdvance;
    arcadeWinState.token += 1;
    const token = arcadeWinState.token;
    renderArcadeCelebration();

    arcadeWinState.timer = setInterval(() => {
      if (arcadeWinState.token !== token) {
        return;
      }
      arcadeWinState.countdown -= 1;
      if (arcadeWinState.countdown <= 0) {
        const advance = arcadeWinState.onAdvance;
        clearArcadeWinSequence();
        advance?.();
        return;
      }
      renderArcadeCelebration();
    }, 1000);
  }

  function showHome() {
    clearArcadeWinSequence();
    setPageTitle();
    homeShellEl.hidden = false;
    appShellEl.hidden = true;
    logicShellEl.hidden = true;
    chemSearchShellEl.hidden = true;
    setHiddenIfPresent(chessShellEl, true);
    spiderShellEl.hidden = true;
    minesShellEl.hidden = true;
    masterShellEl.hidden = true;
    wordShellEl.hidden = true;
    document.body.classList.remove("playing");
  }

  function showSudoku() {
    setPageTitle("Sudoku");
    homeShellEl.hidden = true;
    appShellEl.hidden = false;
    logicShellEl.hidden = true;
    chemSearchShellEl.hidden = true;
    setHiddenIfPresent(chessShellEl, true);
    spiderShellEl.hidden = true;
    minesShellEl.hidden = true;
    masterShellEl.hidden = true;
    wordShellEl.hidden = true;
    document.body.classList.add("playing");
  }

  function showLogicGame() {
    setPageTitle("Grid Logic");
    homeShellEl.hidden = true;
    appShellEl.hidden = true;
    logicShellEl.hidden = false;
    chemSearchShellEl.hidden = true;
    setHiddenIfPresent(chessShellEl, true);
    spiderShellEl.hidden = true;
    minesShellEl.hidden = true;
    masterShellEl.hidden = true;
    wordShellEl.hidden = true;
    document.body.classList.add("playing");
  }

  function showChessGame() {
    setPageTitle("Chess");
    homeShellEl.hidden = true;
    appShellEl.hidden = true;
    logicShellEl.hidden = true;
    chemSearchShellEl.hidden = true;
    setHiddenIfPresent(chessShellEl, false);
    spiderShellEl.hidden = true;
    minesShellEl.hidden = true;
    masterShellEl.hidden = true;
    wordShellEl.hidden = true;
    document.body.classList.add("playing");
    if (chessShellEl) {
      renderChessGame();
    }
  }

  function showChemSearchGame() {
    setPageTitle("Chemistry Word Search");
    homeShellEl.hidden = true;
    appShellEl.hidden = true;
    logicShellEl.hidden = true;
    chemSearchShellEl.hidden = false;
    setHiddenIfPresent(chessShellEl, true);
    spiderShellEl.hidden = true;
    minesShellEl.hidden = true;
    masterShellEl.hidden = true;
    wordShellEl.hidden = true;
    document.body.classList.add("playing");
    renderChemSearchGame();
  }

  function showSpiderGame() {
    setPageTitle("Spider Solitaire");
    homeShellEl.hidden = true;
    appShellEl.hidden = true;
    logicShellEl.hidden = true;
    chemSearchShellEl.hidden = true;
    setHiddenIfPresent(chessShellEl, true);
    spiderShellEl.hidden = false;
    minesShellEl.hidden = true;
    masterShellEl.hidden = true;
    wordShellEl.hidden = true;
    document.body.classList.add("playing");
    renderSpiderGame();
  }

  function showMinesGame() {
    setPageTitle("Minesweeper");
    homeShellEl.hidden = true;
    appShellEl.hidden = true;
    logicShellEl.hidden = true;
    chemSearchShellEl.hidden = true;
    setHiddenIfPresent(chessShellEl, true);
    spiderShellEl.hidden = true;
    minesShellEl.hidden = false;
    masterShellEl.hidden = true;
    wordShellEl.hidden = true;
    document.body.classList.add("playing");
    renderMinesGame();
  }

  function showMasterGame() {
    setPageTitle("Mastermind");
    homeShellEl.hidden = true;
    appShellEl.hidden = true;
    logicShellEl.hidden = true;
    chemSearchShellEl.hidden = true;
    setHiddenIfPresent(chessShellEl, true);
    spiderShellEl.hidden = true;
    minesShellEl.hidden = true;
    masterShellEl.hidden = false;
    wordShellEl.hidden = true;
    document.body.classList.add("playing");
    renderMasterGame();
  }

  function showWordGame() {
    setPageTitle("Word Vault");
    homeShellEl.hidden = true;
    appShellEl.hidden = true;
    logicShellEl.hidden = true;
    chemSearchShellEl.hidden = true;
    setHiddenIfPresent(chessShellEl, true);
    spiderShellEl.hidden = true;
    minesShellEl.hidden = true;
    masterShellEl.hidden = true;
    wordShellEl.hidden = false;
    document.body.classList.add("playing");
    renderWordGame();
  }

  function getLogicPuzzle() {
    return LOGIC_LEVELS[logicState.puzzleIndex];
  }

  function getLogicHintOrder(puzzle) {
    const fallbackOrder = ["exclude", "chain", "pair"];
    const explicitOrder = puzzle.hintOrder || [];
    const ordered = explicitOrder.filter((hintName) => puzzle.hints[hintName]);
    fallbackOrder.forEach((hintName) => {
      if (puzzle.hints[hintName] && !ordered.includes(hintName)) {
        ordered.push(hintName);
      }
    });
    Object.keys(puzzle.hints).forEach((hintName) => {
      if (hintName !== "direct" && !ordered.includes(hintName)) {
        ordered.push(hintName);
      }
    });
    return ordered;
  }

  function getLogicHintKind(hintName, hint) {
    if (hint && hint.kind) {
      return hint.kind;
    }
    if (hintName && hintName.startsWith("exclude")) {
      return "exclude";
    }
    if (hintName && hintName.startsWith("pair")) {
      return "pair";
    }
    if (hintName && hintName.startsWith("chain")) {
      return "chain";
    }
    return hintName || "";
  }

  function logicKey(person, categoryId, option) {
    return `${person}|${categoryId}|${option}`;
  }

  function parseLogicCellRef(ref) {
    return logicKey(ref[0], ref[1], ref[2]);
  }

  function getLogicSolutionMark(puzzle, person, categoryId, option) {
    return puzzle.solution[person][categoryId] === option ? "yes" : "no";
  }

  function getLogicMark(person, categoryId, option) {
    return logicState.marks.get(logicKey(person, categoryId, option)) || "blank";
  }

  function isLogicRefCorrectlyMarked(puzzle, ref) {
    const [person, categoryId, option] = ref;
    return getLogicMark(person, categoryId, option) === getLogicSolutionMark(puzzle, person, categoryId, option);
  }

  function areLogicRefsCorrectlyMarked(puzzle, refs) {
    return refs.length > 0 && refs.every((ref) => isLogicRefCorrectlyMarked(puzzle, ref));
  }

  function getLogicHintRevealKey() {
    return `${logicState.puzzleIndex}|${logicState.activeHint || "none"}`;
  }

  function getLogicCategoryName(puzzle, categoryId) {
    const category = puzzle.categories.find((item) => item.id === categoryId);
    return category ? category.name.toLowerCase() : "group";
  }

  function formatLogicKnownFact(puzzle, ref) {
    const [person, categoryId, option] = ref;
    const expected = getLogicSolutionMark(puzzle, person, categoryId, option);
    const categoryName = getLogicCategoryName(puzzle, categoryId).replace(/s$/, "");
    return expected === "yes" ? `${person}'s ${categoryName} is ${option}` : `${person}'s ${categoryName} is not ${option}`;
  }

  function formatLogicInference(puzzle, ref) {
    const [person, categoryId, option] = ref;
    const expected = getLogicSolutionMark(puzzle, person, categoryId, option);
    const categoryName = getLogicCategoryName(puzzle, categoryId).replace(/s$/, "");
    return expected === "yes" ? `${person}'s ${categoryName} must be ${option}` : `${person}'s ${categoryName} cannot be ${option}`;
  }

  function getLogicRelevantSupportRefs(puzzle, inferredRef) {
    if (!inferredRef) {
      return [];
    }

    const [person, categoryId, option] = inferredRef;
    const category = puzzle.categories.find((item) => item.id === categoryId);

    if (!category) {
      return [];
    }

    const refs = [];
    category.options.forEach((otherOption) => {
      if (otherOption !== option && getLogicMark(person, categoryId, otherOption) !== "blank") {
        refs.push([person, categoryId, otherOption]);
      }
    });

    return refs;
  }

  function getLogicHintSupportRefs(puzzle, hint) {
    if (hint.supports) {
      return hint.supports;
    }

    const inferredRefs = hint.inferred || hint.anchors || [];
    const seen = new Set();
    const supports = [];

    inferredRefs.forEach((inferredRef) => {
      getLogicRelevantSupportRefs(puzzle, inferredRef).forEach((supportRef) => {
        const key = parseLogicCellRef(supportRef);
        if (!seen.has(key)) {
          seen.add(key);
          supports.push(supportRef);
        }
      });
    });

    return supports;
  }

  function renderLogicInferencePrompt(puzzle, hint) {
    const inferredRef = (hint.inferred || hint.anchors || [])[0];
    if (!inferredRef) {
      return "";
    }

    const supports = getLogicHintSupportRefs(puzzle, hint);
    const factText = supports.map((ref) => formatLogicKnownFact(puzzle, ref)).join(" and ");
    const clueText = hint.line1 ? `the clue says "${hint.line1}"` : "";
    const proofFacts = [clueText, factText].filter(Boolean).join(", and ");
    const revealed = logicState.revealedHints.has(getLogicHintRevealKey());
    const answer = formatLogicInference(puzzle, inferredRef);
    const answerNode = revealed
      ? `<strong>${answer}</strong>`
      : `<button id="logicRevealInference" class="logic-reveal-inference" type="button" aria-label="Reveal this inference">___</button>`;
    const proofText = hint.proof
      ? `${hint.proof}, so we can deduce that ${answerNode}.`
      : `We know ${proofFacts}, so we can deduce that ${answerNode}.`;

    return `
      <p class="logic-proof"><strong>Try this:</strong> ${proofText}</p>
    `;
  }

  function setLogicRawMark(person, categoryId, option, mark) {
    const key = logicKey(person, categoryId, option);
    if (mark === "blank") {
      logicState.marks.delete(key);
      logicState.autoMarks.delete(key);
    } else {
      logicState.marks.set(key, mark);
    }
  }

  function setLogicAutoNo(person, categoryId, option, sourceKey) {
    const key = logicKey(person, categoryId, option);
    const current = logicState.marks.get(key) || "blank";

    if (current === "blank") {
      logicState.marks.set(key, "no");
      logicState.autoMarks.set(key, sourceKey);
    }
  }

  function canLogicAutoFillPeers(refs) {
    return refs.every((ref) => {
      const mark = getLogicMark(ref[0], ref[1], ref[2]);
      return mark === "blank" || mark === "no";
    });
  }

  function clearLogicAutoMarksFrom(sourceKey) {
    Array.from(logicState.autoMarks.entries()).forEach(([key, owner]) => {
      if (owner === sourceKey) {
        logicState.autoMarks.delete(key);
        if (logicState.marks.get(key) === "no") {
          logicState.marks.delete(key);
        }
      }
    });
  }

  function setLogicYesWithPeers(person, categoryId, option) {
    const puzzle = getLogicPuzzle();
    const sourceKey = logicKey(person, categoryId, option);
    const category = puzzle.categories.find((item) => item.id === categoryId);

    setLogicRawMark(person, categoryId, option, "yes");
    logicState.autoMarks.delete(sourceKey);

    const rowPeers = category.options
      .filter((otherOption) => otherOption !== option)
      .map((otherOption) => [person, categoryId, otherOption]);
    const columnPeers = puzzle.people
      .filter((otherPerson) => otherPerson !== person)
      .map((otherPerson) => [otherPerson, categoryId, option]);

    if (canLogicAutoFillPeers(rowPeers)) {
      rowPeers.forEach((ref) => setLogicAutoNo(ref[0], ref[1], ref[2], sourceKey));
    }

    if (canLogicAutoFillPeers(columnPeers)) {
      columnPeers.forEach((ref) => setLogicAutoNo(ref[0], ref[1], ref[2], sourceKey));
    }
  }

  function cycleLogicMark(person, categoryId, option) {
    const current = getLogicMark(person, categoryId, option);
    const sourceKey = logicKey(person, categoryId, option);

    if (current === "blank") {
      setLogicYesWithPeers(person, categoryId, option);
      logicState.message = `Checked ${person} and ${option}.`;
    } else if (current === "yes") {
      clearLogicAutoMarksFrom(sourceKey);
      setLogicRawMark(person, categoryId, option, "no");
      logicState.message = `Changed ${person} and ${option} to x.`;
    } else {
      setLogicRawMark(person, categoryId, option, "blank");
      logicState.message = `Erased ${person} and ${option}.`;
    }

    logicState.checked = false;
    logicState.checkStatus = null;
    renderLogicGame();
  }

  function getLogicHintSets() {
    const puzzle = getLogicPuzzle();
    const hint = logicState.activeHint ? puzzle.hints[logicState.activeHint] : null;
    const hintKind = getLogicHintKind(logicState.activeHint, hint);
    const sets = { anchors: new Set(), removals: new Set(), blocked: new Set(), inferred: new Set() };

    if (!hint) {
      return sets;
    }

    if (hint.supports && !areLogicRefsCorrectlyMarked(puzzle, hint.supports)) {
      return sets;
    }

    if (hintKind === "exclude") {
      const supportRefs = puzzle.directMarks || [];
      if (!hint.supports && !areLogicRefsCorrectlyMarked(puzzle, supportRefs)) {
        return sets;
      }
      getLogicHintSupportRefs(puzzle, hint).forEach((ref) => sets.anchors.add(parseLogicCellRef(ref)));
      (hint.inferred || []).forEach((ref) => sets.inferred.add(parseLogicCellRef(ref)));
      return sets;
    }

    if (hintKind === "pair" || hintKind === "chain") {
      const supportRefs = getLogicHintSupportRefs(puzzle, hint);
      if (hint.supports && !areLogicRefsCorrectlyMarked(puzzle, supportRefs)) {
        return sets;
      }
      supportRefs.forEach((ref) => sets.anchors.add(parseLogicCellRef(ref)));
      (hint.inferred || hint.anchors || []).forEach((ref) => sets.inferred.add(parseLogicCellRef(ref)));
      return sets;
    }

    const anchorRefs = logicState.activeHint === "direct" && puzzle.directMarks ? puzzle.directMarks : hint.anchors || [];
    anchorRefs.forEach((ref) => sets.anchors.add(parseLogicCellRef(ref)));
    (hint.removals || []).forEach((ref) => sets.removals.add(parseLogicCellRef(ref)));
    (hint.blocked || []).forEach((ref) => sets.blocked.add(parseLogicCellRef(ref)));
    return sets;
  }

  function createLogicLevelSelect() {
    logicLevelSelectEl.innerHTML = "";
    LOGIC_LEVELS.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Level ${item.level}: ${item.name} (${item.difficulty})`;
      logicLevelSelectEl.append(option);
    });
    logicLevelSelectEl.value = String(logicState.puzzleIndex);
  }

  function createLogicBoard() {
    const puzzle = getLogicPuzzle();
    logicBoardEl.innerHTML = "";

    puzzle.categories.forEach((category) => {
      const table = document.createElement("section");
      table.className = "logic-grid-card";

      const title = document.createElement("h2");
      title.textContent = category.name;
      table.append(title);

      const grid = document.createElement("div");
      grid.className = "logic-grid";
      grid.style.setProperty("--logic-columns", String(category.options.length));
      grid.append(document.createElement("span"));

      category.options.forEach((option) => {
        const header = document.createElement("span");
        header.className = "logic-grid-heading";
        header.textContent = option;
        grid.append(header);
      });

      puzzle.people.forEach((person) => {
        const rowHead = document.createElement("span");
        rowHead.className = "logic-grid-person";
        rowHead.textContent = person;
        grid.append(rowHead);

        category.options.forEach((option) => {
          const cell = document.createElement("button");
          cell.className = "logic-play-cell";
          cell.type = "button";
          cell.dataset.person = person;
          cell.dataset.category = category.id;
          cell.dataset.option = option;
          cell.setAttribute("aria-label", `${person}, ${option}`);
          cell.addEventListener("click", () => cycleLogicMark(person, category.id, option));
          grid.append(cell);
        });
      });

      table.append(grid);
      logicBoardEl.append(table);
    });
  }

  function renderLogicBoard() {
    const puzzle = getLogicPuzzle();
    const hintSets = getLogicHintSets();

    Array.from(logicBoardEl.querySelectorAll(".logic-play-cell")).forEach((cell) => {
      const { person, category, option } = cell.dataset;
      const mark = getLogicMark(person, category, option);
      const key = logicKey(person, category, option);
      const expected = getLogicSolutionMark(puzzle, person, category, option);
      const isHintAnchor = hintSets.anchors.has(key);
      const isHintRemoval = hintSets.removals.has(key);
      const isHintBlocked = hintSets.blocked.has(key);
      const isHintInferred = hintSets.inferred.has(key);

      cell.textContent = mark === "no" ? "x" : "";
      cell.classList.toggle("mark-yes", mark === "yes");
      cell.classList.toggle("mark-no", mark === "no");
      cell.classList.toggle("logic-hint-anchor", isHintAnchor);
      cell.classList.toggle("logic-hint-removal", isHintRemoval);
      cell.classList.toggle("logic-hint-blocked", isHintBlocked);
      cell.classList.remove("logic-hint-check", "logic-hint-cross");
      cell.classList.toggle("logic-hint-infer", isHintInferred);
      cell.classList.toggle(
        "logic-hint-exclusion-infer",
        isHintInferred && getLogicHintKind(logicState.activeHint, puzzle.hints[logicState.activeHint]) === "exclude"
      );
      cell.classList.toggle("logic-mistake", logicState.checked && mark !== "blank" && mark !== expected);
      delete cell.dataset.hintMark;
      cell.setAttribute("aria-pressed", String(mark !== "blank"));
    });
  }

  function renderLogicControls() {
    const puzzle = getLogicPuzzle();
    const hintOrder = getLogicHintOrder(puzzle);

    logicHintButtonsEl.innerHTML = "";
    hintOrder.forEach((hintName) => {
      const hint = puzzle.hints[hintName];
      if (!hint) {
        return;
      }

      const button = document.createElement("button");
      button.className = "logic-hint-button";
      button.type = "button";
      button.dataset.logicHint = hintName;
      button.textContent = hint.title;
      button.classList.toggle("active", hintName === logicState.activeHint);
      button.setAttribute("aria-pressed", String(hintName === logicState.activeHint));
      logicHintButtonsEl.append(button);
    });
  }

  function renderLogicHintPanel() {
    const puzzle = getLogicPuzzle();
    const hint = logicState.activeHint ? puzzle.hints[logicState.activeHint] : null;

    if (!logicState.activeHint) {
      logicHintPanelEl.innerHTML = `
        <h2>Learning lens</h2>
        <p class="quiet">Choose an overlay to color the grid around a clue pattern.</p>
      `;
      return;
    }

    if (!hint) {
      const labels = {
        direct: "Direct clue",
        exclude: "Exclusion",
        pair: "Pair lock",
        chain: "Chain clue"
      };
      const fallback = getLogicHintTeaching(logicState.activeHint);
      logicHintPanelEl.innerHTML = `
        <h2>${labels[logicState.activeHint]}</h2>
        <p><strong>Rule:</strong> ${fallback.rule}</p>
        <p class="quiet">This rule is not needed on this level yet.</p>
      `;
      return;
    }

    const teaching = getLogicHintTeaching(getLogicHintKind(logicState.activeHint, hint));
    const hintKind = getLogicHintKind(logicState.activeHint, hint);
    const exclusionLocked =
      hintKind === "exclude" && !hint.supports && !areLogicRefsCorrectlyMarked(puzzle, puzzle.directMarks || []);
    const supportLocked = hint.supports && !areLogicRefsCorrectlyMarked(puzzle, hint.supports);

    if (exclusionLocked) {
      logicHintPanelEl.innerHTML = `
        <h2>${hint.title}</h2>
        <p><strong>Rule:</strong> ${teaching.rule}</p>
        <p><strong>Locked:</strong> Define the easier direct cells first.</p>
        <p class="quiet">Use Auto Mark, or manually mark the direct clue cells. Then this hint can show what those known cells let you infer.</p>
      `;
      return;
    }

    if (supportLocked) {
      logicHintPanelEl.innerHTML = `
        <h2>${hint.title}</h2>
        <p><strong>Rule:</strong> ${teaching.rule}</p>
        <p><strong>Locked:</strong> Define the easier support cell first.</p>
        <p class="quiet">This hint will only highlight cells once the needed known fact is marked on the board.</p>
      `;
      return;
    }

    const hintAnchorRefs =
      hintKind === "exclude" || hintKind === "pair" || hintKind === "chain"
        ? getLogicHintSupportRefs(puzzle, hint)
        : hint.anchors || [];
    const hasInferCells = hintKind === "exclude" || hintKind === "pair" || hintKind === "chain";
    const anchorLegend = hintAnchorRefs.length ? `<span><b class="swatch anchor"></b>support cells</span>` : "";
    const removalLegend = hint.removals ? `<span><b class="swatch removal"></b>ruled-out cells</span>` : "";
    const supportLegend = hint.blocked ? `<span><b class="swatch blocked"></b>why it cannot go elsewhere</span>` : "";
    const inferSwatch = hintKind === "exclude" ? "infer-warm" : "infer";
    const inferLegend = hasInferCells ? `<span><b class="swatch ${inferSwatch}"></b>cell to infer</span>` : "";
    const inferencePrompt = hasInferCells ? renderLogicInferencePrompt(puzzle, hint) : "";
    logicHintPanelEl.innerHTML = `
      <h2>${hint.title}</h2>
      <p><strong>Rule:</strong> ${teaching.rule}</p>
      ${inferencePrompt || `<p class="quiet">${teaching.example}</p>`}
      <div class="legend" aria-label="Logic overlay legend">
        ${anchorLegend}
        ${removalLegend}
        ${supportLegend}
        ${inferLegend}
      </div>
    `;
  }

  function getLogicHintTeaching(hintName) {
    const teaching = {
      direct: {
        rule: "A direct clue states a match outright.",
        move: "Put a check on that match, then x out the rest of its row and column.",
        example: "Use direct clues first; they create the grid structure for later deductions."
      },
      exclude: {
        rule: "Exclusion means every x removes one option from a row or column until the remaining options become constrained.",
        move: "First read the green/red support cells as facts. Then scan the yellow cell's row and column: which choices are already blocked, and which matching item still needs a home?",
        example: "The yellow highlight does not reveal the answer; it is only a thinking target. Use the visible exclusions around it to decide whether that cell should become a check or an x."
      },
      pair: {
        rule: "Linked clues make two facts travel together.",
        move: "Use the green/red direct marks as supports. The blue cell is where the linked fact can be inferred.",
        example: "Do not mark it from the overlay alone; combine the linked clue with your existing x marks."
      },
      chain: {
        rule: "A chain uses one solved fact to carry a clue into another category.",
        move: "Start from the green/red support cells, apply the clue text, then decide what the blue cell must become.",
        example: "The blue highlight says 'infer here,' not 'this is the answer.'"
      }
    };

    return teaching[hintName] || teaching.direct;
  }

  function renderLogicClues() {
    const puzzle = getLogicPuzzle();
    const directIndexes = new Set(puzzle.directClueIndexes || []);
    const clueItems = puzzle.clues
      .map((clue, index) => {
        const kind = directIndexes.has(index) ? "direct" : "indirect";
        const badge = logicState.showClueKinds
          ? `<span class="logic-clue-kind ${kind}">${kind === "direct" ? "🎯 Plain" : "🧩 Thinking"}</span>`
          : "";
        return `<li>${badge}<span>${clue}</span></li>`;
      })
      .join("");

    logicCluePanelEl.innerHTML = `
      <h2>Clues</h2>
      <p class="quiet">${puzzle.theme}</p>
      <ol>${clueItems}</ol>
      <div class="logic-auto-mark-wrap">
        <button
          id="logicAutoMark"
          class="button primary logic-auto-mark"
          type="button"
          aria-describedby="logicAutoMarkTip"
        >Auto Mark</button>
        <span id="logicAutoMarkTip" class="logic-tooltip" role="tooltip">
          Marks only clues labeled Plain; Thinking clues are skipped.
        </span>
      </div>
    `;
  }

  function applyLogicAutoMarkRef(puzzle, ref) {
    const [person, categoryId, option] = ref;
    const options = ref[3] || {};
    const expected = getLogicSolutionMark(puzzle, person, categoryId, option);

    if (expected === "yes") {
      if (options.autoPeers === false) {
        setLogicRawMark(person, categoryId, option, "yes");
      } else {
        setLogicYesWithPeers(person, categoryId, option);
      }
    } else {
      setLogicRawMark(person, categoryId, option, "no");
    }
  }

  function autoMarkDirectClues() {
    const puzzle = getLogicPuzzle();
    const refs = puzzle.directMarks || [];

    logicState.showClueKinds = true;
    if (refs.length === 0) {
      logicState.message = "No Plain clues are ready to auto mark on this level.";
      renderLogicClues();
      renderLogicGame();
      return;
    }

    refs.forEach((ref) => applyLogicAutoMarkRef(puzzle, ref));

    logicState.checked = false;
    logicState.checkStatus = null;
    logicState.activeHint = "direct";
    logicState.message = "Auto-marked the Plain clues. Thinking clues were skipped.";
    renderLogicClues();
    renderLogicGame();
  }

  function renderLogicStatus() {
    const puzzle = getLogicPuzzle();
    const totalYes = puzzle.people.length * puzzle.categories.length;
    let correctYes = 0;
    let marked = 0;

    puzzle.people.forEach((person) => {
      puzzle.categories.forEach((category) => {
        category.options.forEach((option) => {
          const mark = getLogicMark(person, category.id, option);
          if (mark !== "blank") {
            marked += 1;
          }
          if (mark === "yes" && getLogicSolutionMark(puzzle, person, category.id, option) === "yes") {
            correctYes += 1;
          }
        });
      });
    });

    logicDifficultyPillEl.textContent = `Level ${puzzle.level}: ${puzzle.difficulty}`;
    logicProgressTextEl.textContent = `${correctYes}/${totalYes} matches`;
    logicMessagePanelEl.textContent = logicState.message || `${marked} marks placed.`;
    if (logicState.checkStatus) {
      logicMessagePanelEl.dataset.status = logicState.checkStatus;
    } else {
      delete logicMessagePanelEl.dataset.status;
    }
  }

  function renderLogicGame() {
    renderLogicBoard();
    renderLogicControls();
    renderLogicHintPanel();
    renderLogicStatus();
  }

  function loadLogicPuzzle(index, message) {
    clearArcadeWinSequence();
    logicState.puzzleIndex = index;
    logicState.marks = new Map();
    logicState.autoMarks = new Map();
    logicState.activeHint = null;
    logicState.showClueKinds = false;
    logicState.revealedHints = new Set();
    logicState.checked = false;
    logicState.checkStatus = null;
    logicState.message = message;
    logicLevelSelectEl.value = String(index);
    createLogicBoard();
    renderLogicClues();
    renderLogicGame();
  }

  function checkLogicPuzzle() {
    const puzzle = getLogicPuzzle();
    let mistakes = 0;
    let missingYes = 0;
    let marked = 0;

    puzzle.people.forEach((person) => {
      puzzle.categories.forEach((category) => {
        category.options.forEach((option) => {
          const mark = getLogicMark(person, category.id, option);
          const expected = getLogicSolutionMark(puzzle, person, category.id, option);
          if (mark !== "blank") {
            marked += 1;
          }
          if (mark !== "blank" && mark !== expected) {
            mistakes += 1;
          }
          if (expected === "yes" && mark !== "yes") {
            missingYes += 1;
          }
        });
      });
    });

    logicState.checked = true;
    if (marked === 0) {
      logicState.checkStatus = "incomplete";
      logicState.message = "Incomplete: no marks yet. Use Auto Mark or place a check/x first.";
    } else if (mistakes > 0) {
      logicState.checkStatus = "inaccurate";
      logicState.message = `Inaccurate: ${mistakes} mark${mistakes === 1 ? "" : "s"} need another look.`;
    } else if (missingYes === 0) {
      logicState.checkStatus = "correct";
      logicState.message = "Correct: solved cleanly. Every match is locked.";
    } else {
      logicState.checkStatus = "incomplete";
      logicState.message = `Incomplete: everything marked so far is accurate, but ${missingYes} match${missingYes === 1 ? "" : "es"} still need a check.`;
    }
    renderLogicGame();
    if (logicState.checkStatus === "correct") {
      startArcadeWinSequence({
        label: "Logic grid solved",
        onAdvance: () => {
          const nextIndex = getNextLevelIndex(logicState.puzzleIndex, LOGIC_LEVELS);
          const nextPuzzle = LOGIC_LEVELS[nextIndex];
          loadLogicPuzzle(nextIndex, `Level ${nextPuzzle.level}: ${nextPuzzle.name}.`);
        }
      });
    }
  }

  function getChemSearchLevel() {
    return CHEM_SEARCH_LEVELS[chemSearchState.levelIndex];
  }

  function createChemSearchRandom(seed) {
    let value = seed >>> 0;
    return function nextRandom() {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function shuffleChemSearchItems(items, random) {
    const shuffled = items.slice();
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function getChemSearchDirections(level) {
    return CHEM_SEARCH_DIRECTIONS[level.directionSet] || CHEM_SEARCH_DIRECTIONS.hard;
  }

  function getChemSearchIndex(row, col, size = getChemSearchLevel().size) {
    return row * size + col;
  }

  function getChemSearchCoords(index, size = getChemSearchLevel().size) {
    return {
      row: Math.floor(index / size),
      col: index % size
    };
  }

  function canPlaceChemSearchWord(grid, word, row, col, rowStep, colStep) {
    const size = grid.length;
    const endRow = row + rowStep * (word.length - 1);
    const endCol = col + colStep * (word.length - 1);
    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
      return false;
    }

    for (let index = 0; index < word.length; index += 1) {
      const nextRow = row + rowStep * index;
      const nextCol = col + colStep * index;
      const current = grid[nextRow][nextCol];
      if (current && current !== word[index]) {
        return false;
      }
    }

    return true;
  }

  function getChemSearchPath(row, col, rowStep, colStep, length, size) {
    const path = [];
    for (let index = 0; index < length; index += 1) {
      path.push(getChemSearchIndex(row + rowStep * index, col + colStep * index, size));
    }
    return path;
  }

  function tryCreateChemSearchPuzzle(level, attempt) {
    const random = createChemSearchRandom(level.level * 7919 + attempt * 104729 + level.size);
    const grid = Array.from({ length: level.size }, () => Array(level.size).fill(""));
    const wordPaths = new Map();
    const words = level.words
      .map((word) => word.toUpperCase().replace(/[^A-Z]/g, ""))
      .sort((a, b) => b.length - a.length || a.localeCompare(b));

    for (const word of words) {
      const candidates = [];
      getChemSearchDirections(level).forEach(([rowStep, colStep]) => {
        for (let row = 0; row < level.size; row += 1) {
          for (let col = 0; col < level.size; col += 1) {
            if (canPlaceChemSearchWord(grid, word, row, col, rowStep, colStep)) {
              candidates.push({ row, col, rowStep, colStep });
            }
          }
        }
      });

      const [placement] = shuffleChemSearchItems(candidates, random);
      if (!placement) {
        return null;
      }

      const path = getChemSearchPath(placement.row, placement.col, placement.rowStep, placement.colStep, word.length, level.size);
      path.forEach((cellIndex, letterIndex) => {
        const { row, col } = getChemSearchCoords(cellIndex, level.size);
        grid[row][col] = word[letterIndex];
      });
      wordPaths.set(word, path);
    }

    for (let row = 0; row < level.size; row += 1) {
      for (let col = 0; col < level.size; col += 1) {
        if (!grid[row][col]) {
          grid[row][col] = CHEM_SEARCH_FILLER[Math.floor(random() * CHEM_SEARCH_FILLER.length)];
        }
      }
    }

    return { grid, wordPaths };
  }

  function createChemSearchPuzzle(level) {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const puzzle = tryCreateChemSearchPuzzle(level, attempt);
      if (puzzle) {
        return puzzle;
      }
    }
    throw new Error(`Unable to place Chemistry Word Search level ${level.level}.`);
  }

  function createChemSearchLevelSelect() {
    chemSearchLevelSelectEl.innerHTML = "";
    CHEM_SEARCH_LEVELS.forEach((level, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Level ${level.level} (${level.difficulty})`;
      chemSearchLevelSelectEl.append(option);
    });
    chemSearchLevelSelectEl.value = String(chemSearchState.levelIndex);
  }

  function loadChemSearchLevel(index, message) {
    clearArcadeWinSequence();
    const level = CHEM_SEARCH_LEVELS[index];
    const puzzle = createChemSearchPuzzle(level);
    chemSearchState.levelIndex = index;
    chemSearchState.grid = puzzle.grid;
    chemSearchState.wordPaths = puzzle.wordPaths;
    chemSearchState.foundWords = new Set();
    chemSearchState.selectedCells = [];
    chemSearchState.selectionStart = null;
    chemSearchState.dragStart = null;
    chemSearchState.dragActive = false;
    chemSearchState.dragMoved = false;
    chemSearchState.skipNextClick = false;
    chemSearchState.hintCell = null;
    chemSearchState.invalidPath = [];
    chemSearchState.invalidToken += 1;
    chemSearchState.message = message;
    chemSearchLevelSelectEl.value = String(index);
    renderChemSearchGame();
  }

  function isChemSearchComplete() {
    return chemSearchState.foundWords.size === getChemSearchLevel().words.length;
  }

  function getChemSearchLinePath(fromIndex, toIndex) {
    const size = getChemSearchLevel().size;
    const from = getChemSearchCoords(fromIndex, size);
    const to = getChemSearchCoords(toIndex, size);
    const rowDelta = to.row - from.row;
    const colDelta = to.col - from.col;
    const absRow = Math.abs(rowDelta);
    const absCol = Math.abs(colDelta);

    if (fromIndex === toIndex) {
      return [fromIndex];
    }

    if (rowDelta !== 0 && colDelta !== 0 && absRow !== absCol) {
      return [];
    }

    const rowStep = Math.sign(rowDelta);
    const colStep = Math.sign(colDelta);
    const steps = Math.max(absRow, absCol);
    const path = [];
    for (let step = 0; step <= steps; step += 1) {
      path.push(getChemSearchIndex(from.row + rowStep * step, from.col + colStep * step, size));
    }
    return path;
  }

  function readChemSearchPath(path) {
    const level = getChemSearchLevel();
    return path.map((cellIndex) => {
      const { row, col } = getChemSearchCoords(cellIndex, level.size);
      return chemSearchState.grid[row][col];
    }).join("");
  }

  function getChemSearchMatchedWord(path) {
    const selectedWord = readChemSearchPath(path);
    const reversedWord = selectedWord.split("").reverse().join("");
    return getChemSearchLevel().words.find((word) => {
      const normalized = word.toUpperCase().replace(/[^A-Z]/g, "");
      return !chemSearchState.foundWords.has(normalized) && (selectedWord === normalized || reversedWord === normalized);
    });
  }

  function submitChemSearchSelection() {
    const path = chemSearchState.selectedCells;
    if (path.length < 2) {
      renderChemSearchGame();
      return;
    }

    const match = getChemSearchMatchedWord(path);
    if (match) {
      const normalized = match.toUpperCase().replace(/[^A-Z]/g, "");
      chemSearchState.foundWords.add(normalized);
      const completed = isChemSearchComplete();
      chemSearchState.selectedCells = [];
      chemSearchState.selectionStart = null;
      chemSearchState.hintCell = null;
      chemSearchState.invalidPath = [];
      chemSearchState.invalidToken += 1;
      chemSearchState.message = completed
        ? "Correct: every chemistry word is found."
        : `Found ${normalized}.`;
      renderChemSearchGame();
      if (completed) {
        startArcadeWinSequence({
          label: "Chemistry level complete",
          onAdvance: () => {
            const nextIndex = getNextLevelIndex(chemSearchState.levelIndex, CHEM_SEARCH_LEVELS);
            const nextLevel = CHEM_SEARCH_LEVELS[nextIndex];
            loadChemSearchLevel(nextIndex, `Level ${nextLevel.level}: ${nextLevel.difficulty}.`);
          }
        });
      }
    } else {
      const invalidToken = chemSearchState.invalidToken + 1;
      chemSearchState.invalidToken = invalidToken;
      chemSearchState.invalidPath = path.slice();
      chemSearchState.selectedCells = [];
      chemSearchState.selectionStart = null;
      chemSearchState.hintCell = null;
      chemSearchState.message = "No word from the bank is on that line.";
      renderChemSearchGame();
      window.setTimeout(() => {
        if (chemSearchState.invalidToken !== invalidToken) {
          return;
        }
        chemSearchState.invalidPath = [];
        renderChemSearchGame();
      }, 1200);
    }
  }

  function handleChemSearchCellClick(index) {
    if (chemSearchState.skipNextClick) {
      chemSearchState.skipNextClick = false;
      return;
    }

    if (isChemSearchComplete()) {
      chemSearchState.message = "This level is complete. Choose another level or reset to replay it.";
      renderChemSearchGame();
      return;
    }

    if (chemSearchState.invalidPath.length) {
      chemSearchState.invalidPath = [];
      chemSearchState.invalidToken += 1;
    }

    if (chemSearchState.selectedCells.length === 1 && chemSearchState.selectionStart !== index) {
      const path = getChemSearchLinePath(chemSearchState.selectionStart, index);
      if (path.length < 2) {
        chemSearchState.message = "That selection is not a straight search line.";
        chemSearchState.selectedCells = [index];
        chemSearchState.selectionStart = index;
        renderChemSearchGame();
        return;
      }
      chemSearchState.selectedCells = path;
      submitChemSearchSelection();
      return;
    }

    chemSearchState.selectedCells = [index];
    chemSearchState.selectionStart = index;
    chemSearchState.message = "Start cell selected.";
    renderChemSearchGame();
  }

  function handleChemSearchPointerDown(event, index) {
    if (isChemSearchComplete()) {
      return;
    }
    if (chemSearchState.invalidPath.length) {
      chemSearchState.invalidPath = [];
      chemSearchState.invalidToken += 1;
    }
    chemSearchState.dragStart = index;
    chemSearchState.dragActive = true;
    chemSearchState.dragMoved = false;
    event.preventDefault();
  }

  function handleChemSearchPointerEnter(index) {
    if (!chemSearchState.dragActive || chemSearchState.dragStart === null) {
      return;
    }

    const path = getChemSearchLinePath(chemSearchState.dragStart, index);
    if (path.length > 1) {
      chemSearchState.selectedCells = path;
      chemSearchState.selectionStart = chemSearchState.dragStart;
      chemSearchState.dragMoved = true;
      renderChemSearchGame();
    }
  }

  function handleChemSearchPointerUp() {
    if (!chemSearchState.dragActive) {
      return;
    }

    chemSearchState.dragActive = false;
    chemSearchState.dragStart = null;
    if (chemSearchState.dragMoved && chemSearchState.selectedCells.length > 1) {
      chemSearchState.skipNextClick = true;
      submitChemSearchSelection();
    }
  }

  function showChemSearchHint() {
    const remainingWords = getChemSearchLevel().words
      .map((word) => word.toUpperCase().replace(/[^A-Z]/g, ""))
      .filter((word) => !chemSearchState.foundWords.has(word));

    if (!remainingWords.length) {
      chemSearchState.message = "Correct: every chemistry word is found.";
      renderChemSearchGame();
      return;
    }

    const nextWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    const [firstCell] = chemSearchState.wordPaths.get(nextWord);
    chemSearchState.hintCell = firstCell;
    chemSearchState.invalidPath = [];
    chemSearchState.invalidToken += 1;
    chemSearchState.message = "Hint shown.";
    renderChemSearchGame();
  }

  function getChemSearchFoundCells() {
    const foundCells = new Set();
    chemSearchState.foundWords.forEach((word) => {
      const path = chemSearchState.wordPaths.get(word) || [];
      path.forEach((cellIndex) => foundCells.add(cellIndex));
    });
    return foundCells;
  }

  function appendChemSearchBar(path, variant, toneIndex = 0) {
    if (!path || path.length < 1) {
      return;
    }

    const level = getChemSearchLevel();
    const start = getChemSearchCoords(path[0], level.size);
    const end = getChemSearchCoords(path[path.length - 1], level.size);
    const unit = 100 / level.size;
    const centerX = ((start.col + end.col + 1) / 2) * unit;
    const centerY = ((start.row + end.row + 1) / 2) * unit;
    const deltaCol = end.col - start.col;
    const deltaRow = end.row - start.row;
    const length = (Math.hypot(deltaCol, deltaRow) + 1) * unit;
    const angle = Math.atan2(deltaRow, deltaCol) * 180 / Math.PI;
    const bar = document.createElement("span");
    bar.className = `chem-search-bar ${variant} tone-${toneIndex % 6}`;
    bar.style.setProperty("--bar-x", `${centerX}%`);
    bar.style.setProperty("--bar-y", `${centerY}%`);
    bar.style.setProperty("--bar-length", `${length}%`);
    bar.style.setProperty("--bar-thickness", `${68 / level.size}%`);
    bar.style.setProperty("--bar-angle", `${angle}deg`);
    chemSearchBoardEl.append(bar);
  }

  function renderChemSearchBars(level) {
    level.words.forEach((word, index) => {
      const normalized = word.toUpperCase().replace(/[^A-Z]/g, "");
      if (chemSearchState.foundWords.has(normalized)) {
        appendChemSearchBar(chemSearchState.wordPaths.get(normalized), "found", index);
      }
    });

    if (chemSearchState.selectedCells.length > 1) {
      appendChemSearchBar(chemSearchState.selectedCells, "selected", chemSearchState.foundWords.size);
    }

    if (chemSearchState.invalidPath.length > 1) {
      appendChemSearchBar(chemSearchState.invalidPath, "invalid", chemSearchState.invalidToken);
    }
  }

  function renderChemSearchGame() {
    const level = getChemSearchLevel();
    const selectedCells = new Set(chemSearchState.selectedCells);
    const foundCells = getChemSearchFoundCells();
    const hintCells = new Set(chemSearchState.hintCell === null ? [] : [chemSearchState.hintCell]);

    chemSearchBoardEl.style.setProperty("--chem-size", String(level.size));
    chemSearchBoardEl.innerHTML = "";
    renderChemSearchBars(level);
    chemSearchState.grid.forEach((rowLetters, row) => {
      rowLetters.forEach((letter, col) => {
        const index = getChemSearchIndex(row, col, level.size);
        const cell = document.createElement("span");
        cell.className = "chem-search-cell";
        cell.textContent = letter;
        cell.dataset.index = String(index);
        cell.tabIndex = 0;
        cell.classList.toggle("selected", selectedCells.has(index));
        cell.classList.toggle("found", foundCells.has(index));
        cell.classList.toggle("hint", hintCells.has(index));
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-label", `Row ${row + 1}, column ${col + 1}, letter ${letter}`);
        cell.addEventListener("click", () => handleChemSearchCellClick(index));
        cell.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            handleChemSearchCellClick(index);
            event.preventDefault();
          }
        });
        cell.addEventListener("pointerdown", (event) => handleChemSearchPointerDown(event, index));
        cell.addEventListener("pointerenter", () => handleChemSearchPointerEnter(index));
        cell.addEventListener("pointerup", handleChemSearchPointerUp);
        chemSearchBoardEl.append(cell);
      });
    });

    chemSearchWordListEl.innerHTML = level.words.map((word) => {
      const normalized = word.toUpperCase().replace(/[^A-Z]/g, "");
      const found = chemSearchState.foundWords.has(normalized);
      return `<span class="chem-search-word ${found ? "found" : ""}">${normalized}</span>`;
    }).join("");
    chemSearchDifficultyPillEl.textContent = `Level ${level.level}: ${level.difficulty}`;
    chemSearchProgressTextEl.textContent = `${chemSearchState.foundWords.size}/${level.words.length} words`;
  }

  function getChessLevel() {
    return CHESS_LEVELS[chessState.levelIndex];
  }

  function cloneChessPieces(pieces) {
    return pieces.map((piece) => ({ ...piece }));
  }

  function chessSquare(fileIndex, rankIndex) {
    return `${CHESS_FILES[fileIndex]}${CHESS_RANKS[rankIndex]}`;
  }

  function parseChessSquare(square) {
    return {
      file: CHESS_FILES.indexOf(square[0]),
      rank: CHESS_RANKS.indexOf(square[1])
    };
  }

  function getChessPieceAt(square) {
    return chessState.pieces.find((piece) => piece.square === square) || null;
  }

  function isChessPathClear(from, to) {
    const start = parseChessSquare(from);
    const end = parseChessSquare(to);
    const fileStep = Math.sign(end.file - start.file);
    const rankStep = Math.sign(end.rank - start.rank);
    let file = start.file + fileStep;
    let rank = start.rank + rankStep;

    while (file !== end.file || rank !== end.rank) {
      if (getChessPieceAt(chessSquare(file, rank))) {
        return false;
      }
      file += fileStep;
      rank += rankStep;
    }

    return true;
  }

  function canChessPieceMove(piece, targetSquare) {
    if (!piece || piece.square === targetSquare) {
      return false;
    }

    const target = getChessPieceAt(targetSquare);
    if (target && target.color === piece.color) {
      return false;
    }

    const from = parseChessSquare(piece.square);
    const to = parseChessSquare(targetSquare);
    const fileDelta = to.file - from.file;
    const rankDelta = to.rank - from.rank;
    const absFile = Math.abs(fileDelta);
    const absRank = Math.abs(rankDelta);

    if (piece.type === "king") {
      return absFile <= 1 && absRank <= 1;
    }

    if (piece.type === "queen") {
      return (fileDelta === 0 || rankDelta === 0 || absFile === absRank) && isChessPathClear(piece.square, targetSquare);
    }

    if (piece.type === "rook") {
      return (fileDelta === 0 || rankDelta === 0) && isChessPathClear(piece.square, targetSquare);
    }

    if (piece.type === "bishop") {
      return absFile === absRank && isChessPathClear(piece.square, targetSquare);
    }

    if (piece.type === "knight") {
      return (absFile === 1 && absRank === 2) || (absFile === 2 && absRank === 1);
    }

    if (piece.type === "pawn") {
      const direction = piece.color === "white" ? -1 : 1;
      const startRank = piece.color === "white" ? 6 : 1;
      if (target) {
        return absFile === 1 && rankDelta === direction;
      }
      if (fileDelta === 0 && rankDelta === direction) {
        return true;
      }
      return fileDelta === 0 && from.rank === startRank && rankDelta === direction * 2 && isChessPathClear(piece.square, targetSquare);
    }

    return false;
  }

  function getChessLegalTargets(square) {
    const piece = getChessPieceAt(square);
    if (!piece) {
      return new Set();
    }

    return new Set(
      CHESS_RANKS.flatMap((rank, rankIndex) =>
        CHESS_FILES.map((file, fileIndex) => chessSquare(fileIndex, rankIndex))
      ).filter((targetSquare) => canChessPieceMove(piece, targetSquare))
    );
  }

  function isChessAnswerMove(from, to) {
    const answer = getChessLevel().answer;
    return from === answer.from && to === answer.to;
  }

  function makeChessMove(from, to) {
    const movingPiece = getChessPieceAt(from);
    chessState.pieces = chessState.pieces.filter((piece) => piece.square !== to && piece.square !== from);
    chessState.pieces.push({ ...movingPiece, square: to });
    chessState.lastMove = { from, to };
  }

  function selectChessSquare(square) {
    const level = getChessLevel();
    const piece = getChessPieceAt(square);

    if (chessState.solved) {
      chessState.message = "This tactic is solved. Pick another level or reset to replay it.";
      renderChessGame();
      return;
    }

    if (chessState.selected && chessState.legalTargets.has(square)) {
      const from = chessState.selected;
      if (isChessAnswerMove(from, square)) {
        makeChessMove(from, square);
        chessState.selected = null;
        chessState.legalTargets = new Set();
        chessState.solved = true;
        chessState.message = `Correct: ${level.answer.notation}. ${level.goal}`;
      } else {
        chessState.message = "Inaccurate: that move is legal-looking, but it misses the tactic.";
        chessState.selected = null;
        chessState.legalTargets = new Set();
      }
      renderChessGame();
      return;
    }

    if (piece && piece.color === level.side) {
      chessState.selected = square;
      chessState.legalTargets = getChessLegalTargets(square);
      chessState.message = `${piece.type[0].toUpperCase()}${piece.type.slice(1)} selected. Choose its best destination.`;
    } else if (piece) {
      chessState.message = `${level.side === "white" ? "White" : "Black"} to move. Choose one of your own pieces.`;
      chessState.selected = null;
      chessState.legalTargets = new Set();
    } else {
      chessState.message = "Choose a piece first, then a destination square.";
      chessState.selected = null;
      chessState.legalTargets = new Set();
    }

    renderChessGame();
  }

  function createChessBoard() {
    chessBoardEl.innerHTML = "";
    CHESS_RANKS.forEach((rank, rankIndex) => {
      CHESS_FILES.forEach((file, fileIndex) => {
        const square = chessSquare(fileIndex, rankIndex);
        const button = document.createElement("button");
        button.className = "chess-square";
        button.type = "button";
        button.dataset.square = square;
        button.setAttribute("role", "gridcell");
        button.setAttribute("aria-label", square);
        button.addEventListener("click", () => selectChessSquare(square));
        chessBoardEl.append(button);
      });
    });
  }

  function createChessLevelSelect() {
    chessLevelSelectEl.innerHTML = "";
    CHESS_LEVELS.forEach((level, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Level ${level.level} (${level.difficulty})`;
      chessLevelSelectEl.append(option);
    });
    chessLevelSelectEl.value = String(chessState.levelIndex);
  }

  function renderChessBoard() {
    const level = getChessLevel();
    Array.from(chessBoardEl.querySelectorAll(".chess-square")).forEach((cell) => {
      const square = cell.dataset.square;
      const piece = getChessPieceAt(square);
      const coords = parseChessSquare(square);
      const isDark = (coords.file + coords.rank) % 2 === 1;
      const isSelected = chessState.selected === square;
      const isTarget = chessState.legalTargets.has(square);
      const isAnswerFrom = chessState.hintStep > 0 && level.answer.from === square;
      const isAnswerTo = chessState.hintStep > 1 && level.answer.to === square;
      const isLastMove = chessState.lastMove && (chessState.lastMove.from === square || chessState.lastMove.to === square);

      cell.className = "chess-square";
      cell.classList.toggle("dark-square", isDark);
      cell.classList.toggle("light-square", !isDark);
      cell.classList.toggle("selected", isSelected);
      cell.classList.toggle("target", isTarget);
      cell.classList.toggle("answer-from", isAnswerFrom);
      cell.classList.toggle("answer-to", isAnswerTo);
      cell.classList.toggle("last-move", isLastMove);
      cell.innerHTML = piece
        ? `<span class="chess-board-piece ${piece.color}">${CHESS_PIECES[piece.color][piece.type]}</span>`
        : "";
      cell.setAttribute("aria-label", piece ? `${square}, ${piece.color} ${piece.type}` : square);
    });
  }

  function renderChessPanel() {
    const level = getChessLevel();
    const hintCopy = chessState.hintStep === 0
      ? "Press Hint for a nudge, or solve it straight from the board."
      : chessState.hintStep === 1
        ? level.tactic
        : level.hint;

    chessDifficultyPillEl.textContent = `Level ${level.level}: ${level.difficulty}`;
    chessTurnTextEl.textContent = `${level.side === "white" ? "White" : "Black"} to move`;
    chessLessonPanelEl.innerHTML = `
      <h2>${level.name}</h2>
      <p><strong>Goal:</strong> ${level.goal}</p>
      <p><strong>Pattern:</strong> ${hintCopy}</p>
    `;
    chessMessagePanelEl.textContent = chessState.message;
    if (chessState.solved) {
      chessMessagePanelEl.dataset.status = "correct";
    } else {
      delete chessMessagePanelEl.dataset.status;
    }
  }

  function renderChessGame() {
    renderChessBoard();
    renderChessPanel();
  }

  function loadChessLevel(index, message) {
    chessState.levelIndex = index;
    chessState.pieces = cloneChessPieces(CHESS_LEVELS[index].pieces);
    chessState.selected = null;
    chessState.legalTargets = new Set();
    chessState.hintStep = 0;
    chessState.solved = false;
    chessState.lastMove = null;
    chessState.message = message;
    chessLevelSelectEl.value = String(index);
    renderChessGame();
  }

  function showChessHint() {
    chessState.hintStep = Math.min(chessState.hintStep + 1, 2);
    chessState.message = chessState.hintStep === 1 ? "Hint added: read the pattern." : "Hint added: origin and destination are highlighted.";
    renderChessGame();
  }

  function checkChessTactic() {
    if (chessState.solved) {
      chessState.message = `Correct: ${getChessLevel().answer.notation}.`;
    } else {
      chessState.message = "Incomplete: find the tactic move on the board.";
    }
    renderChessGame();
  }

  function createSpiderDeck() {
    const deck = [];
    for (let suitSet = 0; suitSet < 8; suitSet += 1) {
      for (let rank = 13; rank >= 1; rank -= 1) {
        deck.push({ id: `${suitSet}-${rank}`, rank, faceUp: false });
      }
    }
    return deck;
  }

  function shuffleSpiderDeck(deck) {
    const shuffled = deck.slice();
    let seed = 37;
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      seed = (seed * 9301 + 49297) % 233280;
      const swapIndex = seed % (index + 1);
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function resetSpiderGame(message = "New Spider deal ready.") {
    clearArcadeWinSequence();
    const deck = shuffleSpiderDeck(createSpiderDeck());
    const columns = SPIDER_DEAL_COUNTS.map((count) => deck.splice(0, count));
    columns.forEach((column) => {
      if (column.length) {
        column[column.length - 1].faceUp = true;
      }
    });
    spiderState.columns = columns;
    spiderState.stock = deck;
    spiderState.completed = 0;
    spiderState.selected = null;
    spiderState.dragging = null;
    spiderState.animatedCards = new Set();
    spiderState.foundationPulse = false;
    spiderState.hintMove = null;
    spiderState.message = message;
    renderSpiderGame();
  }

  function getSpiderCardLabel(card) {
    return SPIDER_RANKS[card.rank - 1];
  }

  function isSpiderRun(cards) {
    if (!cards.length || cards.some((card) => !card.faceUp)) {
      return false;
    }
    for (let index = 1; index < cards.length; index += 1) {
      if (cards[index - 1].rank !== cards[index].rank + 1) {
        return false;
      }
    }
    return true;
  }

  function canMoveSpiderStack(fromColumnIndex, fromCardIndex, toColumnIndex) {
    if (fromColumnIndex === toColumnIndex) {
      return false;
    }
    const stack = spiderState.columns[fromColumnIndex].slice(fromCardIndex);
    const targetColumn = spiderState.columns[toColumnIndex];
    const targetCard = targetColumn[targetColumn.length - 1];
    if (!isSpiderRun(stack)) {
      return false;
    }
    return !targetCard || targetCard.rank === stack[0].rank + 1;
  }

  function findSpiderMoveTarget(fromColumnIndex, fromCardIndex) {
    let emptyTarget = null;
    for (let toColumn = 0; toColumn < spiderState.columns.length; toColumn += 1) {
      if (!canMoveSpiderStack(fromColumnIndex, fromCardIndex, toColumn)) {
        continue;
      }
      if (spiderState.columns[toColumn].length > 0) {
        return toColumn;
      }
      if (emptyTarget === null) {
        emptyTarget = toColumn;
      }
    }
    return emptyTarget;
  }

  function getSpiderCardRects(cardIds) {
    const rects = new Map();
    cardIds.forEach((id) => {
      const cardEl = spiderTableauEl.querySelector(`.spider-card-play[data-card-id="${CSS.escape(id)}"]`);
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        rects.set(id, { left: rect.left, top: rect.top });
      }
    });
    return rects;
  }

  function animateSpiderMoveFromRects(rects) {
    requestAnimationFrame(() => {
      rects.forEach((fromRect, id) => {
        const cardEl = spiderTableauEl.querySelector(`.spider-card-play[data-card-id="${CSS.escape(id)}"]`);
        if (!cardEl) {
          return;
        }
        const toRect = cardEl.getBoundingClientRect();
        const deltaX = fromRect.left - toRect.left;
        const deltaY = fromRect.top - toRect.top;
        cardEl.animate(
          [
            { transform: `translate(${deltaX}px, ${deltaY}px)`, offset: 0 },
            { transform: "translate(0, 0)", offset: 1 }
          ],
          {
            duration: 420,
            easing: "cubic-bezier(0.2, 0.9, 0.22, 1)",
            fill: "both"
          }
        );
      });
    });
  }

  function flipSpiderTopCard(column) {
    if (column.length && !column[column.length - 1].faceUp) {
      column[column.length - 1].faceUp = true;
    }
  }

  function clearSpiderCompletedRuns() {
    let cleared = false;
    spiderState.columns.forEach((column) => {
      const run = column.slice(-13);
      if (run.length === 13 && isSpiderRun(run) && run[0].rank === 13 && run[12].rank === 1) {
        column.splice(column.length - 13, 13);
        flipSpiderTopCard(column);
        spiderState.completed += 1;
        cleared = true;
      }
    });
    return cleared;
  }

  function moveSpiderStack(fromColumnIndex, fromCardIndex, toColumnIndex) {
    const fromColumn = spiderState.columns[fromColumnIndex];
    const movingIds = fromColumn.slice(fromCardIndex).map((card) => card.id);
    const oldRects = getSpiderCardRects(movingIds);
    const stack = fromColumn.splice(fromCardIndex);
    spiderState.columns[toColumnIndex].push(...stack);
    spiderState.animatedCards = new Set(stack.map((card) => card.id));
    flipSpiderTopCard(fromColumn);
    spiderState.selected = null;
    spiderState.dragging = null;
    spiderState.hintMove = null;

    const cleared = clearSpiderCompletedRuns();
    spiderState.foundationPulse = cleared;
    if (spiderState.completed === 8) {
      spiderState.message = "Correct: all eight runs cleared.";
      startArcadeWinSequence({
        label: "Spider table cleared",
        onAdvance: () => resetSpiderGame("New Spider deal ready.")
      });
    } else if (cleared) {
      spiderState.message = "Run cleared. Lovely little cascade.";
    } else {
      spiderState.message = "Move placed. Keep building down toward Ace.";
    }
    return oldRects;
  }

  function selectSpiderCard(columnIndex, cardIndex) {
    const card = spiderState.columns[columnIndex][cardIndex];
    if (!card || !card.faceUp) {
      spiderState.message = "Only face-up cards can move.";
      renderSpiderGame();
      return;
    }

    if (spiderState.selected) {
      if (canMoveSpiderStack(spiderState.selected.column, spiderState.selected.card, columnIndex)) {
        const oldRects = moveSpiderStack(spiderState.selected.column, spiderState.selected.card, columnIndex);
        renderSpiderGame();
        animateSpiderMoveFromRects(oldRects);
        return;
      } else {
        spiderState.selected = { column: columnIndex, card: cardIndex };
        spiderState.message = "New run selected. Choose a column where the top card is one rank higher.";
      }
    } else {
      const targetColumn = findSpiderMoveTarget(columnIndex, cardIndex);
      if (targetColumn !== null) {
        const oldRects = moveSpiderStack(columnIndex, cardIndex, targetColumn);
        renderSpiderGame();
        animateSpiderMoveFromRects(oldRects);
        return;
      } else {
        spiderState.selected = { column: columnIndex, card: cardIndex };
        spiderState.message = "Run selected. Drag it or choose a column where the top card is one rank higher.";
      }
    }

    renderSpiderGame();
  }

  function startSpiderDrag(columnIndex, cardIndex) {
    if (!isSpiderRun(spiderState.columns[columnIndex].slice(cardIndex))) {
      spiderState.dragging = null;
      spiderState.message = "Drag only face-up descending runs.";
      renderSpiderGame();
      return false;
    }
    spiderState.dragging = { column: columnIndex, card: cardIndex };
    spiderState.selected = { column: columnIndex, card: cardIndex };
    spiderState.hintMove = null;
    return true;
  }

  function dropSpiderStack(toColumnIndex) {
    const dragging = spiderState.dragging;
    if (!dragging) {
      return false;
    }
    if (canMoveSpiderStack(dragging.column, dragging.card, toColumnIndex)) {
      const oldRects = moveSpiderStack(dragging.column, dragging.card, toColumnIndex);
      renderSpiderGame();
      animateSpiderMoveFromRects(oldRects);
      return true;
    }
    spiderState.message = "That run cannot land there. Drop it onto a card one rank higher, or into an empty column.";
    spiderState.dragging = null;
    spiderState.selected = null;
    renderSpiderGame();
    return false;
  }

  function selectSpiderColumn(columnIndex) {
    if (!spiderState.selected) {
      spiderState.message = "Choose a face-up card or run first.";
      renderSpiderGame();
      return;
    }

    if (canMoveSpiderStack(spiderState.selected.column, spiderState.selected.card, columnIndex)) {
      const oldRects = moveSpiderStack(spiderState.selected.column, spiderState.selected.card, columnIndex);
      renderSpiderGame();
      animateSpiderMoveFromRects(oldRects);
      return;
    } else {
      spiderState.message = "That run cannot land there. Match descending order: 9 onto 10, Q onto K.";
    }
    renderSpiderGame();
  }

  function dealSpiderStock() {
    if (spiderState.stock.length < 10) {
      spiderState.message = "No more stock cards to deal.";
      renderSpiderGame();
      return;
    }
    if (spiderState.columns.some((column) => column.length === 0)) {
      spiderState.message = "Fill every empty column before dealing from the stock.";
      renderSpiderGame();
      return;
    }

    const dealtIds = [];
    spiderState.columns.forEach((column) => {
      const card = spiderState.stock.shift();
      card.faceUp = true;
      dealtIds.push(card.id);
      column.push(card);
    });
    spiderState.selected = null;
    spiderState.dragging = null;
    spiderState.hintMove = null;
    const cleared = clearSpiderCompletedRuns();
    spiderState.animatedCards = new Set(dealtIds);
    spiderState.foundationPulse = cleared;
    if (spiderState.completed === 8) {
      spiderState.message = "Correct: all eight runs cleared.";
      startArcadeWinSequence({
        label: "Spider table cleared",
        onAdvance: () => resetSpiderGame("New Spider deal ready.")
      });
    } else if (cleared) {
      spiderState.message = "Run cleared after the deal.";
    } else {
      spiderState.message = "Dealt one card to each column.";
    }
    renderSpiderGame();
  }

  function findSpiderHintMove() {
    for (let fromColumn = 0; fromColumn < spiderState.columns.length; fromColumn += 1) {
      const column = spiderState.columns[fromColumn];
      for (let cardIndex = 0; cardIndex < column.length; cardIndex += 1) {
        if (!isSpiderRun(column.slice(cardIndex))) {
          continue;
        }
        for (let toColumn = 0; toColumn < spiderState.columns.length; toColumn += 1) {
          if (canMoveSpiderStack(fromColumn, cardIndex, toColumn)) {
            return { fromColumn, cardIndex, toColumn };
          }
        }
      }
    }
    return null;
  }

  function showSpiderHint() {
    const move = findSpiderHintMove();
    spiderState.selected = null;
    spiderState.dragging = null;
    spiderState.hintMove = move;
    spiderState.message = move
      ? `Hint: move ${getSpiderCardLabel(spiderState.columns[move.fromColumn][move.cardIndex])} from column ${move.fromColumn + 1} to column ${move.toColumn + 1}.`
      : "No tableau move is ready. Deal from the stock if every column has a card.";
    renderSpiderGame();
  }

  function checkSpiderGame() {
    if (spiderState.completed === 8) {
      spiderState.message = "Correct: the table is cleared.";
      startArcadeWinSequence({
        label: "Spider table cleared",
        onAdvance: () => resetSpiderGame("New Spider deal ready.")
      });
    } else {
      spiderState.message = `Incomplete: ${spiderState.completed} of 8 complete runs cleared.`;
    }
    renderSpiderGame();
  }

  function renderSpiderGame() {
    spiderStockEl.textContent = spiderState.stock.length ? `${spiderState.stock.length / 10}` : "0";
    spiderStockEl.disabled = spiderState.stock.length < 10;
    spiderFoundationsEl.innerHTML = Array.from({ length: 8 }, (_, index) => (
      `<span class="spider-foundation ${index < spiderState.completed ? "complete" : ""} ${spiderState.foundationPulse && index === spiderState.completed - 1 ? "pulse" : ""}">${index < spiderState.completed ? "K-A" : ""}</span>`
    )).join("");

    spiderTableauEl.innerHTML = "";
    spiderState.columns.forEach((column, columnIndex) => {
      const columnEl = document.createElement("div");
      columnEl.className = "spider-column";
      columnEl.dataset.column = String(columnIndex);
      columnEl.tabIndex = 0;
      columnEl.setAttribute("role", "button");
      columnEl.setAttribute("aria-label", `Column ${columnIndex + 1}`);
      columnEl.addEventListener("click", (event) => {
        if (event.target.closest(".spider-card-play")) {
          return;
        }
        selectSpiderColumn(columnIndex);
      });
      columnEl.addEventListener("dragover", (event) => {
        if (spiderState.dragging && canMoveSpiderStack(spiderState.dragging.column, spiderState.dragging.card, columnIndex)) {
          event.preventDefault();
          columnEl.classList.add("drag-over");
        }
      });
      columnEl.addEventListener("dragleave", (event) => {
        if (!columnEl.contains(event.relatedTarget)) {
          columnEl.classList.remove("drag-over");
        }
      });
      columnEl.addEventListener("drop", (event) => {
        event.preventDefault();
        columnEl.classList.remove("drag-over");
        dropSpiderStack(columnIndex);
      });
      columnEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectSpiderColumn(columnIndex);
        }
      });

      column.forEach((card, cardIndex) => {
        const cardEl = document.createElement("button");
        const selected = spiderState.selected && spiderState.selected.column === columnIndex && cardIndex >= spiderState.selected.card;
        const hintedFrom = spiderState.hintMove && spiderState.hintMove.fromColumn === columnIndex && cardIndex >= spiderState.hintMove.cardIndex;
        const hintedTo = spiderState.hintMove && spiderState.hintMove.toColumn === columnIndex && cardIndex === column.length - 1;
        cardEl.className = "spider-card-play";
        cardEl.type = "button";
        cardEl.dataset.cardId = card.id;
        cardEl.draggable = card.faceUp && isSpiderRun(column.slice(cardIndex));
        cardEl.style.setProperty("--card-top", `${cardIndex * 28}px`);
        cardEl.classList.toggle("face-down", !card.faceUp);
        cardEl.classList.toggle("selected", Boolean(selected));
        cardEl.classList.toggle("hint-from", Boolean(hintedFrom));
        cardEl.classList.toggle("hint-to", Boolean(hintedTo));
        cardEl.classList.toggle("just-moved", spiderState.animatedCards.has(card.id));
        cardEl.innerHTML = card.faceUp
          ? `
            <span class="spider-card-corner top">
              <span>${getSpiderCardLabel(card)}</span>
              <span>&spades;</span>
            </span>
            <span class="spider-card-pip">&spades;</span>
            <span class="spider-card-corner bottom">
              <span>${getSpiderCardLabel(card)}</span>
              <span>&spades;</span>
            </span>
          `
          : "";
        cardEl.setAttribute("aria-label", card.faceUp ? `${getSpiderCardLabel(card)} of spades` : "Face-down card");
        cardEl.addEventListener("click", (event) => {
          event.stopPropagation();
          selectSpiderCard(columnIndex, cardIndex);
        });
        cardEl.addEventListener("dragstart", (event) => {
          if (!startSpiderDrag(columnIndex, cardIndex)) {
            event.preventDefault();
            return;
          }
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", `${columnIndex}:${cardIndex}`);
        });
        cardEl.addEventListener("dragend", () => {
          spiderState.dragging = null;
          spiderState.selected = null;
          renderSpiderGame();
        });
        columnEl.append(cardEl);
      });

      spiderTableauEl.append(columnEl);
    });

    spiderDifficultyPillEl.textContent = "One suit";
    spiderProgressTextEl.textContent = `${spiderState.completed}/8 runs`;
    spiderLessonPanelEl.innerHTML = `
      <h2>Build Runs</h2>
      <p><strong>Rule:</strong> Move face-up descending runs onto a card one rank higher. Empty columns can hold any run.</p>
      <p><strong>Goal:</strong> Complete King-to-Ace runs. Finished runs clear automatically.</p>
    `;
    spiderMessagePanelEl.textContent = spiderState.message;
    if (spiderState.completed === 8) {
      spiderMessagePanelEl.dataset.status = "correct";
    } else {
      delete spiderMessagePanelEl.dataset.status;
    }
  }

  function installE2EHooks() {
    if (!e2eMode) {
      return;
    }

    window.arcadeE2E = {
      prepareSpiderFinalRun() {
        const kingToTwo = [];
        for (let rank = 13; rank >= 2; rank -= 1) {
          kingToTwo.push({ id: `e2e-spider-main-${rank}`, rank, faceUp: true });
        }
        spiderState.columns = [
          kingToTwo,
          [{ id: "e2e-spider-ace", rank: 1, faceUp: true }],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          []
        ];
        spiderState.stock = [];
        spiderState.completed = 7;
        spiderState.selected = null;
        spiderState.hintMove = null;
        spiderState.message = "E2E final Spider run ready.";
        renderSpiderGame();
      }
    };
  }

  function getMinesLevel() {
    return MINES_LEVELS[minesState.levelIndex];
  }

  function parseMinesSquare(square) {
    const file = square.charCodeAt(0) - 97;
    const row = Number(square.slice(1)) - 1;
    return { row, col: file };
  }

  function getMinesIndex(row, col, size = getMinesLevel().size) {
    return row * size + col;
  }

  function clearMinesAutoReset() {
    if (minesState.resetTimer) {
      clearInterval(minesState.resetTimer);
      minesState.resetTimer = null;
    }
    minesState.resetCountdown = 0;
  }

  function scheduleMinesAutoReset() {
    clearMinesAutoReset();
    minesState.resetCountdown = 3;
    minesState.message = "Boom. Resetting in 3...";
    minesState.resetTimer = setInterval(() => {
      minesState.resetCountdown -= 1;
      if (minesState.resetCountdown <= 0) {
        clearMinesAutoReset();
        loadMinesLevel(Number(minesLevelSelectEl.value), "Reset after a mine. Try a safer first click.");
        return;
      }
      minesState.message = `Boom. Resetting in ${minesState.resetCountdown}...`;
      renderMinesGame();
    }, 1000);
  }

  function getMinesNeighbors(index) {
    const level = getMinesLevel();
    const row = Math.floor(index / level.size);
    const col = index % level.size;
    const neighbors = [];

    for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
      for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
        if (rowDelta === 0 && colDelta === 0) {
          continue;
        }
        const nextRow = row + rowDelta;
        const nextCol = col + colDelta;
        if (nextRow >= 0 && nextRow < level.size && nextCol >= 0 && nextCol < level.size) {
          neighbors.push(getMinesIndex(nextRow, nextCol, level.size));
        }
      }
    }

    return neighbors;
  }

  function loadMinesLevel(index, message) {
    clearArcadeWinSequence();
    const level = MINES_LEVELS[index];
    const mineIndexes = new Set(level.mines.map((square) => {
      const parsed = parseMinesSquare(square);
      return getMinesIndex(parsed.row, parsed.col, level.size);
    }));

    minesState.levelIndex = index;
    clearMinesAutoReset();
    minesState.mode = "reveal";
    minesState.status = "playing";
    minesState.hintIndex = null;
    minesState.cells = Array.from({ length: level.size * level.size }, (_, cellIndex) => ({
      mine: mineIndexes.has(cellIndex),
      revealed: false,
      flagged: false,
      adjacent: 0
    }));
    minesState.cells.forEach((cell, cellIndex) => {
      cell.adjacent = getMinesNeighbors(cellIndex).filter((neighborIndex) => minesState.cells[neighborIndex].mine).length;
    });
    minesState.message = message;
    minesLevelSelectEl.value = String(index);
    renderMinesGame();
  }

  function createMinesLevelSelect() {
    minesLevelSelectEl.innerHTML = "";
    MINES_LEVELS.forEach((level, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Level ${level.level} (${level.difficulty})`;
      minesLevelSelectEl.append(option);
    });
    minesLevelSelectEl.value = String(minesState.levelIndex);
  }

  function revealMinesCell(index) {
    const cell = minesState.cells[index];
    if (minesState.status !== "playing" || cell.revealed || cell.flagged) {
      return;
    }

    minesState.hintIndex = null;
    if (cell.mine) {
      cell.revealed = true;
      minesState.status = "lost";
      minesState.cells.forEach((item) => {
        if (item.mine) {
          item.revealed = true;
        }
      });
      scheduleMinesAutoReset();
      renderMinesGame();
      return;
    }

    const queue = [index];
    while (queue.length) {
      const currentIndex = queue.shift();
      const current = minesState.cells[currentIndex];
      if (current.revealed || current.flagged) {
        continue;
      }
      current.revealed = true;
      if (current.adjacent === 0) {
        getMinesNeighbors(currentIndex).forEach((neighborIndex) => {
          const neighbor = minesState.cells[neighborIndex];
          if (!neighbor.revealed && !neighbor.mine && !neighbor.flagged) {
            queue.push(neighborIndex);
          }
        });
      }
    }

    updateMinesWinState();
    renderMinesGame();
  }

  function toggleMinesFlag(index) {
    const cell = minesState.cells[index];
    if (minesState.status !== "playing" || cell.revealed) {
      return;
    }
    minesState.hintIndex = null;
    cell.flagged = !cell.flagged;
    minesState.message = cell.flagged ? "Flag placed. Flags are for cells you believe are mines." : "Flag removed.";
    updateMinesWinState();
    renderMinesGame();
  }

  function handleMinesCell(index) {
    if (minesState.mode === "flag") {
      toggleMinesFlag(index);
    } else {
      revealMinesCell(index);
    }
  }

  function updateMinesWinState() {
    const wasWon = minesState.status === "won";
    const safeCells = minesState.cells.filter((cell) => !cell.mine);
    const allSafeRevealed = safeCells.every((cell) => cell.revealed);
    if (allSafeRevealed) {
      minesState.status = "won";
      minesState.cells.forEach((cell) => {
        if (cell.mine) {
          cell.flagged = true;
        }
      });
      minesState.message = "Correct: every safe cell is open and every mine is handled.";
      if (!wasWon) {
        startArcadeWinSequence({
          label: "Minesweeper cleared",
          onAdvance: () => {
            const nextIndex = getNextLevelIndex(minesState.levelIndex, MINES_LEVELS);
            const nextLevel = MINES_LEVELS[nextIndex];
            loadMinesLevel(nextIndex, `Level ${nextLevel.level}: ${nextLevel.difficulty}.`);
          }
        });
      }
    } else if (minesState.status === "playing") {
      minesState.message = "Safe cell revealed. Use the numbers to choose the next move.";
    }
  }

  function showMinesHint() {
    const safeHidden = minesState.cells.findIndex((cell) => !cell.mine && !cell.revealed && !cell.flagged);
    minesState.hintIndex = safeHidden >= 0 ? safeHidden : null;
    minesState.message = safeHidden >= 0
      ? "Hint: the highlighted cell is safe to reveal."
      : "No safe hidden cell remains. Check your flags.";
    renderMinesGame();
  }

  function checkMinesGame() {
    const wasWon = minesState.status === "won";
    const wrongFlags = minesState.cells.filter((cell) => cell.flagged && !cell.mine).length;
    const hiddenSafe = minesState.cells.filter((cell) => !cell.mine && !cell.revealed).length;
    if (minesState.status === "lost") {
      minesState.message = "Inaccurate: a mine was revealed.";
    } else if (wrongFlags > 0) {
      minesState.message = `Inaccurate: ${wrongFlags} flag${wrongFlags === 1 ? "" : "s"} are on safe cells.`;
    } else if (hiddenSafe === 0) {
      minesState.status = "won";
      minesState.message = "Correct: board cleared.";
      if (!wasWon) {
        startArcadeWinSequence({
          label: "Minesweeper cleared",
          onAdvance: () => {
            const nextIndex = getNextLevelIndex(minesState.levelIndex, MINES_LEVELS);
            const nextLevel = MINES_LEVELS[nextIndex];
            loadMinesLevel(nextIndex, `Level ${nextLevel.level}: ${nextLevel.difficulty}.`);
          }
        });
      }
    } else {
      minesState.message = `Incomplete: ${hiddenSafe} safe cell${hiddenSafe === 1 ? "" : "s"} still hidden.`;
    }
    renderMinesGame();
  }

  function renderMinesGame() {
    const level = getMinesLevel();
    const revealedSafe = minesState.cells.filter((cell) => cell.revealed && !cell.mine).length;
    const totalSafe = minesState.cells.filter((cell) => !cell.mine).length;
    const flags = minesState.cells.filter((cell) => cell.flagged).length;

    minesBoardEl.innerHTML = "";
    minesBoardEl.style.setProperty("--mines-size", String(level.size));
    minesState.cells.forEach((cell, index) => {
      const button = document.createElement("button");
      button.className = "mines-cell";
      button.type = "button";
      button.classList.toggle("revealed", cell.revealed);
      button.classList.toggle("flagged", cell.flagged && !cell.revealed);
      button.classList.toggle("mine", cell.revealed && cell.mine);
      button.classList.toggle("hint-safe", minesState.hintIndex === index);
      button.dataset.count = cell.adjacent ? String(cell.adjacent) : "";
      button.textContent = cell.revealed
        ? cell.mine ? "✹" : cell.adjacent ? String(cell.adjacent) : ""
        : cell.flagged ? "⚑" : "";
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", `Cell ${index + 1}`);
      button.addEventListener("click", () => handleMinesCell(index));
      button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        toggleMinesFlag(index);
      });
      minesBoardEl.append(button);
    });

    if (minesRevealModeEl && minesFlagModeEl) {
      minesRevealModeEl.classList.toggle("active", minesState.mode === "reveal");
      minesFlagModeEl.classList.toggle("active", minesState.mode === "flag");
      minesRevealModeEl.setAttribute("aria-pressed", String(minesState.mode === "reveal"));
      minesFlagModeEl.setAttribute("aria-pressed", String(minesState.mode === "flag"));
    }
    minesDifficultyPillEl.textContent = `Level ${level.level}: ${level.difficulty}`;
    minesProgressTextEl.textContent = `${revealedSafe}/${totalSafe} safe, ${flags}/${level.mines.length} flags`;
    minesLessonPanelEl.innerHTML = `
      <h2>Level ${level.level}: ${level.difficulty}</h2>
      <p><strong>Rule:</strong> A number tells you how many mines touch that cell, including diagonals.</p>
      <p><strong>Goal:</strong> Reveal every safe cell. Use flags for cells you know are mines.</p>
    `;
    minesMessagePanelEl.textContent = minesState.message;
    if (minesState.status === "won") {
      minesMessagePanelEl.dataset.status = "correct";
    } else if (minesState.status === "lost") {
      minesMessagePanelEl.dataset.status = "inaccurate";
    } else {
      delete minesMessagePanelEl.dataset.status;
    }
  }

  function getMasterLevel() {
    return MASTER_LEVELS[masterState.levelIndex];
  }

  function getMasterColor(colorId) {
    return MASTER_COLORS.find((color) => color.id === colorId);
  }

  function scoreMasterGuess(guess, secret) {
    let exact = 0;
    const slots = Array(guess.length).fill("none");
    const guessRemainder = [];
    const secretRemainder = [];

    guess.forEach((color, index) => {
      if (color === secret[index]) {
        exact += 1;
        slots[index] = "exact";
      } else {
        guessRemainder.push({ color, index });
        secretRemainder.push(secret[index]);
      }
    });

    let colorOnly = 0;
    guessRemainder.forEach(({ color, index }) => {
      const matchIndex = secretRemainder.indexOf(color);
      if (matchIndex >= 0) {
        colorOnly += 1;
        slots[index] = "color-only";
        secretRemainder.splice(matchIndex, 1);
      }
    });

    return { exact, colorOnly, slots };
  }

  function startMasterLevelAdvance() {
    masterState.message = "Correct: code cracked.";
    startArcadeWinSequence({
      label: "Code cracked",
      onAdvance: () => {
        const nextIndex = getNextLevelIndex(masterState.levelIndex, MASTER_LEVELS);
        const nextLevel = MASTER_LEVELS[nextIndex];
        loadMasterLevel(nextIndex, `Level ${nextLevel.level}: ${nextLevel.name}.`);
      }
    });
  }

  function loadMasterLevel(index, message) {
    clearArcadeWinSequence();
    masterState.levelIndex = index;
    masterState.guesses = [];
    masterState.current = [];
    masterState.selectedSlot = 0;
    masterState.pickerSlot = null;
    masterState.status = "playing";
    masterState.hintStep = 0;
    masterState.message = message;
    masterLevelSelectEl.value = String(index);
    renderMasterGame();
  }

  function createMasterLevelSelect() {
    masterLevelSelectEl.innerHTML = "";
    MASTER_LEVELS.forEach((level, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Level ${level.level}: ${level.name} (${level.difficulty})`;
      masterLevelSelectEl.append(option);
    });
    masterLevelSelectEl.value = String(masterState.levelIndex);
  }

  function isMasterColorUnavailable(colorId, slot = masterState.selectedSlot) {
    const level = getMasterLevel();
    return level.allowRepeats === false && masterState.current.some((currentColor, index) => currentColor === colorId && index !== slot);
  }

  function addMasterColor(colorId) {
    const slot = Math.min(masterState.selectedSlot, 3);
    if (masterState.status !== "playing") {
      masterState.message = "This code is finished. Reset or choose another level.";
    } else if (isMasterColorUnavailable(colorId, slot)) {
      const color = getMasterColor(colorId);
      masterState.pickerSlot = slot;
      masterState.message = `${color.label} is already used. This level has no repeats.`;
    } else {
      masterState.current[slot] = colorId;
      masterState.pickerSlot = null;
      if (masterState.current.filter(Boolean).length === 4) {
        submitMasterGuess();
        return;
      }
      const nextEmpty = [0, 1, 2, 3].find((index) => !masterState.current[index]);
      masterState.selectedSlot = nextEmpty >= 0 ? nextEmpty : Math.min(slot + 1, 3);
      masterState.message = `Color placed in slot ${slot + 1}.`;
    }
    renderMasterGame();
  }

  function eraseMasterColor() {
    const filledSelected = masterState.current[masterState.selectedSlot];
    if (filledSelected) {
      masterState.current[masterState.selectedSlot] = null;
      masterState.pickerSlot = masterState.selectedSlot;
      masterState.message = `Slot ${masterState.selectedSlot + 1} erased.`;
    } else if (masterState.current.some(Boolean)) {
      const lastIndex = [0, 1, 2, 3].reduce((last, index) => masterState.current[index] ? index : last, -1);
      masterState.current[lastIndex] = null;
      masterState.selectedSlot = lastIndex;
      masterState.pickerSlot = lastIndex;
      masterState.message = "Last color erased.";
    } else {
      masterState.message = "Nothing to erase in the current row.";
    }
    renderMasterGame();
  }

  function selectMasterSlot(slot) {
    if (masterState.status !== "playing") {
      masterState.message = "This code is finished. Reset or choose another level.";
    } else {
      masterState.selectedSlot = slot;
      masterState.pickerSlot = slot;
      masterState.message = `Slot ${slot + 1} selected. Choose a color.`;
    }
    renderMasterGame();
  }

  function submitMasterGuess() {
    const level = getMasterLevel();
    if (masterState.status !== "playing") {
      masterState.message = masterState.status === "won" ? "Correct: code cracked." : "Inaccurate: no guesses left.";
      renderMasterGame();
      return;
    }
    if (masterState.current.filter(Boolean).length < 4) {
      masterState.message = "Incomplete: place four colors before submitting.";
      renderMasterGame();
      return;
    }

    const guess = masterState.current.slice(0, 4);
    const score = scoreMasterGuess(guess, level.secret);
    masterState.guesses.push({ colors: guess, score });
    masterState.current = [];
    masterState.selectedSlot = 0;
    masterState.pickerSlot = null;
    masterState.hintStep = 0;

    if (score.exact === 4) {
      masterState.status = "won";
      startMasterLevelAdvance();
    } else if (masterState.guesses.length >= level.guesses) {
      masterState.status = "lost";
      masterState.message = `Inaccurate: the code was ${level.secret.map((color) => getMasterColor(color).label).join(", ")}.`;
    } else {
      masterState.message = `${score.exact} exact, ${score.colorOnly} right color wrong spot.`;
    }

    renderMasterGame();
  }

  function showMasterHint() {
    const level = getMasterLevel();
    masterState.hintStep = Math.min(masterState.hintStep + 1, 2);
    if (masterState.hintStep === 1) {
      masterState.message = `Hint: the code uses ${new Set(level.secret).size} different color${new Set(level.secret).size === 1 ? "" : "s"}.`;
    } else {
      const color = getMasterColor(level.secret[0]);
      masterState.message = `Hint: the first slot is ${color.label}.`;
    }
    renderMasterGame();
  }

  function checkMasterGame() {
    if (masterState.status === "won") {
      masterState.message = "Correct: code cracked.";
    } else if (masterState.status === "lost") {
      masterState.message = "Inaccurate: no guesses left.";
    } else {
      masterState.message = `Incomplete: ${getMasterLevel().guesses - masterState.guesses.length} guesses remain.`;
    }
    renderMasterGame();
  }

  function renderMasterGame() {
    const level = getMasterLevel();
    masterBoardEl.innerHTML = "";

    for (let row = 0; row < level.guesses; row += 1) {
      const submitted = masterState.guesses[row];
      const isCurrent = row === masterState.guesses.length && masterState.status === "playing";
      const colors = submitted ? submitted.colors : isCurrent ? masterState.current : [];
      const rowEl = document.createElement("div");
      rowEl.className = "master-row-play";
      rowEl.classList.toggle("current", isCurrent);
      rowEl.classList.toggle("picker-open", isCurrent && masterState.pickerSlot !== null);

      const codeEl = document.createElement("div");
      codeEl.className = "master-code-slots";
      for (let slot = 0; slot < 4; slot += 1) {
        const slotEl = document.createElement("div");
        slotEl.className = "master-code-slot";
        const peg = document.createElement(isCurrent ? "button" : "span");
        peg.className = "master-code-peg";
        if (isCurrent) {
          peg.type = "button";
          peg.classList.toggle("selected-slot", slot === masterState.selectedSlot);
          peg.addEventListener("click", (event) => {
            event.stopPropagation();
            selectMasterSlot(slot);
          });
        }
        if (colors[slot]) {
          peg.style.setProperty("--peg-color", getMasterColor(colors[slot]).value);
          peg.classList.add("filled");
          peg.setAttribute("aria-label", getMasterColor(colors[slot]).label);
        } else {
          peg.setAttribute("aria-label", `Empty slot ${slot + 1}`);
        }
        slotEl.append(peg);

        if (isCurrent && masterState.pickerSlot === slot) {
          const pickerEl = document.createElement("div");
          pickerEl.className = "master-slot-picker";
          pickerEl.setAttribute("role", "menu");
          pickerEl.setAttribute("aria-label", `Choose color for slot ${slot + 1}`);
          MASTER_COLORS.forEach((color) => {
            const option = document.createElement("button");
            option.className = "master-slot-option";
            option.type = "button";
            option.disabled = isMasterColorUnavailable(color.id, slot);
            option.style.setProperty("--peg-color", color.value);
            option.setAttribute("aria-label", option.disabled ? `${color.label} already used` : color.label);
            option.setAttribute("role", "menuitem");
            option.addEventListener("click", (event) => {
              event.stopPropagation();
              masterState.selectedSlot = slot;
              addMasterColor(color.id);
            });
            pickerEl.append(option);
          });
          slotEl.append(pickerEl);
        }

        codeEl.append(slotEl);
      }

      const feedbackEl = document.createElement("div");
      feedbackEl.className = "master-feedback-play";
      const score = submitted ? submitted.score : { exact: 0, colorOnly: 0, slots: Array(4).fill("none") };
      const feedbackText = {
        exact: "Black: right color in the right spot.",
        "color-only": "White: right color, wrong spot.",
        none: "Empty: this color does not match the code."
      };
      for (let index = 0; index < 4; index += 1) {
        const peg = document.createElement("span");
        peg.className = "master-feedback-peg";
        if (!submitted) {
          peg.classList.add("pending");
          peg.setAttribute("aria-label", `Feedback ${index + 1}: not scored yet`);
        } else if (score.slots[index] === "exact") {
          peg.tabIndex = 0;
          peg.classList.add("exact");
        } else if (score.slots[index] === "color-only") {
          peg.tabIndex = 0;
          peg.classList.add("color-only");
        } else {
          peg.tabIndex = 0;
          peg.classList.add("none");
        }
        if (submitted) {
          const tooltip = feedbackText[score.slots[index]];
          peg.dataset.tooltip = tooltip;
          peg.title = tooltip;
          peg.setAttribute("aria-label", `Feedback ${index + 1}: ${tooltip}`);
        }
        feedbackEl.append(peg);
      }

      rowEl.append(codeEl, feedbackEl);
      masterBoardEl.append(rowEl);
    }

    masterPaletteEl.innerHTML = "";
    MASTER_COLORS.forEach((color) => {
      const button = document.createElement("button");
      button.className = "master-palette-peg";
      button.type = "button";
      button.disabled = isMasterColorUnavailable(color.id);
      button.style.setProperty("--peg-color", color.value);
      button.setAttribute("aria-label", button.disabled ? `${color.label} already used` : color.label);
      button.addEventListener("click", () => addMasterColor(color.id));
      masterPaletteEl.append(button);
    });

    const secretPreview = masterState.status === "won" || masterState.status === "lost" || masterState.hintStep > 1
      ? level.secret.map((color, index) => index === 0 || masterState.status !== "playing" ? getMasterColor(color).label : "hidden").join(", ")
      : "hidden";

    masterDifficultyPillEl.textContent = `Level ${level.level}: ${level.difficulty}`;
    masterProgressTextEl.textContent = `${masterState.guesses.length}/${level.guesses} guesses`;
    masterLessonPanelEl.innerHTML = `
      <h2>${level.name}</h2>
      <p><strong>Rule:</strong> Black means right color and right spot. White means right color in the wrong spot. Empty means no match.</p>
      <p><strong>Colors:</strong> ${level.allowRepeats === false ? "No repeat colors on this level." : "Repeat colors are allowed on this level."}</p>
      <p><strong>Secret:</strong> ${secretPreview}</p>
    `;
    masterMessagePanelEl.textContent = masterState.message;
    if (masterState.status === "won") {
      masterMessagePanelEl.dataset.status = "correct";
    } else if (masterState.status === "lost") {
      masterMessagePanelEl.dataset.status = "inaccurate";
    } else {
      delete masterMessagePanelEl.dataset.status;
    }
  }

  function getWordLevel() {
    return WORD_LEVELS[wordState.levelIndex];
  }

  function scoreWordGuess(guess, answer) {
    const result = Array(5).fill("absent");
    const remaining = answer.split("");

    guess.split("").forEach((letter, index) => {
      if (letter === answer[index]) {
        result[index] = "exact";
        remaining[index] = null;
      }
    });

    guess.split("").forEach((letter, index) => {
      if (result[index] === "exact") {
        return;
      }
      const foundIndex = remaining.indexOf(letter);
      if (foundIndex >= 0) {
        result[index] = "present";
        remaining[foundIndex] = null;
      }
    });

    return result;
  }

  function loadWordLevel(index, message) {
    clearArcadeWinSequence();
    wordState.levelIndex = index;
    wordState.guesses = [];
    wordState.current = "";
    wordState.status = "playing";
    wordState.hintStep = 0;
    wordState.message = message;
    wordLevelSelectEl.value = String(index);
    renderWordGame();
  }

  function createWordLevelSelect() {
    wordLevelSelectEl.innerHTML = "";
    WORD_LEVELS.forEach((level, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Level ${level.level} (${level.difficulty})`;
      wordLevelSelectEl.append(option);
    });
    wordLevelSelectEl.value = String(wordState.levelIndex);
  }

  function getRandomWordLevelIndex() {
    if (WORD_LEVELS.length <= 1) {
      return 0;
    }
    let nextIndex = wordState.levelIndex;
    while (nextIndex === wordState.levelIndex) {
      nextIndex = Math.floor(Math.random() * WORD_LEVELS.length);
    }
    return nextIndex;
  }

  function addWordLetter(letter) {
    if (wordState.status !== "playing") {
      wordState.message = "This word is finished. Reset or choose another level.";
    } else if (wordState.current.length < 5) {
      wordState.current += letter;
      wordState.message = "Letter placed.";
    } else {
      wordState.message = "This row is full. Enter it or delete a letter.";
    }
    renderWordGame();
  }

  function deleteWordLetter() {
    wordState.current = wordState.current.slice(0, -1);
    wordState.message = wordState.current ? "Last letter removed." : "Current row is empty.";
    renderWordGame();
  }

  function submitWordGuess() {
    const level = getWordLevel();
    if (wordState.status !== "playing") {
      wordState.message = "This word is finished. Reset or choose another level.";
      renderWordGame();
      return;
    }
    if (wordState.current.length !== 5) {
      wordState.message = "Incomplete: enter five letters first.";
      renderWordGame();
      return;
    }

    const guess = wordState.current;
    const score = scoreWordGuess(guess, level.answer);
    wordState.guesses.push({ word: guess, score });
    wordState.current = "";

    if (guess === level.answer) {
      wordState.status = "won";
      wordState.message = "Correct: vault opened.";
      startArcadeWinSequence({
        label: "Word vault opened",
        onAdvance: () => {
          const nextIndex = getNextLevelIndex(wordState.levelIndex, WORD_LEVELS);
          const nextLevel = WORD_LEVELS[nextIndex];
          loadWordLevel(nextIndex, `Level ${nextLevel.level}: ${nextLevel.difficulty}.`);
        }
      });
    } else if (wordState.guesses.length >= 6) {
      wordState.status = "lost";
      wordState.message = `Inaccurate: the word was ${level.answer}.`;
    } else {
      wordState.message = "Guess scored. Use the colors to narrow the word.";
    }

    renderWordGame();
  }

  function showWordHint() {
    const level = getWordLevel();
    wordState.hintStep = Math.min(wordState.hintStep + 1, 2);
    wordState.message = wordState.hintStep === 1
      ? `Hint: ${level.hint}`
      : `Hint: the word starts with ${level.answer[0]}.`;
    renderWordGame();
  }

  function checkWordGame() {
    if (wordState.status === "won") {
      wordState.message = "Correct: vault opened.";
    } else if (wordState.status === "lost") {
      wordState.message = `Inaccurate: the word was ${getWordLevel().answer}.`;
    } else {
      wordState.message = `Incomplete: ${6 - wordState.guesses.length} guesses remain.`;
    }
    renderWordGame();
  }

  function getWordKeyboardStatuses() {
    const rank = { exact: 3, present: 2, absent: 1 };
    const statuses = new Map();
    wordState.guesses.forEach((guess) => {
      guess.word.split("").forEach((letter, index) => {
        const status = guess.score[index];
        const current = statuses.get(letter);
        if (!current || rank[status] > rank[current]) {
          statuses.set(letter, status);
        }
      });
    });
    return statuses;
  }

  function renderWordGame() {
    const level = getWordLevel();
    wordBoardEl.innerHTML = "";

    for (let row = 0; row < 6; row += 1) {
      const submitted = wordState.guesses[row];
      const isCurrent = row === wordState.guesses.length && wordState.status === "playing";
      const word = submitted ? submitted.word : isCurrent ? wordState.current.padEnd(5, " ") : "     ";
      const score = submitted ? submitted.score : [];
      const rowEl = document.createElement("div");
      rowEl.className = "word-row-play";
      rowEl.classList.toggle("current", isCurrent);
      for (let index = 0; index < 5; index += 1) {
        const tile = document.createElement("span");
        tile.className = "word-tile";
        tile.classList.toggle("exact", score[index] === "exact");
        tile.classList.toggle("present", score[index] === "present");
        tile.classList.toggle("absent", score[index] === "absent");
        tile.textContent = word[index].trim();
        rowEl.append(tile);
      }
      wordBoardEl.append(rowEl);
    }

    const keyStatuses = getWordKeyboardStatuses();
    wordKeyboardEl.innerHTML = WORD_KEYS.map((row) => `
      <div class="word-key-row">
        ${row.split("").map((letter) => `<button class="word-key ${keyStatuses.get(letter) || ""}" type="button" data-letter="${letter}">${letter}</button>`).join("")}
      </div>
    `).join("");
    Array.from(wordKeyboardEl.querySelectorAll(".word-key")).forEach((button) => {
      button.addEventListener("click", () => addWordLetter(button.dataset.letter));
    });

    const secretCopy = wordState.status === "won" || wordState.status === "lost"
      ? level.answer
      : wordState.hintStep > 1 ? `${level.answer[0]}____` : "_____";
    wordDifficultyPillEl.textContent = `Level ${level.level}: ${level.difficulty}`;
    wordProgressTextEl.textContent = `${wordState.guesses.length}/6 guesses`;
    wordLessonPanelEl.innerHTML = `
      <h2>Level ${level.level}</h2>
      <p><strong>Rule:</strong> Green is exact, yellow is the right letter in another spot, and gray is not in the word.</p>
      <p><strong>Clue:</strong> ${wordState.hintStep ? level.hint : "Use guesses to discover the hidden word."}</p>
      <p><strong>Word:</strong> ${secretCopy}</p>
    `;
    wordMessagePanelEl.textContent = wordState.message;
    if (wordState.status === "won") {
      wordMessagePanelEl.dataset.status = "correct";
    } else if (wordState.status === "lost") {
      wordMessagePanelEl.dataset.status = "inaccurate";
    } else {
      delete wordMessagePanelEl.dataset.status;
    }
  }
  function bindEvents() {
    homeButtonEl.addEventListener("click", showHome);
    homeThemeToggleEl.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });
    logicHomeButtonEl.addEventListener("click", showHome);
    chemSearchHomeButtonEl.addEventListener("click", showHome);
    chessHomeButtonEl?.addEventListener("click", showHome);
    spiderHomeButtonEl.addEventListener("click", showHome);
    minesHomeButtonEl.addEventListener("click", showHome);
    masterHomeButtonEl.addEventListener("click", showHome);
    wordHomeButtonEl.addEventListener("click", showHome);

    gameButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.game === "sudoku") {
          showSudoku();
          return;
        }

        if (button.dataset.game === "grid-logic") {
          showLogicGame();
          return;
        }

        if (button.dataset.game === "chem-search") {
          showChemSearchGame();
          return;
        }

        if (button.dataset.game === "chess") {
          showChessGame();
          return;
        }

        if (button.dataset.game === "spider-solitaire") {
          showSpiderGame();
          return;
        }

        if (button.dataset.game === "minesweeper") {
          showMinesGame();
          return;
        }

        if (button.dataset.game === "mastermind") {
          showMasterGame();
          return;
        }

        if (button.dataset.game === "wordle-like") {
          showWordGame();
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
    logicThemeToggleEl.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });
    chemSearchThemeToggleEl.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });
    chessThemeToggleEl?.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });
    spiderThemeToggleEl.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });
    minesThemeToggleEl.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });
    masterThemeToggleEl.addEventListener("click", () => {
      setTheme(!document.body.classList.contains("dark"));
    });
    wordThemeToggleEl.addEventListener("click", () => {
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

    logicLevelSelectEl.addEventListener("change", () => {
      const nextPuzzle = LOGIC_LEVELS[Number(logicLevelSelectEl.value)];
      loadLogicPuzzle(Number(logicLevelSelectEl.value), `Loaded Level ${nextPuzzle.level}: ${nextPuzzle.name}.`);
    });

    logicHintButtonsEl.addEventListener("click", (event) => {
      const button = event.target.closest(".logic-hint-button");
      if (!button) {
        return;
      }

      const hint = button.dataset.logicHint;
      const puzzle = getLogicPuzzle();

      if (!puzzle.hints[hint]) {
        logicState.activeHint = null;
        renderLogicGame();
        return;
      }

      logicState.activeHint = logicState.activeHint === hint ? null : hint;
      logicState.message = logicState.activeHint ? "Overlay ready. Match the colors to the clue." : "Overlay cleared.";
      renderLogicGame();
    });

    logicCheckEl.addEventListener("click", checkLogicPuzzle);
    logicResetEl.addEventListener("click", () => {
      loadLogicPuzzle(Number(logicLevelSelectEl.value), "Logic puzzle reset.");
    });

    logicCluePanelEl.addEventListener("click", (event) => {
      if (event.target.closest("#logicAutoMark")) {
        autoMarkDirectClues();
      }
    });

    logicHintPanelEl.addEventListener("click", (event) => {
      if (event.target.closest("#logicRevealInference")) {
        logicState.revealedHints.add(getLogicHintRevealKey());
        renderLogicGame();
      }
    });

    chemSearchLevelSelectEl.addEventListener("change", () => {
      const nextLevel = CHEM_SEARCH_LEVELS[Number(chemSearchLevelSelectEl.value)];
      loadChemSearchLevel(Number(chemSearchLevelSelectEl.value), `Loaded Level ${nextLevel.level}.`);
    });
    chemSearchHintEl.addEventListener("click", showChemSearchHint);
    chemSearchResetEl.addEventListener("click", () => {
      const level = getChemSearchLevel();
      loadChemSearchLevel(chemSearchState.levelIndex, `Reset Level ${level.level}.`);
    });

    chessLevelSelectEl?.addEventListener("change", () => {
      const nextLevel = CHESS_LEVELS[Number(chessLevelSelectEl.value)];
      loadChessLevel(Number(chessLevelSelectEl.value), `Loaded Level ${nextLevel.level}: ${nextLevel.name}.`);
    });

    chessHintEl?.addEventListener("click", showChessHint);
    chessCheckEl?.addEventListener("click", checkChessTactic);
    chessResetEl?.addEventListener("click", () => {
      loadChessLevel(Number(chessLevelSelectEl.value), "Chess tactic reset.");
    });

    spiderStockEl.addEventListener("click", dealSpiderStock);
    spiderHintEl.addEventListener("click", showSpiderHint);
    spiderCheckEl.addEventListener("click", checkSpiderGame);
    spiderResetEl.addEventListener("click", () => resetSpiderGame("Spider deal reset."));

    minesLevelSelectEl.addEventListener("change", () => {
      const nextLevel = MINES_LEVELS[Number(minesLevelSelectEl.value)];
      loadMinesLevel(Number(minesLevelSelectEl.value), `Loaded Level ${nextLevel.level}: ${nextLevel.difficulty}.`);
    });
    minesRevealModeEl?.addEventListener("click", () => {
      minesState.mode = "reveal";
      minesState.message = "Reveal mode: click safe cells to open them.";
      renderMinesGame();
    });
    minesFlagModeEl?.addEventListener("click", () => {
      minesState.mode = "flag";
      minesState.message = "Flag mode: mark cells you believe are mines.";
      renderMinesGame();
    });
    minesHintEl?.addEventListener("click", showMinesHint);
    minesCheckEl?.addEventListener("click", checkMinesGame);
    minesResetEl?.addEventListener("click", () => {
      loadMinesLevel(Number(minesLevelSelectEl.value), "Minesweeper level reset.");
    });

    masterLevelSelectEl.addEventListener("change", () => {
      const nextLevel = MASTER_LEVELS[Number(masterLevelSelectEl.value)];
      loadMasterLevel(Number(masterLevelSelectEl.value), `Loaded Level ${nextLevel.level}: ${nextLevel.name}.`);
    });
    masterSubmitEl?.addEventListener("click", submitMasterGuess);
    masterEraseEl?.addEventListener("click", eraseMasterColor);
    masterHintEl?.addEventListener("click", showMasterHint);
    masterCheckEl?.addEventListener("click", checkMasterGame);
    masterResetEl.addEventListener("click", () => {
      loadMasterLevel(Number(masterLevelSelectEl.value), "Mastermind level reset.");
    });

    document.addEventListener("click", (event) => {
      if (masterShellEl.hidden || masterState.pickerSlot === null) {
        return;
      }
      if (event.target.closest("#masterBoard") || event.target.closest("#masterPalette")) {
        return;
      }
      masterState.pickerSlot = null;
      renderMasterGame();
    });

    wordLevelSelectEl.addEventListener("change", () => {
      const nextLevel = WORD_LEVELS[Number(wordLevelSelectEl.value)];
      loadWordLevel(Number(wordLevelSelectEl.value), `Loaded Level ${nextLevel.level}: ${nextLevel.difficulty}.`);
    });
    wordEnterEl?.addEventListener("click", submitWordGuess);
    wordDeleteEl?.addEventListener("click", deleteWordLetter);
    wordHintEl?.addEventListener("click", showWordHint);
    wordCheckEl?.addEventListener("click", checkWordGame);
    wordNextEl.addEventListener("click", () => {
      const nextIndex = getRandomWordLevelIndex();
      const nextLevel = WORD_LEVELS[nextIndex];
      loadWordLevel(nextIndex, `Loaded random word: Level ${nextLevel.level}.`);
    });
    wordResetEl.addEventListener("click", () => {
      const level = getWordLevel();
      loadWordLevel(wordState.levelIndex, `Reset Level ${level.level}.`);
    });

    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (!wordShellEl.hidden) {
        if (/^[a-z]$/i.test(event.key)) {
          addWordLetter(event.key.toUpperCase());
          event.preventDefault();
          return;
        }
        if (event.key === "Enter") {
          submitWordGuess();
          event.preventDefault();
          return;
        }
        if (event.key === "Backspace" || event.key === "Delete") {
          deleteWordLetter();
          event.preventDefault();
          return;
        }
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
    createLogicLevelSelect();
    createLogicBoard();
    createChemSearchLevelSelect();
    if (chessShellEl) {
      createChessLevelSelect();
      createChessBoard();
    }
    createMinesLevelSelect();
    createMasterLevelSelect();
    createWordLevelSelect();
    loadChemSearchLevel(0, "Find every chemistry term in the grid.");
    if (chessShellEl) {
      loadChessLevel(0, "Find the best move for White.");
    }
    resetSpiderGame("Build descending runs from King to Ace.");
    loadMinesLevel(0, "Reveal safe cells and flag the mines.");
    loadMasterLevel(0, "Choose four colors, then submit your guess.");
    loadWordLevel(0, "Type a five-letter guess.");
    bindEvents();
    render();
    renderLogicClues();
    renderLogicGame();
    renderChemSearchGame();
    if (chessShellEl) {
      renderChessGame();
    }
    renderSpiderGame();
    renderMinesGame();
    renderMasterGame();
    renderWordGame();
    installE2EHooks();
  }

  init();
})();
