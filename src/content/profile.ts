export type Link = {
  label: string;
  href: string;
};

// TODO: replace the placeholder pitch, status, links and about text with your own.
export const profile = {
  name: "Abeer Miglani",
  handle: "abeer",
  siteUrl: "https://portfolio.abbykayo.com",
  pitch: "Software engineer who likes systems, performance and clean tooling.",
  status: "Open to SWE internships and new-grad roles",
  email: "you@example.com",
  resume: "/resume.pdf",
  links: [
    { label: "GitHub", href: "https://github.com/AbeerMiglani" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
  ] satisfies Link[],
  about: [
    "I build software mostly in Python and C++, and I enjoy the parts of a project where performance and correctness actually matter.",
    "Right now I'm learning Rust and looking for an internship where I can ship real things alongside strong engineers.",
  ],
  skills: {
    Languages: ["Python", "C++", "TypeScript", "SQL"],
    Tools: ["Git", "Linux", "CMake", "Docker"],
    "Currently learning": ["Rust"],
  } satisfies Record<string, string[]>,
};
