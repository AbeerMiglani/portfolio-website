import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";

const sections = ["projects", "experience", "about", "contact"];

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-divider bg-bg/85 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 font-mono text-sm sm:px-6"
      >
        <a href="#top" className="shrink-0 font-medium text-fg">
          {profile.handle}
          <span className="text-muted">@portfolio</span>
          <span className="text-accent">:~$</span>
        </a>
        <div className="flex items-center gap-5">
          <ul className="hidden gap-5 text-muted md:flex">
            {sections.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="hover:text-fg">
                  {id}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <a
            href={profile.resume}
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-ink-fg hover:opacity-90"
          >
            resume.pdf
          </a>
        </div>
      </nav>
    </header>
  );
}
