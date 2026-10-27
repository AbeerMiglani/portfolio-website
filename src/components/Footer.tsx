import { profile } from "@/content/profile";
import { endpoints } from "@/lib/api";

// Vercel sets these at build time; local builds just show "local".
const sha = process.env.VERCEL_GIT_COMMIT_SHA;
const repo =
  process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
    ? `https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : null;

// A status-page footer: health, the machine-readable ways in, and the build.
export function Footer() {
  return (
    <footer className="px-4 py-10 font-mono text-xs text-muted sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <p className="flex items-center gap-2 text-fg">
          <span aria-hidden="true" className="size-2 rounded-full bg-ok" />
          <span>
            <span className="text-ok">200</span> OK · all systems operational
          </span>
        </p>
        <p>
          <span aria-hidden="true" className="text-accent">
            ${" "}
          </span>
          curl {profile.siteUrl}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-divider pt-6">
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {Object.keys(endpoints).map((path) => (
            <li key={path}>
              <a href={path} className="hover:text-fg">
                {path}
              </a>
            </li>
          ))}
          <li>
            <a href={profile.resume} className="hover:text-fg">
              resume.pdf
            </a>
          </li>
        </ul>
        <p>
          © {new Date().getFullYear()} {profile.name} · build{" "}
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
