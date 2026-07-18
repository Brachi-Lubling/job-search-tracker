# 02 — SCHEMA (Prisma / DB)

> קרא בכל נגיעה ב-DB, מודלים, מיגרציות, יחסים, או קובץ repository.
> קבצים רלוונטיים: `prisma/schema.prisma`, `src/repositories/*`, `prisma/seed.ts`.

## הסכמה המלאה
```prisma
enum JobStatus   { active  closed  offered }
enum StageStatus { pending completed failed }

model Company {
  id           String           @id @default(cuid())
  name         String
  website      String?
  industry     String?
  applications JobApplication[]
  createdAt    DateTime         @default(now())
}

model ResumeVersion {
  id           String           @id @default(cuid())
  versionTag   String           // 'Full-Stack-Hebrew'
  fileUrl      String           // נתיב יחסי ב-uploads/
  createdAt    DateTime         @default(now())
  applications JobApplication[]
}

model JobApplication {
  id         String         @id @default(cuid())
  company    Company        @relation(fields: [companyId], references: [id])
  companyId  String
  title      String
  jobUrl     String?
  resume     ResumeVersion? @relation(fields: [resumeId], references: [id])
  resumeId   String?
  status     JobStatus      @default(active)
  createdAt  DateTime       @default(now())
  stages     ProcessStage[]
  postMortem PostMortem?
}

model ProcessStage {
  id        String         @id @default(cuid())
  job       JobApplication @relation(fields: [jobId], references: [id], onDelete: Cascade)
  jobId     String
  stageName String         // מחרוזת חופשית — לא enum!
  date      DateTime       @default(now())
  status    StageStatus    @default(pending)
  notes     String?        @db.Text
  createdAt DateTime       @default(now())
}

model PostMortem {
  id              String         @id @default(cuid())
  job             JobApplication @relation(fields: [jobId], references: [id], onDelete: Cascade)
  jobId           String         @unique   // אוכף 1:1
  rejectionReason String?        @db.Text
  improvementTips String?        @db.Text
  selfScore       Int            // 1..5 — נאכף ב-Zod, לא ב-DB
  createdAt       DateTime       @default(now())
}
```

## החלטות מהותיות (למה)
- **`stageName` מחרוזת חופשית, לא enum** → שלבים דינמיים לחלוטין, ללא מסלול קשיח. דרישת ליבה.
- **`onDelete: Cascade`** על `ProcessStage` ו-`PostMortem` → מחיקת משרה מוחקת גרעונית את התלויים בה.
- **`PostMortem.jobId @unique`** → יחס 1:1 (ניתוח אחד למשרה).
- **`selfScore: Int`** — טווח 1–5 נאכף בשכבת Zod בלבד, כדי לרכז ולידציה במקום אחד (ראה 05).
- **`resumeId` אופציונלי** — אפשר ליצור משרה לפני קישור קו"ח.
- מזהים: `cuid()`.

## פקודות Prisma
```bash
npx prisma migrate dev --name <desc>   # יצירת מיגרציה + החלה
npx prisma generate                    # רענון client אחרי שינוי schema
npx prisma studio                      # דפדוף בנתונים
npx prisma db seed                     # הרצת seed.ts
```

## דפוסי include לשימוש חוזר (ב-repositories)
- **Job details:** `include: { company: true, resume: true, stages: { orderBy: { date: 'asc' } }, postMortem: true }`
- **Dashboard (שלב אחרון בלבד):** `include: { company: true, stages: { orderBy: { date: 'desc' }, take: 1 } }` עם `where: { status: 'active' }`. הימנע מטעינת כל השלבים.
