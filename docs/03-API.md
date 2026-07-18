# 03 — API (Routes + Services)

> קרא בכתיבה/שינוי של Route Handler או Service.
> קבצים: `app/api/**/route.ts`, `src/services/*`, `src/repositories/*`.
> תלוי גם ב: [05-CONVENTIONS](./05-CONVENTIONS.md) (פורמט תגובה + Zod), [02-SCHEMA](./02-SCHEMA.md).

## פורמט תגובה אחיד
`{ ok: true, data }` (2xx) או `{ ok: false, error: { message, code? } }` (4xx/5xx).
עוטף: `src/lib/api-response.ts` (ראה 05).

## טבלת endpoints

| Method | Route | Body/Params (Zod) | Service | הערות |
|--------|-------|-------------------|---------|-------|
| POST | `/api/jobs` | `createJobSchema` | `job.create` | 201 |
| GET | `/api/jobs` | — | `job.list` | כל המשרות |
| GET | `/api/jobs/[id]` | `id` param | `job.getById` | include מלא (ראה 02) → 404 אם אין |
| DELETE | `/api/jobs/[id]` | `id` param | `job.remove` | cascade ל-stages/postMortem |
| POST | `/api/jobs/[id]/stages` | `createStageSchema` | `stage.append` | הוספת שלב |
| PATCH | `/api/jobs/[id]/analysis` | `submitAnalysisSchema` | `analysis.submit` | יוצר PostMortem + סוגר משרה |
| GET | `/api/dashboard` | — | `dashboard.getActive` | active + שלב אחרון |
| POST | `/api/companies` | `createCompanySchema` | `company.create` | |
| GET | `/api/companies` | — | `company.list` | לבחירה ביצירת משרה |
| POST | `/api/resumes` | `createResumeSchema` | `resume.create` | מטא-דאטה (versionTag+fileUrl) |
| GET | `/api/resumes` | — | `resume.list` | |
| POST | `/api/resumes/upload` | `multipart/form-data` | `storage.saveUpload` | מחזיר `{ fileUrl }` |

## לוגיקה עסקית לא-טריוויאלית (בשכבת Service)

### `dashboard.getActive`
`where: { status: 'active' }` + include עם `stages: { orderBy: { date: 'desc' }, take: 1 }`.
ממפה כל משרה ל-`{ ...job, latestStage }`. **לא** טוען את כל השלבים.

### `analysis.submit`
בטרנזאקציה אחת (`prisma.$transaction`):
1. `upsert` של `PostMortem` לפי `jobId`.
2. עדכון `job.status` → `closed` (ברירת מחדל) או `offered` אם ה-body ציין.
מחזיר את המשרה המעודכנת עם ה-postMortem.

### `stage.append`
מוודא שהמשרה קיימת (אחרת 404), יוצר `ProcessStage` עם `jobId`.

## חוזה Route Handler (תבנית קבועה)
```ts
export async function POST(req, { params }) {
  return handle(async () => {                    // handle מ-api-response
    const body = createXSchema.parse(await req.json()); // זורק ZodError → 400
    return xService.create(body);                       // service מחזיר data
  });
}
```
כל שגיאה (Zod / not-found / Prisma) ממופה ב-`handle`. ראה 05.
