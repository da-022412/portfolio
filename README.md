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

Payload is installed at `/admin`, with REST endpoints at `/api`. During this
migration's configuration phase, the public site still reads `_portfolio-items/`.
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
internal tables. No migration has been applied as part of the repository setup.
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

### Checks

```bash
npm run build
npm run typecheck
npm run lint
npm run test:access
```

The build generates Payload's import map and collection types before building
Next.js. Database-backed admin/API checks require the environment and schema
setup above. The public frontend remains independent of the database until its
content-source migration is approved.

The Phase 2 dependency audit reported 33 advisories (3 critical), including the
existing Swiper/Tailwind dependency chains and dependencies introduced by
Payload's editor. These remain unresolved and need a separate dependency review;
no automatic major-version remediation has been applied.
