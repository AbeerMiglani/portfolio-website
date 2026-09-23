export type Link = {
  label: string;
  href: string;
};

export const profile = {
  name: "Abeer Miglani",
  handle: "abeer",
  siteUrl: "https://portfolio.abbykayo.com",
  role: "Systems-minded software engineer",
  tagline: "I write systems software in C++ and Python.",
  pitch:
    "ECE undergrad at Shiv Nadar University. Right now I'm building a Redis-compatible server from scratch; before that, Ripple, a simulator for how failures cascade through a city's infrastructure.",
  status: "Open to SWE internships",
  email: "am319@snu.edu.in",
  resume: "/resume.pdf",
  links: [
    { label: "GitHub", href: "https://github.com/AbeerMiglani" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/abeermiglani/" },
  ] satisfies Link[],
  about: [
    "I'm a second-year Electrical and Computer Engineering student at Shiv Nadar Institution of Eminence, and most of what I build leans towards systems: sockets, protocols, graphs and the data structures underneath them.",
    "Right now I'm building a Redis-compatible server in C++ from first principles, and learning Rust, which I've already used to speed up the hottest path in Ripple.",
  ],
  education: {
    school: "Shiv Nadar Institution of Eminence",
    degree: "B.Tech, Electrical and Computer Engineering",
    dates: "Aug 2025 – May 2029",
    place: "Dadri, UP",
  },
  problemSolving: {
    total: "100+",
    leetcode: 95,
    platforms: ["LeetCode", "Codeforces", "CodeChef", "HackerRank"],
  },
  interests: ["Systems programming", "Computer networks", "Data structures & algorithms"],
  skills: {
    Languages: ["C++", "Python", "C", "SQL", "TypeScript", "HTML/CSS"],
    "Frameworks & libraries": ["FastAPI", "Flask", "React", "Celery", "NetworkX", "Pandas", "Selenium"],
    Databases: ["PostgreSQL + PostGIS", "Neo4j", "Redis", "MySQL"],
    Tools: ["Git", "Docker", "GitHub Actions", "Google Cloud", "VS Code"],
    "Currently learning": ["Rust"],
  } satisfies Record<string, string[]>,
};
