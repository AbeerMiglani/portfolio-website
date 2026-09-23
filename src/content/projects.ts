export type Project = {
  slug: string;
  title: string;
  hook: string;
  bullets: string[];
  tags: string[];
  repo?: string;
  demo?: string;
  featured?: boolean;
};

// TODO: replace these placeholders with your real projects. Put the strongest one
// first and mark it `featured` so it spans the full grid width.
export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    hook: "One sentence on what it is and why someone would care.",
    bullets: [
      "What it does, in plain words.",
      "The interesting engineering: the hard part and how you solved it.",
      "A result or number: speedup, users, accuracy, stars.",
    ],
    tags: ["c++", "cmake"],
    repo: "https://github.com/AbeerMiglani",
    featured: true,
  },
  {
    slug: "project-two",
    title: "Project Two",
    hook: "One sentence on what it is and why someone would care.",
    bullets: [
      "What it does, in plain words.",
      "The interesting engineering decision.",
      "A result or number.",
    ],
    tags: ["python"],
    repo: "https://github.com/AbeerMiglani",
  },
  {
    slug: "project-three",
    title: "Project Three",
    hook: "One sentence on what it is and why someone would care.",
    bullets: [
      "What it does, in plain words.",
      "The interesting engineering decision.",
      "A result or number.",
    ],
    tags: ["python", "sql"],
    repo: "https://github.com/AbeerMiglani",
    demo: "https://example.com",
  },
];
