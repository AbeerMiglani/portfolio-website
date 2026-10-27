// A 9-node illustration of a cascading failure, for the Ripple card. Pure
// functions; the UI lives in CascadeDemo.tsx.
//
// Deliberately simpler than Ripple's Motter–Lai model (which re-routes
// shortest paths, so failures can land on nodes far from the first one): here
// every node starts with a load of 1, and a failed node hands its load to its
// working neighbours in equal shares. Any node pushed past its capacity fails
// in the next wave, so a cascade always travels along the drawn links.

export type Kind = "P" | "W" | "C" | "T" | "H";

export const kindNames: Record<Kind, string> = {
  P: "Power station",
  W: "Water plant",
  C: "Comms hub",
  T: "Transit hub",
  H: "Hospital",
};

/** Positions are in a 330 × 178 viewBox. */
export const nodes: { x: number; y: number; kind: Kind }[] = [
  { x: 42, y: 88, kind: "P" },
  { x: 120, y: 36, kind: "W" },
  { x: 128, y: 92, kind: "C" },
  { x: 116, y: 146, kind: "T" },
  { x: 206, y: 28, kind: "P" },
  { x: 212, y: 96, kind: "H" },
  { x: 200, y: 150, kind: "W" },
  { x: 286, y: 58, kind: "T" },
  { x: 290, y: 128, kind: "C" },
];

// Chosen (no crossings) so most starting points give a multi-wave cascade.
export const edges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [2, 6], [3, 6],
  [4, 5], [4, 7], [5, 6], [5, 7], [6, 8], [7, 8],
];

/** Capacity per node; every node starts with a load of 1. Tuned so most
 * starting points give a readable chain of 2–4 waves. */
export const capacity = [2.5, 1.9, 1.2, 1.5, 1.2, 2.5, 2.5, 1.2, 2.5];

/** "Power station 1", "Hospital", … numbered only when a kind repeats. */
export function nodeName(i: number): string {
  const kind = nodes[i].kind;
  const same = nodes.map((n, j) => [n.kind, j] as const).filter(([k]) => k === kind);
  const name = kindNames[kind];
  return same.length > 1 ? `${name} ${same.findIndex(([, j]) => j === i) + 1}` : name;
}

const neighbours: number[][] = nodes.map((_, i) =>
  edges.flatMap(([a, b]) => (a === i ? [b] : b === i ? [a] : [])),
);

/** Waves of failures after knocking out `start`: waves[0] is [start]. */
export function simulate(start: number): number[][] {
  const load = nodes.map(() => 1);
  const alive = nodes.map(() => true);
  const waves: number[][] = [];
  let wave = [start];
  while (wave.length) {
    waves.push(wave);
    for (const i of wave) alive[i] = false;
    for (const i of wave) {
      const live = neighbours[i].filter((j) => alive[j]);
      for (const j of live) load[j] += load[i] / live.length;
      load[i] = 0;
    }
    wave = nodes.map((_, j) => j).filter((j) => alive[j] && load[j] > capacity[j] + 1e-9);
  }
  return waves;
}
