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
    slug: "redis",
    title: "Redis-style server",
    shortName: "redis-cpp",
    eyebrow: "Systems · ongoing",
    hook: "An in-memory key-value server in C++, built from first principles to understand how Redis really works.",
    bullets: [
      "TCP server and client written directly against POSIX sockets.",
      "Length-prefixed binary protocol (4-byte header + payload) to frame messages over a TCP byte stream.",
      "read_full / write_all loops so partial reads and writes never corrupt a message, with a 4 KB size guard.",
    ],
    learned:
      "TCP delivers a byte stream, not messages: one read() can return half a request or two of them, so the protocol has to carry its own boundaries. The server still blocks on one client at a time; the event loop milestone swaps that for non-blocking sockets and poll(), so one thread can serve many connections.",
    tags: ["c++", "sockets", "networking"],
    meta: "C++ · POSIX sockets",
    dates: "Jul 2026 – present",
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
    eyebrow: "Manipal Hackathon 2026 · sole developer",
    hook: "Simulates how one infrastructure failure cascades through a city's power, water, transit and telecom networks.",
    bullets: [
      "Rust (PyO3) extension for the all-pairs shortest-path hotspot, called 20+ times per recommendation request.",
      "Motter–Lai overload cascade on an in-memory graph, streamed to the map wave by wave over WebSockets.",
      "Recommendation engine that verifies every fix by re-running the cascade, ranked by failures prevented and hospitals kept online.",
    ],
    tags: ["rust", "python", "websockets", "graphs"],
    meta: "Rust · Python · WebSockets",
    dates: "Sep 2026",
    repo: "https://github.com/AbeerMiglani/ripple",
  },
];
