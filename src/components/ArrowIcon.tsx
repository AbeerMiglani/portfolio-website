// Up-right arrow for links that leave the site. Drawn as SVG because IBM Plex
// has no "↗" glyph, so the text character fell back to a mismatched font.
// Square caps and joins echo Plex's squared-off stroke ends; the size follows
// the surrounding text and the colour follows `currentColor`.
export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={`inline-block size-[0.8em] shrink-0 ${className}`}
    >
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  );
}
