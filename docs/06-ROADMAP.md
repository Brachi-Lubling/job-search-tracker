# 06 — ROADMAP (משימות + מפת קבצים לכל משימה)

> לכל משימה: **קרא** = הקבצים/מסמכים היחידים לפתוח. **כתוב** = הקבצים שנוצרים/משתנים.
> אל תפתח קבצים מחוץ לרשימה. משימות רצות בסדר (תלות מלמעלה למטה).

---

### T1 — Bootstrap
- **קרא:** 01-ARCHITECTURE
- **כתוב:** `package.json`, `next.config`, `tailwind`, `tsconfig`, `docker-compose.yml`, `.env(.example)`, `.gitignore`
- **בדיקה:** `docker-compose up -d` מריץ Postgres; `npm run dev` עולה.

### T2 — DB layer
- **קרא:** 02-SCHEMA
- **כתוב:** `prisma/schema.prisma`, `src/lib/prisma.ts`, `prisma/seed.ts`
- **פקודות:** `npx prisma migrate dev --name init`, `npx prisma db seed`
- **בדיקה:** `npx prisma studio` מציג 5 טבלאות + נתוני seed.

### T3 — Domain (Zod + Types)
- **קרא:** 05-CONVENTIONS
- **כתוב:** `src/domain/schemas.ts`, `src/domain/types.ts`
- **בדיקה:** `npx tsc --noEmit` נקי.

### T4 — lib (תשתית)
- **קרא:** 05-CONVENTIONS
- **כתוב:** `src/lib/api-response.ts` (handle + NotFoundError), `src/lib/storage.ts`
- **בדיקה:** import ללא שגיאות טיפוס.

### T5 — Repositories
- **קרא:** 02-SCHEMA, 01-ARCHITECTURE
- **כתוב:** `src/repositories/{company,resume,job,stage}.repository.ts`
- **הערה:** Prisma בלבד. השתמש בדפוסי ה-include מ-02.
- **בדיקה:** `tsc --noEmit` נקי.

### T6 — Services
- **קרא:** 03-API, 01-ARCHITECTURE
- **כתוב:** `src/services/{company,resume,job,stage,dashboard,analysis}.service.ts`
- **הערה:** חוקים עסקיים בלבד; `analysis.submit` בטרנזאקציה; `dashboard.getActive` שלב אחרון.
- **בדיקה:** `tsc --noEmit` נקי.

### T7 — API Routes
- **קרא:** 03-API, 05-CONVENTIONS
- **כתוב:** `app/api/jobs/route.ts`, `app/api/jobs/[id]/route.ts`, `app/api/jobs/[id]/stages/route.ts`, `app/api/jobs/[id]/analysis/route.ts`, `app/api/dashboard/route.ts`, `app/api/companies/route.ts`, `app/api/resumes/route.ts`, `app/api/resumes/upload/route.ts`
- **בדיקה:** curl לכל endpoint (ראה 03) → JSON תקין; selfScore=6 → 400.

### T8 — Frontend: Layout + Dashboard
- **קרא:** 04-FRONTEND
- **כתוב:** `app/layout.tsx`, `app/page.tsx`, `src/components/JobCard.tsx`, טופס "משרה חדשה"
- **בדיקה:** Dashboard מציג כרטיסים מנתוני seed.

### T9 — Frontend: Job Details
- **קרא:** 04-FRONTEND
- **כתוב:** `app/jobs/[id]/page.tsx`, `src/components/{StageTimeline,AddStageForm,ReflectionSection}.tsx`
- **בדיקה:** timeline מוצג; הוספת שלב מרעננת; feedback נשמר וסוגר משרה.

### T10 — ליטוש
- **קרא:** לפי הצורך בלבד
- **כתוב:** מצבי loading/error/empty, README ראשי
- **בדיקה:** זרימת קצה-לקצה מלאה (ראה סעיף Verification בכל מסמך).

---

## סטטוס נוכחי
- [x] T1  [x] T2  [x] T3  [x] T4  [x] T5  [x] T6  [x] T7  [x] T8  [x] T9  [x] T10
> ✅ MVP הושלם ונבדק מקצה-לקצה (2026-07-19).

> עדכן את התיבות בסיום כל משימה.
