// One small illustration per project, each drawn from what the project does,
// rather than a shared decorative element. All decorative (aria-hidden).

export function ProjectArt({ slug }: { slug: string }) {
  if (slug === "redis") return <FrameArt />;
  if (slug === "ripple") return <CascadeArt />;
  return null;
}

/* ---------- Redis: the length-prefixed wire format ---------- */

function Frame({ label, payload }: { label: string; payload: string }) {
  // The length is copied in host byte order, i.e. little-endian on x86 and ARM.
  const header = [payload.length.toString(16).padStart(2, "0"), "00", "00", "00"];
  return (
    <div>
      <p className="mb-1.5 font-mono text-[0.65rem] tracking-wider text-muted uppercase">{label}</p>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${4 + payload.length}, minmax(0, 1fr))` }}>
        {header.map((byte, i) => (
          <span
            key={`h${i}`}
            className="grid h-8 place-items-center rounded border border-accent/40 bg-accent-soft font-mono text-xs text-accent"
          >
            {byte}
          </span>
        ))}
        {[...payload].map((char, i) => (
          <span
            key={`p${i}`}
            className="grid h-8 place-items-center rounded border border-border bg-surface font-mono text-xs text-fg"
          >
            {char}
          </span>
        ))}
        <span className="col-span-4 mt-0.5 border-t border-accent/50 pt-1 text-center font-mono text-[0.6rem] text-muted">
          len · 4 bytes
        </span>
        <span
          className="mt-0.5 border-t border-border pt-1 text-center font-mono text-[0.6rem] text-muted"
          style={{ gridColumn: `span ${payload.length} / span ${payload.length}` }}
        >
          payload
        </span>
      </div>
    </div>
  );
}

function FrameArt() {
  return (
    <div aria-hidden="true" className="space-y-4 rounded-lg bg-chip/60 p-4 sm:p-5">
      <Frame label="client → server" payload="hello" />
      <Frame label="server → client" payload="world" />
      <p className="font-mono text-[0.68rem] leading-relaxed text-muted">
        read_full(fd, buf, 4) <span className="text-accent">→</span> len
        <br />
        read_full(fd, buf + 4, len) <span className="text-accent">→</span> payload
      </p>
    </div>
  );
}

/* ---------- Ripple: one failure spreading in waves ---------- */

type NodeState = "source" | "wave1" | "wave2" | "ok";

const nodes: { x: number; y: number; kind: string; state: NodeState }[] = [
  { x: 42, y: 88, kind: "P", state: "source" },
  { x: 120, y: 36, kind: "W", state: "wave1" },
  { x: 128, y: 92, kind: "C", state: "wave1" },
  { x: 116, y: 146, kind: "T", state: "wave1" },
  { x: 206, y: 28, kind: "P", state: "wave2" },
  { x: 212, y: 96, kind: "H", state: "wave2" },
  { x: 200, y: 150, kind: "W", state: "ok" },
  { x: 286, y: 58, kind: "T", state: "ok" },
  { x: 290, y: 128, kind: "C", state: "ok" },
];

const edges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [2, 5], [3, 6], [4, 7], [5, 7], [5, 8], [6, 8],
];

const nodeClass: Record<NodeState, string> = {
  source: "fill-accent stroke-accent",
  wave1: "fill-accent-soft stroke-accent",
  wave2: "fill-surface stroke-accent",
  ok: "fill-surface stroke-border",
};

const hit = (state: NodeState) => state !== "ok";

function CascadeArt() {
  return (
    <div aria-hidden="true" className="rounded-lg bg-chip/60 p-4">
      <svg viewBox="0 0 330 178" className="w-full">
        {edges.map(([a, b]) => {
          const spread = hit(nodes[a].state) && hit(nodes[b].state);
          return (
            <line
              key={`${a}-${b}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              strokeWidth={spread ? 2 : 1.25}
              className={spread ? "stroke-accent" : "stroke-border"}
              strokeDasharray={spread ? undefined : "3 3"}
            />
          );
        })}
        {nodes.map((node, i) => (
          <g key={i}>
            {node.state === "source" && (
              <circle cx={node.x} cy={node.y} r={21} className="fill-none stroke-accent" strokeOpacity={0.35} />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={14}
              strokeWidth={1.75}
              strokeDasharray={node.state === "wave2" ? "4 2.5" : undefined}
              className={nodeClass[node.state]}
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              className={`font-mono text-[11px] font-medium ${node.state === "source" ? "fill-ink-fg" : "fill-fg"}`}
            >
              {node.kind}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.62rem] text-muted">
        <Legend className="bg-accent" label="t0 failure" />
        <Legend className="bg-accent-soft ring-1 ring-accent" label="wave 1" />
        <Legend className="border border-dashed border-accent bg-surface" label="wave 2" />
        <Legend className="bg-surface ring-1 ring-border" label="unaffected" />
        <span>P power · W water · T transit · C comms · H hospital</span>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}
