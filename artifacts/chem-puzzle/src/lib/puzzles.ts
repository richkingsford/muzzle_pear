export type PuzzleDifficulty = "Easy" | "Medium" | "Hard";

export interface Category {
  id: string;
  name: string;
  items: string[];
}

export interface Clue {
  id: string;
  text: string;
}

export interface Solution {
  [category: string]: string;
}

export interface PuzzleDef {
  id: string;
  title: string;
  difficulty: PuzzleDifficulty;
  categories: Category[];
  clues: Clue[];
  solution: Solution[];
}

export const puzzles: PuzzleDef[] = [
  {
    id: "puzzle-1",
    title: "The Chemistry Department",
    difficulty: "Easy",
    categories: [
      { id: "chemist", name: "Chemist", items: ["Dr. Ada", "Dr. Ben", "Dr. Clara", "Dr. Dion"] },
      { id: "element", name: "Favorite Element", items: ["Carbon", "Oxygen", "Nitrogen", "Sulfur"] },
      { id: "tool", name: "Lab Tool", items: ["Bunsen Burner", "Microscope", "Test Tube", "Magnifying Glass"] }
    ],
    clues: [
      { id: "c1", text: "The chemist who loves Carbon uses a Magnifying Glass." },
      { id: "c2", text: "Dr. Ben's favorite element is not Sulfur or Nitrogen." },
      { id: "c3", text: "Dr. Clara does not use a Bunsen Burner or Magnifying Glass." },
      { id: "c4", text: "The Microscope user's element is Sulfur." },
      { id: "c5", text: "Dr. Ada does not use a Test Tube." },
      { id: "c6", text: "Dr. Dion's favorite element is not Carbon or Oxygen." }
    ],
    solution: [
      { chemist: "Dr. Ada", element: "Carbon", tool: "Magnifying Glass" },
      { chemist: "Dr. Ben", element: "Oxygen", tool: "Bunsen Burner" },
      { chemist: "Dr. Clara", element: "Nitrogen", tool: "Test Tube" },
      { chemist: "Dr. Dion", element: "Sulfur", tool: "Microscope" }
    ]
  },
  {
    id: "puzzle-2",
    title: "Nobel Chemists",
    difficulty: "Medium",
    categories: [
      { id: "scientist", name: "Scientist", items: ["Marie", "Linus", "Otto", "Dorothy"] },
      { id: "discovery", name: "Discovery", items: ["Radioactivity", "Vitamin C Structure", "Protein Crystallography", "Fatty Acid Metabolism"] },
      { id: "year", name: "Year", items: ["1903", "1937", "1954", "1964"] }
    ],
    clues: [
      { id: "c1", text: "Marie's discovery predates all others." },
      { id: "c2", text: "Linus made his discovery in 1954." },
      { id: "c3", text: "The Protein Crystallography discovery was in 1964." },
      { id: "c4", text: "Otto's discovery was not in 1903 or 1964." },
      { id: "c5", text: "Dorothy did not win in 1937 or 1954." },
      { id: "c6", text: "Fatty Acid Metabolism was discovered before Vitamin C Structure." }
    ],
    solution: [
      { scientist: "Marie", discovery: "Radioactivity", year: "1903" },
      { scientist: "Otto", discovery: "Fatty Acid Metabolism", year: "1937" },
      { scientist: "Linus", discovery: "Vitamin C Structure", year: "1954" },
      { scientist: "Dorothy", discovery: "Protein Crystallography", year: "1964" }
    ]
  },
  {
    id: "puzzle-3",
    title: "Lab Compounds",
    difficulty: "Medium",
    categories: [
      { id: "student", name: "Student", items: ["Alex", "Blake", "Casey", "Drew"] },
      { id: "compound", name: "Compound Synthesized", items: ["Copper Sulfate", "Potassium Permanganate", "Ferric Chloride", "Cobalt Chloride"] },
      { id: "color", name: "Color Produced", items: ["Blue", "Purple", "Yellow", "Pink"] }
    ],
    clues: [
      { id: "c1", text: "Alex's compound produces a blue color." },
      { id: "c2", text: "Potassium Permanganate produces a purple color." },
      { id: "c3", text: "Casey did not synthesize Copper Sulfate or Cobalt Chloride." },
      { id: "c4", text: "Drew's compound produces a pink color." },
      { id: "c5", text: "Blake did not synthesize Ferric Chloride." },
      { id: "c6", text: "Ferric Chloride produces neither blue nor pink." }
    ],
    solution: [
      { student: "Alex", compound: "Copper Sulfate", color: "Blue" },
      { student: "Blake", compound: "Potassium Permanganate", color: "Purple" },
      { student: "Casey", compound: "Ferric Chloride", color: "Yellow" },
      { student: "Drew", compound: "Cobalt Chloride", color: "Pink" }
    ]
  }
];
