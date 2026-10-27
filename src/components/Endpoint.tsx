import type { ReactNode } from "react";
import { Json } from "./Json";

export type Method = "GET" | "POST" | "WS";

const methodStyle: Record<Method, string> = {
  GET: "text-get bg-get/10 ring-get/25",
  POST: "text-post bg-post/10 ring-post/25",
  WS: "text-ws bg-ws/10 ring-ws/25",
};

// Inside the dark code panels the theme colours can be too dark, so the badges
// switch to fixed bright ones there.
const methodOnDark: Record<Method, string> = {
  GET: "text-[#4ade80] bg-[#4ade80]/10 ring-[#4ade80]/25",
  POST: "text-[#fbbf24] bg-[#fbbf24]/10 ring-[#fbbf24]/25",
  WS: "text-[#c4b5fd] bg-[#c4b5fd]/10 ring-[#c4b5fd]/25",
};

export function MethodBadge({ method, small = false, onDark = false }: { method: Method; small?: boolean; onDark?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded font-mono font-medium ring-1 ring-inset ${
        small ? "w-10 py-px text-[0.6rem]" : "px-1.5 py-0.5 text-[0.68rem]"
      } ${onDark ? methodOnDark[method] : methodStyle[method]}`}
    >
      {method}
    </span>
  );
}

type SectionProps = {
  id: string;
  method: Method;
  path: string;
  title: ReactNode;
  /** A short line under the path, e.g. the project's context. */
  kicker?: ReactNode;
  children: ReactNode;
  /** The right-hand column on wide screens: code panels, demos, responses. */
  aside?: ReactNode;
  /** Heading level: 2 for top-level sections, 3 inside the Projects group. */
  level?: 2 | 3;
};

// Every section is documented like an API endpoint: method, path, a plain
// title, prose on the left and code on the right (stacked on narrow screens).
export function EndpointSection({ id, method, path, title, kicker, children, aside, level = 2 }: SectionProps) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <section aria-labelledby={id} className="border-b border-divider px-4 py-14 sm:px-8 lg:px-12">
      <div className={`grid grid-cols-1 gap-10 ${aside ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] xl:gap-14" : ""}`}>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-mono text-sm text-muted">
            <MethodBadge method={method} />
            <span className="text-fg">{path}</span>
            {kicker && <span className="text-xs">· {kicker}</span>}
          </p>
          <Heading
            id={id}
            className={`mt-3 font-semibold tracking-tight text-fg ${level === 2 ? "text-3xl" : "text-2xl sm:text-3xl"}`}
          >
            {title}
          </Heading>
          <div className="mt-5">{children}</div>
        </div>
        {aside && <div className="min-w-0 space-y-4 xl:pt-1">{aside}</div>}
      </div>
    </section>
  );
}

/** A collapsible "Response" panel with the endpoint's real JSON. Works without JavaScript. */
export function Response({ source, path, open = false }: { source: string; path: string; open?: boolean }) {
  return (
    <details open={open} className="group/resp overflow-hidden rounded-lg border border-panel-border bg-panel text-panel-fg">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 font-mono text-xs text-panel-fg/70 hover:text-panel-fg [&::-webkit-details-marker]:hidden">
        <span>
          <span className="text-[#4ade80]">200</span> OK · {path}
        </span>
        <span aria-hidden="true" className="transition-transform group-open/resp:rotate-90">
          ›
        </span>
      </summary>
      <div
        tabIndex={0}
        aria-label={`Response body for ${path}`}
        className="max-h-96 overflow-auto border-t border-white/10 px-4 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#4fc3dc]"
      >
        <Json source={source} scroll={false} />
      </div>
    </details>
  );
}
