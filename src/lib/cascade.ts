// A 9-node toy version of Ripple's Motter–Lai overload cascade. Pure
// functions; the UI lives in CascadeDemo.tsx.
//
// A node's load is its betweenness centrality (how many shortest paths run
// through it) and its capacity is (1 + ALPHA) times its starting load. When a
// node fails, loads are recomputed on what's left; every node now over
// capacity fails together as the next wave, until nothing else is overloaded.

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

export const ALPHA = 0.2;

/** "Power station 1", "Hospital", … numbered only when a kind repeats. */
export function nodeName(i: number): string {
  const kind = nodes[i].kind;
  const same = nodes.map((n, j) => [n.kind, j] as const).filter(([k]) => k === kind);
  const name = kindNames[kind];
  return same.length > 1 ? `${name} ${same.findIndex(([, j]) => j === i) + 1}` : name;
}

/** Brandes' betweenness centrality on the subgraph of alive nodes (undirected). */
function betweenness(alive: boolean[]): number[] {
  const n = nodes.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    if (alive[a] && alive[b]) {
      adj[a].push(b);
      adj[b].push(a);
    }
  }
  const load = new Array<number>(n).fill(0);
  for (let s = 0; s < n; s++) {
    if (!alive[s]) continue;
    const order: number[] = [];
    const preds: number[][] = Array.from({ length: n }, () => []);
    const paths = new Array<number>(n).fill(0);
    const dist = new Array<number>(n).fill(-1);
    paths[s] = 1;
    dist[s] = 0;
    const queue = [s];
    while (queue.length) {
      const v = queue.shift()!;
      order.push(v);
      for (const w of adj[v]) {
        if (dist[w] < 0) {
          dist[w] = dist[v] + 1;
          queue.push(w);
        }
        if (dist[w] === dist[v] + 1) {
          paths[w] += paths[v];
          preds[w].push(v);
        }
      }
    }
    const dependency = new Array<number>(n).fill(0);
    while (order.length) {
      const w = order.pop()!;
      for (const v of preds[w]) dependency[v] += (paths[v] / paths[w]) * (1 + dependency[w]);
      if (w !== s) load[w] += dependency[w];
    }
  }
  return load.map((l) => l / 2);
}

/** Waves of failures after knocking out `start`: waves[0] is [start]. */
export function cascade(start: number): number[][] {
  const alive = nodes.map(() => true);
  const capacity = betweenness(alive).map((load) => (1 + ALPHA) * load);
  alive[start] = false;
  const waves = [[start]];
  for (;;) {
    const load = betweenness(alive);
    const failing = nodes.map((_, i) => i).filter((i) => alive[i] && load[i] > capacity[i] + 1e-9);
    if (!failing.length) return waves;
    for (const i of failing) alive[i] = false;
    waves.push(failing);
  }
}
