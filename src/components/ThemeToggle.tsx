"use client";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      className="rounded border border-border px-2 py-1 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <span className="theme-icon-light">light</span>
      <span className="theme-icon-dark">dark</span>
    </button>
  );
}
