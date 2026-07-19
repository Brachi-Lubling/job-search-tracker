import type { Prisma } from "@prisma/client";
import { stageRepository } from "@/server/repositories/stage.repository";
import { jobRepository } from "@/server/repositories/job.repository";
import { NotFoundError } from "@/server/http";
import { toStageDTO } from "@/server/mappers";
import type { CreateStageInput, UpdateStageInput } from "@/domain/types";

export const stageService = {
  async append(jobId: string, input: CreateStageInput) {
    // Business rule: cannot append a stage to a non-existent job.
    const job = await jobRepository.exists(jobId);
    if (!job) throw new NotFoundError("המשרה לא נמצאה");
    const stage = await stageRepository.create(jobId, input);
    return toStageDTO(stage);
  },

  async update(jobId: string, stageId: string, input: UpdateStageInput) {
    const stage = await stageRepository.findById(stageId);
    if (!stage || stage.jobId !== jobId) throw new NotFoundError("השלב לא נמצא");

    const data: Prisma.ProcessStageUpdateInput = {};
    if (input.stageName !== undefined) data.stageName = input.stageName;
    if (input.status !== undefined) data.status = input.status;
    if (input.date !== undefined) data.date = input.date;
    if (input.notes !== undefined) data.notes = input.notes || null;

    const updated = await stageRepository.update(stageId, data);
    return toStageDTO(updated);
  },

  async remove(jobId: string, stageId: string) {
    const stage = await stageRepository.findById(stageId);
    if (!stage || stage.jobId !== jobId) throw new NotFoundError("השלב לא נמצא");
    await stageRepository.remove(stageId);
    return { id: stageId };
  },
};
