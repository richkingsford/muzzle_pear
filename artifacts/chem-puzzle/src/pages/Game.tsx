import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, CheckCircle, RefreshCcw, Trophy, Lightbulb, Layers, X, Wand2, Magnet } from "lucide-react";
import { puzzles } from "../lib/puzzles";
import { useLogicGrid, getCellId } from "../hooks/useLogicGrid";
import { LogicGrid } from "../components/LogicGrid";
import { CluesPanel } from "../components/CluesPanel";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Game() {
  const [currentPuzzleId, setCurrentPuzzleId] = useState(puzzles[0].id);
  const puzzle = puzzles.find(p => p.id === currentPuzzleId) || puzzles[0];
  const { toast } = useToast();
  
  const {
    grid,
    cycleCell,
    markYesInSubgrid,
    autoFill,
    crossedClues,
    toggleClue,
    reset,
    checkSolution,
    reveal
  } = useLogicGrid(puzzle);

  const [isSolved, setIsSolved] = useState(false);
  const [showHintOverlay, setShowHintOverlay] = useState(false);
  const [showRuleBox, setShowRuleBox] = useState(false);
  const [showForcedMatchOverlay, setShowForcedMatchOverlay] = useState(false);
  const [showForcedMatchRuleBox, setShowForcedMatchRuleBox] = useState(false);

  useEffect(() => {
    setIsSolved(false);
  }, [puzzle, grid]);

  // Hint 1 — Mutual Exclusivity: empty cells in the same sub-grid row/col as a confirmed YES
  const hintCells = useMemo<Set<string>>(() => {
    if (!showHintOverlay) return new Set();
    const result = new Set<string>();
    for (let i = 0; i < puzzle.categories.length; i++) {
      for (let j = i + 1; j < puzzle.categories.length; j++) {
        const catA = puzzle.categories[i];
        const catB = puzzle.categories[j];
        catA.items.forEach(itemA => {
          catB.items.forEach(itemB => {
            if (grid[getCellId(itemA, itemB)] === "yes") {
              catB.items.forEach(otherB => {
                if (otherB !== itemB) {
                  const id = getCellId(itemA, otherB);
                  if (!grid[id] || grid[id] === "empty") result.add(id);
                }
              });
              catA.items.forEach(otherA => {
                if (otherA !== itemA) {
                  const id = getCellId(otherA, itemB);
                  if (!grid[id] || grid[id] === "empty") result.add(id);
                }
              });
            }
          });
        });
      }
    }
    return result;
  }, [showHintOverlay, grid, puzzle]);

  // Hint 2 — Forced Match: the last empty cell in a row or column (all others are NO, no YES yet)
  // That cell MUST be the correct match — highlight it in amber so the player can confirm it.
  const forcedMatchCells = useMemo<Set<string>>(() => {
    if (!showForcedMatchOverlay) return new Set();
    const result = new Set<string>();
    for (let i = 0; i < puzzle.categories.length; i++) {
      for (let j = i + 1; j < puzzle.categories.length; j++) {
        const catA = puzzle.categories[i];
        const catB = puzzle.categories[j];
        // Check each row (fixed catA item, sweep catB)
        catA.items.forEach(itemA => {
          const hasYes = catB.items.some(itemB => grid[getCellId(itemA, itemB)] === "yes");
          if (hasYes) return;
          const empties = catB.items.filter(itemB => (grid[getCellId(itemA, itemB)] || "empty") === "empty");
          if (empties.length === 1) result.add(getCellId(itemA, empties[0]));
        });
        // Check each column (fixed catB item, sweep catA)
        catB.items.forEach(itemB => {
          const hasYes = catA.items.some(itemA => grid[getCellId(itemA, itemB)] === "yes");
          if (hasYes) return;
          const empties = catA.items.filter(itemA => (grid[getCellId(itemA, itemB)] || "empty") === "empty");
          if (empties.length === 1) result.add(getCellId(empties[0], itemB));
        });
      }
    }
    return result;
  }, [showForcedMatchOverlay, grid, puzzle]);

  const handleCheck = () => {
    const correct = checkSolution();
    if (correct) {
      setIsSolved(true);
    } else {
      toast({
        title: "Not quite right",
        description: "The current grid does not match the solution or is incomplete.",
        variant: "destructive"
      });
    }
  };

  const handleReveal = () => {
    reveal();
    setTimeout(() => setIsSolved(true), 500);
  };

  const handleReset = () => {
    reset();
    setIsSolved(false);
  };

  const handleToggleHint = () => {
    const next = !showHintOverlay;
    setShowHintOverlay(next);
    if (next) setShowRuleBox(true);
  };

  const handleToggleForcedMatch = () => {
    const next = !showForcedMatchOverlay;
    setShowForcedMatchOverlay(next);
    if (next) setShowForcedMatchRuleBox(true);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 bg-white/50 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md -rotate-3">
            <Beaker size={24} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight">ChemGrid</h1>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Badge variant={puzzle.difficulty === "Easy" ? "secondary" : puzzle.difficulty === "Medium" ? "default" : "destructive"} className="px-3 py-1 shadow-sm">
            {puzzle.difficulty}
          </Badge>
          <Select value={currentPuzzleId} onValueChange={setCurrentPuzzleId}>
            <SelectTrigger className="w-full sm:w-[240px] bg-card">
              <SelectValue placeholder="Select a puzzle" />
            </SelectTrigger>
            <SelectContent>
              {puzzles.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Mutual Exclusivity rule box */}
      <AnimatePresence>
        {showRuleBox && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowRuleBox(false)}
            />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
              <button
                onClick={() => setShowRuleBox(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-close-rule-box"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
                </div>
                <h2 className="text-lg font-bold font-serif text-foreground">The Rule of Mutual Exclusivity</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                In a logic puzzle, each person can have only one item in each category. So once you confirm a match, you can eliminate all the other options in that row or column.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2 items-start">
                  <span className="mt-1 w-2 h-2 rounded-full bg-green-500 opacity-70 shrink-0" />
                  <span className="text-foreground">If a row already has its correct match, every other empty cell in that column gets an X.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="mt-1 w-2 h-2 rounded-full bg-green-500 opacity-70 shrink-0" />
                  <span className="text-foreground">If a column already has its correct match, every other empty cell in that row gets an X.</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground italic">
                Green dots mark every cell where this rule applies right now. Double-click any dot to fill the X automatically.
              </p>
              <Button
                className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setShowRuleBox(false)}
                data-testid="button-got-it"
              >
                Got it
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forced Match rule box */}
      <AnimatePresence>
        {showForcedMatchRuleBox && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowForcedMatchRuleBox(false)}
            />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
              <button
                onClick={() => setShowForcedMatchRuleBox(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-close-forced-match-box"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400 opacity-70" />
                </div>
                <h2 className="text-lg font-bold font-serif text-foreground">The Rule of Forced Match</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                If every option in a row or column has been crossed out except one, that last empty cell <em>must</em> be the correct match — there's nowhere else for it to go.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2 items-start">
                  <span className="mt-1 w-2 h-2 rounded-full bg-amber-400 opacity-70 shrink-0" />
                  <span className="text-foreground">
                    <strong>Example:</strong> If A is matched with X (A–X = ✓), then B cannot also be X (B–X = ✗). In a two-item group, B's only remaining option is Y — so B–Y must be ✓.
                  </span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="mt-1 w-2 h-2 rounded-full bg-amber-400 opacity-70 shrink-0" />
                  <span className="text-foreground">Works for any size group: once all but one option are eliminated, the survivor is the answer.</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground italic">
                Amber dots mark every cell that can be confirmed right now using this rule. Double-click any dot to mark it as a match.
              </p>
              <Button
                className="mt-5 w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => setShowForcedMatchRuleBox(false)}
                data-testid="button-forced-match-got-it"
              >
                Got it
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col xl:flex-row items-center xl:items-start p-4 sm:p-8 gap-8 z-10 overflow-y-auto">
        <div className="flex flex-col items-center xl:items-start gap-8 flex-1 max-w-4xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {isSolved && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-xl flex items-center gap-4 border border-primary/20 w-full"
              >
                <div className="bg-white/20 p-2 rounded-full">
                  <Trophy size={32} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif">Brilliant Deduction!</h2>
                  <p className="text-primary-foreground/90 font-medium">You have successfully solved the logic puzzle.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-card p-2 sm:p-6 rounded-xl shadow-sm border border-border overflow-auto max-w-full">
            <LogicGrid 
              puzzle={puzzle} 
              gridState={grid} 
              onCellClick={cycleCell}
              onCellDoubleClick={markYesInSubgrid}
              hintCells={hintCells}
              forcedMatchCells={forcedMatchCells}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto bg-card p-4 rounded-xl shadow-sm border border-border">
            <Button 
              size="lg"
              onClick={handleCheck}
              disabled={isSolved}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md flex-1 sm:flex-none"
              data-testid="button-check"
            >
              <CheckCircle size={18} />
              Check Solution
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleReveal}
              disabled={isSolved}
              className="gap-2 bg-card hover:bg-muted text-foreground flex-1 sm:flex-none"
              data-testid="button-reveal"
            >
              <Lightbulb size={18} className="text-accent" />
              Reveal
            </Button>
            <Button
              variant={showHintOverlay ? "default" : "outline"}
              size="lg"
              onClick={handleToggleHint}
              className={`gap-2 flex-1 sm:flex-none ${showHintOverlay ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : "bg-card hover:bg-muted text-foreground"}`}
              data-testid="button-hint-overlay"
            >
              <Layers size={18} />
              {showHintOverlay ? "Hide Mutual" : "Mutual Exclusivity"}
            </Button>
            <Button
              variant={showForcedMatchOverlay ? "default" : "outline"}
              size="lg"
              onClick={handleToggleForcedMatch}
              className={`gap-2 flex-1 sm:flex-none ${showForcedMatchOverlay ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500" : "bg-card hover:bg-muted text-foreground"}`}
              data-testid="button-forced-match-overlay"
            >
              <Magnet size={18} />
              {showForcedMatchOverlay ? "Hide Forced" : "Forced Match"}
            </Button>
            <Button 
              variant="ghost"
              size="lg"
              onClick={handleReset}
              className="gap-2 text-muted-foreground hover:text-foreground flex-1 sm:flex-none"
              data-testid="button-reset"
            >
              <RefreshCcw size={18} />
              Reset
            </Button>
          </div>
        </div>

        {/* Right: Clues + Auto Fill */}
        <div className="w-full xl:w-[400px] shrink-0 flex flex-col gap-4">
          <CluesPanel puzzle={puzzle} crossedClues={crossedClues} onToggleClue={toggleClue} />
          <Button
            variant="outline"
            size="lg"
            onClick={autoFill}
            disabled={isSolved}
            className="w-full gap-2 bg-card hover:bg-muted text-foreground border-border"
            data-testid="button-autofill"
          >
            <Wand2 size={18} />
            Auto Fill
          </Button>
        </div>
      </main>
    </div>
  );
}
