export type Theme = "light" | "dark";

/** Browser toolbar colours; they match --bg in globals.css. */
export const themeColors: Record<Theme, string> = { light: "#faf9f6", dark: "#121110" };

/** Applies and remembers the visitor's choice. Used by ThemeToggle and the terminal's `theme`. */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  // Both theme-color tags (one per system scheme) get the chosen colour, so the
  // toolbar follows the page rather than the system setting.
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.setAttribute("content", themeColors[theme]);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage can be blocked; the theme still applies for this visit.
  }
}
