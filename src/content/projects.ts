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
  /** Optional "what I learned" note, shown under the bullets. */
  learned?: string;
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
    slug: "ripple",
    title: "Ripple",
    shortName: "ripple",
    eyebrow: "Manipal Hackathon 2026 · sole developer",
    hook: "A FastAPI service that simulates how one infrastructure failure cascades through a city's power, water, transit and telecom networks, and recommends fixes it verifies by re-running the simulation.",
    bullets: [
      "POST /api/simulations writes a pending run to PostgreSQL, then queues it on a Celery worker. If the queue is down, the run is marked failed and the API returns 503, so no client polls a job that will never run.",
      "Workers acknowledge tasks late, have time limits, and retry up to 3 times with exponential backoff, but only on transient Postgres or Redis errors.",
      "Cascade waves stream to the browser over WebSockets through Redis pub/sub, with a fallback check of the stored run so a fast job or a late subscriber never leaves a client hanging.",
      "Role-based API keys (viewer, operator, admin) and a fixed-window Redis rate limiter, 60 requests a minute, that fails closed in production.",
      "Recommendations are cached in Redis for an hour, and a Rust (PyO3) extension for all-pairs shortest paths cut worst-case latency from 1.5 s to 190 ms.",
      "Alembic migrations, 300 pytest tests and GitHub Actions CI.",
    ],
    learned:
      "Redis pub/sub doesn't replay messages: a client that subscribes a moment after the worker publishes never hears the result. Checking the durable row in PostgreSQL whenever the channel goes quiet made the WebSocket correct, not just usually right.",
    tags: ["python", "fastapi", "celery", "postgresql", "redis"],
    meta: "Python · FastAPI · Celery · PostgreSQL · Redis",
    dates: "Sep 2026",
    repo: "https://github.com/AbeerMiglani/ripple",
    featured: true,
  },
  {
    slug: "redis",
    title: "Redis-style server",
    shortName: "redis-cpp",
    eyebrow: "Networking · ongoing",
    hook: "A Redis-style TCP server in C++, built from first principles to understand the networking underneath backend services.",
    bullets: [
      "TCP server and client written directly against POSIX sockets.",
      "Length-prefixed binary protocol (4-byte header + payload) to frame messages over a TCP byte stream.",
      "read_full / write_all loops so partial reads and writes never corrupt a message, with a 4 KB size guard.",
      "Event loop over non-blocking sockets, so one thread serves many clients at once.",
      "Benchmarked 25K requests per second, with 38 µs median and 82 µs p99 latency, over 100K loopback round trips.",
    ],
    learned:
      "TCP delivers a byte stream, not messages: one read() can return half a request or two of them, so the protocol has to carry its own boundaries. The event loop changed the shape of the server: instead of blocking on one client at a time, one thread watches every socket and serves whichever is ready, so a slow client no longer holds up the rest.",
    tags: ["c++", "sockets", "networking"],
    meta: "C++ · POSIX sockets",
    dates: "Jul 2026 – present",
    repo: "https://github.com/AbeerMiglani/redis-cpp",
    roadmap: [
      { label: "Socket programming", done: true },
      { label: "TCP server + client", done: true },
      { label: "Binary protocol + framing", done: true },
      { label: "Concurrent I/O models", done: true },
      { label: "Event loop", done: true },
      { label: "Key-value server", done: false },
      { label: "Hashtable", done: false },
      { label: "Sorted set + AVL tree", done: false },
      { label: "TTL expiry + timers", done: false },
      { label: "Thread pool", done: false },
    ],
  },
];

/** The project still in progress (the one with a roadmap): shown by `now`, `top` and the text résumé. */
export const inProgress = projects.find((p) => p.roadmap);
