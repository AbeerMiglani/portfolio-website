@AGENTS.md

# Portfolio site: working notes

Abeer Miglani's personal site, live at https://portfolio.abbykayo.com. It's a single static page built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4, and deployed on Vercel. The audience is recruiters and engineers hiring for SWE internships, so it should stay fast, easy to skim and accurate.

This is the **backend edition** (Oct 2026): Abeer pivoted from systems (C++/Rust) to backend (Go), and the site reads like API documentation. The earlier systems edition is archived; see **Editions** below.

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # every route should be ○ (static)
npm run resume  # compile resume/resume.tex to public/resume.pdf (needs pdflatex)
curl -s localhost:3000/  # after `npm run start`: the terminal résumé (browsers still get HTML)
```

There are no unit tests. Before pushing, verify changes by running `lint` and `build`, then load the page in Playwright:

- Chromium is at `/opt/pw-browsers`, and the global module is `/opt/node22/lib/node_modules/playwright`.
- Check widths of 320px, 390px and 1280px, in both light and dark themes.
- Confirm there's no horizontal overflow: `document.documentElement.scrollWidth - innerWidth` should be 0.
- Confirm there are no console errors.
- Exercise anything interactive you touched: Ripple's "try it" tabs (simulation and API, click and arrow keys), the cascade (click a node, `reset`, the contained node Transit hub 1), the API playground (all three presets), the Redis framing demo (`send`, `send without framing`), the code-panel tabs (click and arrow keys), the sidebar (desktop) and `menu` (phones), the collapsible responses, and console commands (including `curl /api/profile.json`). Also check reduced motion (`reducedMotion: "reduce"`), keyboard use (Tab must leave the console), and a load with JavaScript disabled.
- Check the JSON API: `curl -s localhost:3100/api/profile.json | python3 -m json.tool` for `/api`, `/api/profile.json` and `/api/projects.json`, and that `access-control-allow-origin: *` is set.
- Run axe-core (`npm i --no-save axe-core` in the scratchpad, inject `axe.min.js`) in both themes and expect zero violations. Run it with `axe.run(document, { rules: { 'label-content-name-mismatch': { enabled: true } } })`: that rule is experimental, so a default run skips it, and Lighthouse gives it zero weight. Contrast is the usual failure: small text on the dark terminal needs at least `text-white/55`, and the light `--accent-soft` was set to `#fdefe7` so accent text on it reaches 4.5:1.

**Cloud-environment gotchas when verifying:**

- **Stopping the server:** don't use `pkill -f` or `pgrep -f` with a pattern like `next`; it matches your own shell and kills it (exit 144). Find the PID with `ps -eo pid,args | awk '/next-server|next start -p 3100/ && !/awk/ {print $1}'` and `kill` that.
- **Browser and network:** Chromium can't reach the internet without the agent proxy, and Playwright's proxy option also routes `localhost` through it (which fails). So run the browser without a proxy against the local server, and stub outside calls with `page.route`. For `git log`, fetch real JSON first with `curl https://api.github.com/repos/AbeerMiglani/redis-cpp/commits?per_page=100` and serve it from the route. Test the failure path with a 403 too.
- **Production can't be screenshotted from here**, because of the certificate check. Check it with `curl` instead: `curl -s -A "Mozilla/5.0" https://portfolio.abbykayo.com | grep …` for HTML, and plain `curl -s https://portfolio.abbykayo.com` for the text résumé.
- **Preview deployments need a Vercel login**, so the `curl` user-agent rewrite can only be tested locally (`npm run start`) or on production after merging.
- **Element screenshots** sometimes render a word (e.g. "comms" in the Ripple legend) blue. That's a screenshot artifact; the computed colour is the normal muted grey.

## Performance

Audited with Lighthouse 12; take the median of three mobile runs against `npm run start`. Chromium for Lighthouse is at `/opt/pw-browsers/chromium` (pass it as `CHROME_PATH`).

