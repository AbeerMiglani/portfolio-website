import { profile } from "@/content/profile";

export function About() {
  return (
    <div className="grid gap-10 md:grid-cols-[3fr_2fr]">
      <div className="space-y-4 text-fg/90">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <dl className="space-y-4 font-mono text-sm">
        {Object.entries(profile.skills).map(([group, items]) => (
          <div key={group}>
            <dt className="text-muted"># {group.toLowerCase()}</dt>
            <dd className="mt-1">{items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
