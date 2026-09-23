import type { ReactNode } from "react";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { SectionHeader } from "./SectionHeader";

export function Experience() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeader id="experience" command="cat experience.log">
        Experience
      </SectionHeader>

      <ol className="space-y-4">
        {experience.map((role) => (
          <li
            key={role.org}
            className="grid gap-6 rounded-xl border border-border bg-surface p-6 sm:p-8 md:grid-cols-[1fr_2fr]"
          >
            <div>
              <p className="font-mono text-xs text-muted">
                {role.start}
                {role.end !== role.start && ` – ${role.end}`} · {role.place}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                {role.orgUrl ? (
                  <a href={role.orgUrl} className="hover:text-accent">
                    {role.org}
                  </a>
                ) : (
                  role.org
                )}
              </h3>
              <p className="mt-1 text-sm text-muted">{role.role}</p>
            </div>
            <div className="flex flex-col">
              <ul className="space-y-2.5">
                {role.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5">
                    <span aria-hidden="true" className="font-mono text-accent">
                      ›
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
              {role.repo && (
                <a
                  href={role.repo}
                  className="mt-5 self-start font-mono text-sm text-muted underline decoration-border underline-offset-4 hover:text-fg hover:decoration-accent"
                >
                  {role.repo.replace("https://", "")} ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
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
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
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
              <span className="font-medium">{profile.handle}</span> [--cpp] [--python] [--learning rust]
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
          </ManSection>

          <ManSection title="Problem solving">
            <p>
              {problemSolving.total} data structures and algorithms problems across{" "}
              {problemSolving.platforms.join(", ")}, including{" "}
              <span className="font-medium">{problemSolving.leetcode} on LeetCode</span>.
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

          <ManSection title="Interests">
            <p>{profile.interests.join(", ")}.</p>
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
              className="rounded-md border border-current/25 px-4 py-2.5 text-sm hover:border-current"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
