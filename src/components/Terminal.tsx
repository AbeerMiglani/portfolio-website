"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { complete, preloaded, run, welcome, type Line, type Session } from "@/lib/terminal";
import { applyTheme } from "@/lib/theme";

type Entry = { id: number; input?: string; lines: Line[] };

// Bash-style prompt: user@host, then the path. Reads as "abeer@portfolio:~$".
function Prompt() {
  return (
    <>
      <span className="font-medium text-term-prompt">abeer@portfolio</span>:<span className="font-medium text-term-path">~</span>$
    </>
  );
}

const suggestions = ["help", "now", "cat ripple", "curl /api/profile.json", "ls", "skills", "contact", "ping"];

// Deterministic, so server and client render the same first frame.
const initialEntries: Entry[] = [
  { id: 0, lines: welcome },
  ...preloaded.map((command, i) => ({
    id: i + 1,
    input: command,
    lines: run(command, { history: [], store: new Map(), tty: false }).lines,
  })),
];

export function Terminal() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [input, setInput] = useState("");
  const [cursor, setCursor] = useState<number | null>(null);
  const [tty, setTty] = useState(false);
  const session = useRef<Session>({ history: [], store: new Map(), tty: false });
  const nextId = useRef(initialEntries.length);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries, tty]);

  // Full-screen mode: lock page scroll and let Esc leave from anywhere.
  useEffect(() => {
    if (!tty) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setFullScreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [tty]);

  function setFullScreen(on: boolean) {
    session.current.tty = on;
    setTty(on);
  }

  function execute(command: string) {
    const trimmed = command.trim();
    if (trimmed) session.current.history.push(trimmed);
    const result = run(trimmed, session.current);
    const entry = { id: nextId.current++, input: command, lines: result.lines };
    let cleared = false;

    for (const effect of result.effects ?? []) {
      if (effect.type === "clear") cleared = true;
      if (effect.type === "open") window.open(effect.href, "_blank", "noopener,noreferrer");
      if (effect.type === "tty") setFullScreen(effect.on);
      if (effect.type === "theme") applyTheme(effect.theme);
    }

    setEntries((prev) => (cleared ? [] : [...prev, entry]));
    result.pending?.then((more) =>
      setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, lines: [...e.lines, ...more] } : e))),
    );
    setInput("");
    setCursor(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const history = session.current.history;
    if (event.key === "Enter") {
      event.preventDefault();
      execute(input);
    } else if (event.key === "Tab" && !event.shiftKey) {
      // Only hold on to Tab when it completes something; otherwise it moves
      // focus as usual, so keyboard users can always leave the terminal.
      const completed = complete(input);
      if (completed !== input) {
        event.preventDefault();
        setInput(completed);
      }
    } else if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next]);
    } else if (event.key === "ArrowDown" && cursor !== null) {
      event.preventDefault();
      const next = cursor + 1;
      setCursor(next < history.length ? next : null);
      setInput(next < history.length ? history[next] : "");
    } else if (event.key.toLowerCase() === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div
        className={`overflow-hidden bg-term-bg font-mono text-[0.8rem] leading-relaxed text-term-fg ${
          tty
            ? "fixed inset-0 z-50 flex flex-col sm:text-sm"
            : "rounded-xl shadow-xl ring-1 ring-black/25 has-[input:focus-visible]:ring-muted"
        }`}
        aria-label={tty ? "Terminal, full screen. Press Escape to leave." : undefined}
        role={tty ? "region" : undefined}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-term-fg/10 px-4 py-2.5">
          <span className="text-xs text-term-dim">abeer@portfolio: ~</span>
          {tty ? (
            <button
              type="button"
              onClick={() => setFullScreen(false)}
              className="ml-auto text-[0.65rem] tracking-wider text-term-dim uppercase hover:text-term-fg"
            >
              esc · exit
            </button>
          ) : (
            <span className="ml-auto text-[0.65rem] tracking-wider text-term-dim uppercase">interactive</span>
          )}
        </div>

        <div ref={scrollRef} className={`overflow-y-auto px-4 py-3 ${tty ? "min-h-0 flex-1 sm:px-8" : "h-72 sm:h-80"}`}>
          <div role="log" aria-live="polite" aria-label="Terminal output">
            {entries.map((entry) => (
              <div key={entry.id} className="mb-2">
                {entry.input !== undefined && (
                  <p className="break-all">
                    <Prompt /> {entry.input}
                  </p>
                )}
                {entry.lines.map((line, i) => (
                  <OutputLine key={i} line={line} />
                ))}
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2">
            <span className="shrink-0" aria-hidden="true">
              <Prompt />
            </span>
            <span className="sr-only">Terminal command</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setCursor(null);
              }}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              className="min-w-0 flex-1 bg-transparent text-term-fg caret-term-fg outline-none"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Example commands">
        {suggestions.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => execute(command)}
            className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}

function OutputLine({ line }: { line: Line }) {
  if (line.kind === "blank") return <p aria-hidden="true">&nbsp;</p>;
  if (line.kind === "link") {
    return (
      <p className="whitespace-pre-wrap">
        <a
          href={line.href}
          target={line.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="text-term-link underline decoration-term-link/40 underline-offset-2 hover:decoration-term-link"
        >
          {line.label}
        </a>
      </p>
    );
  }
  const tone =
    line.tone === "muted"
      ? "text-term-dim"
      : line.tone === "accent"
        ? "text-term-accent"
        : line.tone === "error"
          ? "text-term-error"
          : "";
  return <p className={`whitespace-pre-wrap ${tone}`}>{line.text}</p>;
}
