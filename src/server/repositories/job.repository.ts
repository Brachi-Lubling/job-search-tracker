import { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";
import type { JobFilters, JobStatus, PipelineStage, JobLocation } from "@/domain/types";

// Reusable include for the full job-details view.
const fullInclude = {
  company: true,
  resume: true,
  stages: { orderBy: [{ date: "asc" }, { createdAt: "asc" }] },
  postMortem: true,
} satisfies Prisma.JobApplicationInclude;

type CreateData = {
  companyId: string;
  title: string;
  jobUrl: string | null;
  resumeId: string | null;
  pipeline: PipelineStage;
  status: JobStatus;
  tags: string[];
  location: JobLocation | null;
  salary: string | null;
  source: string | null;
  contact: string | null;
  notes: string | null;
};

function buildWhere(f: JobFilters): Prisma.JobApplicationWhereInput {
  const where: Prisma.JobApplicationWhereInput = {};
  if (f.companyId) where.companyId = f.companyId;
  if (f.pipeline) where.pipeline = f.pipeline;
  if (f.status) where.status = f.status;
  if (f.tag) where.tags = { has: f.tag };
  if (f.jobUrl) where.jobUrl = { equals: f.jobUrl, mode: "insensitive" };
  if (f.from || f.to) {
    where.createdAt = {};
    if (f.from) where.createdAt.gte = f.from;
    if (f.to) where.createdAt.lte = f.to;
  }
  if (f.q) {
    where.OR = [
      { title: { contains: f.q, mode: "insensitive" } },
      { company: { name: { contains: f.q, mode: "insensitive" } } },
    ];
  }
  return where;
}

export const jobRepository = {
  create(data: CreateData) {
    return prisma.jobApplication.create({ data, include: fullInclude });
  },

  list(filters: JobFilters = {}) {
    return prisma.jobApplication.findMany({
      where: buildWhere(filters),
      orderBy: { createdAt: "desc" },
      include: { company: true },
    });
  },

  findByIdFull(id: string) {
    return prisma.jobApplication.findUnique({ where: { id }, include: fullInclude });
  },

  exists(id: string) {
    return prisma.jobApplication.findUnique({ where: { id }, select: { id: true } });
  },

  update(id: string, data: Prisma.JobApplicationUpdateInput) {
    return prisma.jobApplication.update({ where: { id }, data, include: fullInclude });
  },

  // Dashboard: active jobs + only their most recent stage (efficient — take: 1).
  findActiveWithLatestStage() {
    return prisma.jobApplication.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      include: {
        company: true,
        stages: { orderBy: [{ date: "desc" }, { createdAt: "desc" }], take: 1 },
      },
    });
  },

  remove(id: string) {
    // ProcessStage & PostMortem cascade at the DB level.
    return prisma.jobApplication.delete({ where: { id } });
  },

  // Transactionally upsert the post-mortem and set final pipeline/status.
  applyAnalysis(
    jobId: string,
    pm: { rejectionReason: string | null; improvementTips: string | null; selfScore: number },
    pipeline: PipelineStage,
    status: JobStatus,
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.postMortem.upsert({
        where: { jobId },
        create: { jobId, ...pm },
        update: pm,
      });
      return tx.jobApplication.update({
        where: { id: jobId },
        data: { pipeline, status },
        include: fullInclude,
      });
    });
  },
};
