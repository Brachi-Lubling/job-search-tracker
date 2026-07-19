import { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";
import type { CreateResumeInput } from "@/domain/types";

export const resumeRepository = {
  create(data: CreateResumeInput) {
    return prisma.resumeVersion.create({
      data: {
        versionTag: data.versionTag,
        fileUrl: data.fileUrl,
        language: data.language || null,
        tags: data.tags ?? [],
        notes: data.notes || null,
      },
    });
  },

  list() {
    return prisma.resumeVersion.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    });
  },

  findById(id: string) {
    return prisma.resumeVersion.findUnique({ where: { id } });
  },

  // Resume + the jobs that use it (mini-dashboard).
  findByIdWithJobs(id: string) {
    return prisma.resumeVersion.findUnique({
      where: { id },
      include: {
        applications: {
          orderBy: { createdAt: "desc" },
          include: { company: true },
        },
      },
    });
  },

  update(id: string, data: Prisma.ResumeVersionUpdateInput) {
    return prisma.resumeVersion.update({ where: { id }, data });
  },

  remove(id: string) {
    // Linked jobs have resumeId set to NULL (onDelete: SetNull).
    return prisma.resumeVersion.delete({ where: { id } });
  },
};
