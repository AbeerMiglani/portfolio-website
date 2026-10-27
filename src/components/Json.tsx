import type { ReactNode } from "react";

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],:])/g;

/** Colours JSON text (or JSON with "…" elisions) for the dark code panels. */
export function highlightJson(source: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of source.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) out.push(source.slice(last, index));
    const [token, string, colon, literal, number] = match;
    const key = out.length;
    if (string && colon) {
      out.push(
        <span key={key} className="json-key">
          {string}
        </span>,
        <span key={`${key}:`} className="json-punct">
          {colon}
        </span>,
      );
    } else if (string) {
      out.push(<span key={key} className="json-string">{string}</span>);
    } else if (literal) {
      out.push(<span key={key} className="json-literal">{literal}</span>);
    } else if (number) {
      out.push(<span key={key} className="json-number">{number}</span>);
    } else {
      out.push(<span key={key} className="json-punct">{token}</span>);
    }
    last = index + token.length;
  }
  if (last < source.length) out.push(source.slice(last));
  return out;
}

/**
 * A JSON block. On its own it scrolls sideways and is focusable, so keyboard
 * users can scroll it too; inside a scrolling container, pass `scroll={false}`.
 */
export function Json({ source, className = "", scroll = true }: { source: string; className?: string; scroll?: boolean }) {
  return (
    <pre
      tabIndex={scroll ? 0 : undefined}
      className={`font-mono text-[0.72rem] leading-relaxed text-panel-fg ${
        scroll ? "overflow-x-auto rounded focus-visible:outline-2 focus-visible:outline-[#4fc3dc]" : "whitespace-pre"
      } ${className}`}
    >
      <code>{highlightJson(source)}</code>
    </pre>
  );
}
