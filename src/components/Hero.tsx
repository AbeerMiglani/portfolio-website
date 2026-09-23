import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

const redis = projects.find((project) => project.slug === "redis");
const done = redis?.roadmap?.filter((milestone) => milestone.done).length ?? 0;
const total = redis?.roadmap?.length ?? 0;

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <FloatingCards />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pt-20 pb-24 text-center sm:px-6 sm:pt-28 sm:pb-32">
        <a
          href="#projects"
          className="inline-flex items-center gap-3 rounded-lg bg-surface px-3 py-1.5 text-sm shadow-sm ring-1 ring-border hover:ring-fg"
        >
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-accent">
            Now building
          </span>
          <span className="font-medium">Redis-compatible server in C++</span>
          <span aria-hidden="true" className="text-muted">
            →
          </span>
        </a>

        <h1 className="mt-8 text-5xl leading-[1.02] font-semibold tracking-[-0.045em] text-fg sm:text-7xl">
          {profile.name} builds
          <br />
          close to the <span className="font-pixel font-normal tracking-normal">metal.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{profile.pitch}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="rounded-lg bg-ink px-5 py-3 font-medium text-ink-fg shadow-md hover:opacity-90"
          >
            View projects →
          </a>
          <a
            href="#terminal"
            className="flex items-center gap-2 border-b border-border pb-0.5 text-muted hover:border-fg hover:text-fg"
          >
            <span className="font-pixel" aria-hidden="true">
              &gt;_
            </span>
            Try the terminal
          </a>
        </div>

        <p className="mt-8 flex items-center gap-2 font-mono text-xs text-muted">
          <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
          {profile.status}
        </p>
      </div>
    </section>
  );
}

// Tilted "note" cards around the hero, echoing fanout.sh. Decorative only, and
// only shown when there is room either side of the headline.
function FloatingCards() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden min-[1200px]:block">
      <div className="absolute top-24 left-[3%] w-56 -rotate-6 rounded-xl bg-[#1d1d1d] p-4 text-left shadow-xl ring-1 ring-black/10">
        <p className="font-mono text-[0.6rem] tracking-widest text-white/50 uppercase">
          redis_server.cpp
        </p>
        <pre className="mt-3 font-mono text-[0.68rem] leading-relaxed text-white/85">
          {`// [ 4B len | payload ]
read_full(fd, rbuf, 4);
memcpy(&len, rbuf, 4);
if (len > k_max_msg)
  return -1;
read_full(fd, rbuf+4, len);`}
        </pre>
      </div>

      <div className="absolute bottom-16 left-[6%] w-52 rotate-3 rounded-xl bg-surface p-4 text-left shadow-lg ring-1 ring-border">
        <p className="font-mono text-[0.6rem] tracking-widest text-muted uppercase">
          Problem solving
        </p>
        <p className="mt-2 font-pixel text-3xl text-fg">100+</p>
        <p className="mt-1 text-xs text-muted">DSA problems · 75 on LeetCode</p>
      </div>

      <div className="absolute top-28 right-[3%] w-60 rotate-3 rounded-xl bg-surface p-5 text-left shadow-lg ring-1 ring-border">
        <p className="font-mono text-[0.6rem] tracking-widest text-muted uppercase">
          Build log · redis-cpp
        </p>
        <p className="mt-3 text-lg leading-tight font-semibold tracking-tight text-fg">
          Message framing over a TCP byte stream
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          A single read() can return half a message. Loop until all of it arrives.
        </p>
      </div>

      <div className="absolute top-[17rem] right-[2%] flex -rotate-2 items-center gap-3 rounded-xl bg-[#1d1d1d] px-4 py-3 shadow-xl">
        <span className="rounded-md bg-white/10 px-2 py-1 text-[0.65rem] text-white/80">
          Roadmap
        </span>
        <span className="flex gap-1">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`h-4 w-1.5 rounded-sm ${i < done ? "bg-white" : "bg-white/25"}`}
            />
          ))}
        </span>
        <span className="font-medium text-white">
          {done} / {total}
        </span>
      </div>
    </div>
  );
}
