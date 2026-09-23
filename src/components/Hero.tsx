import type { CSSProperties } from "react";
import { profile } from "@/content/profile";

export function Hero() {
  const links = [
    ...profile.links,
    { label: "Email", href: `mailto:${profile.email}` },
  ];

  return (
    <section id="top" className="py-20 sm:py-28">
      <p className="font-mono text-sm text-muted">
        <span className="text-accent">$</span> whoami
      </p>
      <h1 className="mt-3 font-mono text-4xl font-bold sm:text-6xl">
        <span
          className="typed"
          style={{ "--chars": profile.name.length } as CSSProperties}
        >
          {profile.name}
        </span>
        <span className="cursor" aria-hidden="true" />
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-fg/90 sm:text-xl">
        {profile.pitch}
      </p>
      <p className="mt-4 flex items-center gap-2 font-mono text-sm text-muted">
        <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
        {profile.status}
      </p>
      <ul className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
        <li>
          <a
            href={profile.resume}
            className="inline-block rounded bg-accent px-4 py-2 font-semibold text-accent-contrast hover:opacity-90"
          >
            résumé.pdf
          </a>
        </li>
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="inline-block rounded border border-border px-4 py-2 hover:border-accent hover:text-accent"
            >
              {link.label.toLowerCase()}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
