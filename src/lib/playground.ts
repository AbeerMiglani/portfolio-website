// Scripted replays of Ripple's real API, for the Ripple card. Pure data; the UI
// lives in ApiPlayground.tsx. Every path, status code, header and message here
// is copied from Ripple's backend (backend/app/api/*.py, security.py,
// simulation/cascade.py), so keep it that way:
//   - POST /api/simulations answers 200 with status "pending" (not 202) and
//     queues a Celery task; a queue failure is a 503.
//   - Keys go in Authorization: Bearer … or X-API-Key; a missing key is 401
//     "API key required", a viewer key on an operator route is 403.
//   - The limiter allows 60 requests a minute per client and route, then 429
//     with Retry-After: 60.
//   - The WebSocket at /api/ws/simulations/{id} relays each wave dict, then
//     {"status": "completed"}.
//   - Recommendations are cached in Redis for an hour.
// IDs are shortened with "…" and the result values are samples; nothing here
// invents an endpoint, status code, header or timing.

export type Step =
  | { kind: "request"; method: "GET" | "POST" | "WS"; path: string; headers?: string[]; body?: string }
  | { kind: "response"; status: number; text: string; headers?: string[]; body: string }
  | { kind: "message"; body: string }
  | { kind: "note"; text: string };

export type Preset = { id: string; label: string; steps: Step[]; done: string };

const SIM = "7d2b…";
const NET = "3f1c…";

export const presets: Preset[] = [
  {
    id: "run",
    label: "run a simulation",
    steps: [
      {
        kind: "request",
        method: "POST",
        path: "/api/simulations",
        headers: ["Authorization: Bearer op_…"],
        body: `{"network_id": "${NET}", "initial_failures": ["a91e…"]}`,
      },
      { kind: "response", status: 200, text: "OK", body: `{"id": "${SIM}", "status": "pending", "waves": [], "total_failed": 0}` },
      { kind: "note", text: "The run is saved in PostgreSQL first, then queued; a Celery worker picks it up." },
      { kind: "request", method: "WS", path: `/api/ws/simulations/${SIM}?api_key=op_…` },
      { kind: "message", body: `{"wave": 1, "failed_node_ids": ["c04d…", "e7a2…"], "cumulative_failed_node_ids": ["a91e…", "c04d…", "e7a2…"]}` },
      { kind: "message", body: `{"wave": 2, "failed_node_ids": ["5b19…"], "cumulative_failed_node_ids": ["5b19…", "a91e…", "c04d…", "e7a2…"]}` },
      { kind: "message", body: `{"status": "completed"}` },
    ],
    done: "Simulation queued, streamed wave by wave over the WebSocket, then completed.",
  },
  {
    id: "auth",
    label: "auth and rate limits",
    steps: [
      { kind: "request", method: "POST", path: "/api/simulations" },
      { kind: "response", status: 401, text: "Unauthorized", body: `{"detail": "API key required"}` },
      { kind: "request", method: "POST", path: "/api/simulations", headers: ["X-API-Key: view_…"] },
      { kind: "response", status: 403, text: "Forbidden", body: `{"detail": "Operator role required"}` },
      { kind: "note", text: "The 61st request from one client to one route within a minute:" },
      { kind: "request", method: "GET", path: `/api/simulations/${SIM}`, headers: ["X-API-Key: view_…"] },
      { kind: "response", status: 429, text: "Too Many Requests", headers: ["Retry-After: 60"], body: `{"detail": "Rate limit exceeded"}` },
    ],
    done: "No key gets 401, a viewer key gets 403 on an operator route, and the 61st request in a minute gets 429.",
  },
  {
    id: "cache",
    label: "recommendations, twice",
    steps: [
      { kind: "request", method: "GET", path: `/api/simulations/${SIM}/recommendations?limit=1`, headers: ["X-API-Key: view_…"] },
      { kind: "response", status: 200, text: "OK", body: `[{"rank": 1, "node_name": "Substation 4", "intervention_type": "upgrade_node", "failures_prevented": 11, …}]` },
      { kind: "note", text: "Computed: each candidate fix is re-simulated, and the ranked list is cached in Redis for an hour." },
      { kind: "request", method: "GET", path: `/api/simulations/${SIM}/recommendations?limit=1`, headers: ["X-API-Key: view_…"] },
      { kind: "response", status: 200, text: "OK", body: `[{"rank": 1, "node_name": "Substation 4", "intervention_type": "upgrade_node", "failures_prevented": 11, …}]` },
      { kind: "note", text: "Same answer, served from the Redis cache without re-running anything." },
    ],
    done: "The first call computed and cached the recommendations; the repeat was served from Redis.",
  },
];
