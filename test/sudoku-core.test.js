const test = require("node:test");
const assert = require("node:assert/strict");
const SudokuCore = require("../src/sudoku-core.js");

const puzzle = SudokuCore.PUZZLES.find((item) => item.id === "level-07-technique-lab");
const board = SudokuCore.parseBoard(puzzle.givens);
const solution = SudokuCore.parseBoard(puzzle.solution);

test("puzzle ladder has seven increasing non-master levels", () => {
  assert.equal(SudokuCore.PUZZLES.length, 7);
  assert.deepEqual(SudokuCore.PUZZLES.map((item) => item.level), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(SudokuCore.PUZZLES.some((item) => /master/i.test(item.difficulty)), false);
});

test("all puzzle givens agree with their solutions", () => {
  SudokuCore.PUZZLES.forEach((item) => {
    const givens = SudokuCore.parseBoard(item.givens);
    const solved = SudokuCore.parseBoard(item.solution);

    givens.forEach((value, index) => {
      if (value !== SudokuCore.EMPTY) {
        assert.equal(value, solved[index], `${item.id} has a mismatched given at ${SudokuCore.formatCell(index)}`);
      }
    });
  });
});

test("candidate notes are calculated from row, column, and box peers", () => {
  const index = 0 * 9 + 5;

  assert.deepEqual(SudokuCore.getCandidates(board, index), [2, 8]);
});

test("starting puzzle contains a live naked pair teaching pattern", () => {
  const pair = SudokuCore.findNakedSet(board, 2);

  assert.equal(pair.title, "Naked pair");
  assert.equal(pair.unit.label, "row 8");
  assert.deepEqual(pair.cells.map((cell) => SudokuCore.formatCell(cell.index)), ["R8C1", "R8C7"]);
  assert.deepEqual(pair.digits, [2, 6]);
  assert.deepEqual(pair.eliminations.map((removal) => SudokuCore.formatCell(removal.index)), ["R8C2"]);
});

test("starting puzzle contains a live naked trio teaching pattern", () => {
  const trio = SudokuCore.findNakedSet(board, 3);

  assert.equal(trio.title, "Naked trio");
  assert.equal(trio.unit.label, "box 2");
  assert.deepEqual(trio.cells.map((cell) => SudokuCore.formatCell(cell.index)), ["R1C6", "R2C6", "R3C6"]);
  assert.deepEqual(trio.digits, [2, 5, 8]);
  assert.deepEqual(trio.eliminations.map((removal) => SudokuCore.formatCell(removal.index)), ["R1C4", "R3C4", "R3C5"]);
});

test("starting puzzle contains a live X-Wing teaching pattern", () => {
  const xwing = SudokuCore.findXWing(board);

  assert.equal(xwing.title, "X-Wing");
  assert.equal(xwing.digit, 5);
  assert.equal(xwing.orientation, "column");
  assert.deepEqual(xwing.cols.map((col) => col + 1), [2, 3]);
  assert.deepEqual(xwing.rows.map((row) => row + 1), [4, 9]);
  assert.deepEqual(xwing.eliminations.map((index) => SudokuCore.formatCell(index)), ["R4C5"]);
});

test("board evaluation recognizes the completed solution", () => {
  const review = SudokuCore.evaluateBoard(solution, solution);

  assert.equal(review.solved, true);
  assert.equal(review.empty, 0);
  assert.deepEqual(review.mistakes, []);
  assert.deepEqual(review.conflicts, []);
});

test("board evaluation detects mistakes and duplicate conflicts", () => {
  const edited = solution.slice();
  edited[1] = edited[0];

  const review = SudokuCore.evaluateBoard(edited, solution);

  assert.equal(review.solved, false);
  assert.ok(review.mistakes.includes(1));
  assert.ok(review.conflicts.includes(0));
  assert.ok(review.conflicts.includes(1));
});
