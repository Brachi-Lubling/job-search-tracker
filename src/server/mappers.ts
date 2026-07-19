import type {
  Company,
  Recruiter,
  ResumeVersion,
  JobApplication,
  ProcessStage,
  PostMortem,
} from "@prisma/client";
import type {
  CompanyDTO,
  RecruiterDTO,
  ResumeDTO,
  StageDTO,
  PostMortemDTO,
  JobListItemDTO,
  JobDetailDTO,
} from "@/domain/types";

export const toCompanyDTO = (c: Company): CompanyDTO => ({
  id: c.id,
  name: c.name,
  website: c.website,
  industry: c.industry,
  notes: c.notes,
  createdAt: c.createdAt.toISOString(),
});

export const toRecruiterDTO = (r: Recruiter): RecruiterDTO => ({
  id: r.id,
  name: r.name,
  role: r.role,
  email: r.email,
  phone: r.phone,
  notes: r.notes,
});

export const toResumeDTO = (r: ResumeVersion): ResumeDTO => ({
  id: r.id,
  versionTag: r.versionTag,
  fileUrl: r.fileUrl,
  language: r.language,
  tags: r.tags,
  notes: r.notes,
  createdAt: r.createdAt.toISOString(),
});

export const toStageDTO = (s: ProcessStage): StageDTO => ({
  id: s.id,
  stageName: s.stageName,
  date: s.date.toISOString(),
  status: s.status,
  notes: s.notes,
  createdAt: s.createdAt.toISOString(),
});

export const toPostMortemDTO = (p: PostMortem): PostMortemDTO => ({
  rejectionReason: p.rejectionReason,
  improvementTips: p.improvementTips,
  selfScore: p.selfScore,
});

export const toJobListItemDTO = (
  j: JobApplication & { company: Company },
): JobListItemDTO => ({
  id: j.id,
  title: j.title,
  jobUrl: j.jobUrl,
  status: j.status,
  pipeline: j.pipeline,
  tags: j.tags,
  location: j.location,
  createdAt: j.createdAt.toISOString(),
  company: toCompanyDTO(j.company),
});

export const toJobDetailDTO = (
  j: JobApplication & {
    company: Company;
    resume: ResumeVersion | null;
    stages: ProcessStage[];
    postMortem: PostMortem | null;
  },
): JobDetailDTO => ({
  ...toJobListItemDTO(j),
  salary: j.salary,
  source: j.source,
  contact: j.contact,
  notes: j.notes,
  resume: j.resume ? toResumeDTO(j.resume) : null,
  stages: j.stages.map(toStageDTO),
  postMortem: j.postMortem ? toPostMortemDTO(j.postMortem) : null,
});
