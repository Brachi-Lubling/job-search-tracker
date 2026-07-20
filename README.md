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

# 3. Run migrations + seed demo data
npm run db:migrate
npm run db:seed

# 4. Run the dev server
npm run dev        # http://localhost:3000
```

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
| `npm run dev` | Start the dev server |
| `npm run typecheck` | Type-check (tsc) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Prisma Studio (browse data) |

## API (summary)
`POST /api/jobs` · `GET /api/jobs/:id` · `DELETE /api/jobs/:id` ·
`POST /api/jobs/:id/stages` · `PATCH /api/jobs/:id/analysis` ·
`GET /api/dashboard` · `POST/GET /api/companies` · `POST/GET /api/resumes` ·
`POST /api/resumes/upload`. Full details in [docs/03-API.md](./docs/03-API.md).

## License
[MIT](./LICENSE) — free to use, modify, and distribute.
