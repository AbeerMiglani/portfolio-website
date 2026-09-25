import { earlier } from "@/content/earlier";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { resumeText } from "@/lib/plaintext";

export type Line =
  | { kind: "text"; text: string; tone?: "muted" | "accent" | "error" }
  | { kind: "link"; label: string; href: string }
  | { kind: "blank" };

export type Effect =
  | { type: "clear" }
  | { type: "open"; href: string }
  | { type: "theme"; theme: "light" | "dark" }
  | { type: "tty"; on: boolean };

/** `pending` output is appended to the same entry when it resolves (used by `git log`). */
export type Result = { lines: Line[]; effects?: Effect[]; pending?: Promise<Line[]> };

/** Per-visitor state that commands can read and change. */
export type Session = {
  history: string[];
  store: Map<string, string>;
  /** True while the terminal is full screen (the `tty` command). */
  tty: boolean;
};

const text = (value: string, tone?: "muted" | "accent" | "error"): Line => ({
  kind: "text",
  text: value,
  tone,
});
const link = (label: string, href: string): Line => ({ kind: "link", label, href });
const blank: Line = { kind: "blank" };

const siteLinks: Record<string, string> = {
  github: profile.links.find((l) => l.label === "GitHub")!.href,
  linkedin: profile.links.find((l) => l.label === "LinkedIn")!.href,
  resume: profile.resume,
  email: `mailto:${profile.email}`,
};

type Command = {
  summary: string;
  usage?: string;
  hidden?: boolean;
  run: (args: string[], session: Session) => Result;
};

