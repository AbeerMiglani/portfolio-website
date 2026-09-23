"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { complete, run, welcome, type Line, type Session } from "@/lib/terminal";

type Entry = { id: number; input?: string; lines: Line[] };

const PROMPT = "abeer@portfolio:~$";

const suggestions = ["help", "whoami", "ls", "cat redis", "cat ripple", "skills", "contact", "ping"];

export function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, lines: welcome }]);
  const [input, setInput] = useState("");
  const [cursor, setCursor] = useState<number | null>(null);
  const session = useRef<Session>({ history: [], store: new Map() });
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  function execute(command: string) {
    const trimmed = command.trim();
    if (trimmed) session.current.history.push(trimmed);
    const result = run(trimmed, session.current);
    const entry = { id: nextId.current++, input: command, lines: result.lines };
    let cleared = false;

    for (const effect of result.effects ?? []) {
      if (effect.type === "clear") cleared = true;
      if (effect.type === "open") window.open(effect.href, "_blank", "noopener,noreferrer");
      if (effect.type === "theme") {
        document.documentElement.dataset.theme = effect.theme;
        try {
          localStorage.setItem("theme", effect.theme);
        } catch {
          // Storage can be blocked; the theme still applies for this visit.
        }
      }
    }

    setEntries((prev) => (cleared ? [] : [...prev, entry]));
    setInput("");
    setCursor(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const history = session.current.history;
    if (event.key === "Enter") {
      event.preventDefault();
      execute(input);
    } else if (event.key === "Tab") {
      event.preventDefault();
      setInput(complete(input));
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
    <div className="flex flex-col gap-4">
      <div
        className="overflow-hidden rounded-xl bg-[#161618] font-mono text-[0.8rem] leading-relaxed text-[#e6e6e6] shadow-2xl ring-1 ring-black/20"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="size-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-3 text-xs text-white/45">abeer@portfolio — zsh</span>
        </div>

        <div ref={scrollRef} className="h-[22rem] overflow-y-auto px-4 py-3 sm:h-[26rem]">
          <div role="log" aria-live="polite" aria-label="Terminal output">
            {entries.map((entry) => (
              <div key={entry.id} className="mb-2">
                {entry.input !== undefined && (
                  <p className="break-all">
                    <span className="text-[#3fcf8e]">{PROMPT}</span> {entry.input}
                  </p>
                )}
                {entry.lines.map((line, i) => (
                  <OutputLine key={i} line={line} />
                ))}
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2">
            <span className="shrink-0 text-[#3fcf8e]" aria-hidden="true">
              {PROMPT}
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
              className="min-w-0 flex-1 bg-transparent text-[#e6e6e6] caret-[#3fcf8e] outline-none"
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
            className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted hover:border-fg hover:text-fg"
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
          className="text-[#7cc4ff] underline decoration-white/20 underline-offset-2 hover:decoration-[#7cc4ff]"
        >
          {line.label}
        </a>
      </p>
    );
  }
  const tone =
    line.tone === "muted"
      ? "text-white/50"
      : line.tone === "accent"
        ? "text-[#3fcf8e]"
        : line.tone === "error"
          ? "text-[#ff7b72]"
          : "";
  return <p className={`whitespace-pre-wrap ${tone}`}>{line.text}</p>;
}
