"use client";

import { useEffect, useRef, useState } from "react";
import { presets, type Step } from "@/lib/playground";
import { highlightJson } from "./Json";
import { MethodBadge } from "./Endpoint";

const STEP_MS = 650;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const statusTone = (status: number) => (status < 300 ? "text-[#4ade80]" : status < 500 ? "text-[#fbbf24]" : "text-[#f87171]");

// The Ripple card's demo: a replay of real request/response exchanges with
// Ripple's API (see src/lib/playground.ts). No network calls are made.
export function ApiPlayground() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [shown, setShown] = useState(presets[0].steps.length);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const preset = presets[presetIndex];
  const done = shown >= preset.steps.length;

  useEffect(() => () => stop(), []);

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }

  function play(index: number) {
    stop();
    const total = presets[index].steps.length;
    setPresetIndex(index);
    if (prefersReducedMotion()) {
      setShown(total);
      return;
    }
    // The count lives in the closure and each interval clears only itself, so
    // a late tick from an earlier replay can't stop a newer one.
    let n = 1;
    setShown(n);
    const id = setInterval(() => {
      setShown(++n);
      if (n >= total) {
        clearInterval(id);
        if (timer.current === id) timer.current = null;
      }
    }, STEP_MS);
    timer.current = id;
  }

  return (
    <div className="rounded-lg bg-chip/60 p-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Example requests">
        {presets.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => play(i)}
            aria-pressed={i === presetIndex}
            className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent aria-pressed:border-accent aria-pressed:text-fg"
          >
            {p.label}
          </button>
        ))}
      </div>

      <ol
        className="mt-3 min-h-[15rem] space-y-1.5 overflow-hidden rounded-md bg-panel px-3 py-3 font-mono text-[0.68rem] leading-relaxed text-panel-fg"
        aria-label={`Replay: ${preset.label}`}
      >
        {preset.steps.slice(0, shown).map((step, i) => (
          <StepLine key={`${preset.id}-${i}`} step={step} />
        ))}
      </ol>
      <p className="mt-2 font-mono text-[0.62rem] text-muted">Replay of Ripple&apos;s API with sample data; no requests are sent.</p>
      <p className="sr-only" aria-live="polite">
        {done ? preset.done : ""}
      </p>
    </div>
  );
}

function StepLine({ step }: { step: Step }) {
  if (step.kind === "request") {
    return (
      <li className="[overflow-wrap:anywhere]">
        <span className="inline-flex items-center gap-2">
          <MethodBadge method={step.method} small onDark />
          <span className="text-panel-fg">{step.path}</span>
        </span>
        {step.headers?.map((h) => (
          <span key={h} className="block pl-12 text-panel-fg/60">
            {h}
          </span>
        ))}
        {step.body && <span className="block pl-12">{highlightJson(step.body)}</span>}
      </li>
    );
  }
  if (step.kind === "response") {
    return (
      <li className="pl-12 [overflow-wrap:anywhere]">
        <span className={statusTone(step.status)}>
          {step.status} {step.text}
        </span>
        {step.headers?.map((h) => (
          <span key={h} className="block text-panel-fg/60">
            {h}
          </span>
        ))}
        <span className="block">{highlightJson(step.body)}</span>
      </li>
    );
  }
  if (step.kind === "message") {
    return (
      <li className="pl-12 [overflow-wrap:anywhere]">
        <span aria-hidden="true" className="text-panel-fg/55">
          ↓{" "}
        </span>
        <span className="sr-only">WebSocket message: </span>
        {highlightJson(step.body)}
      </li>
    );
  }
  return <li className="pl-12 font-sans text-[0.7rem] text-panel-fg/70">{step.text}</li>;
}
