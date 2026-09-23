import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

// A row of quick, checkable numbers under the hero, for people skimming.
export function FactsStrip() {
  const featured = projects.find((p) => p.featured);
  const roadmap = featured?.roadmap ?? [];
  const done = roadmap.filter((m) => m.done).length;

  const facts = [
    { value: profile.problemSolving.total, label: "DSA problems solved" },
    { value: String(profile.problemSolving.leetcode), label: "on LeetCode" },
    { value: `${done}/${roadmap.length}`, label: `${featured?.shortName ?? "project"} milestones` },
    { value: profile.education.graduation, label: "graduating, B.Tech ECE" },
  ];

  return (
    <section aria-label="Quick facts" className="border-y border-divider bg-surface">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">
        {facts.map((fact, i) => (
          <div
            key={fact.label}
            className={`flex flex-col-reverse gap-1 py-6 ${i % 2 ? "pl-6" : "pr-6"} ${
              i > 1 ? "border-t border-divider md:border-t-0" : ""
            } md:border-l md:border-divider md:px-6 md:first:border-l-0 md:first:pl-0`}
          >
            <dt className="font-mono text-xs text-muted">{fact.label}</dt>
            <dd className="text-3xl font-semibold tracking-tight text-fg">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
