import { earlier } from "@/content/earlier";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { pretty, profileJson, projectsJson } from "@/lib/api";
import { ArrowIcon } from "./ArrowIcon";
import { CodePanel } from "./CodePanel";
import { EndpointSection, MethodBadge, Response } from "./Endpoint";
import { Json } from "./Json";
import { Terminal } from "./Terminal";

const linkClass = "underline decoration-border underline-offset-4 hover:decoration-accent";

// GET /projects : the group header above the project endpoints.
export function ProjectsIndex() {
  return (
    <section aria-labelledby="projects-title" className="border-b border-divider bg-band px-4 py-10 sm:px-8 lg:px-12">
      <p id="projects" className="flex items-center gap-2 font-mono text-sm text-muted">
        <MethodBadge method="GET" />
        <span className="text-fg">/projects</span>
      </p>
      <h2 id="projects-title" className="mt-3 text-3xl font-semibold tracking-tight text-fg">
        Projects
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {projects.map((p) => (
          <li key={p.slug}>
            <a
              href={`#project-${p.shortName}`}
              className="block rounded-lg border border-border bg-surface px-4 py-3 transition hover:border-accent/50"
            >
              <span className="font-mono text-xs text-muted">/{p.shortName}</span>
              <span className="mt-1 block font-medium text-fg">{p.title}</span>
              <span className="mt-0.5 block text-sm text-muted">{p.meta}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// GET /experience : pre-university work, kept small.
export function Experience() {
  return (
    <EndpointSection
      id="experience"
      method="GET"
      path="/experience"
      title="Experience"
      aside={<Response source={pretty(projectsJson().earlier)} path="/api/projects.json → earlier" />}
    >
      <ul className="max-w-2xl space-y-4">
        {earlier.map((item) => (
          <li key={item.org}>
            <p className="font-mono text-xs text-muted">{item.when}</p>
            <p className="mt-1">
              <span className="font-medium">{item.what}</span> at{" "}
              {item.orgUrl ? (
                <a href={item.orgUrl} className={linkClass}>
                  {item.org}
                </a>
              ) : (
                item.org
              )}
              .
            </p>
            <p className="mt-1 text-muted">{item.summary}</p>
            {item.repo && (
              <a href={item.repo} className="group/link mt-2 inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-fg">
                source
                <span className="sr-only"> for the {item.org} project</span>
                <ArrowIcon className="transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </EndpointSection>
  );
}

// GET /skills
export function Skills() {
  return (
    <EndpointSection
      id="skills"
      method="GET"
      path="/skills"
      title="Skills"
      aside={<Response source={pretty(profileJson().skills)} path="/api/profile.json → skills" />}
    >
      <dl className="grid max-w-3xl grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
        {Object.entries(profile.skills).map(([group, items]) => (
          <div key={group} className="min-w-0">
            <dt className="font-mono text-xs text-muted">&quot;{group.toLowerCase()}&quot;</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {items.map((item) => (
                <span key={item} className="rounded border border-border bg-surface px-2 py-0.5 text-sm">
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </EndpointSection>
  );
}

// GET /about
export function About() {
  const { education, problemSolving } = profile;
  return (
    <EndpointSection id="about" method="GET" path="/about" title="About">
      <div className="max-w-3xl space-y-3 leading-relaxed">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <dl className="mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <dt className="font-mono text-xs text-muted">education</dt>
          <dd className="mt-2">
            <p className="font-medium">{education.school}</p>
            <p className="mt-1 text-sm text-muted">
              {education.degree} · {education.dates} · {education.place}
            </p>
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <dt className="font-mono text-xs text-muted">problem solving</dt>
          <dd className="mt-2">
            <p className="font-medium">{problemSolving.total} DSA problems</p>
            <p className="mt-1 text-sm text-muted">On {problemSolving.platforms.join(", ")}, outside coursework.</p>
          </dd>
        </div>
      </dl>
    </EndpointSection>
  );
}

// WS /console : the interactive terminal.
export function Console() {
  return (
    <section aria-labelledby="terminal-title" className="border-b border-divider px-4 py-14 sm:px-8 lg:px-12">
      <p id="terminal" className="flex items-center gap-2 font-mono text-sm text-muted">
        <MethodBadge method="WS" />
        <span className="text-fg">/console</span>
      </p>
      <h2 id="terminal-title" className="mt-3 text-3xl font-semibold tracking-tight text-fg">
        Console
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        A small shell over this site&apos;s data. Try <code className="font-mono text-sm text-fg">now</code>,{" "}
        <code className="font-mono text-sm text-fg">cat ripple</code> or{" "}
        <code className="font-mono text-sm text-fg">curl /api/profile.json</code>.
      </p>
      <div className="mt-6 max-w-4xl">
        <Terminal />
      </div>
    </section>
  );
}

const requestBody = pretty({
  from: "you@company.com",
  role: "SWE intern, summer 2027",
  message: "Let's talk.",
});

// POST /contact
export function Contact() {
  return (
    <EndpointSection
      id="contact"
      method="POST"
      path="/contact"
      title="Get in touch"
      aside={
        <CodePanel
          title="request body"
          tabs={[{ label: "application/json", content: <Json source={requestBody} scroll={false} /> }]}
        />
      }
    >
      <p className="max-w-xl text-lg leading-relaxed text-muted">
        I&apos;m looking for SWE internships. Email is the fastest way to reach me; the request body here is
        only a suggestion.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={`mailto:${profile.email}?subject=${encodeURIComponent("SWE internship")}`}
          className="rounded-md bg-accent px-4 py-2.5 font-mono text-sm font-medium text-ink-fg hover:opacity-90"
        >
          {profile.email}
        </a>
        {profile.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="group/link inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2.5 text-sm hover:border-fg"
          >
            {link.label}
            <ArrowIcon className="transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5" />
          </a>
        ))}
      </div>
    </EndpointSection>
  );
}
