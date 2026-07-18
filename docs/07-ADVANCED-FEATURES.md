# 07 — ADVANCED FEATURES (תוכנית הרחבה)

> קרא לפני עבודה על הרחבות ה-UX/פיצ'רים. תלוי ב: [01-ARCHITECTURE](./01-ARCHITECTURE.md) (הגבול FE/BE),
> [02-SCHEMA](./02-SCHEMA.md), [03-API](./03-API.md).

## Context
ה-MVP עבד אך היה: (א) לא מופרד מספיק — עמודים ייבאו service/repository ישירות;
(ב) UI בסיסי לא אינטואיטיבי. הרחבה זו מוסיפה הפרדת FE/BE קשיחה + חוויית משתמש מלאה
למחפש עבודה: דשבורד סיכום, קנבן, ניהול קורות-חיים, פילטרים ועוד.

## החלטת ארכיטקטורה: גבול FE/BE קשיח (ריפו אחד)
```
BACKEND (server-only)                       FRONTEND
─────────────────────                       ─────────────────
src/server/prisma.ts                        app/(pages)/**/page.tsx
src/server/repositories/*   ← Prisma        src/components/*
src/server/services/*       ← business      src/client/api.ts   ← typed HTTP client
src/server/http.ts, storage.ts              (FE קורא ל-BE אך ורק דרך api.ts)
app/api/**/route.ts         ← REST (HTTP)
        ▲ שכבת הגבול היחידה ▲
src/domain/*  = חוזה משותף (Zod schemas + types) — נקי, ללא תלות שרת/לקוח
```
**כלל ברזל חדש:** אף קובץ ב-`app/(pages)` או `src/components` לא מייבא מ-`src/server`.
קריאות נתונים עוברות רק דרך `src/client/api.ts` (fetch ל-`/api/...`).
- ב-Server Components: `api.ts` פונה ל-URL מוחלט (`APP_URL`, ברירת מחדל `http://localhost:3000`).
- ב-Client Components: URL יחסי.
- Trade-off מודע: קריאות RSC עוברות דרך HTTP פנימי (hop קטן) בתמורה לגבול נקי.

## שינויי סכימה
```prisma
enum PipelineStage { wishlist applied interviewing offer accepted rejected }

model JobApplication {
  // ... קיים ...
  pipeline  PipelineStage @default(applied)   // עמודת הקנבן (מקור אמת לפאנל)
  // status (active/closed/offered) נגזר מ-pipeline ב-service (statusFromPipeline)
}

model ResumeVersion {
  // ... קיים ...
  notes  String? @db.Text                      // הערות חופשיות לכל קו"ח
}
// resume relation: onDelete: SetNull  (מחיקת קו"ח מנתקת ממשרות, לא מוחקת אותן)
```
מיפוי pipeline→status: `{wishlist,applied,interviewing}→active`, `{offer,accepted}→offered`, `{rejected}→closed`.

## פיצ'רים ו-Endpoints

### 1. Shell ניווט (Layout)
Sidebar קבוע: **דשבורד · משרות · קורות חיים · חברות**. RTL, רספונסיבי (collapse במובייל).

### 2. דשבורד ראשי — סיכום
`GET /api/stats` → `statsService`:
- ספירות: סה"כ משרות, פעילות, הצעות, נדחו, אחוז הצלחה.
- פאנל (כמה בכל pipeline) → ויזואל funnel.
- ציון עצמי ממוצע, פעילות אחרונה (שלבים אחרונים), משרות עם שלב "ממתין".
> ויזואלים: לפני כתיבת גרפים — טען את מיומנות `dataviz` לצבעים/מבנה.

### 3. משרות — List + Kanban + פילטרים
- `GET /api/jobs?companyId=&pipeline=&from=&to=&q=` → סינון בצד שרת (`jobService.list(filters)`).
- Toggle **רשימה / קנבן**. קנבן: עמודה לכל `PipelineStage`, גרירה (HTML5 DnD) → `PATCH /api/jobs/:id` לעדכון pipeline.
- פילטרים: חברה (select), שלב (select), טווח תאריכים, חיפוש טקסט חופשי.

### 4. פרטי משרה — עיצוב מחדש
- Timeline ברור (נקודות מחוברות + תוויות + צבע סטטוס) — מחליף את "העיגול" הלא-ברור.
- בורר pipeline, עריכת שדות בסיס, שלבים, רפלקציה (קיים).
- `PATCH /api/jobs/:id` (עדכון pipeline/title/jobUrl/resumeId).

### 5. קורות חיים — עמוד ניהול
- `GET /api/resumes` (רשימה + ספירת משרות מקושרות), `GET /api/resumes/:id` (עם המשרות וסטטוסן).
- העלאה (קיים `/api/resumes/upload` + `POST /api/resumes`), הורדה (fileUrl), מחיקה `DELETE /api/resumes/:id`, הערות `PATCH /api/resumes/:id`.
- לכל קו"ח **מיני-דשבורד**: אילו משרות מוצמדות אליו + הסטטוס/pipeline שלהן.

### 6. חברות — עמוד
`GET /api/companies` (עם ספירת משרות). רשימה + קישור לסינון משרות לפי החברה.

## UX niceties (לשלב לאורך הדרך)
מצבי loading/empty/error עקביים · badges צבעוניים אחידים (`src/lib/ui.ts`) · toasts קלים
לפעולות · רספונסיביות · חיפוש/פילטר ללא רענון מלא · קיצור "משרה חדשה" מכל מקום.

## סדר ביצוע (ראה todos)
Restructure(גבול) → Schema → Backend(services+endpoints) → Layout → Dashboard → Jobs(list/kanban/filters)
→ Job details → Resumes → Companies → Polish+verify. כל שלב: `tsc --noEmit` נקי + בדיקת E2E.
