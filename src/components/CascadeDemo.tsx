"use client";

import { useEffect, useRef, useState } from "react";
import { ALPHA, baseline, edges, nodeName, nodes, ratio, simulate } from "@/lib/cascade";

const WAVE_MS = 900;
const VIEW = { w: 330, h: 178 };
const DEFAULT_START = 0;
const pct = (r: number) => `${Math.round(r * 100)}%`;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The Ripple card's artwork. Knock out a node and watch Motter–Lai re-route
// the traffic: each node's meter shows its load against its capacity, and
// any node pushed past 100% fails in the next wave (see src/lib/cascade.ts).
// That's why failures can jump to nodes that aren't next to the first one.
export function CascadeDemo() {
  const [start, setStart] = useState<number | null>(DEFAULT_START);
  const [shown, setShown] = useState(() => simulate(DEFAULT_START).waves.length);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const normal = baseline();
  const run = start === null ? null : simulate(start);
  const capacity = normal.capacity;
  // After revealing `shown` waves, show the loads those failures caused: nodes
  // over 100% here are the ones about to fail in the next wave.
  const load = run && shown > 0 ? run.loads[shown - 1] : normal.load;
  const waveOf = new Map<number, number>();
  run?.waves.slice(0, shown).forEach((wave, w) => wave.forEach((i) => waveOf.set(i, w)));
  const done = !run || shown >= run.waves.length;
  // Survivors with no working links carry no traffic at all: call that out
  // instead of showing an empty meter.
  const cutOff = new Set(
    nodes
      .map((_, i) => i)
      .filter((i) => run && !waveOf.has(i) && edges.every(([a, b]) => (a !== i && b !== i) || waveOf.has(a === i ? b : a))),
  );

  useEffect(() => () => stop(), []);

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }

  function knockOut(i: number) {
    stop();
    const total = simulate(i).waves.length;
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

  // "wave 1 Hospital 125%", using the load that tipped each node over.
  const story = run
    ? run.waves
        .slice(1, shown)
        .map(
          (wave, k) =>
            `wave ${k + 1}: ${wave.map((i) => `${nodeName(i)} ${pct(ratio(run.loads[k][i], capacity[i]))}`).join(", ")}`,
        )
    : [];
  const status =
    start === null || !run
      ? `Every node at its normal load (${pct(1 / (1 + ALPHA))} of capacity). Knock one out.`
      : run.waves.length === 1 && done
        ? `${nodeName(start)} out. Traffic re-routed, but no node went past capacity.`
        : `${nodeName(start)} out, traffic re-routed. ${story.join(" · ")}${
            done ? `. ${waveOf.size} of ${nodes.length} down${cutOff.size ? `, ${cutOff.size} cut off` : ""}.` : story.length ? "…" : ""
          }`;

  return (
    <div className="rounded-lg bg-chip/60 p-4">
      <div
        role="group"
        aria-label="Cascade simulator: knock out a node"
        className="relative"
        style={{ aspectRatio: `${VIEW.w} / ${VIEW.h}` }}
      >
        <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="absolute inset-0 size-full" aria-hidden="true">
          {edges.map(([a, b]) => {
            const cut = waveOf.has(a) || waveOf.has(b);
            return (
              <line
                key={`${a}-${b}`}
                x1={nodes[a].x}
                y1={nodes[a].y}
                x2={nodes[b].x}
                y2={nodes[b].y}
                strokeWidth={cut ? 1 : 1.5}
                strokeDasharray={cut ? "3 4" : undefined}
                className={`transition-opacity duration-300 ${cut ? "stroke-border opacity-60" : "stroke-muted/60"}`}
              />
            );
          })}
        </svg>
        {nodes.map((node, i) => {
          const wave = waveOf.get(i);
          const r = ratio(load[i], capacity[i]);
          const isolated = cutOff.has(i);
          const over = wave === undefined && r > 1 + 1e-9;
          const state =
            wave === 0
              ? "border-accent bg-accent text-ink-fg"
              : wave !== undefined
                ? "border-accent bg-accent-soft text-fg"
                : isolated
                  ? "border-dashed border-muted bg-surface text-muted"
                  : over
                  ? "border-accent bg-surface text-fg ring-2 ring-accent/40"
                  : "border-border bg-surface text-fg";
          const label =
            wave === 0
              ? "knocked out"
              : wave !== undefined
                ? `failed in wave ${wave}`
                : isolated
                  ? "cut off, no working links"
                  : `load ${pct(r)} of capacity${over ? ", overloaded" : ""}`;
          return (
            <button
              key={i}
              type="button"
              onClick={() => knockOut(i)}
              aria-label={`${nodeName(i)}, ${label}`}
              className="absolute flex w-[9%] min-w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-0.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{ left: `${(node.x / VIEW.w) * 100}%`, top: `${(node.y / VIEW.h) * 100}%` }}
            >
              <span
                aria-hidden="true"
                className={`relative grid aspect-square w-full place-items-center rounded-full border-[1.75px] font-mono text-[11px] font-medium transition-colors duration-300 hover:border-accent ${state}`}
              >
                {node.kind}
                {wave !== undefined && wave > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] leading-none font-semibold text-ink-fg">
                    {wave}
                  </span>
                )}
              </span>
              {wave === undefined && !isolated && (
                <span aria-hidden="true" className="block h-[3px] w-full overflow-hidden rounded-full bg-border">
                  <span
                    className={`block h-full rounded-full transition-[width] duration-500 ${over ? "bg-accent" : "bg-muted"}`}
                    style={{ width: `${Math.min(r, 1) * 100}%` }}
                  />
                </span>
              )}
              {over && (
                <span aria-hidden="true" className="absolute top-full mt-0.5 font-mono text-[9px] leading-none font-semibold text-accent">
                  {pct(r)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[0.62rem]">
        <p aria-live="polite" className="text-fg">
          {status}
        </p>
        {start !== null && (
          <button
            type="button"
            onClick={reset}
            className="text-muted underline decoration-border underline-offset-2 hover:text-fg hover:decoration-accent"
          >
            reset
          </button>
        )}
      </div>
      <div className="mt-2 space-y-1 font-mono text-[0.62rem] text-muted" aria-hidden="true">
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <Legend className="bg-accent" label="knocked out" />
          <span className="inline-flex items-center gap-1.5">
            <span className="grid size-3.5 place-items-center rounded-full bg-accent text-[8px] font-semibold text-ink-fg">2</span>
            failed in wave 2
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="block h-[3px] w-4 rounded-full bg-muted" />
            load / capacity
          </span>
          <Legend className="border border-dashed border-muted bg-surface" label="cut off" />
        </p>
        <p>
          Load is the shortest-path traffic through a node; capacity is {1 + ALPHA}× its normal load. Past 100%, it fails
          in the next wave.
        </p>
        <p>P power · W water · T transit · C comms · H hospital</p>
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
