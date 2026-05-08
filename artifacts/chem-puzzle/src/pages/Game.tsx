import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, CheckCircle, RefreshCcw, Trophy, Lightbulb } from "lucide-react";
import { puzzles } from "../lib/puzzles";
import { useLogicGrid } from "../hooks/useLogicGrid";
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
    crossedClues,
    toggleClue,
    reset,
    checkSolution,
    reveal
  } = useLogicGrid(puzzle);

  const [isSolved, setIsSolved] = useState(false);

  // Reset completion state when puzzle changes or resets
  useEffect(() => {
    setIsSolved(false);
  }, [puzzle, grid]);

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

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden font-sans">
      {/* Decorative background elements */}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col xl:flex-row items-center xl:items-start p-4 sm:p-8 gap-8 z-10 overflow-y-auto">
        {/* Left: Logic Grid and Controls */}
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
              variant="ghost"
              size="lg"
              onClick={handleReset}
              className="gap-2 text-muted-foreground hover:text-foreground flex-1 sm:flex-none"
            >
              <RefreshCcw size={18} />
              Reset
            </Button>
          </div>
        </div>

        {/* Right: Clues */}
        <div className="w-full xl:w-[400px] shrink-0">
          <CluesPanel puzzle={puzzle} crossedClues={crossedClues} onToggleClue={toggleClue} />
        </div>
      </main>
    </div>
  );
}
