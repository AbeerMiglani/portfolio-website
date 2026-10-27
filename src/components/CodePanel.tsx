"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type Tab = { label: string; content: ReactNode };

// A dark code panel with tabs (e.g. curl / Go / Python), following the WAI-ARIA
// tabs pattern: arrow keys move between tabs, Tab moves into the panel. The
// first tab is what visitors without JavaScript see.
export function CodePanel({ tabs, title }: { tabs: Tab[]; title?: string }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-panel-border bg-panel text-panel-fg">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-2">
        <div role="tablist" aria-label={title ?? "Code examples"} className="flex min-w-0 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${id}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`shrink-0 border-b-2 px-3 py-2.5 font-mono text-xs focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#4fc3dc] ${
                active === i ? "border-[#4fc3dc] text-panel-fg" : "border-transparent text-panel-fg/60 hover:text-panel-fg"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {title && <span className="hidden shrink-0 pr-2 font-mono text-[0.65rem] text-panel-fg/55 sm:inline">{title}</span>}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          id={`${id}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
          tabIndex={0}
          className="overflow-x-auto px-4 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#4fc3dc]"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
