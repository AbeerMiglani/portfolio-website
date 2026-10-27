export type Link = {
  label: string;
  href: string;
};

export const profile = {
  name: "Abeer Miglani",
  handle: "abeer",
  siteUrl: "https://portfolio.abbykayo.com",
  role: "Backend engineer",
  tagline: "I build backend services.",
  pitch:
    "ECE undergrad at Shiv Nadar University. I build backend services: most recently Ripple, an async simulation API with FastAPI, Celery, PostgreSQL and Redis. I'm learning Go, and I wrote a Redis-style TCP server in C++ to understand what sits under the API.",
  status: "Open to SWE internships",
  learning: ["Go"],
  email: "am319@snu.edu.in",
  resume: "/resume.pdf",
  links: [
    { label: "GitHub", href: "https://github.com/AbeerMiglani" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/abeermiglani/" },
  ] satisfies Link[],
  about: [
    "I'm a second-year Electrical and Computer Engineering student at Shiv Nadar Institution of Eminence. I build backend services: APIs, background jobs, caches and the databases behind them.",
    "Ripple is the most complete so far: a FastAPI service that queues simulations on Celery workers, streams results over WebSockets and keeps its hot paths in Redis. I'm learning Go next, and I built a Redis-style server in C++ to understand the networking underneath.",
  ],
  education: {
    school: "Shiv Nadar Institution of Eminence",
    degree: "B.Tech, Electrical and Computer Engineering",
    dates: "Aug 2025 – May 2029",
    graduation: "2029",
    place: "Dadri, UP",
  },
  problemSolving: {
    total: "140+",
    platforms: ["LeetCode", "Codeforces", "CodeChef", "HackerRank"],
  },
  skills: {
    Languages: ["Python", "Go (learning)", "C++", "C", "SQL", "TypeScript"],
    Backend: ["FastAPI", "Celery", "REST APIs", "WebSockets", "Pydantic", "SQLAlchemy"],
    Data: ["PostgreSQL + PostGIS", "Redis", "Neo4j", "MySQL"],
    Tools: ["Docker", "Docker Compose", "GitHub Actions", "Alembic", "pytest", "Git"],
  } satisfies Record<string, string[]>,
};
