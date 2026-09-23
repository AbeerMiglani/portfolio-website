# portfolio-website

Source for [portfolio.abbykayo.com](https://portfolio.abbykayo.com), built with Next.js (App Router), TypeScript and Tailwind CSS, and deployed on Vercel.

## Editing content

All the text lives in `src/content/`, so you don't need to touch components to update the site:

- `profile.ts`: name, pitch, availability status, email, links, education, about text and skills
- `projects.ts`: project cards. Set `featured: true` on the one to highlight (it gets the wide card and roadmap).
- `experience.ts`: roles, newest first

The interactive terminal (`src/lib/terminal.ts`) reads from the same files, so it stays in sync.

`public/resume.pdf` is the public copy of the résumé. It deliberately leaves out the phone number; keep the full version for applications.

Fonts: Departure Mono (pixel accent) and Hanken Grotesk are vendored in `src/fonts/` under the SIL Open Font License.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Deployment

Vercel is connected to this repository. Every push to `main` deploys to production, and every other branch or pull request gets its own preview URL.
