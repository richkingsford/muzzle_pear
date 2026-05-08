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

const CELL = 32;

function VerticalLabel({ text, className }: { text: string; className?: string }) {
  return (
    <span
      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      className={cn("text-xs font-semibold tracking-wider uppercase text-muted-foreground whitespace-nowrap", className)}
    >
      {text}
    </span>
  );
}

export function LogicGrid({ puzzle, gridState, onCellClick }: LogicGridProps) {
  if (puzzle.categories.length !== 3) {
    return <div>Only 3 categories supported.</div>;
  }

  const [cat0, cat1, cat2] = puzzle.categories;

  const renderCell = (itemRow: string, itemCol: string, borderClasses: string) => {
    const id = getCellId(itemRow, itemCol);
    const state = gridState[id] || "empty";

    return (
      <div
        key={`${itemRow}-${itemCol}`}
        data-testid={`cell-${id}`}
        style={{ width: CELL, height: CELL }}
        className={cn(
          "flex items-center justify-center border-b border-r border-border cursor-pointer hover:bg-muted/50 select-none transition-colors",
          borderClasses
        )}
        onClick={() => onCellClick(itemRow, itemCol)}
      >
        {state === "yes" && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-primary">
            <Check size={18} strokeWidth={3} />
          </motion.div>
        )}
        {state === "no" && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-destructive/70">
            <X size={18} strokeWidth={2.5} />
          </motion.div>
        )}
      </div>
    );
  };

  const renderSubGrid = (rowItems: string[], colItems: string[]) => (
    <div className="border-l border-t border-border">
      {rowItems.map((rItem, rIdx) => (
        <div key={rItem} className="flex">
          {colItems.map((cItem, cIdx) => renderCell(rItem, cItem, cn(
            rIdx === rowItems.length - 1 && "border-b-0",
            cIdx === colItems.length - 1 && "border-r-0"
          )))}
        </div>
      ))}
    </div>
  );

  const colHeaderHeight = 96;
  const catLabelHeight = 24;

  return (
    <div className="flex p-4 overflow-auto">
      <div className="flex flex-col">

        {/* ── Top header row ── */}
        <div className="flex">
          {/* Corner: matches the left column width */}
          <div style={{ width: 128, height: colHeaderHeight + catLabelHeight }} />

          {/* Cat1 column headers */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-center font-semibold text-xs tracking-wider uppercase text-muted-foreground"
              style={{ width: cat1.items.length * CELL, height: catLabelHeight }}
            >
              {cat1.name}
            </div>
            <div className="flex" style={{ height: colHeaderHeight }}>
              {cat1.items.map(item => (
                <div
                  key={item}
                  style={{ width: CELL, height: colHeaderHeight }}
                  className="flex items-end justify-center pb-2"
                >
                  <VerticalLabel text={item} className="text-foreground font-medium" />
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: 8 }} />

          {/* Cat2 column headers */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-center font-semibold text-xs tracking-wider uppercase text-muted-foreground"
              style={{ width: cat2.items.length * CELL, height: catLabelHeight }}
            >
              {cat2.name}
            </div>
            <div className="flex" style={{ height: colHeaderHeight }}>
              {cat2.items.map(item => (
                <div
                  key={item}
                  style={{ width: CELL, height: colHeaderHeight }}
                  className="flex items-end justify-center pb-2"
                >
                  <VerticalLabel text={item} className="text-foreground font-medium" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Grid row 1: Cat0 rows ── */}
        <div className="flex">
          {/* Left label column: category name + item names */}
          <div style={{ width: 128 }} className="flex border-r border-border/60 pr-1">
            {/* Category name label */}
            <div
              style={{ width: 20 }}
              className="flex items-center justify-center"
            >
              <VerticalLabel text={cat0.name} />
            </div>
            {/* Item names */}
            <div className="flex flex-col flex-1">
              {cat0.items.map(item => (
                <div
                  key={item}
                  style={{ height: CELL }}
                  className="flex items-center justify-end pr-2 text-sm font-medium text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {renderSubGrid(cat0.items, cat1.items)}
          <div style={{ width: 8 }} />
          {renderSubGrid(cat0.items, cat2.items)}
        </div>

        <div style={{ height: 8 }} />

        {/* ── Grid row 2: Cat1 rows (paired with Cat2 only) ── */}
        <div className="flex">
          {/* Left label column: category name + item names */}
          <div style={{ width: 128 }} className="flex border-r border-border/60 pr-1">
            <div style={{ width: 20 }} className="flex items-center justify-center">
              <VerticalLabel text={cat1.name} />
            </div>
            <div className="flex flex-col flex-1">
              {cat1.items.map(item => (
                <div
                  key={item}
                  style={{ height: CELL }}
                  className="flex items-center justify-end pr-2 text-sm font-medium text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Blank space under Cat1 column headers (no self-pairing) */}
          <div style={{ width: cat1.items.length * CELL }} />
          <div style={{ width: 8 }} />

          {renderSubGrid(cat1.items, cat2.items)}
        </div>

      </div>
    </div>
  );
}
