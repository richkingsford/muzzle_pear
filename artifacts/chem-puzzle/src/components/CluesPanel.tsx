import React from "react";
import { PuzzleDef } from "../lib/puzzles";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CluesPanelProps {
  puzzle: PuzzleDef;
  crossedClues: Record<string, boolean>;
  onToggleClue: (clueId: string) => void;
}

export function CluesPanel({ puzzle, crossedClues, onToggleClue }: CluesPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-serif font-semibold text-primary border-b border-border pb-2">Observations</h3>
      <div className="flex flex-col gap-3">
        {puzzle.clues.map((clue, idx) => {
          const isCrossed = crossedClues[clue.id];
          return (
            <motion.div 
              key={clue.id}
              layout
              className={cn(
                "flex items-start gap-3 p-3 rounded-md transition-colors cursor-pointer group",
                isCrossed ? "bg-muted/30 opacity-50 grayscale" : "bg-card hover:bg-muted/50 border border-border"
              )}
              onClick={() => onToggleClue(clue.id)}
              data-testid={`clue-${clue.id}`}
            >
              <div className="mt-0.5">
                <Checkbox 
                  checked={isCrossed} 
                  onCheckedChange={() => onToggleClue(clue.id)}
                  onClick={e => e.stopPropagation()}
                />
              </div>
              <div className={cn(
                "text-sm leading-relaxed",
                isCrossed ? "line-through" : ""
              )}>
                <span className="font-semibold text-primary/70 mr-2">{idx + 1}.</span>
                {clue.text}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
