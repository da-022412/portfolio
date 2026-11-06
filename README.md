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

Clone the repo and install dependencies:

```bash
npm install
npm run dev
```

## Payload CMS setup

Payload is installed at `/admin`, with REST endpoints at `/api`. The public
frontend reads the `projects` collection through Payload's Local API. Existing
Markdown files remain untouched for the separately approved import phase.
The `projects` collection uses Lexical rich text. Cover images remain in
`public/images/`; there is no upload collection or external media storage.

Use Node.js `^22.23.4 || >=24.22.1`. Next.js, React, and Payload dependencies are
pinned in `package.json` and `package-lock.json`.

### Environment and Neon

Connect Neon to the Vercel project yourself, select the intended database and
environments, and supply its PostgreSQL connection string as `DATABASE_URL`.
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
internal tables. Apply this migration once per database; the Preview database
has already been initialized.
Future schema changes require `npm run payload -- migrate:create <name>`, review,
and an explicit migration run. Do not run rollback/reset commands against a
populated database without reviewing their destructive effects.

### First administrator

Every user is an administrator. Anonymous account creation is blocked, including
Payload's special first-user registration operation. Bootstrap the initial
administrator locally after applying the schema migration. In Bash, these
prompts keep credentials out of command history and hide password input:

```bash
read -r -p 'Admin email: ' PAYLOAD_ADMIN_EMAIL
read -r -s -p 'Admin password: ' PAYLOAD_ADMIN_PASSWORD
printf '\n'
export PAYLOAD_ADMIN_EMAIL PAYLOAD_ADMIN_PASSWORD
npm run create-admin
unset PAYLOAD_ADMIN_EMAIL PAYLOAD_ADMIN_PASSWORD
```

These two variables are used only by the bootstrap command; do not add them to
Vercel or commit them. The command refuses to create an account if any user
already exists. Sign in at `/admin` and manage subsequent administrators there.
Until bootstrap succeeds, the first-user form cannot create an account.

No email delivery service is configured. Password-reset email delivery requires
an email adapter in a separately approved change.

### Import the existing projects

Run from the repository root after configuring the intended database and applying
its schema migration. For this review, use the Preview database, not production.

Validate all eight source files and their exact body HTML without connecting to
a database:

```bash
npm run seed:projects -- --dry-run
```

After approving the import, configure `DATABASE_URL` and `PAYLOAD_SECRET` in
`.env` (or the process environment), check that the URL targets the intended
Preview database, then run:

```bash
npm run seed:projects
```

A `[SENSITIVE]` placeholder from a Vercel environment pull is not a usable
`PAYLOAD_SECRET`; the script refuses it. Never commit environment values.

The script reads only `_portfolio-items/*.md`. Filename slugs, title, excerpt,
cover-image paths, sort numbers, and live-site links are preserved. Markdown
headings, paragraphs, text, and hard/soft line breaks become Lexical JSON, with
an exact HTML comparison for every body before any database connection opens.
Unsupported Markdown or invalid fields fail preflight instead of losing content.
The unused `portfolio-items/` duplicate is excluded. No source file is modified.

Documents are matched by slug: missing documents are created, identical documents
are skipped without a write, and changed source fields are updated in place.
Every result is logged as `CREATE`, `SKIP`, or `UPDATE`, followed by totals. A
rerun does not create duplicates; it can resume an interrupted run. Reimporting
will overwrite CMS edits to the migrated source fields when they differ from
the Markdown source. Other fields and unrelated projects are left alone.

This is a trusted Local API maintenance command. It bypasses access control and
suppresses request-only Next.js revalidation. After an import, redeploy the
Preview (or rebuild/restart locally) to regenerate static pages from the imported
data. The build never runs the import automatically.

### Checks

```bash
npm run build
npm run typecheck
npm run lint
npm run test:access
npm run test:content
npm run test:import
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
updates or duplicates. Build, typecheck, lint, and all 27 tests passed. The
homepage and eight detail pages return 200 on the refreshed Preview. The
homepage content markup is identical to the Markdown baseline; detail markup
matches after the approved generated CSS-module class rename.

See [verification results](reports/payload-migration-verification.json) for every
URL, browser style/layout checks, exact comparison scope, remaining production
setup, and limitations. The [complete HTML diff](reports/payload-migration-html.diff)
records all raw-value differences, including generated font classes, framework
assets, and React routing/bootstrap data.

Production is unchanged. Existing Markdown files and public image files are
untouched. Production database setup, schema/content import, and deployment must
be handled separately after review.

The Phase 2 dependency audit reported 33 advisories (3 critical), including the
existing Swiper/Tailwind dependency chains and dependencies introduced by
Payload's editor. These remain unresolved and need a separate dependency review;
no automatic major-version remediation has been applied.
