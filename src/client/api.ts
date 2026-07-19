import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  CreateRecruiterInput,
  UpdateRecruiterInput,
  CreateJobInput,
  UpdateJobInput,
  JobFilters,
  CreateStageInput,
  UpdateStageInput,
  SubmitAnalysisInput,
  CreateResumeInput,
  UpdateResumeInput,
  CompanyDTO,
  CompanyListItemDTO,
  CompanyDetailDTO,
  RecruiterDTO,
  ResumeDTO,
  ResumeListItemDTO,
  ResumeDetailDTO,
  JobListItemDTO,
  JobDetailDTO,
  StageDTO,
  DashboardCard,
  StatsDTO,
} from "@/domain/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Absolute base on the server (RSC fetch needs it), relative in the browser.
function baseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.APP_URL ?? "http://localhost:3000";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.ok) {
    throw new ApiError(json?.error?.message ?? "שגיאת שרת", res.status, json?.error?.details);
  }
  return json.data as T;
}

function qs(filters?: JobFilters): string {
  if (!filters) return "";
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === null || v === "") continue;
    p.set(k, v instanceof Date ? v.toISOString() : String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const api = {
  dashboard: {
    get: () => request<DashboardCard[]>("/api/dashboard"),
  },
  stats: {
    get: () => request<StatsDTO>("/api/stats"),
  },
  jobs: {
    list: (filters?: JobFilters) => request<JobListItemDTO[]>(`/api/jobs${qs(filters)}`),
    get: (id: string) => request<JobDetailDTO>(`/api/jobs/${id}`),
    create: (input: CreateJobInput) =>
      request<JobDetailDTO>("/api/jobs", { method: "POST", body: JSON.stringify(input) }),
    update: (id: string, input: UpdateJobInput) =>
      request<JobDetailDTO>(`/api/jobs/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    remove: (id: string) =>
      request<{ id: string }>(`/api/jobs/${id}`, { method: "DELETE" }),
    addStage: (id: string, input: CreateStageInput) =>
      request<StageDTO>(`/api/jobs/${id}/stages`, { method: "POST", body: JSON.stringify(input) }),
    updateStage: (id: string, stageId: string, input: UpdateStageInput) =>
      request<StageDTO>(`/api/jobs/${id}/stages/${stageId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    removeStage: (id: string, stageId: string) =>
      request<{ id: string }>(`/api/jobs/${id}/stages/${stageId}`, { method: "DELETE" }),
    submitAnalysis: (id: string, input: SubmitAnalysisInput) =>
      request<JobDetailDTO>(`/api/jobs/${id}/analysis`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
  },
  companies: {
    list: () => request<CompanyListItemDTO[]>("/api/companies"),
    get: (id: string) => request<CompanyDetailDTO>(`/api/companies/${id}`),
    create: (input: CreateCompanyInput) =>
      request<CompanyDTO>("/api/companies", { method: "POST", body: JSON.stringify(input) }),
    update: (id: string, input: UpdateCompanyInput) =>
      request<CompanyDTO>(`/api/companies/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    remove: (id: string) =>
      request<{ id: string }>(`/api/companies/${id}`, { method: "DELETE" }),
    addRecruiter: (companyId: string, input: CreateRecruiterInput) =>
      request<RecruiterDTO>(`/api/companies/${companyId}/recruiters`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
  },
  recruiters: {
    update: (id: string, input: UpdateRecruiterInput) =>
      request<RecruiterDTO>(`/api/recruiters/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    remove: (id: string) =>
      request<{ id: string }>(`/api/recruiters/${id}`, { method: "DELETE" }),
  },
  resumes: {
    list: () => request<ResumeListItemDTO[]>("/api/resumes"),
    get: (id: string) => request<ResumeDetailDTO>(`/api/resumes/${id}`),
    create: (input: CreateResumeInput) =>
      request<ResumeDTO>("/api/resumes", { method: "POST", body: JSON.stringify(input) }),
    update: (id: string, input: UpdateResumeInput) =>
      request<ResumeDTO>(`/api/resumes/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    remove: (id: string) =>
      request<{ id: string }>(`/api/resumes/${id}`, { method: "DELETE" }),
    // Multipart upload — no JSON content-type; returns the stored file URL.
    upload: async (file: File): Promise<{ fileUrl: string }> => {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${baseUrl()}/api/resumes/upload`, { method: "POST", body: form });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        throw new ApiError(json?.error?.message ?? "העלאה נכשלה", res.status);
      }
      return json.data;
    },
  },
};
