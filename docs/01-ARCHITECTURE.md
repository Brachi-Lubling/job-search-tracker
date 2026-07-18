# 01 — ARCHITECTURE

> קרא כשמוסיפים מודול/שכבה או לא בטוחים לאיזו שכבה קוד שייך.

## עיקרון על
Next.js מאוחד (App Router). הפרדת שכבות מלאה. **חוק ברזל:** Route Handler לא קורא ל-Prisma
ישירות. הזרימה תמיד:

```
Route (HTTP + Zod)  →  Service (business logic)  →  Repository (Prisma)  →  DB
```

## גבול FE/BE קשיח
```
BACKEND (server-only)              │ שכבת גבול │        FRONTEND
src/server/*  (prisma, repos,      │ app/api/  │   app/(pages)/**, src/components/*
              services, http,      │  **/route │   src/client/api.ts  ← typed HTTP client
              storage)             │   .ts     │
                        └── REST ──┘           └── fetch(/api) דרך api.ts בלבד ──┘
              src/domain/*  = חוזה משותף (Zod + types), נקי משני הצדדים
```
**כלל ברזל:** אף קובץ ב-`app/(pages)` או `src/components` לא מייבא מ-`src/server`.
כל קריאת נתונים מה-FE עוברת דרך `src/client/api.ts`.

## אחריות כל שכבה (מה מותר ומה אסור)

| שכבה | תיקייה | אחראית ל... | אסור לה |
|------|--------|-------------|---------|
| Route Handler | `app/api/**/route.ts` | פענוח בקשה, `Zod.parse`, קריאה ל-service **אחד**, JSON אחיד | לוגיקה עסקית, `prisma.*` |
| Service | `src/server/services/*` | חוקים עסקיים, תיאום repositories, טרנזאקציות | `Response`/HTTP, ולידציית Zod |
| Repository | `src/server/repositories/*` | שאילתות Prisma בלבד + `include` | חוקים עסקיים, ולידציה |
| server/lib | `src/server/{prisma,http,storage}.ts` | תשתית שרת | לוגיקת דומיין |
| Domain | `src/domain/*` | סכמות Zod + טיפוסים (`z.infer`) | תלות שרת/לקוח |
| API client | `src/client/api.ts` | fetch מוקלד ל-`/api/*` (isomorphic) | Prisma, לוגיקה עסקית |
| UI | `app/**/page.tsx`, `src/components/*` | תצוגה + קריאה דרך `src/client/api.ts` | ייבוא מ-`src/server`, גישה ל-DB |

## מבנה תיקיות
```
cv-platform/
├─ prisma/{schema.prisma, seed.ts}
├─ src/
│  ├─ server/                       ← BACKEND בלבד
│  │  ├─ prisma.ts  http.ts  storage.ts
│  │  ├─ repositories/{job,stage,company,resume}.repository.ts
│  │  └─ services/{job,stage,dashboard,stats,analysis,company,resume}.service.ts
│  ├─ domain/{types.ts, schemas.ts}   ← חוזה משותף
│  ├─ client/api.ts                    ← FRONTEND data layer
│  ├─ lib/ui.ts                        ← עזרי UI (client-safe)
│  └─ components/*                     ← FRONTEND
└─ app/
   ├─ layout.tsx (sidebar, dir="rtl")
   ├─ page.tsx                    # Dashboard (סיכום)
   ├─ jobs/page.tsx               # List + Kanban + פילטרים
   ├─ jobs/[id]/page.tsx          # Job Details
   ├─ resumes/page.tsx            # ניהול קו"ח
   ├─ companies/page.tsx          # חברות
   └─ api/... (ראה 03-API)
```

## כללי תלות (imports)
- Route → Service → Repository → Prisma. **חד-כיווני.** אסור repository שמייבא service.
- שרת: מייבא מ-`src/domain`. FE: מייבא מ-`src/domain` (types) ו-`src/client/api.ts`.
- **FE לעולם לא מייבא מ-`src/server`** — נאכף ידנית (grep) ובבדיקות.

## מוכנות לעתיד
- רב-משתמשים: הוספת מודל `User` + `userId` FK בכל מודל + סינון ב-repositories. אין צורך עכשיו.
