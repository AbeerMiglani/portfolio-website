"use client";

import { useEffect, useRef, useState } from "react";
import { edges, nodeName, nodes, simulate } from "@/lib/cascade";

const WAVE_MS = 650;
const VIEW = { w: 330, h: 178 };
const DEFAULT_START = 6; // Water plant 2: a four-wave chain that ends at the hospital
const HOSPITAL = nodes.findIndex((n) => n.kind === "H");
const NAMES = nodes.map((_, i) => nodeName(i));
const CASCADES = nodes.map((_, i) => simulate(i));

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The Ripple card's artwork. Click a node to knock it out: its load moves to
// its neighbours, and any that can't carry it fail in the next wave. The links
// the failure travelled along light up (see src/lib/cascade.ts).
export function CascadeDemo() {
  const [start, setStart] = useState<number | null>(DEFAULT_START);
  const [shown, setShown] = useState(CASCADES[DEFAULT_START].length);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const group = useRef<HTMLDivElement>(null);

  const waves = start === null ? [] : CASCADES[start];
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
    const total = CASCADES[i].length;
    setStart(i);
    if (total === 1 || prefersReducedMotion()) {
      setShown(total);
      return;
    }
    // The count lives in the closure and each interval clears only itself, so
    // a late tick from an earlier cascade can't stop a newer one.
    let n = 1;
    setShown(n);
    const id = setInterval(() => {
      setShown(++n);
      if (n >= total) {
        clearInterval(id);
        if (timer.current === id) timer.current = null;
      }
    }, WAVE_MS);
    timer.current = id;
  }

  function reset() {
    stop();
    setStart(null);
    setShown(0);
    // The reset button unmounts, so move focus to the first node rather than losing it.
    group.current?.querySelector("button")?.focus();
  }

  const status =
    start === null
      ? "Click a node to knock it out. Its load moves to its neighbours."
      : !done
        ? `${NAMES[start]} down…`
        : waves.length === 1
          ? `${NAMES[start]} down. Its neighbours absorbed the load.`
          : `${NAMES[start]} down → ${waves.length - 1} wave${waves.length > 2 ? "s" : ""}, ${waveOf.size} of ${nodes.length} down.${
              waveOf.has(HOSPITAL) && start !== HOSPITAL ? ` Hospital lost in wave ${waveOf.get(HOSPITAL)}.` : ""
            }`;

  return (
    <div className="rounded-lg bg-chip/60 p-4">
      <div
        ref={group}
        role="group"
        aria-label="Cascade simulator: knock out a node"
        className="relative"
        style={{ aspectRatio: `${VIEW.w} / ${VIEW.h}` }}
      >
        <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="absolute inset-0 size-full" aria-hidden="true">
          {edges.map(([a, b]) => {
            const wa = waveOf.get(a);
            const wb = waveOf.get(b);
            // The failure travelled along this link: one end fell a wave after the other.
            const path = wa !== undefined && wb !== undefined && Math.abs(wa - wb) === 1;
            const dead = !path && (wa !== undefined || wb !== undefined);
            return (
              <line
                key={`${a}-${b}`}
                x1={nodes[a].x}
                y1={nodes[a].y}
                x2={nodes[b].x}
                y2={nodes[b].y}
                strokeWidth={path ? 2.25 : 1.25}
                strokeDasharray={dead ? "3 4" : undefined}
                className={`transition-colors duration-300 ${path ? "stroke-accent" : "stroke-border"}`}
              />
            );
          })}
        </svg>
        {nodes.map((node, i) => {
          const wave = waveOf.get(i);
          const state =
            wave === 0
              ? "border-accent bg-accent text-ink-fg forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]"
              : wave !== undefined
                ? "border-accent bg-accent-soft text-fg"
                : "border-border bg-surface text-fg";
          // Named with sr-only text rather than aria-label, so the visible
          // letter and wave number never have to match the name.
          return (
            <button
              key={i}
              type="button"
              onClick={() => knockOut(i)}
              className={`absolute grid aspect-square w-[8.5%] min-w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-[1.75px] font-mono text-[11px] font-medium transition-colors duration-300 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${state}`}
              style={{ left: `${(node.x / VIEW.w) * 100}%`, top: `${(node.y / VIEW.h) * 100}%` }}
            >
              <span aria-hidden="true">{node.kind}</span>
              <span className="sr-only">
                {NAMES[i]}, {wave === undefined ? "working" : wave === 0 ? "knocked out" : `failed in wave ${wave}`}
              </span>
              {wave !== undefined && wave > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] leading-none text-ink-fg forced-colors:border"
                >
                  {wave}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[0.62rem]">
        <p aria-live="polite" className="text-fg">
          {status}
        </p>
        {start !== null && (
          <button
            type="button"
            onClick={reset}
            className="shrink-0 text-muted underline decoration-border underline-offset-2 hover:text-fg hover:decoration-accent"
          >
            reset
          </button>
        )}
      </div>
      <p className="mt-1.5 font-mono text-[0.62rem] text-muted" aria-hidden="true">
        P power · W water · T transit · C comms · H hospital · numbers are waves
      </p>
    </div>
  );
}
