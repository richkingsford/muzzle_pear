(function attachSudokuCore(root) {
  "use strict";

  const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const EMPTY = 0;

  const PUZZLES = [
    {
      id: "level-01-fresh-start",
      level: 1,
      name: "Fresh Start",
      difficulty: "Easy",
      givens: "504070910070190300008000067800761400426803001710924050900530084087419035305286100",
      solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
    },
    {
      id: "level-02-bright-steps",
      level: 2,
      name: "Bright Steps",
      difficulty: "Easy+",
      givens: "534678002670195340000300000800061400426803090000924050001530080007419035000286070",
      solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
    },
    {
      id: "level-03-pattern-finder",
      level: 3,
      name: "Pattern Finder",
      difficulty: "Moderate",
      givens: "500070910602190300108002000809001400026003700000004050061530280007419635300286000",
      solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
    },
    {
      id: "level-04-cross-checks",
      level: 4,
      name: "Cross Checks",
      difficulty: "Medium",
      givens: "534070000000195300000300000800001400026053001000004856060537080007419035000286000",
      solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
    },
    {
      id: "level-05-candidate-lab",
      level: 5,
      name: "Candidate Lab",
      difficulty: "Intermediate",
      givens: "530070000070190308000000060800001400026003000000024050001530080007419035000286000",
      solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
    },
    {
      id: "level-06-strategy-builder",
      level: 6,
      name: "Strategy Builder",
      difficulty: "Advanced",
      givens: "500070000000190300000002000800001403026003000000004050000530080007419635000286000",
      solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
    },
    {
      id: "level-07-technique-lab",
      level: 7,
      name: "Technique Lab",
      difficulty: "Expert",
      givens: "500070000000190300000000000800001400026003000000004050000530080007419035000286000",
      solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
    }
  ];

  function buildUnits() {
    const units = [];

    for (let row = 0; row < 9; row += 1) {
      units.push(Array.from({ length: 9 }, (_, col) => row * 9 + col));
    }

    for (let col = 0; col < 9; col += 1) {
      units.push(Array.from({ length: 9 }, (_, row) => row * 9 + col));
    }

    for (let boxRow = 0; boxRow < 3; boxRow += 1) {
      for (let boxCol = 0; boxCol < 3; boxCol += 1) {
        units.push(
          Array.from({ length: 9 }, (_, offset) => {
            const row = boxRow * 3 + Math.floor(offset / 3);
            const col = boxCol * 3 + (offset % 3);
            return row * 9 + col;
          })
        );
      }
    }

    return units;
  }

  const UNITS = buildUnits();
  const CELL_UNITS = Array.from({ length: 81 }, (_, index) =>
    UNITS.map((unit, unitIndex) => (unit.includes(index) ? unitIndex : -1)).filter((unitIndex) => unitIndex >= 0)
  );
  const PEERS = Array.from({ length: 81 }, (_, index) => {
    const peers = new Set();
    CELL_UNITS[index].forEach((unitIndex) => {
      UNITS[unitIndex].forEach((cellIndex) => {
        if (cellIndex !== index) {
          peers.add(cellIndex);
        }
      });
    });
    return Array.from(peers);
  });

  function parseBoard(boardText) {
    if (typeof boardText !== "string" || boardText.length !== 81) {
      throw new Error("A Sudoku board must be an 81-character string.");
    }

    return boardText.split("").map((char) => {
      if (char === "." || char === "0") {
        return EMPTY;
      }

      const digit = Number(char);
      if (!DIGITS.includes(digit)) {
        throw new Error(`Invalid Sudoku character: ${char}`);
      }

      return digit;
    });
  }

  function serializeBoard(board) {
    return board.map((value) => value || EMPTY).join("");
  }

  function rowOf(index) {
    return Math.floor(index / 9);
  }

  function colOf(index) {
    return index % 9;
  }

  function boxOf(index) {
    return Math.floor(rowOf(index) / 3) * 3 + Math.floor(colOf(index) / 3);
  }

  function formatCell(index) {
    return `R${rowOf(index) + 1}C${colOf(index) + 1}`;
  }

  function formatDigits(digits) {
    if (digits.length <= 1) {
      return digits.join("");
    }

    return `${digits.slice(0, -1).join(", ")} and ${digits[digits.length - 1]}`;
  }

  function unitLabel(unitIndex) {
    if (unitIndex < 9) {
      return `row ${unitIndex + 1}`;
    }

    if (unitIndex < 18) {
      return `column ${unitIndex - 8}`;
    }

    return `box ${unitIndex - 17}`;
  }

  function unitKind(unitIndex) {
    if (unitIndex < 9) {
      return "row";
    }

    if (unitIndex < 18) {
      return "column";
    }

    return "box";
  }

  function getCandidates(board, index) {
    if (board[index] !== EMPTY) {
      return [];
    }

    const used = new Set(
      PEERS[index]
        .map((peerIndex) => board[peerIndex])
        .filter((value) => value !== EMPTY)
    );

    return DIGITS.filter((digit) => !used.has(digit));
  }

  function getAllCandidates(board) {
    return board.map((_, index) => getCandidates(board, index));
  }

  function isConflict(board, index) {
    const value = board[index];
    return value !== EMPTY && PEERS[index].some((peerIndex) => board[peerIndex] === value);
  }

  function evaluateBoard(board, solution) {
    const mistakes = [];
    const conflicts = [];
    let filled = 0;

    board.forEach((value, index) => {
      if (value !== EMPTY) {
        filled += 1;
      }

      if (value !== EMPTY && solution[index] !== value) {
        mistakes.push(index);
      }

      if (isConflict(board, index)) {
        conflicts.push(index);
      }
    });

    return {
      filled,
      empty: 81 - filled,
      complete: filled === 81,
      solved: filled === 81 && mistakes.length === 0 && conflicts.length === 0,
      mistakes,
      conflicts
    };
  }

  function combinations(items, size) {
    const result = [];

    function walk(start, path) {
      if (path.length === size) {
        result.push(path.slice());
        return;
      }

      for (let index = start; index < items.length; index += 1) {
        path.push(items[index]);
        walk(index + 1, path);
        path.pop();
      }
    }

    walk(0, []);
    return result;
  }

  function sameMembers(left, right) {
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values)).sort((a, b) => a - b);
  }

  function buildNakedExplanation(size, pattern) {
    const target = size === 2 ? "two cells" : "three cells";
    const groupDigits = formatDigits(pattern.digits);
    const eraseText =
      pattern.eliminations.length === 1
        ? "the other highlighted cell"
        : "the other highlighted cells";

    return {
      line1:
        size === 2
          ? "A naked pair is two cells in one row, column, or box that share the exact same two candidates."
          : "A naked trio happens when three open cells in the same row, column, or box are limited to the same three digits between them.",
      line2:
        size === 2
          ? `Example: The highlighted ${target} reserve ${groupDigits} inside ${pattern.unit.label}, so those digits can be erased from ${eraseText} in that ${pattern.unit.kind}.`
          : `Example: The highlighted ${target} reserve ${groupDigits} inside ${pattern.unit.label}. A trio cell may show only two of those digits; together the three cells still claim all three, so those digits can be erased from ${eraseText} in that ${pattern.unit.kind}.`,
      fallback: `Example: Find ${target} in one row, column, or box whose candidates use only ${size} digits in total, then erase those digits from the other cells there.`
    };
  }

  function findNakedSet(board, size) {
    for (let unitIndex = 0; unitIndex < UNITS.length; unitIndex += 1) {
      const unit = UNITS[unitIndex];
      const openCells = unit
        .filter((index) => board[index] === EMPTY)
        .map((index) => ({
          index,
          candidates: getCandidates(board, index)
        }))
        .filter((cell) => cell.candidates.length >= 2 && cell.candidates.length <= size);

      const groups = combinations(openCells, size);

      for (const group of groups) {
        const digits = uniqueSorted(group.flatMap((cell) => cell.candidates));

        if (digits.length !== size) {
          continue;
        }

        const everyCellUsesOnlySet = group.every((cell) => cell.candidates.every((digit) => digits.includes(digit)));
        if (!everyCellUsesOnlySet) {
          continue;
        }

        const groupIndexes = new Set(group.map((cell) => cell.index));
        const eliminations = unit
          .filter((index) => board[index] === EMPTY && !groupIndexes.has(index))
          .map((index) => ({
            index,
            digits: getCandidates(board, index).filter((digit) => digits.includes(digit))
          }))
          .filter((removal) => removal.digits.length > 0);

        if (eliminations.length === 0) {
          continue;
        }

        const pattern = {
          type: size === 2 ? "pair" : "trio",
          title: size === 2 ? "Naked pair" : "Naked trio",
          unit: {
            index: unitIndex,
            label: unitLabel(unitIndex),
            kind: unitKind(unitIndex),
            cells: unit.slice()
          },
          cells: group.map((cell) => ({
            index: cell.index,
            candidates: cell.candidates.slice()
          })),
          digits,
          eliminations
        };

        return {
          ...pattern,
          explanation: buildNakedExplanation(size, pattern)
        };
      }
    }

    return null;
  }

  function buildXWingExplanation(pattern) {
    const eraseText =
      pattern.eliminations.length === 1
        ? "the other highlighted cell"
        : "the other highlighted cells";
    const linePart =
      pattern.orientation === "row"
        ? `rows ${pattern.rows.map((row) => row + 1).join(" and ")} share columns ${pattern.cols.map((col) => col + 1).join(" and ")}`
        : `columns ${pattern.cols.map((col) => col + 1).join(" and ")} share rows ${pattern.rows.map((row) => row + 1).join(" and ")}`;

    return {
      line1: "An X-Wing locks one digit into the same two rows and columns, forming four corners.",
      line2: `Example: ${linePart} for ${pattern.digit}, so remove ${pattern.digit} from ${eraseText}.`,
      fallback: "Example: If two rows place a digit in the same two columns, erase that digit from the rest of those columns."
    };
  }

  function buildHiddenSingleExplanation(pattern) {
    return {
      line1: "A hidden single means one digit has only one possible cell in a row, column, or box.",
      line2: `Example: In ${pattern.unit.label}, ${pattern.digit} can go only in the highlighted cell. Pink cells show related open spaces where ${pattern.digit} is ruled out.`,
      fallback: "Example: Pick one row, column, or box and scan a digit. If that digit fits in only one open cell, place it there."
    };
  }

  function findHiddenSingle(board) {
    const allCandidates = getAllCandidates(board);
    let fallback = null;

    for (let unitIndex = 0; unitIndex < UNITS.length; unitIndex += 1) {
      const unit = UNITS[unitIndex];

      for (const digit of DIGITS) {
        const cells = unit
          .filter((index) => board[index] === EMPTY && allCandidates[index].includes(digit))
          .map((index) => ({
            index,
            candidates: allCandidates[index].slice()
          }));

        if (cells.length !== 1) {
          continue;
        }

        const targetIndex = cells[0].index;
        const relatedIndexes = new Set();
        CELL_UNITS[targetIndex].forEach((relatedUnitIndex) => {
          UNITS[relatedUnitIndex].forEach((index) => relatedIndexes.add(index));
        });
        relatedIndexes.delete(targetIndex);

        const pattern = {
          type: "hidden-single",
          title: "Hidden single",
          digit,
          unit: {
            index: unitIndex,
            label: unitLabel(unitIndex),
            kind: unitKind(unitIndex),
            cells: unit.slice()
          },
          cells,
          blockedCells: Array.from(relatedIndexes).filter(
            (index) => board[index] === EMPTY && !allCandidates[index].includes(digit)
          ),
          eliminations: []
        };

        const result = {
          ...pattern,
          explanation: buildHiddenSingleExplanation(pattern)
        };

        if (cells[0].candidates.length > 1) {
          return result;
        }

        fallback = fallback || result;
      }
    }

    return fallback;
  }

  function buildPointingExplanation(pattern) {
    const eraseText =
      pattern.eliminations.length === 1
        ? "the other highlighted cell"
        : "the other highlighted cells";

    return {
      line1: "A pointing pair or triple happens when a digit's candidates inside one box all sit in the same row or column.",
      line2: `Example: In ${pattern.unit.label}, every possible ${pattern.digit} is in ${pattern.lineLabel}. That keeps ${pattern.digit} inside the box there, so erase it from ${eraseText} in ${pattern.lineLabel} outside that box.`,
      fallback: `Example: If all possible spots for a digit in a box point along one row or column, erase that digit from the rest of that row or column.`
    };
  }

  function findPointingSet(board) {
    const allCandidates = getAllCandidates(board);

    for (let boxIndex = 18; boxIndex < 27; boxIndex += 1) {
      const box = UNITS[boxIndex];

      for (const digit of DIGITS) {
        const cells = box
          .filter((index) => board[index] === EMPTY && allCandidates[index].includes(digit))
          .map((index) => ({
            index,
            candidates: [digit]
          }));

        if (cells.length < 2 || cells.length > 3) {
          continue;
        }

        const rows = uniqueSorted(cells.map((cell) => rowOf(cell.index)));
        const cols = uniqueSorted(cells.map((cell) => colOf(cell.index)));
        const isRowPointing = rows.length === 1;
        const isColPointing = cols.length === 1;

        if (!isRowPointing && !isColPointing) {
          continue;
        }

        const lineKind = isRowPointing ? "row" : "column";
        const lineIndex = isRowPointing ? rows[0] : cols[0];
        const lineUnit = UNITS[isRowPointing ? lineIndex : 9 + lineIndex];
        const boxCells = new Set(box);
        const eliminations = lineUnit
          .filter((index) => !boxCells.has(index) && board[index] === EMPTY && allCandidates[index].includes(digit))
          .map((index) => ({
            index,
            digits: [digit]
          }));

        if (eliminations.length === 0) {
          continue;
        }

        const pattern = {
          type: "pointing",
          title: cells.length === 2 ? "Pointing pair" : "Pointing triple",
          digit,
          unit: {
            index: boxIndex,
            label: unitLabel(boxIndex),
            kind: "box",
            cells: box.slice()
          },
          lineKind,
          lineLabel: `${lineKind} ${lineIndex + 1}`,
          cells,
          eliminations
        };

        return {
          ...pattern,
          explanation: buildPointingExplanation(pattern)
        };
      }
    }

    return null;
  }

  function findXWing(board) {
    const allCandidates = getAllCandidates(board);

    for (const digit of DIGITS) {
      const rowPairs = [];
      for (let row = 0; row < 9; row += 1) {
        const cols = [];
        for (let col = 0; col < 9; col += 1) {
          const index = row * 9 + col;
          if (board[index] === EMPTY && allCandidates[index].includes(digit)) {
            cols.push(col);
          }
        }

        if (cols.length === 2) {
          rowPairs.push({ row, cols });
        }
      }

      for (const [first, second] of combinations(rowPairs, 2)) {
        if (!sameMembers(first.cols, second.cols)) {
          continue;
        }

        const eliminations = [];
        for (let row = 0; row < 9; row += 1) {
          if (row === first.row || row === second.row) {
            continue;
          }

          first.cols.forEach((col) => {
            const index = row * 9 + col;
            if (board[index] === EMPTY && allCandidates[index].includes(digit)) {
              eliminations.push(index);
            }
          });
        }

        if (eliminations.length > 0) {
          const pattern = {
            type: "xwing",
            title: "X-Wing",
            digit,
            orientation: "row",
            rows: [first.row, second.row],
            cols: first.cols.slice(),
            corners: [
              first.row * 9 + first.cols[0],
              first.row * 9 + first.cols[1],
              second.row * 9 + first.cols[0],
              second.row * 9 + first.cols[1]
            ],
            eliminations
          };

          return {
            ...pattern,
            explanation: buildXWingExplanation(pattern)
          };
        }
      }

      const colPairs = [];
      for (let col = 0; col < 9; col += 1) {
        const rows = [];
        for (let row = 0; row < 9; row += 1) {
          const index = row * 9 + col;
          if (board[index] === EMPTY && allCandidates[index].includes(digit)) {
            rows.push(row);
          }
        }

        if (rows.length === 2) {
          colPairs.push({ col, rows });
        }
      }

      for (const [first, second] of combinations(colPairs, 2)) {
        if (!sameMembers(first.rows, second.rows)) {
          continue;
        }

        const eliminations = [];
        for (let col = 0; col < 9; col += 1) {
          if (col === first.col || col === second.col) {
            continue;
          }

          first.rows.forEach((row) => {
            const index = row * 9 + col;
            if (board[index] === EMPTY && allCandidates[index].includes(digit)) {
              eliminations.push(index);
            }
          });
        }

        if (eliminations.length > 0) {
          const pattern = {
            type: "xwing",
            title: "X-Wing",
            digit,
            orientation: "column",
            rows: first.rows.slice(),
            cols: [first.col, second.col],
            corners: [
              first.rows[0] * 9 + first.col,
              first.rows[1] * 9 + first.col,
              first.rows[0] * 9 + second.col,
              first.rows[1] * 9 + second.col
            ],
            eliminations
          };

          return {
            ...pattern,
            explanation: buildXWingExplanation(pattern)
          };
        }
      }
    }

    return null;
  }

  function getHintPattern(board, technique) {
    if (technique === "pair") {
      return findNakedSet(board, 2);
    }

    if (technique === "trio") {
      return findNakedSet(board, 3);
    }

    if (technique === "hidden-single") {
      return findHiddenSingle(board);
    }

    if (technique === "pointing") {
      return findPointingSet(board);
    }

    if (technique === "xwing") {
      return findXWing(board);
    }

    return null;
  }

  const api = {
    DIGITS,
    EMPTY,
    PUZZLES,
    UNITS,
    PEERS,
    parseBoard,
    serializeBoard,
    rowOf,
    colOf,
    boxOf,
    formatCell,
    formatDigits,
    getCandidates,
    getAllCandidates,
    isConflict,
    evaluateBoard,
    findNakedSet,
    findHiddenSingle,
    findPointingSet,
    findXWing,
    getHintPattern
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.SudokuCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
