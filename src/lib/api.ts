// The site's content as JSON, for the static endpoints under /api and for the
// response panels on the page, so the two always show the same data. Built
// from src/content; no phone number, ever.
import { earlier } from "@/content/earlier";
import { profile } from "@/content/profile";
import { projects, type Project } from "@/content/projects";

const absolute = (href: string) => (href.startsWith("/") ? `${profile.siteUrl}${href}` : href);

export const endpoints = {
  "/api": "this index",
  "/api/profile.json": "who I am, how to reach me, skills",
  "/api/projects.json": "projects, with highlights and stack",
} as const;

export function apiIndex() {
  return {
    name: `${profile.name} portfolio API`,
    docs: profile.siteUrl,
    endpoints,
  };
}

export function profileJson() {
  return {
    name: profile.name,
    role: profile.role,
    tagline: profile.tagline,
    status: profile.status,
    learning: profile.learning,
    education: {
      school: profile.education.school,
      degree: profile.education.degree,
      dates: profile.education.dates,
    },
    problem_solving: { total: profile.problemSolving.total, platforms: profile.problemSolving.platforms },
    skills: Object.fromEntries(Object.entries(profile.skills).map(([group, items]) => [group.toLowerCase(), items])),
    links: {
      email: `mailto:${profile.email}`,
      ...Object.fromEntries(profile.links.map((l) => [l.label.toLowerCase(), l.href])),
      resume: absolute(profile.resume),
      site: profile.siteUrl,
    },
  };
}

export function projectJson(project: Project) {
  const roadmap = project.roadmap;
  return {
    slug: project.shortName,
    name: project.title,
    context: project.eyebrow,
    summary: project.hook,
    stack: project.meta.split(" · "),
    dates: project.dates,
    highlights: project.bullets,
    ...(roadmap
      ? {
          roadmap: {
            done: roadmap.filter((m) => m.done).length,
            total: roadmap.length,
            next: roadmap.find((m) => !m.done)?.label ?? null,
          },
        }
      : {}),
    repo: project.repo ?? null,
  };
}

export function projectsJson() {
  return {
    projects: projects.map(projectJson),
    earlier: earlier.map((e) => ({ what: e.what, org: e.org, when: e.when, summary: e.summary, repo: e.repo ?? null })),
  };
}

/** Pretty JSON the way an API would print it, shared by the routes and the page. */
export const pretty = (value: unknown) => JSON.stringify(value, null, 2);

export function jsonResponse(value: unknown) {
  return new Response(`${pretty(value)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