const commands: Record<string, Command> = {
  help: {
    summary: "list available commands",
    run: () => ({
      lines: [
        text("Available commands:", "muted"),
        ...Object.entries(commands)
          .filter(([, cmd]) => !cmd.hidden)
          .map(([name, cmd]) => text(`  ${(cmd.usage ?? name).padEnd(22)} ${cmd.summary}`)),
        blank,
        text("Tip: Tab completes, ↑/↓ walks history, Ctrl+L clears.", "muted"),
        text(`This site also answers \`curl ${profile.siteUrl}\` in a real terminal.`, "muted"),
      ],
    }),
  },
  whoami: {
    summary: "who is this?",
    run: () => ({
      lines: [
        text(profile.name, "accent"),
        text(profile.tagline),
        text(`${profile.education.degree}, ${profile.education.school}`, "muted"),
        text(
          `dsa: ${profile.problemSolving.total} problems solved (${profile.problemSolving.leetcode} on LeetCode)`,
          "muted",
        ),
        text(`status: ${profile.status}`, "muted"),
      ],
    }),
  },
  now: {
    summary: "what I'm working on",
    run: () => {
      const featured = projects.find((p) => p.featured);
      const roadmap = featured?.roadmap ?? [];
      const done = roadmap.filter((m) => m.done).length;
      return {
        lines: [
          text(`building  ${featured?.title ?? "–"} (${done}/${roadmap.length} milestones)`),
          text(`learning  ${profile.learning.join(", ")}`),
          text(`open to   ${profile.status.replace(/^Open to /i, "")}`),
        ],
      };
    },
  },
  about: {
    summary: "a little more about me",
    run: () => ({ lines: profile.about.flatMap((p, i) => (i ? [blank, text(p)] : [text(p)])) }),
  },
  ls: {
    summary: "list projects",
    usage: "ls",
    run: () => ({
      lines: [
        ...projects.map((p) => text(`${p.slug.padEnd(8)} ${p.title}${p.featured ? "  ★" : ""}`)),
        blank,
        text("Run `cat <name>` for details, e.g. `cat redis`.", "muted"),
      ],
    }),
  },
  cat: {
    summary: "show a project",
    usage: "cat <project>",
    run: (args) => {
      const name = args[0]?.replace(/\/$/, "").replace(/\.md$/, "");
      if (!name) return { lines: [text("usage: cat <project>   (try `ls`)", "error")] };
      if (name === "about" || name === "about.md") return commands.about.run([], emptySession());
      const project = projects.find((p) => p.slug === name || p.shortName === name);
      if (!project) return { lines: [text(`cat: ${name}: no such project (try \`ls\`)`, "error")] };
      const lines: Line[] = [
        text(`${project.title} · ${project.dates}`, "accent"),
        text(project.hook),
        blank,
        ...project.bullets.map((b) => text(`  + ${b}`)),
        ...(project.learned ? [blank, text(`learned: ${project.learned}`)] : []),
        blank,
        text(`stack: ${project.meta}`, "muted"),
      ];
      if (project.roadmap) {
        const done = project.roadmap.filter((m) => m.done).length;
        lines.push(text(`roadmap: ${done}/${project.roadmap.length} milestones`, "muted"));
        lines.push(
          ...project.roadmap.map((m) => text(`  [${m.done ? "x" : " "}] ${m.label}`, m.done ? undefined : "muted")),
        );
      }
      if (project.repo) lines.push(blank, link(`repo → ${project.repo.replace("https://", "")}`, project.repo));
      return { lines };
    },
  },
  earlier: {
    summary: "before university",
    run: () => ({
      lines: earlier.flatMap((item) => [
        text(`${item.what} @ ${item.org}`, "accent"),
        text(item.when, "muted"),
        text(`  + ${item.summary}`),
        ...(item.repo ? [link(`  repo → ${item.repo.replace("https://", "")}`, item.repo)] : []),
      ]),
    }),
  },
  education: {
    summary: "where I study",
    run: () => ({
      lines: [
        text(profile.education.school, "accent"),
        text(profile.education.degree),
        text(`${profile.education.dates} · ${profile.education.place}`, "muted"),
      ],
    }),
  },
  skills: {
    summary: "languages, tools, databases",
    run: () => ({
      lines: Object.entries(profile.skills).map(([group, items]) =>
        text(`${(group.toLowerCase() + ":").padEnd(24)}${items.join(", ")}`),
      ),
    }),
  },
  contact: {
    summary: "ways to reach me",
    run: () => ({
      lines: [
        link(`email     ${profile.email}`, siteLinks.email),
        link(`linkedin  ${siteLinks.linkedin.replace("https://www.", "")}`, siteLinks.linkedin),
        link(`github    ${siteLinks.github.replace("https://", "")}`, siteLinks.github),
      ],
    }),
  },
  resume: {
    summary: "open my résumé (PDF)",
    run: () => ({ lines: [text("Opening résumé…", "muted")], effects: [{ type: "open", href: profile.resume }] }),
  },
  open: {
    summary: "open github | linkedin | resume | email",
    usage: "open <target>",
    run: (args) => {
      const target = args[0]?.toLowerCase();
      const project = projects.find((p) => p.slug === target);
      const href = target ? siteLinks[target] ?? project?.repo : undefined;
      if (!href) return { lines: [text("usage: open github | linkedin | resume | email | <project>", "error")] };
      return { lines: [text(`Opening ${target}…`, "muted")], effects: [{ type: "open", href }] };
    },
  },
  theme: {
    summary: "switch colour theme",
    usage: "theme <light|dark>",
    run: (args) => {
      const theme = args[0];
      if (theme !== "light" && theme !== "dark") return { lines: [text("usage: theme light | theme dark", "error")] };
      return { lines: [text(`theme set to ${theme}`, "muted")], effects: [{ type: "theme", theme }] };
    },
  },
  ping: {
    summary: "a tiny Redis, in your browser",
    usage: "ping/set/get/keys",
    // Real Redis answers PONG; this one has an inside joke instead.
    run: (args) => ({ lines: [text(args.length ? `"${args.join(" ")}"` : "Chishit Rib")] }),
  },
  set: {
    summary: "",
    hidden: true,
    run: (args, session) => {
      if (args.length < 2) return { lines: [text("(error) ERR wrong number of arguments for 'set' command", "error")] };
      session.store.set(args[0], args.slice(1).join(" "));
      return { lines: [text("OK")] };
    },
  },
  get: {
    summary: "",
    hidden: true,
    run: (args, session) => {
      if (args.length !== 1) return { lines: [text("(error) ERR wrong number of arguments for 'get' command", "error")] };
      const value = session.store.get(args[0]);
      return { lines: [text(value === undefined ? "(nil)" : `"${value}"`)] };
    },
  },
  del: {
    summary: "",
    hidden: true,
    run: (args, session) => ({
      lines: [text(`(integer) ${args.filter((key) => session.store.delete(key)).length}`)],
    }),
  },
  keys: {
    summary: "",
    hidden: true,
    run: (_args, session) => {
      const keys = [...session.store.keys()];
      return { lines: keys.length ? keys.map((k, i) => text(`${i + 1}) "${k}"`)) : [text("(empty array)")] };
    },
  },
  history: {
    summary: "",
    hidden: true,
    run: (_args, session) => ({ lines: session.history.map((cmd, i) => text(`${String(i + 1).padStart(4)}  ${cmd}`)) }),
  },
  git: {
    summary: "commit activity for a project",
    usage: "git log [project]",
    run: (args) => {
      if (args[0] === "push") return { lines: [text("remote: Permission to AbeerMiglani/portfolio-website.git denied to visitor.", "error")] };
      if (args[0] !== "log") return { lines: [text("usage: git log [redis|ripple]", "error")] };
      const project = args[1] ? findProject(args[1]) : projects.find((p) => p.featured);
      if (!project?.repo) return { lines: [text(`git: ${args[1]}: no repository (try \`ls\`)`, "error")] };
      const repo = project.repo.replace("https://github.com/", "");
      return { lines: [text(`fetching ${repo} from GitHub…`, "muted")], pending: commitActivity(repo, project.repo) };
    },
  },
  tty: {
    summary: "full-screen terminal",
    run: (_args, session) =>
      session.tty
        ? { lines: [text("/dev/tty1")] }
        : {
            lines: [text("/dev/tty1", "accent"), text("Full screen. Type `exit` or press Esc to leave.", "muted")],
            effects: [{ type: "tty", on: true }],
          },
  },
  clear: {
    summary: "clear the screen",
    run: () => ({ lines: [], effects: [{ type: "clear" }] }),
  },
  echo: { summary: "", hidden: true, run: (args) => ({ lines: [text(args.join(" "))] }) },
  pwd: { summary: "", hidden: true, run: () => ({ lines: [text(`/home/${profile.handle}`)] }) },
  date: { summary: "", hidden: true, run: () => ({ lines: [text(new Date().toString())] }) },
  sudo: {
    summary: "",
    hidden: true,
    run: () => ({ lines: [text(`${profile.handle} is not in the sudoers file. This incident will be reported.`, "error")] }),
  },
  exit: {
    summary: "",
    hidden: true,
    run: (_args, session) =>
      session.tty
        ? { lines: [text("logout", "muted")], effects: [{ type: "tty", on: false }] }
        : { lines: [text("There's no escape. Try `contact` instead.", "muted")] },
  },
  top: {
    summary: "",
    hidden: true,
    run: () => {
      const featured = projects.find((p) => p.featured);
      const next = featured?.roadmap?.find((m) => !m.done)?.label ?? "–";
      const rows: [string, string, string, string][] = [
        [featured?.shortName ?? "project", "R", "71.3", `next milestone: ${next}`],
        [profile.learning.join(",").toLowerCase(), "R", "18.9", "learning"],
        ["internships", "S", " 0.0", profile.status.replace(/^Open/, "open")],
        ["sleep", "S", " 9.8", "occasionally"],
      ];
      return {
        lines: [
          text("  PID COMMAND      S  %CPU  NOTE", "muted"),
          ...rows.map(([cmd, state, cpu, note], i) => text(`${String(i + 1).padStart(5)} ${cmd.padEnd(12)} ${state}  ${cpu}  ${note}`)),
        ],
      };
    },
  },
  neofetch: {
    summary: "",
    hidden: true,
    run: () => {
      const featured = projects.find((p) => p.featured);
      const done = featured?.roadmap?.filter((m) => m.done).length ?? 0;
      const info: [string, string][] = [
        ["os", "portfolio (Next.js 16, static)"],
        ["host", profile.education.school],
        ["uptime", `B.Tech ECE, class of ${profile.education.graduation}`],
        ["shell", "this one (try `help`)"],
        ["langs", profile.skills.Languages.slice(0, 4).join(", ")],
        ["building", `${featured?.title ?? "–"} (${done}/${featured?.roadmap?.length ?? 0})`],
      ];
      return {
        lines: [
          text(" ▄▀▀▄   abeer@portfolio", "accent"),
          text(" █▄▄█   ---------------", "accent"),
          text(" █  █", "accent"),
          ...info.map(([key, value]) => text(`        ${key.padEnd(9)}${value}`)),
        ],
      };
    },
  },
  vim: {
    summary: "",
    hidden: true,
    run: () => ({ lines: [text("You're not getting me in there. (If you were: `:q`.)", "muted")] }),
  },
  ":q": {
    summary: "",
    hidden: true,
    run: () => ({ lines: [text("Exited vim on the first try. Put that on your résumé.", "muted")] }),
  },
  rm: {
    summary: "",
    hidden: true,
    run: (args) =>
      args.some((a) => a.startsWith("-") && a.includes("r")) && args.includes("/")
        ? {
            lines: [
              text("rm: it is dangerous to operate recursively on '/'", "error"),
              text("rm: use --no-preserve-root to override this failsafe", "error"),
            ],
          }
        : { lines: [text("rm: cannot remove: Read-only file system", "error")] },
  },
  curl: {
    summary: "",
    hidden: true,
    run: (args) => {
      const target = args.find((a) => !a.startsWith("-"));
      if (!target) return { lines: [text("curl: try 'curl --help' or 'curl --manual' for more information", "error")] };
      const host = profile.siteUrl.replace("https://", "");
      if (!target.replace(/^https?:\/\//, "").startsWith(host)) {
        return { lines: [text(`curl: (6) Could not resolve host: ${target.replace(/^https?:\/\//, "").split("/")[0]}`, "error")] };
      }
      return {
        lines: [
          ...resumeText({ color: false }).split("\n").map((l) => (l ? text(l) : blank)),
          text("That's what a real terminal gets from this URL, in colour.", "muted"),
        ],
      };
    },
  },
};

// Friendly aliases people are likely to type.
const aliases: Record<string, string> = {
  projects: "ls",
  dir: "ls",
  cls: "clear",
  work: "earlier",
  experience: "earlier",
  cv: "resume",
  email: "contact",
  "?": "help",
  github: "contact",
  linkedin: "contact",
  vi: "vim",
  nano: "vim",
  emacs: "vim",
  ":wq": ":q",
  ":q!": ":q",
  htop: "top",
  wget: "curl",
};

function emptySession(): Session {
  return { history: [], store: new Map(), tty: false };
}

function findProject(name: string) {
  const clean = name.replace(/\/$/, "").replace(/\.md$/, "");
  return projects.find((p) => p.slug === clean || p.shortName === clean);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Commit counts per month from GitHub's public API. Dates and counts only, not messages. */
async function commitActivity(repo: string, url: string): Promise<Line[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=100`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(String(res.status));
    const commits: { commit: { author: { date: string } } }[] = await res.json();
    if (!commits.length) return [text("no commits yet", "muted")];
    const dates = commits.map((c) => new Date(c.commit.author.date));
    const newest = new Date(Math.max(...dates.map(Number)));
    const oldest = new Date(Math.min(...dates.map(Number)));
    const counts = new Map<string, number>();
    for (const d of dates) counts.set(`${d.getFullYear()}-${d.getMonth()}`, (counts.get(`${d.getFullYear()}-${d.getMonth()}`) ?? 0) + 1);
    const months: [string, number][] = [];
    const now = new Date();
    for (let y = oldest.getFullYear(), m = oldest.getMonth(); y < now.getFullYear() || (y === now.getFullYear() && m <= now.getMonth()); m === 11 ? (y++, (m = 0)) : m++) {
      months.push([`${MONTHS[m]} ${y}`, counts.get(`${y}-${m}`) ?? 0]);
    }
    const max = Math.max(...months.map(([, n]) => n));
    const days = Math.floor((Date.now() - newest.getTime()) / 86_400_000);
    const ago = days <= 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
    return [
      text(`${repo.split("/")[1]} · ${commits.length === 100 ? "100+" : commits.length} commits · latest ${ago}`, "accent"),
      ...months.map(([label, n]) => text(`  ${label}  ${n ? "█".repeat(Math.max(1, Math.round((n / max) * 20))) : "·"} ${n}`)),
      link(`history → ${url.replace("https://", "")}/commits`, `${url}/commits`),
    ];
  } catch {
    return [
      text("git: couldn't reach GitHub right now (it allows 60 requests an hour per visitor).", "error"),
      link(`history → ${url.replace("https://", "")}/commits`, `${url}/commits`),
    ];
  }
}

export function run(input: string, session: Session): Result {
  const [rawName, ...args] = input.trim().split(/\s+/);
  if (!rawName) return { lines: [] };
  const name = rawName.toLowerCase();
  // "ls projects" and "ls projects/" behave like plain "ls".
  const command = commands[name] ?? commands[aliases[name]];
  if (!command) {
    return { lines: [text(`command not found: ${rawName}. Type \`help\` for a list.`, "error")] };
  }
  return command.run(name === "ls" ? [] : args, session);
}

/** Completes the command name, or a project name after `cat`/`open`. */
export function complete(input: string): string {
  const parts = input.split(/\s+/);
  if (parts.length === 1) {
    const matches = Object.keys(commands).filter((c) => c.startsWith(parts[0].toLowerCase()) && !commands[c].hidden);
    return matches.length === 1 ? `${matches[0]} ` : input;
  }
  if (parts.length === 2 && ["cat", "open"].includes(parts[0])) {
    const options = [...projects.map((p) => p.slug), ...(parts[0] === "open" ? Object.keys(siteLinks) : [])];
    const matches = options.filter((o) => o.startsWith(parts[1].toLowerCase()));
    return matches.length === 1 ? `${parts[0]} ${matches[0]}` : input;
  }
  return input;
}

export const welcome: Line[] = [
  text(`Welcome to ${profile.handle}@portfolio. Type \`help\` to get started.`, "muted"),
];

/** Commands shown as already run when the page loads. */
export const preloaded = ["now"];
