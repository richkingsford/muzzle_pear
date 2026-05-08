import { memo } from "react";
import { motion } from "framer-motion";
import { GridState, CellInfo, Word, Direction } from "../hooks/use-crossword";
import { cn } from "@/lib/utils";

interface CrosswordGridProps {
  layout: CellInfo[][];
  gridState: GridState;
  selectedCell: { row: number; col: number } | null;
  activeWord: Word | null;
  onCellClick: (row: number, col: number) => void;
}

export const CrosswordGrid = memo(({
  layout,
  gridState,
  selectedCell,
  activeWord,
  onCellClick,
}: CrosswordGridProps) => {
  return (
    <div className="inline-block p-4 bg-white rounded-xl shadow-lg border border-slate-200">
      <div 
        className="grid gap-[2px] bg-slate-200 p-[2px] rounded-lg"
        style={{ gridTemplateRows: `repeat(${layout.length}, minmax(0, 1fr))` }}
      >
        {layout.map((row, r) => (
          <div key={`row-${r}`} className="flex gap-[2px]">
            {row.map((cell, c) => {
              if (cell.isBlank) {
                return (
                  <div 
                    key={`blank-${r}-${c}`} 
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-transparent"
                  />
                );
              }

              const state = gridState[`${r}-${c}`];
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;
              const isActiveWord = activeWord && cell.words.some(w => w.id === activeWord.id);
              
              // Determine if this cell is the start of a word to show its number
              let wordNumber: number | null = null;
              cell.words.forEach(w => {
                if (w.row === r && w.col === c) {
                  // Quick hack to assign a visual number: just use row+col to keep it simple, 
                  // or rely on a proper numbering if we had one. Let's compute a stable ID based on position.
                  wordNumber = (r * 10) + c; 
                }
              });

              return (
                <div
                  key={`cell-${r}-${c}`}
                  data-testid={`cell-${r}-${c}`}
                  onClick={() => onCellClick(r, c)}
                  className={cn(
                    "relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-sans font-bold text-lg sm:text-xl cursor-pointer transition-colors duration-150 select-none bg-white",
                    isActiveWord && !isSelected && "bg-primary/10",
                    isSelected && "bg-primary/30 ring-2 ring-primary ring-inset z-10",
                    state?.isCorrect === true && "text-green-600 bg-green-50",
                    state?.isCorrect === false && "text-destructive bg-destructive/10"
                  )}
                >
                  {wordNumber !== null && (
                    <span className="absolute top-0.5 left-1 text-[10px] sm:text-xs font-normal text-slate-500 leading-none">
                      {wordNumber}
                    </span>
                  )}
                  {state?.value && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {state.value}
                    </motion.span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});

CrosswordGrid.displayName = "CrosswordGrid";
