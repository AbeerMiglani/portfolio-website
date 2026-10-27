import { profile } from "@/content/profile";
import { pretty, profileJson } from "@/lib/api";
import { ArrowIcon } from "./ArrowIcon";
import { CodePanel } from "./CodePanel";
import { MethodBadge, Response } from "./Endpoint";

const url = `${profile.siteUrl}/api/profile.json`;

const examples = [
  { label: "curl", code: `curl ${url}` },
  {
    label: "Go",
    code: `resp, err := http.Get("${url}")
if err != nil {
	log.Fatal(err)
}
defer resp.Body.Close()

var me struct {
	Name   string \`json:"name"\`
	Status string \`json:"status"\`
}
json.NewDecoder(resp.Body).Decode(&me)
fmt.Println(me.Name, "·", me.Status)`,
  },
  {
    label: "Python",
    code: `import requests

me = requests.get("${url}").json()
print(me["name"], "·", me["status"])`,
  },
];

// GET / : who I am, with the same data as a real request to /api/profile.json.
export function Intro() {
  return (
    <section aria-labelledby="top-title" className="border-b border-divider px-4 pt-12 pb-14 sm:px-8 lg:px-12 lg:pt-16">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] xl:gap-14">
        <div className="min-w-0">
          <p id="top" className="flex items-center gap-2 font-mono text-sm text-muted">
            <MethodBadge method="GET" />
            <span className="text-fg">/</span>
            <span className="text-xs">
              · <span className="text-ok">200</span> OK
            </span>
          </p>
          <h1 id="top-title" className="mt-4 text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-xl text-fg sm:text-2xl">{profile.tagline}</p>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">{profile.pitch}</p>

          <p className="mt-6 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md bg-accent-soft px-2.5 py-1 font-mono text-xs text-fg">
            <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
            {profile.status}
            <span className="text-muted">·</span>
            learning {profile.learning.join(", ")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#projects" className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-ink-fg hover:opacity-90">
              See my projects
            </a>
            <a
              href={profile.resume}
              className="rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:border-fg"
            >
              Résumé (PDF)
            </a>
            {profile.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group/link inline-flex items-center gap-1 px-2 py-2.5 text-sm text-muted hover:text-fg"
              >
                {link.label}
                <ArrowIcon className="transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5" />
              </a>
            ))}
          </div>

          <p className="mt-8 font-mono text-xs text-muted">
            Everything here is also JSON:{" "}
            <a href="/api" className="text-fg underline decoration-border underline-offset-4 hover:decoration-accent">
              /api
            </a>
            , or try the{" "}
            <a href="#terminal" className="text-fg underline decoration-border underline-offset-4 hover:decoration-accent">
              console
            </a>
            .
          </p>
        </div>

        <div className="min-w-0 space-y-4">
          <CodePanel
            title="request"
            tabs={examples.map((ex) => ({
              label: ex.label,
              content: (
                <pre className="font-mono text-[0.72rem] leading-relaxed text-panel-fg [tab-size:4]">
                  <code>
                    {ex.label === "curl" && (
                      <span aria-hidden="true" className="text-panel-fg/55">
                        ${" "}
                      </span>
                    )}
                    {ex.code}
                  </code>
                </pre>
              ),
            }))}
          />
          <Response source={pretty(profileJson())} path="/api/profile.json" open />
        </div>
      </div>
    </section>
  );
}
