# 00 — INDEX (מפת קריאה / Token Economy Hub)

> **מטרת המסמך:** לפני כל משימה, קרא כאן איזה מסמכים וקבצי קוד רלוונטיים — **ורק אותם**.
> אל תקרא קבצים שלא מופיעים ברשימה של המשימה. זה המנגנון לחיסכון בטוקנים.

## המסמכים (קרא לפי צורך, לא הכול תמיד)

| # | מסמך | מתי לקרוא אותו |
|---|------|----------------|
| 01 | [ARCHITECTURE](./01-ARCHITECTURE.md) | כשמוסיפים שכבה/מודול חדש, או לא בטוחים איפה קוד שייך |
| 02 | [SCHEMA](./02-SCHEMA.md) | כל נגיעה ב-DB, מודלים, מיגרציות, יחסים |
| 03 | [API](./03-API.md) | כתיבה/שינוי של Route Handler או Service |
| 04 | [FRONTEND](./04-FRONTEND.md) | כתיבה/שינוי של עמוד או רכיב React |
| 05 | [CONVENTIONS](./05-CONVENTIONS.md) | פורמט תגובות, שגיאות, Zod, מוסכמות קוד — קצר, כדאי תמיד |
| 06 | [ROADMAP](./06-ROADMAP.md) | לבחור את המשימה הבאה ולדעת אילו קבצים היא נוגעת |

## כלל הזהב לכל משימה
1. פתח את [ROADMAP](./06-ROADMAP.md) → מצא את המשימה → העתק את רשימת **"קרא"** ו**"כתוב"** שלה.
2. קרא רק את המסמכים/קבצים ברשימה.
3. אל תפתח את שאר ה-`docs/` או קוד לא קשור.

## מפת שכבות מהירה (בעל-פה, בלי לפתוח קבצים)
```
FRONTEND: app/**/page.tsx + src/components/*  ──(api.ts)──►  fetch /api
                                                                 │
HTTP:  app/api/**/route.ts        (Zod validate + http.handle)   │  [03-API, 05]
  →    src/server/services/*.ts   (business logic)               │  [03-API]
  →    src/server/repositories/*  (Prisma only)                  │  [02-SCHEMA]
  →    prisma (DB)
```
**גבול קשיח:** FE לעולם לא מייבא מ-`src/server` — רק דרך `src/client/api.ts`. [01, 07]

## היכן כל דבר יושב (lookup מהיר)
| צריך לגעת ב... | הקובץ | מסמך |
|----------------|-------|------|
| סכמת DB / מודל | `prisma/schema.prisma` | 02 |
| ולידציה / טיפוסים / DTOs | `src/domain/schemas.ts`, `src/domain/types.ts` | 05 |
| שאילתת DB | `src/server/repositories/<entity>.repository.ts` | 02, 03 |
| חוק עסקי | `src/server/services/<entity>.service.ts` | 03 |
| pipeline→status / DTO mappers | `src/server/pipeline.ts`, `src/server/mappers.ts` | 07 |
| endpoint | `app/api/.../route.ts` | 03, 05 |
| פורמט תגובה/שגיאה | `src/server/http.ts` | 05 |
| העלאת קובץ | `src/server/storage.ts` | 03 |
| חיבור Prisma | `src/server/prisma.ts` | — |
| **קריאה ל-API מה-FE** | `src/client/api.ts` | 01, 03 |
| עזרי UI (labels/צבעים) | `src/lib/ui.ts` | 04 |
| עמוד UI | `app/{page,jobs,resumes,companies}/**` | 04, 07 |
| רכיב UI | `src/components/**` | 04, 07 |
