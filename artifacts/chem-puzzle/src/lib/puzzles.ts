export type PuzzleDifficulty = "Easy" | "Medium" | "Hard";

export interface Category {
  id: string;
  name: string;
  items: string[];
}

export interface ClueFact {
  item1: string;
  item2: string;
  state: "yes" | "no";
}

export interface Clue {
  id: string;
  text: string;
  facts: ClueFact[];
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
      {
        id: "c1",
        text: "The chemist who loves Carbon uses a Magnifying Glass.",
        facts: [
          { item1: "Carbon", item2: "Magnifying Glass", state: "yes" }
        ]
      },
      {
        id: "c2",
        text: "Dr. Ben's favorite element is not Sulfur or Nitrogen.",
        facts: [
          { item1: "Dr. Ben", item2: "Sulfur", state: "no" },
          { item1: "Dr. Ben", item2: "Nitrogen", state: "no" }
        ]
      },
      {
        id: "c3",
        text: "Dr. Clara does not use a Bunsen Burner or Magnifying Glass.",
        facts: [
          { item1: "Dr. Clara", item2: "Bunsen Burner", state: "no" },
          { item1: "Dr. Clara", item2: "Magnifying Glass", state: "no" }
        ]
      },
      {
        id: "c4",
        text: "The Microscope user's element is Sulfur.",
        facts: [
          { item1: "Microscope", item2: "Sulfur", state: "yes" }
        ]
      },
      {
        id: "c5",
        text: "Dr. Ada does not use a Test Tube.",
        facts: [
          { item1: "Dr. Ada", item2: "Test Tube", state: "no" }
        ]
      },
      {
        id: "c6",
        text: "Dr. Dion's favorite element is not Carbon or Oxygen.",
        facts: [
          { item1: "Dr. Dion", item2: "Carbon", state: "no" },
          { item1: "Dr. Dion", item2: "Oxygen", state: "no" }
        ]
      }
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
      {
        id: "c1",
        text: "Marie's discovery predates all others.",
        facts: [
          { item1: "Marie", item2: "1937", state: "no" },
          { item1: "Marie", item2: "1954", state: "no" },
          { item1: "Marie", item2: "1964", state: "no" }
        ]
      },
      {
        id: "c2",
        text: "Linus made his discovery in 1954.",
        facts: [
          { item1: "Linus", item2: "1954", state: "yes" }
        ]
      },
      {
        id: "c3",
        text: "The Protein Crystallography discovery was in 1964.",
        facts: [
          { item1: "Protein Crystallography", item2: "1964", state: "yes" }
        ]
      },
      {
        id: "c4",
        text: "Otto's discovery was not in 1903 or 1964.",
        facts: [
          { item1: "Otto", item2: "1903", state: "no" },
          { item1: "Otto", item2: "1964", state: "no" }
        ]
      },
      {
        id: "c5",
        text: "Dorothy did not win in 1937 or 1954.",
        facts: [
          { item1: "Dorothy", item2: "1937", state: "no" },
          { item1: "Dorothy", item2: "1954", state: "no" }
        ]
      },
      {
        id: "c6",
        text: "Fatty Acid Metabolism was discovered before Vitamin C Structure.",
        facts: [
          { item1: "Fatty Acid Metabolism", item2: "1954", state: "no" },
          { item1: "Fatty Acid Metabolism", item2: "1964", state: "no" },
          { item1: "Vitamin C Structure", item2: "1903", state: "no" },
          { item1: "Vitamin C Structure", item2: "1937", state: "no" }
        ]
      }
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
      {
        id: "c1",
        text: "Alex's compound produces a blue color.",
        facts: [
          { item1: "Alex", item2: "Blue", state: "yes" }
        ]
      },
      {
        id: "c2",
        text: "Potassium Permanganate produces a purple color.",
        facts: [
          { item1: "Potassium Permanganate", item2: "Purple", state: "yes" }
        ]
      },
      {
        id: "c3",
        text: "Casey did not synthesize Copper Sulfate or Cobalt Chloride.",
        facts: [
          { item1: "Casey", item2: "Copper Sulfate", state: "no" },
          { item1: "Casey", item2: "Cobalt Chloride", state: "no" }
        ]
      },
      {
        id: "c4",
        text: "Drew's compound produces a pink color.",
        facts: [
          { item1: "Drew", item2: "Pink", state: "yes" }
        ]
      },
      {
        id: "c5",
        text: "Blake did not synthesize Ferric Chloride.",
        facts: [
          { item1: "Blake", item2: "Ferric Chloride", state: "no" }
        ]
      },
      {
        id: "c6",
        text: "Ferric Chloride produces neither blue nor pink.",
        facts: [
          { item1: "Ferric Chloride", item2: "Blue", state: "no" },
          { item1: "Ferric Chloride", item2: "Pink", state: "no" }
        ]
      }
    ],
    solution: [
      { student: "Alex", compound: "Copper Sulfate", color: "Blue" },
      { student: "Blake", compound: "Potassium Permanganate", color: "Purple" },
      { student: "Casey", compound: "Ferric Chloride", color: "Yellow" },
      { student: "Drew", compound: "Cobalt Chloride", color: "Pink" }
    ]
  }
];
