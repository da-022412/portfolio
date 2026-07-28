# AGENTS Handoff Notes

## Context
- Project: `portfolio` (Next.js + Payload migration from local Markdown content)
- Date of work: 2026-05-05
- Primary goal: migrate content workflow to Payload CMS with local Postgres for dev.

## What Was Implemented
- Added Payload integration into existing Next app:
  - `payload.config.ts`
  - `src/app/(payload)/...` routes/layout for admin and API
  - Collections:
    - `src/collections/Users.ts`
    - `src/collections/Media.ts`
    - `src/collections/PortfolioItems.ts`
  - Generated types:
    - `src/payload-types.ts`
- Added local DB workflow:
  - `docker-compose.yml` (Postgres service)
  - `scripts/db-up.sh`, `scripts/db-down.sh`
  - `package.json` scripts updated
- Added install-time native dependency repair:
  - `scripts/ensure-lightningcss.mjs`
  - `postinstall` hook in `package.json`
- Updated docs:
  - `README.md` notes for Payload + DB startup.

## App Status
- Homepage (`/`) works.
- Payload admin (`/admin`) fails with DB auth/connect errors.
- Browser-side `undefined` error on `/admin` is a symptom of backend Payload init failure.

## Key Errors Seen

### 1) Native CSS binary missing (fixed in repo, but can recur per machine)
- Error:
  - `Cannot find module '../lightningcss.darwin-arm64.node'` (mac)
  - `Cannot find module '../lightningcss.linux-arm64-gnu.node'` (linux)
- Mitigation added:
  - `scripts/ensure-lightningcss.mjs` + `postinstall`.

### 2) Payload cannot connect to Postgres on `/admin` (current blocker)
- Error:
  - `Error: cannot connect to Postgres. Details: role "payload" does not exist`
- Important discovery:
  - In container env, these exist:
    - `POSTGRES_DB=portfolio`
    - `POSTGRES_USER=payload`
    - `POSTGRES_PASSWORD=payload`
  - Running `psql -U postgres` fails because role `postgres` does not exist in that container.

## Most Likely Root Cause Now
- `DATABASE_URI` mismatch/override in local shell or env file, or host-to-container auth/connection mismatch.
- `payload.config.ts` uses:
  - `process.env.DATABASE_URI || postgres://payload:payload@localhost:5432/portfolio`
- If `DATABASE_URI` is set incorrectly, app will ignore fallback and fail.

## Resume Checklist (Tomorrow)
1. Verify active DB URI in terminal:
   - `echo "$DATABASE_URI"`
   - `cat .env .env.local 2>/dev/null | rg DATABASE_URI`
2. Verify container users/DB with correct role:
   - `docker exec -it portfolio-payload-postgres psql -U payload -d portfolio -c "\du"`
   - `docker exec -it portfolio-payload-postgres psql -U payload -d portfolio -c "\l"`
3. Verify host can connect:
   - `PGPASSWORD=payload psql "postgres://payload:payload@localhost:5432/portfolio" -c "select current_user, current_database();"`
4. Force known-good DB URI for current shell:
   - `export DATABASE_URI="postgres://payload:payload@localhost:5432/portfolio"`
5. Start app:
   - `npm run dev -- -p 3001`
6. Test:
   - open `/admin`
   - `curl -i http://localhost:3001/admin`

## Notes on Commands
- Correct way to pass port through npm script:
  - `npm run dev -- -p 3001`
- Incorrect (interpreted as directory by Next):
  - `npm run dev -p 3001`
  - `next dev 3001`

## Secondary Warnings (non-blocking)
- Next image warnings about width/height ratio on homepage assets.
- Does not block `/admin`; can be cleaned up later.

## Files Touched in This Session
- `payload.config.ts`
- `docker-compose.yml`
- `scripts/db-up.sh`
- `scripts/db-down.sh`
- `scripts/ensure-lightningcss.mjs`
- `src/app/(payload)/layout.tsx`
- `src/app/(payload)/admin/importMap.js`
- `src/app/(payload)/admin/[[...segments]]/page.tsx`
- `src/app/(payload)/admin/[[...segments]]/not-found.tsx`
- `src/app/(payload)/api/[...slug]/route.ts`
- `src/app/(payload)/api/graphql/route.ts`
- `src/app/(payload)/api/graphql-playground/route.ts`
- `src/collections/Users.ts`
- `src/collections/Media.ts`
- `src/collections/PortfolioItems.ts`
- `src/payload-types.ts`
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `eslint.config.mjs`
- `README.md`

