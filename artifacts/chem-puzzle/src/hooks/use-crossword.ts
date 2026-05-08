import { useState, useEffect, useCallback, useMemo } from "react";
import { Puzzle, Word, Direction } from "../lib/puzzles";

export interface CellState {
  value: string;
  isCorrect?: boolean;
}

export type GridState = Record<string, CellState>;

export interface CellInfo {
  row: number;
  col: number;
  isBlank: boolean;
  words: Word[];
}

export function useCrossword(puzzle: Puzzle) {
  const [grid, setGrid] = useState<GridState>({});
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<Direction>("across");
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // Compute grid layout based on words
  const layout = useMemo(() => {
    let maxRow = 0;
    let maxCol = 0;
    const cellMap = new Map<string, CellInfo>();

    puzzle.words.forEach((word) => {
      for (let i = 0; i < word.answer.length; i++) {
        const r = word.direction === "down" ? word.row + i : word.row;
        const c = word.direction === "across" ? word.col + i : word.col;
        maxRow = Math.max(maxRow, r);
        maxCol = Math.max(maxCol, c);

        const key = `${r}-${c}`;
        const existing = cellMap.get(key);
        if (existing) {
          existing.words.push(word);
        } else {
          cellMap.set(key, { row: r, col: c, isBlank: false, words: [word] });
        }
      }
    });

    const rows = maxRow + 1;
    const cols = maxCol + 1;
    const gridLayout: CellInfo[][] = [];

    for (let r = 0; r < rows; r++) {
      const rowArr: CellInfo[] = [];
      for (let c = 0; c < cols; c++) {
        const info = cellMap.get(`${r}-${c}`);
        if (info) {
          rowArr.push(info);
        } else {
          rowArr.push({ row: r, col: c, isBlank: true, words: [] });
        }
      }
      gridLayout.push(rowArr);
    }

    return gridLayout;
  }, [puzzle]);

  // Reset state when puzzle changes
  useEffect(() => {
    setGrid({});
    setSelectedCell(null);
    setIsCompleted(false);
    setTimeSeconds(0);
    setTimerActive(true);
    setDirection("across");

    // Find first non-blank cell to select initially
    for (let r = 0; r < layout.length; r++) {
      for (let c = 0; c < layout[r].length; c++) {
        if (!layout[r][c].isBlank) {
          setSelectedCell({ row: r, col: c });
          setDirection(layout[r][c].words[0].direction);
          return;
        }
      }
    }
  }, [puzzle, layout]);

  // Timer
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimeSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const activeWord = useMemo(() => {
    if (!selectedCell) return null;
    const cellInfo = layout[selectedCell.row]?.[selectedCell.col];
    if (!cellInfo || cellInfo.isBlank) return null;

    const wordMatch = cellInfo.words.find((w) => w.direction === direction) || cellInfo.words[0];
    return wordMatch || null;
  }, [selectedCell, direction, layout]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const cellInfo = layout[row]?.[col];
      if (!cellInfo || cellInfo.isBlank) return;

      if (selectedCell?.row === row && selectedCell?.col === col) {
        // Toggle direction if cell belongs to multiple words
        if (cellInfo.words.length > 1) {
          setDirection((prev) => (prev === "across" ? "down" : "across"));
        }
      } else {
        setSelectedCell({ row, col });
        // Automatically set direction to the available word's direction if only one
        if (cellInfo.words.length === 1) {
          setDirection(cellInfo.words[0].direction);
        } else if (!cellInfo.words.some((w) => w.direction === direction)) {
          setDirection(cellInfo.words[0].direction);
        }
      }
    },
    [layout, selectedCell, direction]
  );

  const getNextCell = useCallback(
    (r: number, c: number, dir: Direction, forward: boolean = true) => {
      if (!activeWord) return null;
      let nextR = r;
      let nextC = c;

      if (dir === "across") {
        nextC += forward ? 1 : -1;
      } else {
        nextR += forward ? 1 : -1;
      }

      // Check if next cell is part of the active word
      const nextCellInfo = layout[nextR]?.[nextC];
      if (nextCellInfo && !nextCellInfo.isBlank && nextCellInfo.words.some((w) => w.id === activeWord.id)) {
        return { row: nextR, col: nextC };
      }
      return null;
    },
    [activeWord, layout]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedCell || !activeWord || isCompleted) return;

      const { row, col } = selectedCell;

      if (e.key === "Backspace") {
        e.preventDefault();
        const currentVal = grid[`${row}-${col}`]?.value;
        
        if (currentVal) {
          setGrid((prev) => ({
            ...prev,
            [`${row}-${col}`]: { value: "", isCorrect: undefined },
          }));
        } else {
          const prevCell = getNextCell(row, col, direction, false);
          if (prevCell) {
            setSelectedCell(prevCell);
            setGrid((prev) => ({
              ...prev,
              [`${prevCell.row}-${prevCell.col}`]: { value: "", isCorrect: undefined },
            }));
          }
        }
      } else if (e.key.match(/^[a-zA-Z]$/)) {
        e.preventDefault();
        setGrid((prev) => ({
          ...prev,
          [`${row}-${col}`]: { value: e.key.toUpperCase(), isCorrect: undefined },
        }));

        const nextCell = getNextCell(row, col, direction, true);
        if (nextCell) {
          setSelectedCell(nextCell);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const nextCell = getNextCell(row, col, "down", false);
        if (nextCell) setSelectedCell(nextCell);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextCell = getNextCell(row, col, "down", true);
        if (nextCell) setSelectedCell(nextCell);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const nextCell = getNextCell(row, col, "across", false);
        if (nextCell) setSelectedCell(nextCell);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextCell = getNextCell(row, col, "across", true);
        if (nextCell) setSelectedCell(nextCell);
      }
    },
    [selectedCell, activeWord, isCompleted, grid, getNextCell, direction]
  );

  const getCorrectLetter = useCallback(
    (r: number, c: number) => {
      const cellInfo = layout[r]?.[c];
      if (!cellInfo || cellInfo.isBlank) return "";
      
      const word = cellInfo.words[0];
      const index = word.direction === "across" ? c - word.col : r - word.row;
      return word.answer[index];
    },
    [layout]
  );

  const checkAnswers = useCallback(() => {
    let allCorrect = true;
    let anyFilled = false;
    const newGrid = { ...grid };

    layout.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell.isBlank) {
          const correctLetter = getCorrectLetter(r, c);
          const currentVal = newGrid[`${r}-${c}`]?.value;
          
          if (currentVal) {
            anyFilled = true;
            const isCorrect = currentVal === correctLetter;
            newGrid[`${r}-${c}`] = { value: currentVal, isCorrect };
            if (!isCorrect) allCorrect = false;
          } else {
            allCorrect = false;
          }
        }
      });
    });

    setGrid(newGrid);

    if (allCorrect && anyFilled) {
      setIsCompleted(true);
      setTimerActive(false);
    }
  }, [grid, layout, getCorrectLetter]);

  const revealLetter = useCallback(() => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const correctLetter = getCorrectLetter(row, col);
    if (correctLetter) {
      setGrid((prev) => ({
        ...prev,
        [`${row}-${col}`]: { value: correctLetter, isCorrect: true },
      }));
    }
  }, [selectedCell, getCorrectLetter]);

  return {
    grid,
    layout,
    selectedCell,
    direction,
    activeWord,
    isCompleted,
    timeSeconds,
    handleCellClick,
    handleKeyDown,
    checkAnswers,
    revealLetter,
  };
}
