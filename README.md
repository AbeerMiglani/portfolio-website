# portfolio-website

Source for [portfolio.abbykayo.com](https://portfolio.abbykayo.com), built with Next.js (App Router), TypeScript and Tailwind CSS, and deployed on Vercel.

## Editing content

All the text lives in `src/content/`, so you don't need to touch components to update the site:

- `profile.ts`: name, pitch, availability status, email, links, education, about text and skills
- `projects.ts`: project cards. Set `featured: true` on the one to highlight (it gets the wide card and roadmap).
- `earlier.ts`: pre-university work, shown as one-line entries under Projects

The interactive terminal (`src/lib/terminal.ts`) reads from the same files, so it stays in sync.

`public/resume.pdf` is the public copy of the résumé and is generated from `resume/resume.html`. After editing the HTML, run `npm run resume` (it uses your local Google Chrome). The public copy deliberately leaves out the phone number; `RESUME_PHONE="…" npm run resume` also writes a full copy to `resume/out/`, which is gitignored.

The site uses IBM Plex Sans and IBM Plex Mono (loaded with `next/font`). TTF copies in `src/fonts/` (SIL Open Font License) are only used to render the link-preview image.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Deployment

Vercel is connected to this repository. Every push to `main` deploys to production, and every other branch or pull request gets its own preview URL.
