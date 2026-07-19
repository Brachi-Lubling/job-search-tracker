import { z } from "zod";

// ---- Enums (mirror Prisma enums) ----
export const jobStatusSchema = z.enum(["active", "closed", "offered"]);
export const stageStatusSchema = z.enum(["pending", "completed", "failed"]);
export const pipelineStageSchema = z.enum([
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "accepted",
  "rejected",
]);
export const jobLocationSchema = z.enum(["remote", "hybrid", "onsite"]);

// Normalizes a comma-separated string OR array into a clean, de-duped tag list.
// Stays `undefined` when omitted, so partial updates don't clobber existing tags.
export const tagsSchema = z
  .union([z.string(), z.array(z.string())])
  .transform((v) => {
    const arr = Array.isArray(v) ? v : v.split(",");
    return Array.from(new Set(arr.map((t) => t.trim()).filter(Boolean)));
  })
  .optional();

// ---- Company ----
export const createCompanySchema = z.object({
  name: z.string().min(1, "שם חברה נדרש"),
  website: z.string().url("כתובת אתר לא תקינה").optional().or(z.literal("")),
  industry: z.string().optional(),
  notes: z.string().optional(),
});

export const updateCompanySchema = z
  .object({
    name: z.string().min(1).optional(),
    website: z.string().url("כתובת אתר לא תקינה").nullable().optional().or(z.literal("")),
    industry: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "אין שדות לעדכון" });

// ---- Recruiter (contact person at a company) ----
export const createRecruiterSchema = z.object({
  name: z.string().min(1, "שם נדרש"),
  role: z.string().optional(),
  email: z.string().email("אימייל לא תקין").optional().or(z.literal("")),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export const updateRecruiterSchema = z
  .object({
    name: z.string().min(1).optional(),
    role: z.string().nullable().optional(),
    email: z.string().email("אימייל לא תקין").nullable().optional().or(z.literal("")),
    phone: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "אין שדות לעדכון" });

// ---- Resume ----
export const createResumeSchema = z.object({
  versionTag: z.string().min(1, "תיוג גרסה נדרש"),
  fileUrl: z.string().min(1, "קובץ נדרש"),
  language: z.string().optional(),
  tags: tagsSchema,
  notes: z.string().optional(),
});

export const updateResumeSchema = z
  .object({
    versionTag: z.string().min(1).optional(),
    language: z.string().nullable().optional(),
    tags: tagsSchema,
    notes: z.string().nullable().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "אין שדות לעדכון" });

// ---- Job ----
export const createJobSchema = z.object({
  companyId: z.string().min(1, "יש לבחור חברה"),
  title: z.string().min(1, "כותרת המשרה נדרשת"),
  jobUrl: z.string().url("קישור לא תקין").optional().or(z.literal("")),
  resumeId: z.string().optional(),
  pipeline: pipelineStageSchema.optional(),
  tags: tagsSchema,
  location: jobLocationSchema.optional(),
  salary: z.string().optional(),
  source: z.string().optional(),
  contact: z.string().optional(),
  notes: z.string().optional(),
});

// Partial update (pipeline move from kanban, edit fields).
export const updateJobSchema = z
  .object({
    title: z.string().min(1).optional(),
    jobUrl: z.string().url("קישור לא תקין").optional().or(z.literal("")),
    resumeId: z.string().nullable().optional(),
    pipeline: pipelineStageSchema.optional(),
    tags: tagsSchema,
    location: jobLocationSchema.nullable().optional(),
    salary: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
    contact: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "אין שדות לעדכון" });

// Job list filters (query params → server-side filtering).
export const jobFiltersSchema = z.object({
  companyId: z.string().optional(),
  pipeline: pipelineStageSchema.optional(),
  status: jobStatusSchema.optional(),
  tag: z.string().optional(),
  q: z.string().optional(),
  // Exact-match on the posting URL — used to warn about duplicate applications.
  jobUrl: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

// ---- Stage (dynamic) ----
export const createStageSchema = z.object({
  stageName: z.string().min(1, "שם השלב נדרש"),
  status: stageStatusSchema.default("pending"),
  date: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const updateStageSchema = z
  .object({
    stageName: z.string().min(1).optional(),
    status: stageStatusSchema.optional(),
    date: z.coerce.date().optional(),
    notes: z.string().nullable().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "אין שדות לעדכון" });

// ---- Analysis / Post-Mortem ----
export const submitAnalysisSchema = z.object({
  rejectionReason: z.string().optional(),
  improvementTips: z.string().optional(),
  selfScore: z
    .number({ invalid_type_error: "ציון עצמי נדרש" })
    .int()
    .min(1, "ציון מינימלי 1")
    .max(5, "ציון מקסימלי 5"),
  finalStatus: z.enum(["closed", "offered"]).default("closed"),
});

// ---- Id param ----
export const idParamSchema = z.object({ id: z.string().min(1) });
