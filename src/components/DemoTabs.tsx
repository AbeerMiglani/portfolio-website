"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type DemoTab = { label: string; content: ReactNode };

// The "try it" card on a project. With more than one demo it shows tabs
// (WAI-ARIA tabs pattern, like CodePanel); every panel stays mounted so a
// running demo keeps its state. Visitors without JavaScript see the first.
export function DemoTabs({ tabs }: { tabs: DemoTab[] }) {
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
    <div className="rounded-lg border border-border bg-surface p-1">
      <div className="flex items-center justify-between gap-3 px-3 pt-2 pb-1">
        <p className="font-mono text-[0.65rem] tracking-wider text-muted uppercase">try it</p>
        {tabs.length > 1 && (
          <div role="tablist" aria-label="Demos" className="flex gap-1">
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
                className="rounded-md px-2.5 py-1 font-mono text-xs text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent aria-selected:bg-accent-soft aria-selected:text-fg"
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          id={`${id}-panel-${i}`}
          role={tabs.length > 1 ? "tabpanel" : undefined}
          aria-labelledby={tabs.length > 1 ? `${id}-tab-${i}` : undefined}
          hidden={active !== i}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
