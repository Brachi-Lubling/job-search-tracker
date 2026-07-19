import type { Prisma } from "@prisma/client";
import { jobRepository } from "@/server/repositories/job.repository";
import { companyRepository } from "@/server/repositories/company.repository";
import { NotFoundError } from "@/server/http";
import { statusFromPipeline } from "@/server/pipeline";
import { toJobListItemDTO, toJobDetailDTO } from "@/server/mappers";
import type { CreateJobInput, UpdateJobInput, JobFilters } from "@/domain/types";

export const jobService = {
  async create(input: CreateJobInput) {
    // Business rule: the referenced company must exist.
    const company = await companyRepository.findById(input.companyId);
    if (!company) throw new NotFoundError("החברה שנבחרה לא נמצאה");

    const pipeline = input.pipeline ?? "wishlist";
    const job = await jobRepository.create({
      companyId: input.companyId,
      title: input.title,
      jobUrl: input.jobUrl || null,
      resumeId: input.resumeId || null,
      pipeline,
      status: statusFromPipeline(pipeline),
      tags: input.tags ?? [],
      location: input.location ?? null,
      salary: input.salary || null,
      source: input.source || null,
      contact: input.contact || null,
      notes: input.notes || null,
    });
    return toJobDetailDTO(job);
  },

  async list(filters: JobFilters = {}) {
    const jobs = await jobRepository.list(filters);
    return jobs.map(toJobListItemDTO);
  },

  async getById(id: string) {
    const job = await jobRepository.findByIdFull(id);
    if (!job) throw new NotFoundError("המשרה לא נמצאה");
    return toJobDetailDTO(job);
  },

  async update(id: string, input: UpdateJobInput) {
    const exists = await jobRepository.exists(id);
    if (!exists) throw new NotFoundError("המשרה לא נמצאה");

    const data: Prisma.JobApplicationUpdateInput = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.jobUrl !== undefined) data.jobUrl = input.jobUrl || null;
    if (input.resumeId !== undefined) {
      data.resume = input.resumeId
        ? { connect: { id: input.resumeId } }
        : { disconnect: true };
    }
    if (input.pipeline !== undefined) {
      data.pipeline = input.pipeline;
      // Keep the derived lifecycle status in sync with the funnel stage.
      data.status = statusFromPipeline(input.pipeline);
    }
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.location !== undefined) data.location = input.location;
    if (input.salary !== undefined) data.salary = input.salary || null;
    if (input.source !== undefined) data.source = input.source || null;
    if (input.contact !== undefined) data.contact = input.contact || null;
    if (input.notes !== undefined) data.notes = input.notes || null;

    const job = await jobRepository.update(id, data);
    return toJobDetailDTO(job);
  },

  async remove(id: string) {
    const exists = await jobRepository.exists(id);
    if (!exists) throw new NotFoundError("המשרה לא נמצאה");
    await jobRepository.remove(id);
    return { id };
  },
};
