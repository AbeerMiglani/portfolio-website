import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { Pixel, SectionHeader } from "./SectionHeader";

export function Experience() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeader
        id="experience"
        eyebrow="Experience"
        action={
          <a
            href={profile.resume}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-ink-fg shadow-sm hover:opacity-90"
          >
            Full résumé →
          </a>
        }
      >
        Where I&apos;ve <Pixel>shipped.</Pixel>
      </SectionHeader>

      <div className="grid gap-4">
        {experience.map((role) => (
          <article
            key={role.org}
            className="grid gap-6 rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-border sm:p-8 md:grid-cols-[1fr_2fr]"
          >
            <div>
              <p className="eyebrow">
                {role.start}
                {role.end !== role.start && ` – ${role.end}`} · {role.place}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                {role.orgUrl ? (
                  <a href={role.orgUrl} className="hover:underline">
                    {role.org}
                  </a>
                ) : (
                  role.org
                )}
              </h3>
              <p className="mt-1 text-muted">{role.role}</p>
            </div>
            <div className="flex flex-col">
              <ul className="space-y-3 border-t border-divider pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-8">
                {role.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-fg/90">
                    <span aria-hidden="true" className="text-muted">
                      +
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
              {role.repo && (
                <a
                  href={role.repo}
                  className="mt-6 self-start border-b border-border pb-0.5 text-sm text-muted hover:border-fg hover:text-fg md:ml-8"
                >
                  See the scraper on GitHub →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type Tile = {
  number: string;
  label: string;
  title: string;
  body: string;
  background: string;
  color: string;
};

const tiles: Tile[] = [
  {
    number: "01",
    label: "Education",
    title: "Shiv Nadar",
    body: `${profile.education.degree} · ${profile.education.dates}`,
    background: "var(--surface)",
    color: "var(--fg)",
  },
  {
    number: "02",
    label: "Problem solving",
    title: "100+ DSA",
    body: "LeetCode, Codeforces, CodeChef and HackerRank, including 75 on LeetCode.",
    background: "var(--card-orange)",
    color: "var(--card-orange-fg)",
  },
  {
    number: "03",
    label: "Now learning",
    title: "Rust",
    body: "Already shipping it: a PyO3 extension that speeds up Ripple's hottest path.",
    background: "var(--card-pink)",
    color: "var(--card-pink-fg)",
  },
  {
    number: "04",
    label: "Interests",
    title: "Systems",
    body: profile.interests.join(" · "),
    background: "var(--card-sky)",
    color: "var(--card-sky-fg)",
  },
];

export function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="eyebrow">About</p>
          <h2 id="about" className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Everything else about <Pixel>{profile.handle}.</Pixel>
          </h2>
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-muted">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <li
            key={tile.number}
            style={{ background: tile.background, color: tile.color }}
            className="flex min-h-48 flex-col justify-between gap-8 rounded-2xl p-6 shadow-sm ring-1 ring-border sm:min-h-72"
          >
            <div className="text-right">
              <p className="text-5xl font-semibold tracking-[-0.05em]">{tile.number}</p>
              <p className="mt-1 font-mono text-[0.62rem] tracking-widest uppercase opacity-75">{tile.label}</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight">{tile.title}</p>
              <p className="mt-2 text-sm opacity-80">{tile.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-2xl bg-surface p-6 ring-1 ring-border sm:p-8">
        <p className="eyebrow">Toolbox</p>
        <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(profile.skills).map(([group, items]) => (
            <div key={group}>
              <dt className="font-mono text-xs text-muted">{group}</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span key={item} className="rounded-md bg-chip px-2 py-1 text-sm">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-8 rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-border sm:p-12 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 id="contact" className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Let&apos;s <Pixel>talk.</Pixel>
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Looking for SWE internships. Email is the fastest way to reach me.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-lg bg-ink px-5 py-3 font-medium text-ink-fg shadow-md hover:opacity-90"
          >
            {profile.email}
          </a>
          {profile.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg border border-border px-5 py-3 font-medium hover:border-fg"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
