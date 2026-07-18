# 05 — CONVENTIONS (קצר — כדאי לקרוא כמעט תמיד)

> פורמט תגובות, שגיאות, Zod, מוסכמות קוד. מסמך קצר בכוונה.
> קבצים: `src/lib/api-response.ts`, `src/domain/schemas.ts`, `src/domain/types.ts`, `src/lib/prisma.ts`.

## TypeScript
- `strict: true`. אין `any`. טיפוסים נגזרים מ-Zod: `type CreateJob = z.infer<typeof createJobSchema>`.
- שמות קבצים: `kebab-case.ts`. רכיבים: `PascalCase.tsx`.

## Zod — מקור אמת יחיד (`src/domain/schemas.ts`)
```ts
export const createCompanySchema = z.object({
  name: z.string().min(1),
  website: z.string().url().optional(),
  industry: z.string().optional(),
});
export const createResumeSchema = z.object({
  versionTag: z.string().min(1),
  fileUrl: z.string().min(1),
});
export const createJobSchema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(1),
  jobUrl: z.string().url().optional(),
  resumeId: z.string().optional(),
});
export const createStageSchema = z.object({
  stageName: z.string().min(1),
  status: z.enum(['pending','completed','failed']).default('pending'),
  date: z.coerce.date().optional(),
  notes: z.string().optional(),
});
export const submitAnalysisSchema = z.object({
  rejectionReason: z.string().optional(),
  improvementTips: z.string().optional(),
  selfScore: z.number().int().min(1).max(5),
  finalStatus: z.enum(['closed','offered']).default('closed'),
});
```
אותן סכמות משמשות גם בטפסים בצד לקוח.

## פורמט תגובה + שגיאות (`src/lib/api-response.ts`)
```ts
// עוטף כל handler. ממפה שגיאות ל-JSON אחיד.
export async function handle(fn: () => Promise<unknown>) {
  try {
    const data = await fn();
    return Response.json({ ok: true, data });
  } catch (e) {
    if (e instanceof ZodError)      return json(400, 'ולידציה נכשלה', e.issues);
    if (e instanceof NotFoundError) return json(404, e.message);
    if (isPrismaKnown(e, 'P2025'))  return json(404, 'לא נמצא');
    if (isPrismaKnown(e, 'P2003'))  return json(409, 'הפרת יחס');
    console.error(e);
    return json(500, 'שגיאת שרת');   // בלי דליפת פרטים
  }
}
```
- קודי סטטוס: 200/201 הצלחה, 400 ולידציה, 404 לא נמצא, 409 קונפליקט, 500 לא צפוי.
- `NotFoundError` — מחלקת שגיאה פשוטה שה-services זורקים.

## Prisma singleton (`src/lib/prisma.ts`)
דפוס globalThis הסטנדרטי כדי למנוע ריבוי חיבורים ב-dev hot-reload.

## Git
- `.gitignore`: `node_modules`, `.next`, `.env`, `uploads/*` (עם `!uploads/.gitkeep`).
