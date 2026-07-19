import type { Prisma } from "@prisma/client";
import { resumeRepository } from "@/server/repositories/resume.repository";
import { NotFoundError } from "@/server/http";
import { toResumeDTO, toJobListItemDTO } from "@/server/mappers";
import type {
  CreateResumeInput,
  UpdateResumeInput,
  ResumeListItemDTO,
  ResumeDetailDTO,
} from "@/domain/types";

export const resumeService = {
  async create(input: CreateResumeInput) {
    const resume = await resumeRepository.create(input);
    return toResumeDTO(resume);
  },

  async list(): Promise<ResumeListItemDTO[]> {
    const resumes = await resumeRepository.list();
    return resumes.map((r) => ({ ...toResumeDTO(r), jobCount: r._count.applications }));
  },

  async getById(id: string): Promise<ResumeDetailDTO> {
    const resume = await resumeRepository.findByIdWithJobs(id);
    if (!resume) throw new NotFoundError("קורות החיים לא נמצאו");
    return { ...toResumeDTO(resume), jobs: resume.applications.map(toJobListItemDTO) };
  },

  async update(id: string, input: UpdateResumeInput) {
    const exists = await resumeRepository.findById(id);
    if (!exists) throw new NotFoundError("קורות החיים לא נמצאו");

    const data: Prisma.ResumeVersionUpdateInput = {};
    if (input.versionTag !== undefined) data.versionTag = input.versionTag;
    if (input.language !== undefined) data.language = input.language || null;
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.notes !== undefined) data.notes = input.notes || null;

    const resume = await resumeRepository.update(id, data);
    return toResumeDTO(resume);
  },

  async remove(id: string) {
    const exists = await resumeRepository.findById(id);
    if (!exists) throw new NotFoundError("קורות החיים לא נמצאו");
    await resumeRepository.remove(id);
    return { id };
  },
};
