import type { Project } from "@/content/projects";
import { ProjectArt } from "./ProjectArt";
import { ArrowIcon } from "./ArrowIcon";

export function ProjectCard({ project }: { project: Project }) {
  if (project.featured) {
    return (
      <article className="group grid grid-cols-1 gap-8 rounded-xl border border-border bg-surface p-5 sm:p-8 md:grid-cols-2 transition duration-200 hover:border-accent/50 hover:shadow-lg motion-safe:hover:-translate-y-0.5">
        <div className="flex min-w-0 flex-col gap-6">
          <ProjectArt slug={project.slug} />
          {project.roadmap && <Roadmap project={project} />}
        </div>
        <div className="flex min-w-0 flex-col">
          <CardBody project={project} large />
        </div>
      </article>
    );
  }

  // Secondary projects sit side by side with their art on wide screens: full width,
  // but smaller type and no roadmap, so the featured card stays the anchor.
  return (
    <article className="group grid grid-cols-1 gap-6 rounded-xl border border-border bg-surface p-5 sm:p-7 md:grid-cols-[2fr_3fr] md:gap-8 transition duration-200 hover:border-accent/50 hover:shadow-lg motion-safe:hover:-translate-y-0.5">
      <div className="min-w-0 md:self-center">
        <ProjectArt slug={project.slug} />
      </div>
      <div className="flex min-w-0 flex-col">
        <CardBody project={project} />
      </div>
    </article>
  );
}

function CardBody({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <>
      <p className="font-mono text-xs text-muted">
        <span className="text-accent">~/</span>
        {project.shortName} · {project.eyebrow}
      </p>
      <h3 className={`mt-2 font-semibold tracking-tight ${large ? "text-3xl" : "text-2xl"}`}>{project.title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{project.hook}</p>
      <ul className="mt-5 space-y-2 text-sm">
        {project.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2.5">
            <span aria-hidden="true" className="font-mono text-accent">
              ›
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {project.learned && (
        <div className="mt-5 border-l-2 border-accent/60 pl-4 text-sm leading-relaxed">
          <p className="font-mono text-xs text-muted">what I learned</p>
          <p className="mt-1">{project.learned}</p>
        </div>
      )}
      <p className="mt-5 font-mono text-xs text-muted">
        {project.meta} · {project.dates}
      </p>
      {project.repo && (
        <div className="mt-auto pt-6">
          <a
            href={project.repo}
            className="inline-flex items-center gap-1.5 font-mono text-sm text-fg underline decoration-border underline-offset-4 hover:decoration-accent"
          >
            {project.repo.replace("https://", "")}
            <span className="sr-only"> (source for {project.title})</span>
            <ArrowIcon className="transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
          </a>
        </div>
      )}
    </>
  );
}

function Roadmap({ project }: { project: Project }) {
  const roadmap = project.roadmap ?? [];
  const done = roadmap.filter((m) => m.done).length;
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs text-muted">
        <p>roadmap</p>
        <p>
          <span className="text-fg">{done}</span>/{roadmap.length} done
        </p>
      </div>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {roadmap.map((m) => (
          <span key={m.label} className={`h-1.5 flex-1 rounded-full ${m.done ? "bg-accent" : "bg-chip"}`} />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1.5 font-mono text-xs sm:grid-cols-2">
        {roadmap.map((m) => (
          <li key={m.label} className={m.done ? "text-fg" : "text-muted"}>
            <span aria-hidden="true" className={m.done ? "text-accent" : ""}>
              {m.done ? "[x] " : "[ ] "}
            </span>
            {m.label}
            <span className="sr-only">{m.done ? " (done)" : " (planned)"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
