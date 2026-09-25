"use client";

import { useEffect, useRef, useState } from "react";
import {
  clampBytes,
  encode,
  frame,
  messagesFor,
  randomSegments,
  simulateFramed,
  simulateUnframed,
  type Step,
} from "@/lib/framing";

type Mode = "idle" | "framed" | "unframed";

const STEP_MS = 260;
const hex = (byte: number) => byte.toString(16).padStart(2, "0");
const printable = (byte: number) => (byte >= 0x20 && byte < 0x7f ? String.fromCharCode(byte) : hex(byte));

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The Redis card's artwork: the wire format of one request, plus a replay of
// the server reading two requests off the socket with and without framing.
export function FrameDemo() {
  const [text, setText] = useState("hello");
  const [mode, setMode] = useState<Mode>("idle");
  const [steps, setSteps] = useState<Step[]>([]);
  const [shown, setShown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const messages = messagesFor(text);
  const first = frame(messages[0]);
  const running = mode !== "idle" && shown < steps.length;
  const visible = steps.slice(0, shown);
  const lastRead = [...visible].reverse().find((s) => s.kind === "read");
  const consumed = mode === "framed" && running ? (lastRead?.kind === "read" ? lastRead.consumed : 0) : first.length;

  useEffect(() => () => stop(), []);

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }

  function send(next: Exclude<Mode, "idle">) {
    stop();
    const frames = messages.map((m) => (next === "framed" ? frame(m) : encode(m)));
    const lengths = frames.map((f) => f.length);
    const boundaries = lengths.map((_, i) => lengths.slice(0, i + 1).reduce((a, b) => a + b, 0));
    // Smaller segments show partial headers; larger ones keep the unframed log short.
    const sizes: [number, number] = next === "framed" ? [1, 5] : [3, 6];
    const segments = randomSegments(boundaries[boundaries.length - 1], boundaries, sizes);
    const all = next === "framed" ? simulateFramed(messages, segments) : simulateUnframed(messages, segments);
    setMode(next);
    setSteps(all);
    if (prefersReducedMotion()) {
      setShown(all.length);
      return;
    }
    setShown(1);
    timer.current = setInterval(() => {
      setShown((n) => {
        if (n + 1 >= all.length) stop();
        return Math.min(n + 1, all.length);
      });
    }, STEP_MS);
  }

  function edit(value: string) {
    stop();
    setText(clampBytes(value));
    setMode("idle");
    setSteps([]);
    setShown(0);
  }

  const printed = steps.filter((s) => s.kind === "print" && s.text !== "EOF").map((s) => (s.kind === "print" ? s.text.replace("Client says: ", "") : ""));
  const status =
    mode === "idle" || running
      ? ""
      : mode === "framed"
        ? `With framing, the server printed ${printed.map((p) => `"${p}"`).join(" and ")}, one per request.`
        : `Without framing, the server printed ${printed.map((p) => `"${p}"`).join(", ")}: message boundaries were lost.`;

  return (
    <div className="space-y-4 rounded-lg bg-chip/60 p-4 sm:p-5">
      <div>
        <p className="mb-1.5 font-mono text-[0.65rem] tracking-wider text-muted uppercase">
          client → server · request 1 of 2
        </p>
        <p className="sr-only">
          The request &quot;{messages[0]}&quot; is sent as a 4-byte length, {[...first.slice(0, 4)].map(hex).join(" ")} in
          little-endian order, followed by {first.length - 4} payload bytes.
        </p>
        <div
          aria-hidden="true"
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${first.length}, minmax(0, 1fr))` }}
        >
          {[...first].map((byte, i) => {
            const header = i < 4;
            const waiting = i >= consumed;
            const faded = mode === "unframed" && header;
            return (
              <span
                key={i}
                className={`grid h-8 place-items-center rounded border font-mono text-xs transition-opacity duration-200 ${
                  header ? "border-accent/40 bg-accent-soft text-accent" : "border-border bg-surface text-fg"
                } ${waiting || faded ? "opacity-35" : ""} ${faded ? "line-through" : ""}`}
              >
                {header ? hex(byte) : printable(byte)}
              </span>
            );
          })}
          <span className="col-span-4 mt-0.5 border-t border-accent/50 pt-1 text-center font-mono text-[0.6rem] text-muted">
            {mode === "unframed" ? "not sent" : "len · 4 bytes"}
          </span>
          <span
            className="mt-0.5 border-t border-border pt-1 text-center font-mono text-[0.6rem] text-muted"
            style={{ gridColumn: `span ${first.length - 4} / span ${first.length - 4}` }}
          >
            payload
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <label className="flex items-center gap-2 text-muted">
          message
          <input
            value={text}
            onChange={(e) => edit(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-describedby="frame-demo-hint"
            className="w-24 rounded-md border border-border bg-surface px-2 py-1 text-fg focus-visible:outline-2 focus-visible:outline-accent"
          />
        </label>
        <button
          type="button"
          onClick={() => send("framed")}
          disabled={!text}
          className="rounded-md border border-border bg-surface px-2.5 py-1 text-fg hover:border-accent hover:text-accent disabled:opacity-50"
        >
          send
        </button>
        <button
          type="button"
          onClick={() => send("unframed")}
          disabled={!text}
          className="rounded-md border border-border bg-surface px-2.5 py-1 text-muted hover:border-accent hover:text-accent disabled:opacity-50"
        >
          send without framing
        </button>
      </div>
      <p id="frame-demo-hint" className="sr-only">
        Sends two requests, {messages.join(" and ")}, split into random TCP segments, and replays how the server reads them.
      </p>

      <div className="min-h-[4.5rem] rounded-md bg-surface/70 px-3 py-2.5 font-mono text-[0.68rem] leading-relaxed" aria-hidden="true">
        {mode === "idle" ? (
          <p className="text-muted">
            read_full(fd, buf, 4) <span className="text-accent">→</span> len
            <br />
            read_full(fd, buf + 4, len) <span className="text-accent">→</span> payload
          </p>
        ) : (
          visible.map((step, i) =>
            step.kind === "read" ? (
              <p key={i} className="text-muted">
                <span className="text-fg">{step.call}</span> <span className="text-accent">→</span> {step.got}
                {step.note && <span> · {step.note}</span>}
                {step.waiting > 0 && <span> · {step.waiting} more buffered</span>}
              </p>
            ) : (
              <p key={i} className={step.text === "EOF" ? "text-muted" : "text-accent"}>
                {step.text}
              </p>
            ),
          )
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
