import { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";
import type { CreateStageInput } from "@/domain/types";

export const stageRepository = {
  create(jobId: string, data: CreateStageInput) {
    return prisma.processStage.create({
      data: {
        jobId,
        stageName: data.stageName,
        status: data.status,
        date: data.date ?? new Date(),
        notes: data.notes || null,
      },
    });
  },

  findById(id: string) {
    return prisma.processStage.findUnique({ where: { id } });
  },

  update(id: string, data: Prisma.ProcessStageUpdateInput) {
    return prisma.processStage.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.processStage.delete({ where: { id } });
  },
};
