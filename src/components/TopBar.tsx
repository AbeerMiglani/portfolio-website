import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";

const sections = [
  { id: "terminal", label: "Terminal" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-divider bg-bg/85 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <div className="flex items-center gap-8">
          <a href="#top" className="flex items-center gap-2">
            <span className="font-pixel text-lg text-fg">{profile.handle}</span>
            <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-[0.6rem] font-medium uppercase tracking-wider text-ink-fg">
              swe
            </span>
          </a>
          <ul className="hidden gap-6 text-sm text-muted md:flex">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="hover:text-fg">
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a
            href={profile.resume}
            className="hidden rounded-full border border-border bg-surface px-4 py-1.5 text-sm hover:border-fg sm:inline-block"
          >
            Résumé ↗
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-lg bg-ink px-3.5 py-1.5 text-sm font-medium text-ink-fg shadow-sm hover:opacity-90"
          >
            Get in touch
          </a>
        </div>
      </nav>
    </header>
  );
}
