import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";

const sections = ["projects", "experience", "about", "contact"];

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/85 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 font-mono text-sm sm:px-6"
      >
        <a href="#top" className="shrink-0 hover:text-accent">
          <span className="text-accent">{profile.handle}@portfolio</span>
          <span className="text-muted">:~$</span>
        </a>
        <div className="flex items-center gap-4">
          <ul className="hidden gap-4 md:flex">
            {sections.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="text-muted hover:text-fg">
                  {id}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <a
            href={profile.resume}
            className="rounded bg-accent px-3 py-1 text-xs font-semibold text-accent-contrast hover:opacity-90"
          >
            résumé
          </a>
        </div>
      </nav>
    </header>
  );
}
