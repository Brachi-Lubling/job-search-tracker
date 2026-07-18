# 04 — FRONTEND (Pages + Components)

> קרא בכתיבה/שינוי של עמוד או רכיב React.
> קבצים: `app/layout.tsx`, `app/page.tsx`, `app/jobs/[id]/page.tsx`, `src/components/*`.
> חוזי הנתונים: [03-API](./03-API.md). אין גישה ישירה ל-DB מה-UI.

## הגדרות כלליות
- `app/layout.tsx`: `<html dir="rtl" lang="he">`, Tailwind, כותרת/ניווט מינימלי.
- טעינת נתונים: Server Components קוראים ל-`fetch` על ה-API (או ל-service ישירות בעתיד).
  פעולות כתיבה (הוספת שלב וכו') דרך fetch ל-API + רענון.
- כל מצב צריך: loading / error / empty.

## עמודים

### Dashboard — `app/page.tsx`
- מקור נתונים: `GET /api/dashboard`.
- Grid של `JobCard` למשרות active.
- כפתור "משרה חדשה" → טופס (בחירת חברה מ-`GET /api/companies`, גרסת קו"ח מ-`GET /api/resumes`, כותרת, URL).

### Job Details — `app/jobs/[id]/page.tsx`
- מקור: `GET /api/jobs/[id]` (include מלא).
- כותרת: חברה, תפקיד, סטטוס (badge), קישור למשרה, קישור ל-PDF של הקו"ח.
- `StageTimeline` + `AddStageForm` + `ReflectionSection`.

## רכיבים (`src/components/`)

| רכיב | Props (מהטיפוסים ב-domain) | תפקיד |
|------|----------------------------|-------|
| `JobCard` | `{ job, latestStage }` | כרטיס: חברה, תפקיד, badge שלב אחרון + סטטוס, תאריך. קישור לעמוד המשרה |
| `StageTimeline` | `{ stages }` | ציר זמן כרונולוגי: שם שלב, תאריך, סטטוס בצבע, notes |
| `AddStageForm` | `{ jobId }` | טופס הוספת שלב → `POST /api/jobs/[id]/stages` → רענון |
| `ReflectionSection` | `{ job }` | אם `status !== active`: הצגה/עריכת PostMortem → `PATCH /api/jobs/[id]/analysis` |

## צבעי סטטוס (Tailwind, עקבי בכל הרכיבים)
- StageStatus: `pending`=אפור, `completed`=ירוק, `failed`=אדום.
- JobStatus: `active`=כחול, `closed`=אפור, `offered`=ירוק.

## נגישות/UX
- טפסים עם ולידציה בצד לקוח (אותן סכמות Zod מ-`src/domain/schemas.ts` — שימוש חוזר!).
- הודעות שגיאה בעברית, מצב ריק ידידותי ("עדיין אין משרות — הוסף אחת").