- **Scores (backend edition, Oct 2026):** mobile 95 for performance (FCP ≈ 0.9 s, TBT ≈ 150 ms, CLS 0) and 100 for accessibility, best practices and SEO. The systems edition measured 97 in the same run (desktop was 100 in every category).
- **Mobile LCP (≈ 2.6 s, was ≈ 2.0 s) is a simulation artifact.** The LCP element is the hero pitch paragraph, which is plain text. The browser's observed LCP equals FCP (about 140 ms unthrottled). Lighthouse's simulator counts every script that finished before the observed paint, and on localhost that means the whole React bundle. Don't chase it with markup changes.
- **Page weight:** about 266 KB total. Of that, roughly 150 KB gzipped is React and Next.js itself; the site's own client code is under 30 KB gzipped. HTML is about 25 KB gzipped (it was 15 KB): the JSON panels are rendered into the HTML and again into the inline RSC payload. If a panel doesn't earn its place, drop it rather than adding lazy loading. CSS is about 7 KB gzipped.
- **Production:** Vercel serves pages with Brotli from the CDN (`x-vercel-cache: HIT`). Hashed assets under `/_next/static/immutable/` get `max-age=31536000, immutable`, and TTFB is about 250 ms.
- **Fonts:** see the comments in `layout.tsx` for which weights load. IBM Plex Sans is a variable font (`weight: "variable"`), so every Sans weight from 100 to 700 is real and costs nothing extra. IBM Plex Mono is static: each listed weight is a separate preloaded file (about 10 KB), and any heavier Mono weight is drawn as faux bold. So keep Mono text at medium or lighter, or add the weight in `layout.tsx` knowing it adds a preload. `next/font` preloads every configured file, not just the ones above the fold; today that's three (Sans latin, Mono 400, Mono 500).
- **Tailwind scanning:** `globals.css` imports Tailwind with `source("../")`, so only `src/` is scanned for class names. Without it, class-like words in this file or the README shipped as unused CSS.
- **Tried and rejected, with measurements:**
  - `experimental.inlineCss`: LCP unchanged, FCP about 170 ms worse because the HTML grew.
  - `<Suspense>` around each client component for progressive hydration: FCP about 150 ms worse, and no reliable TBT gain.

  Measure against a fresh baseline before retrying either.

## Editions (switching back)

- **Systems edition** (C++ headline, terminal look, man-page About): frozen on the branch `archive/systems` at commit `f77f019`. Vercel keeps a preview of that branch, and the last systems production deployment stays in Vercel's history (Instant Rollback works for a quick switch).
- **Tag:** `systems-v1` should point at the same commit. The cloud session can't create tags (the git proxy refuses tag pushes and tag API writes), so Abeer creates it in GitHub's Releases page if it's missing.
- **To switch back for good:** restart the working branch from the archive (`git fetch origin archive/systems && git checkout -B <branch> origin/archive/systems`), push it with `--force-with-lease`, open a PR into `main` and let Abeer merge. The archive's own CLAUDE.md, résumé and content come with it.
- **Don't edit `archive/systems`** except to fix something Abeer asks for there; it's the record of that edition.

## Git and pull requests

- Do not add Claude attribution anywhere: no `Co-Authored-By: Claude` or `Claude-Session:` trailers in commit messages, and no "Generated with Claude Code" line or session link in pull request descriptions or comments.
- Author commits as `Abeer <216707591+AbeerMiglani@users.noreply.github.com>`.
- The GitHub integration may append a "Generated by Claude Code" footer to PR descriptions you create. Check the description after opening the PR, and remove the footer if it's there.
- Workflow: work on a branch, push it (Vercel builds a preview), open a PR only when asked, and let Abeer merge it. Merging to `main` deploys production.
- Branch deletion is blocked from the cloud environment's git proxy (HTTP 403), so ask Abeer to delete branches on GitHub.
- **One branch at a time:** the cloud session may only push its designated branch (e.g. `claude/elegant-cray-u6e3df`). After a PR from it merges, restart it from `origin/main` (`git checkout -B <branch> origin/main`) before new work, and push with `--force-with-lease`. To stage a second PR while the first is open, commit it on a local branch, keep a `git format-patch` copy in the scratchpad, and cherry-pick it onto the restarted branch after the first merges.
- **After merge:** Vercel deploys `main` in about a minute. Poll the live site with `curl` for a string from the change before reporting that it's live.

## Deployment

