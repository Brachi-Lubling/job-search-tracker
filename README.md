# מערכת ניהול חיפוש עבודה (Job Management System)

פלטפורמה אישית למעקב אחר מועמדויות לעבודה: ניהול משרות, גרסאות קורות חיים,
שלבי גיוס דינמיים, וניתוח בדיעבד (Post-Mortem) לשיפור עתידי.

## Stack
Next.js 15 (App Router) · TypeScript · Prisma · PostgreSQL · Tailwind · Zod

## ארכיטקטורה
שכבות מופרדות (ראה `docs/`):
`Route (Zod) → Service (business) → Repository (Prisma) → DB`.
ה-Route Handler לעולם לא ניגש ל-Prisma ישירות.

📖 **תיעוד מלא ב-[docs/](./docs/)** — התחל מ-[docs/00-INDEX.md](./docs/00-INDEX.md).

## הרצה מקומית

```bash
# 1. התקנה
npm install
cp .env.example .env

# 2. הרצת Postgres (פורט 5544 כדי לא להתנגש עם Postgres מקומי על 5432)
docker compose up -d

# 3. מיגרציה + נתוני דמו
npm run db:migrate
npm run db:seed

# 4. הרצה
npm run dev        # http://localhost:3000
```

### הערה על הורדת מנועי Prisma (רשת עם פרוקסי/תעודות ארגוניות)
אם `prisma generate` / `migrate` נכשל עם `unable to get local issuer certificate`,
המכונה מאחורי פרוקסי TLS. נוצר `cacerts.pem` (ייצוא של תעודות השורש המהימנות של Windows).
הרץ את פקודות Prisma עם:

```powershell
$env:NODE_EXTRA_CA_CERTS = "$PWD\cacerts.pem"; npx prisma migrate dev
```

זהו פתרון מאובטח — הוא *מוסיף* אמון בתעודות שהמערכת כבר סומכת עליהן, לא מבטל אימות TLS.

## סקריפטים
| פקודה | פעולה |
|-------|-------|
| `npm run dev` | הרצת שרת פיתוח |
| `npm run typecheck` | בדיקת טיפוסים (tsc) |
| `npm run db:migrate` | מיגרציית Prisma |
| `npm run db:seed` | נתוני דמו |
| `npm run db:studio` | Prisma Studio (דפדוף בנתונים) |

## API (תמצית)
`POST /api/jobs` · `GET /api/jobs/:id` · `DELETE /api/jobs/:id` ·
`POST /api/jobs/:id/stages` · `PATCH /api/jobs/:id/analysis` ·
`GET /api/dashboard` · `POST/GET /api/companies` · `POST/GET /api/resumes` ·
`POST /api/resumes/upload`. פירוט מלא ב-[docs/03-API.md](./docs/03-API.md).
