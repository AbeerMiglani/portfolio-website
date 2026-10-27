import type { Project } from "@/content/projects";
import { pretty, projectJson } from "@/lib/api";
import { ApiPlayground } from "./ApiPlayground";
import { ArrowIcon } from "./ArrowIcon";
import { EndpointSection, Response } from "./Endpoint";
import { FrameDemo } from "./FrameDemo";

// One demo per project, each showing what the project does. Both render a
// complete picture on the server, so they make sense without JavaScript.
function Demo({ slug }: { slug: string }) {
  if (slug === "ripple") return <ApiPlayground />;
  if (slug === "redis") return <FrameDemo />;
  return null;
}

export function ProjectEndpoint({ project }: { project: Project }) {
  const path = `/projects/${project.shortName}`;
  return (
    <EndpointSection
      id={`project-${project.shortName}`}
      method="GET"
      path={path}
      kicker={project.eyebrow}
      title={project.title}
      level={3}
      aside={
        <>
          <div className="rounded-lg border border-border bg-surface p-1">
            <p className="px-3 pt-2 pb-1 font-mono text-[0.65rem] tracking-wider text-muted uppercase">try it</p>
            <Demo slug={project.slug} />
          </div>
          <Response source={pretty(projectJson(project))} path={`/api/projects.json → ${project.shortName}`} />
        </>
      }
    >
      <p className="max-w-2xl text-lg leading-relaxed text-muted">{project.hook}</p>
      <ul className="mt-6 max-w-2xl space-y-2.5 text-[0.95rem]">
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
        <div className="mt-6 max-w-2xl border-l-2 border-accent/60 pl-4 text-sm leading-relaxed">
          <p className="font-mono text-xs text-muted">what I learned</p>
          <p className="mt-1">{project.learned}</p>
        </div>
      )}
      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs">
        <div>
          <dt className="text-muted">stack</dt>
          <dd className="mt-1 text-fg">{project.meta}</dd>
        </div>
        <div>
          <dt className="text-muted">dates</dt>
          <dd className="mt-1 text-fg">{project.dates}</dd>
        </div>
      </dl>
      {project.roadmap && <Roadmap project={project} />}
      {project.repo && (
        <a
          href={project.repo}
          className="group/link mt-6 inline-flex items-center gap-1.5 font-mono text-sm text-fg underline decoration-border underline-offset-4 hover:decoration-accent"
        >
          {project.repo.replace("https://", "")}
          <span className="sr-only"> (source for {project.title})</span>
          <ArrowIcon className="transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5" />
        </a>
      )}
    </EndpointSection>
  );
}

function Roadmap({ project }: { project: Project }) {
  const roadmap = project.roadmap ?? [];
  const done = roadmap.filter((m) => m.done).length;
  return (
    <div className="mt-6 max-w-2xl rounded-lg border border-border bg-surface p-4">
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
