import { profile } from "@/content/profile";
import { SectionHeading } from "./SectionHeading";

// Vercel sets these at build time; local builds just show "local".
const sha = process.env.VERCEL_GIT_COMMIT_SHA;
const repo =
  process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
    ? `https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : null;

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <SectionHeading id="contact" command="./contact.sh" label="Contact" />
        <p className="max-w-xl text-fg/90">
          The fastest way to reach me is email. I usually reply within a day or two.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
          <li>
            <a href={`mailto:${profile.email}`} className="text-accent hover:underline">
              {profile.email}
            </a>
          </li>
          {profile.links.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="hover:text-accent">
                {link.label.toLowerCase()}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-16 font-mono text-xs text-muted">
          © {new Date().getFullYear()} {profile.name} · build{" "}
          {sha && repo ? (
            <a href={`${repo}/commit/${sha}`} className="hover:text-accent">
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
