import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export type Line =
  | { kind: "text"; text: string; tone?: "muted" | "accent" | "error" }
  | { kind: "link"; label: string; href: string }
  | { kind: "blank" };

export type Effect =
  | { type: "clear" }
  | { type: "open"; href: string }
  | { type: "theme"; theme: "light" | "dark" };

export type Result = { lines: Line[]; effects?: Effect[] };

/** Per-visitor state that commands can read and change. */
export type Session = {
  history: string[];
  store: Map<string, string>;
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
          text(`learning  ${profile.skills["Currently learning"].join(", ")}`),
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
  experience: {
    summary: "work experience",
    run: () => ({
      lines: experience.flatMap((role) => [
        text(`${role.role} @ ${role.org}`, "accent"),
        text(`${role.start}${role.end !== role.start ? ` – ${role.end}` : ""} · ${role.place}`, "muted"),
        ...role.bullets.map((b) => text(`  + ${b}`)),
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
    run: (args) => ({ lines: [text(args.length ? `"${args.join(" ")}"` : "PONG")] }),
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
    run: () => ({ lines: [text("There's no escape. Try `contact` instead.", "muted")] }),
  },
};

// Friendly aliases people are likely to type.
const aliases: Record<string, string> = {
  projects: "ls",
  dir: "ls",
  cls: "clear",
  work: "experience",
  cv: "resume",
  email: "contact",
  "?": "help",
  github: "contact",
  linkedin: "contact",
};

function emptySession(): Session {
  return { history: [], store: new Map() };
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
