import { profile } from "@/content/profile";
import { ArrowIcon } from "./ArrowIcon";
import { Terminal } from "./Terminal";

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="font-mono text-sm text-muted">
            <span className="text-accent">$</span> whoami
          </p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-fg sm:text-6xl">{profile.name}</h1>
          <p className="mt-4 text-xl text-fg sm:text-2xl">{profile.tagline}</p>
          <p className="mt-5 max-w-lg leading-relaxed text-muted">{profile.pitch}</p>

          <p className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent-soft px-2.5 py-1 font-mono text-xs text-fg">
            <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
            {profile.status}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-ink-fg hover:opacity-90"
            >
              See my projects
            </a>
            <a
              href={profile.resume}
              className="rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:border-fg"
            >
              Résumé (PDF)
            </a>
            {profile.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group/link inline-flex items-center gap-1 px-2 py-2.5 text-sm text-muted hover:text-fg"
              >
                {link.label}
                <ArrowIcon className="transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5" />
              </a>
            ))}
          </div>

          <p className="mt-8 font-mono text-xs text-muted">
            <span aria-hidden="true" className="text-accent">
              #{" "}
            </span>
            Try <code className="text-fg">cat redis</code> or <code className="text-fg">help</code> in the{" "}
            <a href="#terminal" className="underline decoration-border underline-offset-4 hover:text-fg">
              terminal
            </a>
            .
          </p>
        </div>

        <Terminal />
      </div>
    </section>
  );
}
