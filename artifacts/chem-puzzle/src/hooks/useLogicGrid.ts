import { useState, useCallback, useMemo } from "react";
import { PuzzleDef } from "../lib/puzzles";

export type CellState = "empty" | "yes" | "no";

// We identify a cell by a pair of items, e.g., "Dr. Ada" and "Carbon".
// We sort the item names alphabetically so order doesn't matter.
export const getCellId = (item1: string, item2: string) => {
  return [item1, item2].sort().join("::");
};

export function useLogicGrid(puzzle: PuzzleDef) {
  const [grid, setGrid] = useState<Record<string, CellState>>({});
  const [crossedClues, setCrossedClues] = useState<Record<string, boolean>>({});

  const toggleClue = useCallback((clueId: string) => {
    setCrossedClues((prev) => ({ ...prev, [clueId]: !prev[clueId] }));
  }, []);

  const reset = useCallback(() => {
    setGrid({});
    setCrossedClues({});
  }, []);

  const updateCell = useCallback((item1: string, item2: string, newState: CellState) => {
    setGrid((prev) => {
      const next = { ...prev };
      
      const setCellState = (i1: string, i2: string, state: CellState) => {
        const id = getCellId(i1, i2);
        if (next[id] !== state) {
          next[id] = state;
          return true;
        }
        return false;
      };

      const applyLogic = (i1: string, i2: string, state: CellState) => {
        if (!setCellState(i1, i2, state)) return;

        const cat1 = puzzle.categories.find(c => c.items.includes(i1));
        const cat2 = puzzle.categories.find(c => c.items.includes(i2));
        if (!cat1 || !cat2) return;

        if (state === "yes") {
          // If YES, all other items in same categories must be NO
          cat1.items.forEach(other => {
            if (other !== i1) applyLogic(other, i2, "no");
          });
          cat2.items.forEach(other => {
            if (other !== i2) applyLogic(i1, other, "no");
          });
          
          // Transitive logic: if A=B and A=C, then B=C.
          puzzle.categories.forEach(cat => {
            if (cat === cat1 || cat === cat2) return;
            cat.items.forEach(item3 => {
              const id13 = getCellId(i1, item3);
              const id23 = getCellId(i2, item3);
              if (next[id13] === "yes") applyLogic(i2, item3, "yes");
              if (next[id23] === "yes") applyLogic(i1, item3, "yes");
              if (next[id13] === "no") applyLogic(i2, item3, "no");
              if (next[id23] === "no") applyLogic(i1, item3, "no");
            });
          });
        } else if (state === "no") {
          // If NO, and it's the last remaining empty in its row/col, auto-mark the remaining one YES
          
          // Check row (fix i1, iterate i2's category)
          const rowSiblings = cat2.items.map(item => ({ item, state: next[getCellId(i1, item)] || "empty" }));
          const emptyRowSiblings = rowSiblings.filter(s => s.state === "empty");
          const yesRowSiblings = rowSiblings.filter(s => s.state === "yes");
          if (yesRowSiblings.length === 0 && emptyRowSiblings.length === 1) {
            applyLogic(i1, emptyRowSiblings[0].item, "yes");
          }

          // Check col (fix i2, iterate i1's category)
          const colSiblings = cat1.items.map(item => ({ item, state: next[getCellId(item, i2)] || "empty" }));
          const emptyColSiblings = colSiblings.filter(s => s.state === "empty");
          const yesColSiblings = colSiblings.filter(s => s.state === "yes");
          if (yesColSiblings.length === 0 && emptyColSiblings.length === 1) {
            applyLogic(emptyColSiblings[0].item, i2, "yes");
          }
        }
      };

      applyLogic(item1, item2, newState);
      return next;
    });
  }, [puzzle]);

  // Single click: empty → no → yes → empty, no auto-propagation
  const cycleCell = useCallback((item1: string, item2: string) => {
    const id = getCellId(item1, item2);
    setGrid(prev => {
      const current = prev[id] || "empty";
      const next = { ...prev };
      if (current === "empty") {
        next[id] = "no";
      } else if (current === "no") {
        next[id] = "yes";
      } else {
        delete next[id];
      }
      return next;
    });
  }, []);

  // Double-click: mark YES and auto-fill NOs within the same sub-grid only
  const markYesInSubgrid = useCallback((item1: string, item2: string) => {
    const cat1 = puzzle.categories.find(c => c.items.includes(item1));
    const cat2 = puzzle.categories.find(c => c.items.includes(item2));
    if (!cat1 || !cat2) return;

    setGrid(prev => {
      const next = { ...prev };
      // Mark this cell YES
      next[getCellId(item1, item2)] = "yes";
      // X out the rest of the row within this sub-grid (same item1, other item2s)
      cat2.items.forEach(other => {
        if (other !== item2) next[getCellId(item1, other)] = "no";
      });
      // X out the rest of the column within this sub-grid (same item2, other item1s)
      cat1.items.forEach(other => {
        if (other !== item1) next[getCellId(other, item2)] = "no";
      });
      return next;
    });
  }, [puzzle]);

  // Cheat-code: stamp the full solution onto the grid immediately.
  const autoFill = useCallback(() => {
    const next: Record<string, CellState> = {};

    // Build the set of all correct cross-category pairs from the solution
    const correctPairs = new Set<string>();
    puzzle.solution.forEach(sol => {
      const items = Object.values(sol);
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          correctPairs.add(getCellId(items[i], items[j]));
        }
      }
    });

    // Mark every cell in every sub-grid YES or NO
    for (let i = 0; i < puzzle.categories.length; i++) {
      for (let j = i + 1; j < puzzle.categories.length; j++) {
        puzzle.categories[i].items.forEach(itemA => {
          puzzle.categories[j].items.forEach(itemB => {
            const id = getCellId(itemA, itemB);
            next[id] = correctPairs.has(id) ? "yes" : "no";
          });
        });
      }
    }

    setGrid(next);
  }, [puzzle]);

  const checkSolution = useCallback(() => {
    let allCorrect = true;
    let anyEmpty = false;

    // Check every pair in the solution
    puzzle.solution.forEach(sol => {
      const items = Object.values(sol);
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const item1 = items[i];
          const item2 = items[j];
          const id = getCellId(item1, item2);
          if (grid[id] !== "yes") {
            allCorrect = false;
          }
        }
      }
    });

    // Are there any "yes" in the grid that shouldn't be?
    // We can just rely on the fact that if all solution pairs are "yes", and logic holds, it's correct.
    // But let's verify nothing is incorrectly marked "yes".
    Object.entries(grid).forEach(([key, val]) => {
      if (val === "yes") {
        const [item1, item2] = key.split("::");
        let validPair = false;
        puzzle.solution.forEach(sol => {
          const items = Object.values(sol);
          if (items.includes(item1) && items.includes(item2)) {
            validPair = true;
          }
        });
        if (!validPair) allCorrect = false;
      }
    });

    return allCorrect;
  }, [grid, puzzle]);

  const reveal = useCallback(() => {
    reset();
    setTimeout(() => {
      puzzle.solution.forEach(sol => {
        const items = Object.values(sol);
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            updateCell(items[i], items[j], "yes");
          }
        }
      });
    }, 50);
  }, [puzzle, reset, updateCell]);

  return {
    grid,
    cycleCell,
    markYesInSubgrid,
    autoFill,
    crossedClues,
    toggleClue,
    reset,
    checkSolution,
    reveal
  };
}
