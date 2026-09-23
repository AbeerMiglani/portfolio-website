import type { CSSProperties } from "react";
import type { Project } from "@/content/projects";

const palette: Record<Project["color"], { bg: string; fg: string; art: string }> = {
  blue: { bg: "var(--card-blue)", fg: "var(--card-blue-fg)", art: "#c3e4ff" },
  green: { bg: "var(--card-green)", fg: "var(--card-green-fg)", art: "#08c3a0" },
  sand: { bg: "var(--card-sand)", fg: "var(--card-sand-fg)", art: "#ffa21a" },
};

export function ProjectCard({ project }: { project: Project }) {
  const colors = palette[project.color];
  const style = { background: colors.bg, color: colors.fg } as CSSProperties;

  if (project.featured) {
    return (
      <article style={style} className="grid overflow-hidden rounded-2xl shadow-sm md:grid-cols-2">
        <div className="relative flex flex-col justify-between gap-8 p-6 sm:p-8">
          <CardArt label={project.shortName} color={colors.art} />
          {project.roadmap && <Roadmap project={project} />}
        </div>
        <div className="flex flex-col p-6 sm:p-8 md:pl-2">
          <CardBody project={project} large />
        </div>
      </article>
    );
  }

  return (
    <article style={style} className="flex flex-col overflow-hidden rounded-2xl p-6 shadow-sm sm:p-7">
      <CardArt label={project.shortName} color={colors.art} />
      <div className="mt-8 flex flex-1 flex-col">
        <CardBody project={project} />
      </div>
    </article>
  );
}

function CardBody({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <>
      <p className="font-mono text-[0.65rem] tracking-widest uppercase opacity-75">{project.eyebrow}</p>
      <h3 className={`mt-3 font-pixel leading-tight ${large ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}>
        {project.title}
      </h3>
      <p className="mt-3 max-w-prose leading-relaxed opacity-85">{project.hook}</p>
      <ul className="mt-5 space-y-2 text-sm">
        {project.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2.5">
            <span aria-hidden="true" className="opacity-60">
              +
            </span>
            <span className="opacity-90">{bullet}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 font-mono text-[0.65rem] tracking-widest uppercase opacity-70">
        {project.meta} · {project.dates}
      </p>
      {project.repo && (
        <div className="mt-auto pt-6 text-sm font-medium">
          <a href={project.repo} className="group flex items-center justify-between hover:underline">
            View on GitHub
            <span className="sr-only"> ({project.title})</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      )}
    </>
  );
}

// Stacked "index cards" with a pixel-font label, after fanout's course cards.
function CardArt({ label, color }: { label: string; color: string }) {
  return (
    <div aria-hidden="true" className="ruled relative h-44 rounded-lg">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-32 w-40">
          {[3, 2, 1].map((depth) => (
            <div
              key={depth}
              className="absolute inset-0 rounded-lg border-2 border-[#1d1d1d]"
              style={{
                background: color,
                transform: `translate(${depth * 9}px, ${-depth * 7}px)`,
                filter: `brightness(${1 - depth * 0.06})`,
              }}
            />
          ))}
          <div
            className="absolute inset-0 flex items-end rounded-lg border-2 border-[#1d1d1d] p-2.5 shadow-lg"
            style={{ background: color }}
          >
            <span className="font-pixel text-base leading-none text-[#1d1d1d]">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Roadmap({ project }: { project: Project }) {
  const roadmap = project.roadmap ?? [];
  const done = roadmap.filter((m) => m.done).length;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[0.65rem] tracking-widest uppercase opacity-75">Build roadmap</p>
        <p className="font-mono text-xs opacity-75">
          {done}/{roadmap.length}
        </p>
      </div>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {roadmap.map((m) => (
          <span
            key={m.label}
            className={`h-2 flex-1 rounded-sm ${m.done ? "bg-current" : "bg-current opacity-25"}`}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2">
        {roadmap.map((m) => (
          <li key={m.label} className={`flex items-center gap-2 ${m.done ? "" : "opacity-60"}`}>
            <span className="font-mono" aria-hidden="true">
              {m.done ? "[x]" : "[ ]"}
            </span>
            {m.label}
            <span className="sr-only">{m.done ? "(done)" : "(planned)"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
