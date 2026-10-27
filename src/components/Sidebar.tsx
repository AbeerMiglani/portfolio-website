"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { ArrowIcon } from "./ArrowIcon";
import { MethodBadge, type Method } from "./Endpoint";
import { ThemeToggle } from "./ThemeToggle";

type Item = { id: string; method: Method; path: string; indent?: boolean };

export const navItems: Item[] = [
  { id: "top", method: "GET", path: "/" },
  { id: "projects", method: "GET", path: "/projects" },
  ...projects.map((p) => ({ id: `project-${p.shortName}`, method: "GET" as const, path: `/${p.shortName}`, indent: true })),
  { id: "experience", method: "GET", path: "/experience" },
  { id: "skills", method: "GET", path: "/skills" },
  { id: "about", method: "GET", path: "/about" },
  { id: "terminal", method: "WS", path: "/console" },
  { id: "contact", method: "POST", path: "/contact" },
];

const external = [
  { label: "resume.pdf", href: profile.resume },
  { label: "JSON API", href: "/api" },
  { label: "GitHub", href: profile.links.find((l) => l.label === "GitHub")!.href },
];

// The docs-style sidebar: sticky on wide screens, a menu under a top bar on
// phones. The endpoint in view is marked with aria-current.
export function Sidebar() {
  const [current, setCurrent] = useState("top");
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    // The current endpoint is the last section whose heading has scrolled
    // above a line 30% down the viewport.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let id = navItems[0].id;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) id = item.id;
      }
      // The last sections are too short to reach the line, so the bottom of
      // the page counts as the last endpoint.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setCurrent(atBottom ? navItems[navItems.length - 1].id : id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const nav = (
    <nav aria-label="Endpoints">
      <ul className="space-y-0.5">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current === item.id ? "location" : undefined}
              onClick={() => menu.current?.removeAttribute("open")}
              className={`flex items-center gap-2.5 rounded-md py-1.5 pr-2 font-mono text-[0.8rem] hover:bg-chip hover:text-fg aria-[current]:bg-accent-soft aria-[current]:text-fg ${
                item.indent ? "pl-6 text-muted" : "pl-2 text-fg/85"
              }`}
            >
              {!item.indent && <MethodBadge method={item.method} small />}
              <span className="truncate">{item.path}</span>
            </a>
          </li>
        ))}
      </ul>
      <ul className="mt-6 space-y-1 border-t border-divider pt-4 font-mono text-[0.8rem]">
        {external.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="group/link inline-flex items-center gap-1.5 px-2 py-1 text-muted hover:text-fg">
              {link.label}
              <ArrowIcon className="transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  const wordmark = (
    <a href="#top" className="flex items-center gap-2 font-mono text-sm font-medium text-fg">
      {profile.handle}
      <span className="text-muted">/</span>
      <span className="text-accent">api</span>
      <span className="rounded border border-border px-1.5 py-px text-[0.6rem] font-normal text-muted">v2</span>
    </a>
  );

  return (
    <>
      {/* Phones and tablets: a top bar with a menu. */}
      <header className="sticky top-0 z-30 border-b border-divider bg-bg/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
          {wordmark}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <details ref={menu} className="relative">
              <summary className="cursor-pointer list-none rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-fg [&::-webkit-details-marker]:hidden">
                menu
              </summary>
              <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-surface p-3 shadow-xl">{nav}</div>
            </details>
          </div>
        </div>
      </header>

      {/* Desktop: a sticky sidebar. */}
      <aside className="sticky top-0 hidden h-screen flex-col overflow-y-auto border-r border-divider bg-band px-4 py-6 lg:flex">
        {wordmark}
        <p className="mt-3 flex items-center gap-2 px-0.5 font-mono text-xs text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
          {profile.status}
        </p>
        <div className="mt-8 flex-1">{nav}</div>
        <div className="mt-6 flex items-center justify-between border-t border-divider pt-4">
          <span className="font-mono text-xs text-muted">theme</span>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
