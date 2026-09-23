export type Role = {
  role: string;
  org: string;
  start: string;
  end: string;
  bullets: string[];
};

// TODO: replace with your real roles, newest first. Keep it to 1-2 impact bullets
// each; the full detail lives in the résumé PDF.
export const experience: Role[] = [
  {
    role: "Software Engineering Intern",
    org: "Company Name",
    start: "May 2026",
    end: "Aug 2026",
    bullets: [
      "Built X using Y, which improved Z by N%.",
      "Owned A end to end, from design through deployment.",
    ],
  },
  {
    role: "Teaching Assistant, Data Structures",
    org: "University Name",
    start: "Sep 2025",
    end: "Present",
    bullets: ["Ran weekly labs for 40 students on C++ and algorithm design."],
  },
];
