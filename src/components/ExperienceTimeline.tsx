import type { Role } from "@/content/experience";

export function ExperienceTimeline({ roles }: { roles: Role[] }) {
  return (
    <ol className="space-y-8 border-l border-border pl-6">
      {roles.map((role) => (
        <li key={`${role.org}-${role.start}`} className="relative">
          <span
            className="absolute top-2 -left-[1.8rem] size-2.5 rounded-full border-2 border-accent bg-bg"
            aria-hidden="true"
          />
          <p className="font-mono text-xs text-muted">
            {role.start} – {role.end}
          </p>
          <h3 className="mt-1 font-semibold">
            {role.role} <span className="text-muted">@ {role.org}</span>
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {role.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="font-mono text-accent" aria-hidden="true">
                  -
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