- **Vercel project:** `portfolio-website` (`prj_LAImArYCTA7TxXK7ZxlnEF9yTVYG`) in team "Abeer's projects" (`team_MisghZjZoPCf2CdjxcdsDpKx`). Production branch is `main`.
- **Framework preset:** `vercel.json` pins `"framework": "nextjs"`. The project was created as "Other", and without this pin `/` returns 404.
- **Domain:** `portfolio.abbykayo.com` uses DNS managed at Cloudflare (registrar Porkbun). It needs a `CNAME portfolio → cname.vercel-dns.com` record set to **DNS only** (grey cloud). Proxying it through Cloudflare breaks SSL with error 525. The root `abbykayo.com` is separate and not part of this project.
- **Preview protection:** preview URLs need a Vercel login. To fetch one, use the Vercel MCP `web_fetch_vercel_url`; plain `curl` won't work.

## Code map

| Path | What it is |
| --- | --- |
| `src/content/profile.ts` | Name, role, tagline, pitch, status, `learning`, email, links, education, about text, `problemSolving` stats, skills |
| `src/content/projects.ts` | Projects in page order (Ripple first, `featured`), the optional `roadmap`, the optional `learned` note and `shortName` (used in paths like `/projects/ripple` and by `cat`). `inProgress` is the project with a roadmap |
| `src/content/earlier.ts` | Pre-university work (the LOHUM summer training), shown under `GET /experience` and by the terminal's `earlier` |
| `src/lib/api.ts` | The content as JSON (`profileJson`, `projectsJson`, `apiIndex`), used by the `/api` routes and by every response panel on the page, so they can't drift |
| `src/app/api/route.ts`, `api/profile.json/`, `api/projects.json/` | Static JSON endpoints (`force-static`, CORS `*`) |
| `src/lib/terminal.ts` | Terminal command table: pure functions that return `Line[]`, optional effects (`clear`, `open`, `theme`, `tty`) and an optional `pending` promise whose lines are appended when it resolves (used by `git log`) |
| `src/components/Terminal.tsx` | Console UI (client component), shown under `WS /console`: history, Tab completion, Ctrl+L, suggestion chips, full-screen `tty` mode (Esc or `exit` to leave) |
| `src/lib/plaintext.ts` | The site as a 78-column text résumé, built from `src/content`. Served at `/resume.txt` (plain) and `/resume.ansi` (coloured), and printed by the terminal's `curl` |
| `next.config.ts` | Rewrites `/` to `/resume.ansi` when the user agent is `curl`, `wget`, HTTPie or `xh`, so `curl https://portfolio.abbykayo.com` prints the résumé. Both responses stay static |
| `src/components/Sidebar.tsx` | The endpoint nav: sticky sidebar on desktop, top bar plus `menu` on phones; marks the section in view with `aria-current` |
| `src/components/Intro.tsx` | `GET /`: name, tagline, pitch, status, CTAs, request examples (curl, Go, Python) and the real `/api/profile.json` response |
| `src/components/ProjectEndpoint.tsx` | `GET /projects/<name>`: prose, stack, roadmap and repo on the left; the demo ("try it") and the JSON response on the right |
| `src/components/Endpoint.tsx` | `EndpointSection` (method, path, title, prose and aside), `MethodBadge`, and `Response` (a collapsible `<details>` with the JSON) |
| `src/components/CodePanel.tsx`, `Json.tsx` | Dark code panel with accessible tabs; JSON syntax colouring |
| `src/components/FrameDemo.tsx`, `src/lib/framing.ts` | Redis card: the frame's bytes, plus a replay of the server reading two requests with and without framing |
| `src/components/DemoTabs.tsx` | A project's "try it" card; tabs when a project has more than one demo (Ripple: simulation, then API). Panels stay mounted so a running demo keeps its state |
| `src/components/CascadeDemo.tsx`, `src/lib/cascade.ts` | Ripple's first demo: click a node to knock it out and watch its load spread to neighbours in waves (a simplified illustration, not Motter–Lai) |
| `src/components/ApiPlayground.tsx`, `src/lib/playground.ts` | Ripple's second demo: replays of real exchanges with Ripple's API (run a simulation, auth and rate limits, cached recommendations). No network calls |
| `src/components/Sections.tsx` | `GET /projects` (index), `/experience`, `/skills`, `/about`, `WS /console`, `POST /contact` |
| `src/components/Footer.tsx`, `ThemeToggle.tsx` | Status-page footer ("200 OK · all systems operational", the `curl` hint, `/api` links, build SHA) and the theme toggle |
| `src/components/ArrowIcon.tsx` | The ↗ used on outbound links, drawn as SVG because IBM Plex has no `↗` glyph (the character fell back to a mismatched font). Don't type `↗` in markup |
| `src/app/page.tsx` | Layout (sidebar + main) and page order: `GET /`, `/projects` and each project, `/experience`, `/skills`, `/about`, `/console`, `/contact` |
| `src/app/robots.ts`, `sitemap.ts` | Static SEO routes |
| `src/app/layout.tsx` | Fonts, metadata, and the pre-paint theme script |
| `src/app/globals.css` | Design tokens (see below) |
| `src/app/opengraph-image.tsx` | Link-preview image. `next/og` can't read woff2, so it uses the TTFs in `src/fonts/` |
| `resume/resume.tex` | Résumé source: Abeer's ATS-friendly LaTeX résumé (one US Letter page, no phone number) |
| `scripts/render-resume.mjs` | Compiles the résumé with `pdflatex` in a temporary folder |
| `public/resume.pdf` | Public résumé, generated by `npm run resume`, never hand-edited |

