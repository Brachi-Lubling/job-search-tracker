# 💡 Job Application Tracker

A personal platform for tracking job applications: managing openings, resume
versions, a dynamic recruiting pipeline, and post-mortem analysis to improve
future applications.

> The app's UI is in Hebrew (RTL); this README is in English for contributors.

## ✨ Features
- **Job applications** — track every application: company, status, job posting link, which resume version was sent
- **Pipeline / Kanban** — a dynamic recruiting pipeline (applied → interview → offer, etc.) with a drag-and-drop board
- **Resume versions** — manage multiple CV versions, tag by language/specialty, link to the file
- **Companies & recruiters** — contact details for each company and the recruiters you're working with
- **Dashboard** — a pipeline funnel and stats across all applications
- **Post-mortem** — retrospective analysis on closed applications, for continuous improvement

## 🧱 Stack
Next.js 15 (App Router) · TypeScript · Prisma · PostgreSQL · Tailwind · Zod

## Architecture
Layers are strictly separated (see `docs/`):
`Route (Zod) → Service (business) → Repository (Prisma) → DB`.
Route handlers never access Prisma directly.

📖 **Full documentation in [docs/](./docs/)** — start at [docs/00-INDEX.md](./docs/00-INDEX.md).

## Prerequisites
- [Node.js](https://nodejs.org/) 18.18 or later
- [Docker](https://www.docker.com/) (to run Postgres locally) — or a native Postgres install, see `.env.example`

## Local setup

```bash
# 1. Install dependencies
npm install
cp .env.example .env

# 2. Start Postgres (host port 5544 to avoid clashing with a native Postgres on 5432)
docker compose up -d

# 3. Apply migrations + seed demo data
npm run db:migrate
npm run db:seed

# 4. Build Production and apply any pending deployment migrations
npm run update:production

# 5. Run the production server
npm start          # http://localhost:3000
```

On Windows, `UPDATE.bat` builds the production version and applies pending
migrations; run it after code or schema changes, with the app stopped. Then use
`START.bat` for normal production use. It reuses the existing build, starts
Postgres, and waits for the database before starting Next.js. Use
`START-DEV.bat` when actively developing; it runs `prisma migrate dev` and
`next dev`.

The data loaded by `db:seed` is demo data only (fictional companies, recruiters,
and job applications) — safe to use and doesn't expose any real information.

### Note on Prisma engine downloads (corporate proxy / custom certificates)
If `prisma generate` / `migrate` fails with `unable to get local issuer certificate`,
your machine is behind a TLS-inspecting proxy. Generate a `cacerts.pem` (an export
of your OS's trusted root certificates) and run Prisma commands with:

```powershell
$env:NODE_EXTRA_CA_CERTS = "$PWD\cacerts.pem"; npx prisma migrate dev
```

This is a safe workaround — it *adds* trust for certificates your system already
trusts, it doesn't disable TLS verification. Most contributors won't need this.

## Scripts
| Command | Action |
|---------|--------|
| `npm run up` | One-shot: start Postgres (Docker), run migrations, start the dev server (no seed) |
| `npm run dev` | Start the dev server |
| `npm run start` | Start the existing production build |
| `npm run update:production` | Generate Prisma Client, build, then deploy pending migrations |
| `npm run typecheck` | Type-check (tsc) |
| `npm run db:migrate` | Create/apply development migrations (`prisma migrate dev`) |
| `npm run db:deploy` | Apply existing migrations without creating new ones (`prisma migrate deploy`) |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Prisma Studio (browse data) |

## API (summary)
`POST /api/jobs` · `GET /api/jobs/:id` · `DELETE /api/jobs/:id` ·
`POST /api/jobs/:id/stages` · `PATCH /api/jobs/:id/analysis` ·
`GET /api/dashboard` · `POST/GET /api/companies` · `POST/GET /api/resumes` ·
`POST /api/resumes/upload`. Full details in [docs/03-API.md](./docs/03-API.md).

## License
[MIT](./LICENSE) — free to use, modify, and distribute.
