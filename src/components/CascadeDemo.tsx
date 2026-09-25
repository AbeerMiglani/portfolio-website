"use client";

import { useEffect, useRef, useState } from "react";
import { cascade, edges, nodeName, nodes } from "@/lib/cascade";

const WAVE_MS = 550;
const VIEW = { w: 330, h: 178 };
const DEFAULT_START = 0;
const HOSPITAL = nodes.findIndex((n) => n.kind === "H");

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The Ripple card's artwork. Click a node to knock it out and watch the
// overload cascade spread wave by wave (see src/lib/cascade.ts for the model).
export function CascadeDemo() {
  const [start, setStart] = useState<number | null>(DEFAULT_START);
  const [shown, setShown] = useState(() => cascade(DEFAULT_START).length);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const waves = start === null ? [] : cascade(start);
  const waveOf = new Map<number, number>();
  waves.slice(0, shown).forEach((wave, w) => wave.forEach((i) => waveOf.set(i, w)));
  const done = shown >= waves.length;

  useEffect(() => () => stop(), []);

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }

  function knockOut(i: number) {
    stop();
    const total = cascade(i).length;
    setStart(i);
    if (prefersReducedMotion()) {
      setShown(total);
      return;
    }
    setShown(1);
    timer.current = setInterval(() => {
      setShown((n) => {
        if (n + 1 >= total) stop();
        return Math.min(n + 1, total);
      });
    }, WAVE_MS);
  }

  function reset() {
    stop();
    setStart(null);
    setShown(0);
  }

  const down = waveOf.size;
  const status =
    start === null
      ? "All 9 nodes healthy. Pick one to knock out."
      : !done
        ? `${nodeName(start)} failed…`
        : waves.length === 1
          ? `${nodeName(start)} failed. Contained: nothing else overloaded.`
          : `${nodeName(start)} failed → ${waves.length - 1} wave${waves.length > 2 ? "s" : ""}, ${down} of ${nodes.length} down.${
              waveOf.has(HOSPITAL) && start !== HOSPITAL ? ` Hospital lost in wave ${waveOf.get(HOSPITAL)}.` : ""
            }`;

  return (
    <div className="rounded-lg bg-chip/60 p-4">
      <div role="group" aria-label="Cascade simulator: knock out a node" className="relative" style={{ aspectRatio: `${VIEW.w} / ${VIEW.h}` }}>
        <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="absolute inset-0 size-full" aria-hidden="true">
          {edges.map(([a, b]) => {
            const spread = waveOf.has(a) && waveOf.has(b);
            return (
              <line
                key={`${a}-${b}`}
                x1={nodes[a].x}
                y1={nodes[a].y}
                x2={nodes[b].x}
                y2={nodes[b].y}
                strokeWidth={spread ? 2 : 1.25}
                className={`transition-colors duration-300 ${spread ? "stroke-accent" : "stroke-border"}`}
                strokeDasharray={spread ? undefined : "3 3"}
              />
            );
          })}
        </svg>
        {nodes.map((node, i) => {
          const wave = waveOf.get(i);
          const state =
            wave === undefined
              ? "border-border bg-surface text-fg"
              : wave === 0
                ? "border-accent bg-accent text-ink-fg ring-4 ring-accent/25"
                : wave === 1
                  ? "border-accent bg-accent-soft text-fg"
                  : "border-dashed border-accent bg-surface text-fg";
          return (
            <button
              key={i}
              type="button"
              onClick={() => knockOut(i)}
              aria-label={`${nodeName(i)}, ${wave === undefined ? "healthy" : wave === 0 ? "knocked out" : `failed in wave ${wave}`}`}
              className={`absolute grid aspect-square w-[8.5%] min-w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-[1.75px] font-mono text-[11px] font-medium transition-colors duration-300 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${state}`}
              style={{ left: `${(node.x / VIEW.w) * 100}%`, top: `${(node.y / VIEW.h) * 100}%` }}
            >
              <span aria-hidden="true">{node.kind}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[0.62rem] text-muted">
        <p aria-live="polite" className="text-fg">
          {status}
        </p>
        {start !== null && (
          <button type="button" onClick={reset} className="underline decoration-border underline-offset-2 hover:text-fg hover:decoration-accent">
            reset
          </button>
        )}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.62rem] text-muted" aria-hidden="true">
        <Legend className="bg-accent" label="knocked out" />
        <Legend className="bg-accent-soft ring-1 ring-accent" label="wave 1" />
        <Legend className="border border-dashed border-accent bg-surface" label="wave 2+" />
        <Legend className="bg-surface ring-1 ring-border" label="healthy" />
        <span>P power · W water · T transit · C comms · H hospital</span>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}