## Content: single sources of truth

Change a number in one place and every view updates:

- **DSA count** (`profile.problemSolving.total`, matching the résumé's "140+") appears in the About page's Education entry and the terminal's `whoami`. Show only the overall total, not a per-platform figure such as LeetCode alone. It's deliberately kept low-key; don't promote it back to a headline stat.
- **The in-progress project's `roadmap`** (`inProgress`, today the Redis server) feeds its roadmap on the page, the JSON API and the terminal's `now`, `top`, `neofetch` and `cat redis`. To record progress, flip `done: false` to `true`.
- **JSON:** `src/lib/api.ts` builds both the `/api` endpoints and the page's response panels. Add fields there, never by hand in a component.
- **Dates** use one format everywhere: `Mon YYYY`, a range as `Jul 2026 – present` (en dash with spaces). The résumé uses its own `Jul. 2026 – Present` style.

**Adding a project:**

1. Add an entry to `projects.ts` with a unique `slug` and `shortName`.
2. Add a matching case in `demos()` in `ProjectEndpoint.tsx` (one or more tabs). Show what the project actually does; don't reuse a generic graphic. A small interactive demo is best, but it must render a complete picture on the server (for no-JS visitors), announce results with `aria-live`, and show the end state immediately under reduced motion.
3. The sidebar, the `/projects` index, the JSON API, `ls` and `cat <slug>` pick the new project up automatically.
4. Once Abeer has a Go project, it should lead (`featured`, first in the array), and the "learning Go" wording should be revisited.

**Adding a terminal command:** add an entry to `commands` in `src/lib/terminal.ts`.

- Set `hidden: true` to keep it out of `help`.
- For aliases, use the `aliases` map.
- Commands in `preloaded` run at render time on both server and client, so their output must be deterministic (no dates, no randomness).
- A bare `ping` answering "Chishit Rib" is an intentional inside joke. Keep it.
- `git log [project]` fetches commits from GitHub's public API in the visitor's browser (60 requests an hour per IP) and shows **dates and counts only, never commit messages**. It only reads; don't add anything that writes to Abeer's other repos.
- `curl /api/…` (or the full URL) prints the same JSON as the real endpoints; `curl <site>` prints the text résumé.
- Hidden easter eggs: `top`, `neofetch`, `vim` (and `:q`), `rm -rf /` (GNU's real failsafe message), `git push`, `go version` (honest: no Go repo yet). Keep them short and derived from content where they state facts.

## Design system

The page reads like API documentation, which suits the backend pitch and stays easy for recruiters to skim. Don't bring back the systems edition's pieces (the `$ whoami` hero, the man-page About, the burnt-orange palette) or the older fanout-inspired ones (pixel-font accent word, tilted note cards, pastel stacked cards, numbered tiles, a badge next to the logo).

**Layout:**

- A 15rem sticky sidebar of endpoints on desktop (`lg` and up); on phones a sticky top bar with the theme toggle and a `menu` (`<details>`, so it works without JavaScript).
- The main column is a stack of endpoint sections. Each has a method badge, a mono path, a plain title, prose on the left and an aside on the right at `xl` (stacked below the prose on narrower screens).
- The aside holds code: request examples (`CodePanel`), a demo ("try it"), and a collapsible `Response` with the real JSON. Keep it to those.
- Section ids are nav anchors: `top`, `projects`, `project-<shortName>`, `experience`, `skills`, `about`, `terminal` (the console's element), `contact`. Don't rename them.

**Colour tokens** live in `src/app/globals.css`: `--bg`, `--surface`, `--chip`, `--fg`, `--muted`, `--border`, `--divider`, `--ink`, `--ink-fg`, `--accent`, `--accent-soft`, `--ok`, `--band`, `--panel`, `--panel-fg`, `--panel-border`, plus the method colours `--get`, `--post`, `--ws`. Use them as Tailwind classes (`bg-surface`, `text-accent`, `text-get` and so on).

**To add a token,** set it in all four places:

1. the `:root, :root[data-theme="light"]` block
2. the `:root[data-theme="dark"]` block
3. the `@media (prefers-color-scheme: dark)` no-JS fallback
4. `@theme inline`, as `--color-<name>`

**Palette and type:**

- Cool paper light theme (`#f7f8fa`) and a near-black dark theme (`#0d1117`), with one teal accent (`#0a6f8b` light, `#4fc3dc` dark). Stick to one accent.
- Method colours (GET green, POST amber, WS violet) are only for method badges and status codes, never for decoration.
- Code panels (`--panel`) are dark in both themes. Inside them, theme colours can be too dark, so use the fixed bright ones: `MethodBadge onDark`, the `.json-*` classes in `globals.css`, `#4fc3dc` for the console prompt and tab underline, `#4ade80`/`#fbbf24`/`#f87171` for 2xx/4xx/5xx.
- IBM Plex Sans for text and IBM Plex Mono for paths, code and labels, both loaded with `next/font`. Plex Sans italic isn't loaded, so don't use `italic`.

**Theme switching:**

- Theme is `data-theme` on `<html>`, set before paint by the inline script in `layout.tsx`.
- The visitor's choice is stored in `localStorage` under `theme`. With no stored choice, it follows the system setting, defaulting to light.
- `ThemeToggle` and the terminal's `theme` command both go through `applyTheme` in `src/lib/theme.ts`, which also recolours the `theme-color` meta tags so the phone's toolbar follows the page. The colours live in `themeColors` there and must match `--bg`.
- If reading storage throws (blocked site data), the pre-paint script still follows the system setting.

**Patterns to reuse:**

- **New section:** wrap it in `EndpointSection` with an honest method and path; give it a `Response` only if `src/lib/api.ts` really serves that data.
- **Backgrounds:** only the sidebar and the `GET /projects` index sit on `--band`. Sections are separated by `--divider` rules.
- **Code panel tabs:** `CodePanel` follows the WAI-ARIA tabs pattern (arrow keys, Home/End). The first tab is what no-JS visitors see.
- **Links with arrows:** use `ArrowIcon`, never a typed `↗`.

## Conventions and gotchas

- **Decorative elements:** artwork, prompts and bullets get `aria-hidden="true"`. Give screen readers the plain label with `sr-only` text.
- **Controls with visible text** (for example, a button showing a short glyph or a number): name them with `sr-only` text inside the button, not `aria-label`. An `aria-label` has to contain the visible text (axe's `label-content-name-mismatch`), which short glyphs rarely do.
- **Keyboard:** never trap Tab. The terminal only keeps Tab when it completes something; Shift+Tab and a Tab with nothing to complete move focus as usual. A control that disappears when used must move focus somewhere sensible.
- **Timers in demos:** keep `setState` updaters pure. Each interval counts in its own closure and clears only its own id, so a late tick can't stop a newer run.
- **Reduced motion:** respect it with `motion-safe:` or the `prefers-reduced-motion` block.
- **Grids on phones:** a grid whose items contain wide content can overflow at 320–390px (code panels and the console are the usual cause). Use `grid-cols-1` (which gives `minmax(0,1fr)`) plus `min-w-0` on the children, and `overflow-x-auto` on `<pre>`. Long JSON lines wrap with `[overflow-wrap:anywhere]`, not `break-all`.
- **Next.js 16 changes:** read `node_modules/next/dist/docs/` before using unfamiliar APIs (see `AGENTS.md`).

## Accuracy rules (the site and résumé must match the repos)

- **Redis:** `redis-cpp` implements a length-prefixed binary protocol (a 4-byte length in host byte order, so little-endian on x86/ARM, then the payload) with `read_full`/`write_all` loops and a 4 KB guard. It does not implement RESP and has no key-value store yet, so call it a "Redis-style server", never "Redis-compatible", until it speaks RESP. Since Oct 2026 it has an event loop over non-blocking sockets, so one thread serves many clients (the site doesn't name poll() or epoll(); check the code before it does). "Concurrent I/O models" in the roadmap is the book's chapter on the options, not an implementation. Started Jul 2026.
- **Framing demo:** it mirrors the real code, so keep it that way. The client sends `hello1` and `hello2` (from `redis_client.cpp`); the length prefix is little-endian; `read_full` asks `read()` for exactly the bytes still needed; the unframed mode is the old `do_something()` (`read(fd, buf, 63)`). Lengths are counted in UTF-8 bytes, which is why a split `é` prints as `�`.
- **Cascade demo:** a 9-node *simplified illustration*, not Ripple's model. Every node starts with a load of 1; a failed node hands its load to its working neighbours in equal shares, and any node past its capacity (`capacity` in `src/lib/cascade.ts`) fails in the next wave. Failures therefore always travel along drawn links, which the demo shows by lighting up the links between consecutive waves and putting a wave number on each failed node. An earlier Motter–Lai version failed nodes far from the click and read as random, even with load meters added, and Abeer found the meters cluttered. So keep this model and keep the card minimal: badges, path links, one status line and one key line. The capacities were tuned so most starts give a 2–4-wave chain, Transit hub 1 is contained, and the default (Water plant 2) ends at the hospital. Re-check those properties if you change nodes, edges or capacities. The knocked-out node uses the system `Highlight` colour in forced-colours (high-contrast) mode, since it has no badge to set it apart. Abeer asked for it back in the backend edition (Ripple looked flat without it), so it's the first tab of Ripple's "try it" card, with the API playground second.
- **Positioning:** backend. The headline is "I build backend services." Python (Ripple) is the backend evidence; Go is only ever "learning Go" or "Go (learning)" until a Go repo exists. The C++ Redis server is framed as the networking underneath, not as the headline.
- **Ripple's backend claims** are checked against its code: `api/simulations.py` (POST returns 200 with `status: "pending"`, then `run_simulation_task.delay`; a dispatch failure marks the run failed and returns 503), `celery_app.py` (`acks_late`, time limits) and `simulation/runner.py` (3 retries, exponential backoff capped at 30 s, only for transient Postgres/Redis errors), `api/ws.py` (Redis pub/sub with a fallback check of the stored run), `security.py` (viewer/operator/admin keys, 60 requests a minute fixed window, 429 with `Retry-After: 60`, fails closed in production), `services/recommendation_cache.py` (1 h TTL). The 1.5 s → 190 ms, 25x and 300-test figures come from Abeer's résumé. Re-check before changing any of them.
- **API playground:** `src/lib/playground.ts` must only use paths, status codes, headers and messages that exist in Ripple's code (the list is in the file's header comment). IDs are shortened with "…" and result values are labelled as sample data; never invent timings or headers such as `X-Cache`.
- **Ripple:** link to `github.com/AbeerMiglani/ripple`, not `SatishSystemsInc`. `SatishSystemsInc` is the hackathon record and must stay untouched.
  - Describe Ripple as "Manipal Hackathon 2026".
  - The "sole developer" wording is Abeer's choice, so keep it.
  - Lead with its backend parts (FastAPI, Celery, PostgreSQL, Redis); the Rust extension is a supporting detail.
- **LOHUM:** it was summer training in Grade 11 (Jun 2023), not a job. Don't give it a job title on the site; the résumé lists it under Experience as "Summer Trainee" at LOHUM Cleantech.
- **Skills:** only list skills backed by the résumés or repos. For example, "Linux" was deliberately left out.
- **Excluded projects:** AI Scam Protect, AI Voice Detector and the HCL GUVI variant are deliberately left off the site and résumé. The Terminal quiz is off both the site and the current résumé.
- **Skills:** Google Cloud was removed because no project uses it. Docker and GitHub Actions stay (Ripple uses both).
- **Plain-text résumé:** `src/lib/plaintext.ts` builds it from `src/content`, so it follows the site, not `resume/resume.tex`. Keep lines at 78 columns or less (check with `awk '{ if (length > m) m = length } END { print m }'`).
- **Phone number:** it must never be committed. `public/resume.pdf` is the web version without it.

## Abeer's other repositories

- **`redis-cpp`: hands off.** Abeer doesn't want changes made to it, not even README or build fixes; a PR for that was closed at their request. Only read it (e.g. to keep the site accurate). One known issue, left for Abeer on purpose: both `.cpp` files use `memcpy`, `strlen` and `errno` without including `<cstring>` and `<cerrno>`, so they build with clang on macOS but not with g++ on Linux.
- **`ripple`:** its history was rewritten so that every commit is authored by Abeer, with no Claude trailers. Don't rewrite it again without being asked.
- **`SatishSystemsInc`:** the hackathon record. Never touch it.

## Ideas not done yet

- **Redis benchmarks:** the card and the résumé quote the same numbers (25K requests per second, 38 µs median and 82 µs p99 latency over 100K loopback round trips). When Abeer re-benchmarks, for example with many concurrent clients on the event loop, update both together, and keep the conditions (loopback, number of round trips) next to the numbers.
- **Write-up:** a short post on one thing learned (framing, epoll vs threads, why `read_full` exists), once Abeer writes it.
- **Name line:** an "also Abby" line explaining the `abbykayo` domain was considered and left out; ask before adding it.
- **Abeer's to-dos:** pin `redis-cpp` and `ripple` on the GitHub profile, and check the link preview in LinkedIn's Post Inspector.

## Résumé

- **Where to edit:** `resume/resume.tex` is Abeer's own LaTeX résumé, tuned for applicant tracking systems (ATS). Since Oct 2026 it's the backend version (backend summary, Ripple's tech line and bullets, skills led by Python, Go (learning), FastAPI and Celery); the systems version lives on `archive/systems`. Rust is deliberately not listed as a language (Abeer finds it a stretch); Ripple's Rust (PyO3) extension is still described in its bullets. Keep its wording, structure and section order as Abeer wrote it, and change only what's asked. Then run `npm run resume` to rebuild `public/resume.pdf`.
- **Repo links:** project and experience headings link to their repos with the `\repo{name}` macro: an underlined, unboxed "GitHub" on the right of the heading line, followed by `|` and the date (write `{\repo{name}Jun. 2023}` in the date argument). The full URL stays in the PDF link. The header keeps the full `github.com/AbeerMiglani` profile link.
- **Toolchain:** the script needs `pdflatex` (TeX Live on Linux, MacTeX on macOS). In the cloud environment, install it with `apt-get install -y --no-install-recommends texlive-latex-base texlive-latex-recommended texlive-latex-extra texlive-fonts-recommended texlive-lang-english`. Vercel doesn't build the résumé; the committed PDF is what's served.
- **Full copy with phone:** `RESUME_PHONE="…" npm run resume` also writes `resume/out/Abeer_Miglani_Resume.pdf`, with the phone number inserted at the start of the contact line. `resume/out/` is gitignored. Never put the number in the `.tex`, a commit or a PR.
- **One page:** the script fails if a PDF isn't exactly one page. Tighten wording or spacing rather than shrinking the font further.
- **Keep it in sync with the site:** the résumé repeats facts from `src/content/` (the DSA count, projects, benchmark numbers, links), so when one changes, update the other in the same PR.
