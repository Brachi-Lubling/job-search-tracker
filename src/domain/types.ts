import type { z } from "zod";
import type {
  createCompanySchema,
  updateCompanySchema,
  createRecruiterSchema,
  updateRecruiterSchema,
  createResumeSchema,
  updateResumeSchema,
  createJobSchema,
  updateJobSchema,
  jobFiltersSchema,
  createStageSchema,
  updateStageSchema,
  submitAnalysisSchema,
  jobStatusSchema,
  stageStatusSchema,
  pipelineStageSchema,
  jobLocationSchema,
} from "./schemas";

// ---- Enums ----
export type JobStatus = z.infer<typeof jobStatusSchema>;
export type StageStatus = z.infer<typeof stageStatusSchema>;
export type PipelineStage = z.infer<typeof pipelineStageSchema>;
export type JobLocation = z.infer<typeof jobLocationSchema>;

// ---- Input DTOs (derived from Zod — single source of truth) ----
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CreateRecruiterInput = z.infer<typeof createRecruiterSchema>;
export type UpdateRecruiterInput = z.infer<typeof updateRecruiterSchema>;
export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobFilters = z.infer<typeof jobFiltersSchema>;
export type CreateStageInput = z.infer<typeof createStageSchema>;
export type UpdateStageInput = z.infer<typeof updateStageSchema>;
export type SubmitAnalysisInput = z.infer<typeof submitAnalysisSchema>;

// ---- Response DTOs (the API contract; dates are ISO strings over HTTP) ----
export interface CompanyDTO {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  notes: string | null;
  createdAt: string;
}
export interface CompanyListItemDTO extends CompanyDTO {
  jobCount: number;
  recruiterCount: number;
}

export interface RecruiterDTO {
  id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
}

export interface CompanyDetailDTO extends CompanyDTO {
  recruiters: RecruiterDTO[];
  jobs: JobListItemDTO[];
}

export interface ResumeDTO {
  id: string;
  versionTag: string;
  fileUrl: string;
  language: string | null;
  tags: string[];
  notes: string | null;
  createdAt: string;
}
export interface ResumeListItemDTO extends ResumeDTO {
  jobCount: number;
}

export interface StageDTO {
  id: string;
  stageName: string;
  date: string;
  status: StageStatus;
  notes: string | null;
  createdAt: string;
}

export interface PostMortemDTO {
  rejectionReason: string | null;
  improvementTips: string | null;
  selfScore: number;
}

export interface JobListItemDTO {
  id: string;
  title: string;
  jobUrl: string | null;
  status: JobStatus;
  pipeline: PipelineStage;
  tags: string[];
  location: JobLocation | null;
  createdAt: string;
  company: CompanyDTO;
}

export interface JobDetailDTO extends JobListItemDTO {
  salary: string | null;
  source: string | null;
  contact: string | null;
  notes: string | null;
  resume: ResumeDTO | null;
  stages: StageDTO[];
  postMortem: PostMortemDTO | null;
}

export interface ResumeDetailDTO extends ResumeDTO {
  jobs: JobListItemDTO[];
}

// Dashboard card = active job + its most recent stage.
export interface DashboardCard {
  id: string;
  title: string;
  companyName: string;
  status: JobStatus;
  pipeline: PipelineStage;
  latestStage: {
    stageName: string;
    status: StageStatus;
    date: string;
  } | null;
  createdAt: string;
}

// Summary statistics for the main dashboard.
export interface StatsDTO {
  total: number;
  active: number;
  offers: number;
  rejected: number;
  successRate: number; // offers / (finished) as %
  avgSelfScore: number | null;
  byPipeline: Record<PipelineStage, number>;
  pendingStages: number;
  recentActivity: {
    jobId: string;
    jobTitle: string;
    companyName: string;
    stageName: string;
    status: StageStatus;
    date: string;
  }[];
}
