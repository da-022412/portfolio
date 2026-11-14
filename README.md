# Dennis Acosta – Portfolio

A Next.js portfolio with Payload CMS, React, TypeScript, Tailwind CSS, and Motion.

## Content management

Payload is the single source of truth for all portfolio content. Create, edit,
reorder, and delete projects through `/admin`. Project text, excerpts, links,
slugs, and display order are stored in the `projects` collection in PostgreSQL.
The body uses Payload’s Lexical rich-text editor.

The frontend reads projects through Payload’s Local API. There are no local
content collections, source snapshots, import steps, or filesystem fallbacks.
Publishing or editing project content does not require a code commit or PR.

Projects display in ascending `order`, with descending slug as the tie-breaker.
MasterTax uses order `5.5`, immediately after Purdue Global Law School (`5`).

Existing cover images are assets in `public/images/`, referenced by the
`coverImage` field in Payload. There is currently no upload collection or
external media storage. Adding a new image file still requires a deployment;
editing project content or selecting an existing image does not.

Every user is an administrator. Anonymous account creation and first-user
registration are blocked. Manage users through `/admin`.

No email adapter is configured, so password-reset email delivery is unavailable.

## Run locally

Use Node.js `^22.23.4 || >=24.22.1` and install the locked dependencies:

```bash
npm ci
cp .env.example .env
```

Fill in `DATABASE_URL` and `PAYLOAD_SECRET` in `.env`, then run:

```bash
npm run dev
```

Use a separate development database or Neon branch. Preserve the connection
string’s SSL parameters and use a long random `PAYLOAD_SECRET`, consistent
across instances of an environment. Neither value belongs in Git or client-side
environment variables. Payload CLI commands load `.env`.

The Vercel project `amphora-creative/portfolio` uses separate Neon projects,
`portfolio-payload-preview` and `portfolio-payload-production`, with
environment-scoped credentials. Both schemas are initialized. The production
site is [dennisacosta.com](https://www.dennisacosta.com).

## Database migrations

Automatic database creation and schema pushing are disabled. For a new database,
review and explicitly apply the committed migration:

```bash
npm run payload -- migrate
```

Do not rerun initial setup or import content into an already populated
environment. New databases start without project content; use Payload to manage
their content.

For future schema changes, generate and review a migration before applying it:

```bash
npm run payload -- migrate:create <name>
```

Review the effects of any rollback or reset before running it against a
populated database.

## Rendering and revalidation

The homepage and project pages are statically generated from Payload.
`generateStaticParams` reads project slugs from the Projects collection. New
slugs can render on demand without a rebuild. Missing project URLs return 404,
and an empty collection produces an empty project list.

Saving or deleting a project revalidates `/` and the affected
`/portfolio-items/{slug}` paths. Changing a slug invalidates both the old and new
detail paths. Standalone Local API scripts must pass
`context: { disableRevalidate: true }` to avoid calling Next.js revalidation
outside a server request; those scripts do not invalidate existing page caches.

## Checks

```bash
npm run lint
npm run typecheck
npm run test:access
npm run test:content
npm run build
```

Access tests cover project permissions, user permissions, and blocked public
registration. Content tests exercise Payload rich-text rendering, line breaks,
empty bodies, and HTML escaping directly.

The build generates Payload’s import map and collection types before building
Next.js. Building and serving the frontend require a configured database with
the schema applied.
