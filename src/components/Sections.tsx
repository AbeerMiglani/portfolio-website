import type { ReactNode } from "react";
import { earlier } from "@/content/earlier";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { SectionHeader } from "./SectionHeader";
import { ArrowIcon } from "./ArrowIcon";

// Pre-university work, kept to one line each under Projects.
export function Earlier() {
  return (
    <div className="mt-10 border-t border-divider pt-6">
      <h3 className="font-mono text-xs text-muted"># earlier</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {earlier.map((item) => (
          <li key={item.org} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-xs text-muted">{item.when}</span>
            <span>
              <span className="font-medium">{item.what}</span> at{" "}
              {item.orgUrl ? (
                <a href={item.orgUrl} className="underline decoration-border underline-offset-4 hover:decoration-accent">
                  {item.org}
                </a>
              ) : (
                item.org
              )}
              . <span className="text-muted">{item.summary}</span>
            </span>
            {item.repo && (
              <a
                href={item.repo}
                className="group/link inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-fg"
              >
                source
                <span className="sr-only"> for the {item.org} project</span>
                <ArrowIcon className="transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// "About" rendered as a Unix manual page: `man abeer`.
export function About() {
  const { education, problemSolving } = profile;
  const manTitle = `${profile.handle.toUpperCase()}(1)`;
  const seeAlso = [
    ...projects.filter((p) => p.repo).map((p) => ({ label: `${p.shortName}(1)`, href: p.repo! })),
    ...profile.links.map((l) => ({ label: l.label.toLowerCase(), href: l.href })),
  ];

  return (
    <section className="border-y border-divider bg-band">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeader id="about" command={`man ${profile.handle}`}>
          About
        </SectionHeader>

        <article className="rounded-xl border border-border bg-surface p-6 sm:p-10">
          <div className="flex justify-between font-mono text-xs text-muted" aria-hidden="true">
            <span>{manTitle}</span>
            <span className="hidden sm:inline">Portfolio Manual</span>
            <span>{manTitle}</span>
          </div>

          <div className="mt-8 space-y-8">
            <ManSection title="Name">
              <p>
                <span className="font-mono font-medium">{profile.handle}</span> — {profile.role.toLowerCase()}
              </p>
            </ManSection>

            <ManSection title="Synopsis">
              <p className="font-mono text-sm">
                <span className="font-medium">{profile.handle}</span> [--cpp] [--c] [--learning rust]
                [--open-to internships]
              </p>
            </ManSection>

            <ManSection title="Description">
              <div className="max-w-3xl space-y-3 leading-relaxed">
                {profile.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </ManSection>

            <ManSection title="Education">
              <p className="font-medium">{education.school}</p>
              <p className="text-muted">
                {education.degree} · {education.dates} · {education.place}
              </p>
              <p className="mt-2 text-sm text-muted">
                Outside coursework: {problemSolving.total} DSA problems, {problemSolving.leetcode} of them on LeetCode.
              </p>
            </ManSection>

            <ManSection title="Skills">
              <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {Object.entries(profile.skills).map(([group, items]) => (
                  <div key={group}>
                    <dt className="font-mono text-xs text-muted">--{group.toLowerCase().replace(/[^a-z]+/g, "-")}</dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {items.map((item) => (
                        <span key={item} className="rounded bg-chip px-2 py-0.5 text-sm">
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </ManSection>

            <ManSection title="See also">
              <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm">
                {seeAlso.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="underline decoration-border underline-offset-4 hover:decoration-accent"
                  >
                    {item.label}
                  </a>
                ))}
              </p>
            </ManSection>
          </div>

          <div className="mt-10 flex justify-between font-mono text-xs text-muted" aria-hidden="true">
            <span>{profile.siteUrl.replace("https://", "")}</span>
            <span>{manTitle}</span>
          </div>
        </article>
      </div>
    </section>
  );
}

function ManSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <h3 className="font-mono text-sm font-medium tracking-wide text-accent uppercase">{title}</h3>
      <div>{children}</div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-panel-border bg-panel p-8 text-panel-fg sm:p-12">
        <p className="font-mono text-sm opacity-70" aria-hidden="true">
          <span className="text-accent">$</span> mail {profile.email}
        </p>
        <h2 id="contact" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Get in touch
        </h2>
        <p className="mt-3 max-w-md opacity-75">
          I&apos;m looking for SWE internships. Email is the fastest way to reach me.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-md bg-accent px-4 py-2.5 font-mono text-sm font-medium text-ink-fg hover:opacity-90"
          >
            {profile.email}
          </a>
          {profile.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group/link inline-flex items-center gap-1.5 rounded-md border border-current/25 px-4 py-2.5 text-sm hover:border-current"
            >
              {link.label}
              <ArrowIcon className="transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
