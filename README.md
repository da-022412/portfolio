# Dennis Acosta – Portfolio

This repository contains the code for my personal developer portfolio.  
It’s where I showcase selected projects, skills, and experience as a front-end engineer.

## Tech Stack

- **Next.js** — framework for fast, modern React apps
- **TypeScript** — type-safe development
- **Tailwind CSS** — utility-first styling

## Features

- **Custom design** built without templates or stock themes
- **Responsive layout** optimized for desktop and mobile
- **Clean, accessible UI** with semantic HTML and WCAG best practices
- **Fast performance** through Next.js static generation and optimization
- **Scalable architecture** for adding projects, blog posts, or case studies

## About This Project

This portfolio is more than a website — it’s a demonstration of how I approach front-end engineering:

- Building with modern frameworks (React, Next.js, TypeScript)
- Applying strong UI and accessibility standards
- Structuring code for maintainability and growth
- Delivering performance-focused websites that scale

## Run Locally

Use Node.js `^22.23.4 || >=24.22.1`, then clone the repo and install the locked
dependencies:

```bash
npm ci
cp .env.example .env
```

Fill in `DATABASE_URL` and `PAYLOAD_SECRET` in `.env` using a separate development
database or Neon branch. Follow the schema setup below for a new database before
starting the app:

```bash
npm run dev
```

## Payload CMS setup

Payload is installed at `/admin`, with REST endpoints at `/api`. The public
frontend reads the `projects` collection through Payload's Local API. Existing
Markdown files remain preserved after the completed import.
The `projects` collection uses Lexical rich text. Cover images remain in
`public/images/`; there is no upload collection or external media storage.

Use Node.js `^22.23.4 || >=24.22.1`. Next.js, React, and Payload dependencies are
pinned in `package.json` and `package-lock.json`.

### Environment and Neon

The Vercel project `amphora-creative/portfolio` has separate Neon databases:
`portfolio-payload-preview` for Preview and `portfolio-payload-production` for
Production. Both use the free plan in `iad1`, with separate environment-scoped
`DATABASE_URL` values and sensitive `PAYLOAD_SECRET` values. The production schema
is initialized, all eight projects are imported, and the production admin
`dennis@dennisacosta.com` has been created and verified. Temporary credentials
are stored privately outside Git. The Payload migration is deployed to production
at [dennisacosta.com](https://dennisacosta.com).

For another environment, connect Neon and supply its PostgreSQL connection
string as `DATABASE_URL`.
Preserve the connection string's SSL parameters. Supply a long random
`PAYLOAD_SECRET`, consistent across application instances. Neither value belongs
in Git or in client-side environment variables.

For local development, copy `.env.example` to `.env` and fill in those two values.
Payload CLI commands load `.env`. Use a separate development database or Neon
branch when testing locally. This repository does not provision databases or
change Vercel settings.

The adapter disables automatic database creation and schema pushing. After
reviewing the committed SQL migration, apply it explicitly to the intended
database:

```bash
npm run payload -- migrate
```

The initial schema includes `projects`, authenticated `users`, and Payload's
internal tables. Apply this migration once per database; both Preview and
Production databases have already been initialized.
Future schema changes require `npm run payload -- migrate:create <name>`, review,
and an explicit migration run. Do not run rollback/reset commands against a
populated database without reviewing their destructive effects.

### Administrators and content

The initial administrators and eight projects are already provisioned in Preview
and Production. Manage users and projects through `/admin`. Every user is an
administrator; anonymous account creation and first-user registration are blocked.
The one-time import and administrator setup scripts have been removed.

The approved [NYU Gallatin entry](https://dennisacosta.com/portfolio-items/nyu-gallatin)
was published on November 12, 2026, bringing the production Projects collection
to nine entries. Its source snapshot is `_portfolio-items/nyu-gallatin.md`, with
its cover at `public/images/nyu-gallatin-screenshot-v2.webp`. A review copy also
remains in the isolated `preview-nyu-gallatin` Neon branch under the Preview
project. Markdown files are not read by the frontend: future content changes
must be applied to the corresponding Payload Projects collection as well as
any source snapshot kept in Git.

No email delivery service is configured. Password-reset email delivery requires
an email adapter in a separately approved change.

### Checks

```bash
npm run build
npm run typecheck
npm run lint
npm run test:access
npm run test:content
```

The build generates Payload's import map and collection types before building
Next.js. Building and serving the frontend now requires the environment and
schema setup above. The homepage and project routes remain static;
`generateStaticParams` reads project slugs from Payload. New slugs can render
on demand without a rebuild.

Project saves and deletions revalidate `/` and the affected
`/portfolio-items/{slug}` paths. Slug changes invalidate both old and new detail
paths. Standalone Local API scripts must pass `context: { disableRevalidate: true }`
to avoid calling Next.js revalidation outside a server request.

Rich-text converters preserve the existing body HTML without adding a container.
The content tests cover all eight Markdown bodies, including hard line breaks and
PineBridge's soft newline. An empty Projects collection produces an empty work
list and missing project URLs return 404; there is no Markdown fallback. All
eight original projects have now been imported into the Preview database.

### Completed migration verification

The first import created eight projects; repeated runs skipped all eight without
updates or duplicates. Migration verification passed build, typecheck, lint, and
the retained 21 tests. The
homepage and eight detail pages return 200 on the refreshed Preview. The
homepage content markup is identical to the Markdown baseline; detail markup
matches after the approved generated CSS-module class rename.

The Payload migration deployment was confirmed on November 12, 2026: Vercel reported the
deployment serving `dennisacosta.com` and `www.dennisacosta.com` as Ready, built
from `main` commit `9a7a4da8fe3ade1707580bffbc422bfcb02147d9` (the Payload
migration merge). This matched the local checkout at verification time.

Existing Markdown files and public image files are untouched. The separate
production database, secrets, and schema
are configured, and all eight projects are imported with field/HTML parity and
an unchanged rerun verified. The production admin is created and verified.

Local verification on November 12, 2026 passed build, lint, typecheck, and all 22
tests, including the new Gallatin content fixture. The build used Node.js
24.22.1 and the isolated Gallatin preview database, with local credentials kept
in an ignored `.env`. The Gallatin Vercel preview also built successfully. This
verification did not change the production database or deployment.

The dependency review reduced the audit from 33 affected packages (including
three critical findings) to 12: seven low and five moderate, with no high or
critical findings. The remaining counts come from two upstream advisories:
Payload's unpatched `deepmerge` dependency, and an old esbuild development-server
dependency under Drizzle tooling. No esbuild serve endpoint is configured here.
