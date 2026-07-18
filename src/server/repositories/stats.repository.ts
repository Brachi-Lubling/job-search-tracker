import { prisma } from "@/server/prisma";

export const statsRepository = {
  countByPipeline() {
    return prisma.jobApplication.groupBy({ by: ["pipeline"], _count: { _all: true } });
  },

  countByStatus() {
    return prisma.jobApplication.groupBy({ by: ["status"], _count: { _all: true } });
  },

  total() {
    return prisma.jobApplication.count();
  },

  avgSelfScore() {
    return prisma.postMortem.aggregate({ _avg: { selfScore: true } });
  },

  pendingStages() {
    return prisma.processStage.count({ where: { status: "pending" } });
  },

  recentStages(take = 6) {
    return prisma.processStage.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take,
      include: { job: { include: { company: true } } },
    });
  },
};
