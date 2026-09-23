import type { Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={`flex flex-col rounded-lg border border-border bg-surface p-6 transition-colors hover:border-accent ${
        project.featured ? "md:col-span-2" : ""
      }`}
    >
      <h3 className="font-mono text-lg font-semibold">
        {project.title}
        {project.featured && (
          <span className="ml-3 align-middle text-xs font-normal text-accent">
            ★ featured
          </span>
        )}
      </h3>
      <p className="mt-2 text-muted">{project.hook}</p>
      <ul className="mt-4 space-y-1.5 text-sm">
        {project.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="font-mono text-accent" aria-hidden="true">
              &gt;
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
        <ul className="flex flex-wrap gap-2 font-mono text-xs text-muted" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag}>[{tag}]</li>
          ))}
        </ul>
        <div className="flex gap-4 font-mono text-sm">
          {project.repo && (
            <a href={project.repo} className="hover:text-accent">
              code →<span className="sr-only"> for {project.title}</span>
            </a>
          )}
          {project.demo && (
            <a href={project.demo} className="hover:text-accent">
              demo →<span className="sr-only"> of {project.title}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
