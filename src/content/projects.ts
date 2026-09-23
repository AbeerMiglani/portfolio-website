export type Milestone = {
  label: string;
  done: boolean;
};

export type Project = {
  slug: string;
  title: string;
  /** Directory-style name shown on the card and accepted by `cat` in the terminal. */
  shortName: string;
  eyebrow: string;
  hook: string;
  bullets: string[];
  tags: string[];
  meta: string;
  dates: string;
  repo?: string;
  demo?: string;
  featured?: boolean;
  roadmap?: Milestone[];
};

export const projects: Project[] = [
  {
    slug: "redis",
    title: "Redis-compatible server",
    shortName: "redis-cpp",
    eyebrow: "Systems · ongoing",
    hook: "An in-memory key-value server in C++, built from first principles to understand how Redis really works.",
    bullets: [
      "TCP server and client written directly against POSIX sockets.",
      "Length-prefixed binary protocol (4-byte header + payload) to frame messages over a TCP byte stream.",
      "read_full / write_all loops so partial reads and writes never corrupt a message, with a 4 KB size guard.",
    ],
    tags: ["c++", "sockets", "networking"],
    meta: "C++ · POSIX sockets",
    dates: "Ongoing",
    repo: "https://github.com/AbeerMiglani/redis-cpp",
    featured: true,
    roadmap: [
      { label: "Socket programming", done: true },
      { label: "TCP server + client", done: true },
      { label: "Binary protocol + framing", done: true },
      { label: "Concurrent I/O models", done: true },
      { label: "Event loop", done: false },
      { label: "Key-value server", done: false },
      { label: "Hashtable", done: false },
      { label: "Sorted set + AVL tree", done: false },
      { label: "TTL expiry + timers", done: false },
      { label: "Thread pool", done: false },
    ],
  },
  {
    slug: "ripple",
    title: "Ripple",
    shortName: "ripple",
    eyebrow: "Manipal Hackathon 2026",
    hook: "Simulates how one infrastructure failure cascades through a city's power, water, transit and telecom networks.",
    bullets: [
      "Sole developer on the team: Motter–Lai overload cascade on an in-memory NetworkX graph, streamed wave by wave over WebSockets.",
      "Recommendation engine that verifies every fix by re-running the cascade, ranked by failures prevented and hospitals kept online.",
      "Rust (PyO3) extension for the all-pairs shortest-path hotspot, called 20+ times per recommendation request.",
    ],
    tags: ["python", "fastapi", "neo4j", "rust", "react"],
    meta: "FastAPI · Neo4j · PostGIS · Celery · deck.gl",
    dates: "Sep 2026",
    repo: "https://github.com/AbeerMiglani/ripple",
  },
  {
    slug: "quiz",
    title: "Terminal quiz system",
    shortName: "quiz",
    eyebrow: "Python · MySQL",
    hook: "A command-line quiz app with MySQL-backed persistence for questions, responses and scores.",
    bullets: [
      "Designed the SQL schema and queries for quiz questions and user responses.",
      "Implemented quiz flow, scoring and result retrieval in Python.",
    ],
    tags: ["python", "mysql", "sql"],
    meta: "Python · MySQL · SQL",
    dates: "Jan – Feb 2025",
  },
];
