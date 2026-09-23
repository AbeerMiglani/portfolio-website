import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

// Vercel sets these at build time; local builds just show "local".
const sha = process.env.VERCEL_GIT_COMMIT_SHA;
const repo =
  process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
    ? `https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : null;

export function Footer() {
  const columns = [
    {
      title: "Site",
      links: [
        { label: "Terminal", href: "#terminal" },
        { label: "Projects", href: "#projects" },
        { label: "Experience", href: "#experience" },
        { label: "About", href: "#about" },
      ],
    },
    {
      title: "Projects",
      links: projects.filter((p) => p.repo).map((p) => ({ label: p.title, href: p.repo! })),
    },
    {
      title: "Elsewhere",
      links: [
        ...profile.links,
        { label: "Email", href: `mailto:${profile.email}` },
        { label: "Résumé (PDF)", href: profile.resume },
      ],
    },
  ];

  return (
    <footer className="border-t border-divider">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="font-pixel text-lg">{profile.handle}</p>
          <p className="mt-3 max-w-xs text-sm text-muted">{profile.role}. {profile.status}.</p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="eyebrow">{column.title}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted hover:text-fg">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-divider px-4 py-6 font-mono text-xs text-muted sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>
          build{" "}
          {sha && repo ? (
            <a href={`${repo}/commit/${sha}`} className="hover:text-fg">
              {sha.slice(0, 7)}
            </a>
          ) : (
            "local"
          )}
        </p>
      </div>
    </footer>
  );
}
