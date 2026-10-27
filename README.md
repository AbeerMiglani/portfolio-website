# portfolio-website

Source for [portfolio.abbykayo.com](https://portfolio.abbykayo.com), built with Next.js (App Router), TypeScript and Tailwind CSS, and deployed on Vercel. The page is laid out like API documentation, and the same content is served as JSON under [`/api`](https://portfolio.abbykayo.com/api).

## Editing content

All the text lives in `src/content/`, so you don't need to touch components to update the site:

- `profile.ts`: name, pitch, availability status, email, links, education, about text and skills
- `projects.ts`: projects, in page order. `featured: true` marks the lead project; a `roadmap` marks one still in progress.
- `earlier.ts`: pre-university work, shown under `GET /experience`

The console (`src/lib/terminal.ts`), the JSON API (`src/lib/api.ts`) and the text résumé (`src/lib/plaintext.ts`) read from the same files, so they stay in sync.

`public/resume.pdf` is the public copy of the résumé and is compiled from `resume/resume.tex`. After editing it, run `npm run resume` (it needs `pdflatex`, from TeX Live or MacTeX). The public copy deliberately leaves out the phone number; `RESUME_PHONE="…" npm run resume` also writes a full copy to `resume/out/`, which is gitignored.

The site uses IBM Plex Sans and IBM Plex Mono (loaded with `next/font`). TTF copies in `src/fonts/` (SIL Open Font License) are only used to render the link-preview image.

## Editions

The earlier **systems edition** of the site (C++ headline, terminal look) is kept on the [`archive/systems`](https://github.com/AbeerMiglani/portfolio-website/tree/archive/systems) branch. To switch back, open a pull request from it into `main` (or restart a working branch from it) and merge.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Deployment

Vercel is connected to this repository. Every push to `main` deploys to production, and every other branch or pull request gets its own preview URL.
