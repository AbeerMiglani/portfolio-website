# portfolio-website

Source for [portfolio.abbykayo.com](https://portfolio.abbykayo.com), built with Next.js (App Router), TypeScript and Tailwind CSS, and deployed on Vercel.

## Editing content

All the text lives in `src/content/`, so you don't need to touch components to update the site:

- `profile.ts`: name, pitch, availability status, email, links, about text and skills
- `projects.ts`: project cards. Put the strongest one first and set `featured: true`.
- `experience.ts`: roles, newest first

Replace `public/resume.pdf` with your real résumé (keep the same file name).

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Deployment

Vercel is connected to this repository. Every push to `main` deploys to production, and every other branch or pull request gets its own preview URL.
