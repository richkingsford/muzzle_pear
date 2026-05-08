import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { PuzzleDef } from "../lib/puzzles";
import { getCellId, CellState } from "../hooks/useLogicGrid";
import { cn } from "@/lib/utils";

interface LogicGridProps {
  puzzle: PuzzleDef;
  gridState: Record<string, CellState>;
  onCellClick: (item1: string, item2: string) => void;
}

export function LogicGrid({ puzzle, gridState, onCellClick }: LogicGridProps) {
  // A standard logic grid layout for 3 categories:
  // Let categories be Cat0, Cat1, Cat2
  // Top headers: Cat1, Cat2
  // Left headers: Cat0, Cat1
  
  if (puzzle.categories.length !== 3) {
    return <div>Only 3 categories supported in this visualizer.</div>;
  }

  const [cat0, cat1, cat2] = puzzle.categories;
  const cellSize = 32;

  const renderCell = (itemRow: string, itemCol: string, borderClasses: string) => {
    const id = getCellId(itemRow, itemCol);
    const state = gridState[id] || "empty";

    return (
      <div
        key={`${itemRow}-${itemCol}`}
        data-testid={`cell-${id}`}
        className={cn(
          "w-8 h-8 flex items-center justify-center border-b border-r border-border cursor-pointer hover:bg-muted/50 select-none transition-colors",
          borderClasses
        )}
        onClick={() => onCellClick(itemRow, itemCol)}
      >
        {state === "yes" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-primary"
          >
            <Check size={20} strokeWidth={3} />
          </motion.div>
        )}
        {state === "no" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-destructive/70"
          >
            <X size={20} strokeWidth={2.5} />
          </motion.div>
        )}
      </div>
    );
  };

  const renderSubGrid = (rowCatItems: string[], colCatItems: string[], isLastCol: boolean, isLastRow: boolean) => {
    return (
      <div className={cn(
        "flex flex-col border-border border-l border-t",
        isLastCol && "border-r-2 border-border/80",
        isLastRow && "border-b-2 border-border/80",
      )}>
        {rowCatItems.map((rItem, rIdx) => (
          <div key={rItem} className="flex">
            {colCatItems.map((cItem, cIdx) => {
              const borders = cn(
                rIdx === rowCatItems.length - 1 && "border-b-0",
                cIdx === colCatItems.length - 1 && "border-r-0"
              );
              return renderCell(rItem, cItem, borders);
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex p-4 overflow-auto">
      <div className="flex flex-col">
        {/* Top Headers */}
        <div className="flex">
          <div className="w-32 h-32" /> {/* Empty top-left corner */}
          
          {/* Top headers: Cat1 */}
          <div className="flex flex-col items-center">
            <div className="h-8 font-semibold text-xs tracking-wider text-muted-foreground uppercase flex items-center justify-center w-full">{cat1.name}</div>
            <div className="flex h-24">
              {cat1.items.map((item, idx) => (
                <div key={item} className="w-8 relative flex justify-center items-end pb-2">
                  <span className="transform -rotate-90 origin-bottom-left absolute left-1/2 bottom-2 text-sm whitespace-nowrap text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Top headers: Cat2 */}
          <div className="flex flex-col items-center ml-2">
            <div className="h-8 font-semibold text-xs tracking-wider text-muted-foreground uppercase flex items-center justify-center w-full">{cat2.name}</div>
            <div className="flex h-24">
              {cat2.items.map((item, idx) => (
                <div key={item} className="w-8 relative flex justify-center items-end pb-2">
                  <span className="transform -rotate-90 origin-bottom-left absolute left-1/2 bottom-2 text-sm whitespace-nowrap text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 1: Cat0 */}
        <div className="flex mt-2">
          {/* Left headers: Cat0 */}
          <div className="w-32 flex flex-col justify-between items-end pr-4">
            <div className="flex flex-col w-full h-full border-r border-border/80">
              {cat0.items.map(item => (
                <div key={item} className="h-8 flex items-center justify-end text-sm pr-2 text-foreground font-medium">{item}</div>
              ))}
            </div>
          </div>
          
          {/* Grid Cat0 x Cat1 */}
          {renderSubGrid(cat0.items, cat1.items, false, false)}
          
          {/* Spacer */}
          <div className="w-2" />

          {/* Grid Cat0 x Cat2 */}
          {renderSubGrid(cat0.items, cat2.items, true, false)}
        </div>

        {/* Row 2: Cat1 (only with Cat2) */}
        <div className="flex mt-2">
          {/* Left headers: Cat1 */}
          <div className="w-32 flex flex-col justify-between items-end pr-4">
            <div className="flex flex-col w-full h-full border-r border-border/80">
              {cat1.items.map(item => (
                <div key={item} className="h-8 flex items-center justify-end text-sm pr-2 text-foreground font-medium">{item}</div>
              ))}
            </div>
          </div>
          
          {/* Empty Space where Cat1 x Cat1 would be */}
          <div style={{ width: cat1.items.length * cellSize }} />
          
          {/* Spacer */}
          <div className="w-2" />

          {/* Grid Cat1 x Cat2 */}
          {renderSubGrid(cat1.items, cat2.items, true, true)}
        </div>
        
        {/* Left header names side-labels */}
        <div className="absolute left-2 top-[12rem] h-[8rem] w-6 flex items-center justify-center">
           <span className="transform -rotate-90 font-semibold text-xs tracking-wider text-muted-foreground uppercase whitespace-nowrap">{cat0.name}</span>
        </div>
        <div className="absolute left-2 top-[20.5rem] h-[8rem] w-6 flex items-center justify-center">
           <span className="transform -rotate-90 font-semibold text-xs tracking-wider text-muted-foreground uppercase whitespace-nowrap">{cat1.name}</span>
        </div>
      </div>
    </div>
  );
}
