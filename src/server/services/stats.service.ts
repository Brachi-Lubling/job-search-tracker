import { statsRepository } from "@/server/repositories/stats.repository";
import type { PipelineStage, StatsDTO } from "@/domain/types";

const ALL_PIPELINE: PipelineStage[] = [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "accepted",
  "rejected",
];

export const statsService = {
  async getSummary(): Promise<StatsDTO> {
    const [total, byPipelineRows, byStatusRows, avg, pendingStages, recent] = await Promise.all([
      statsRepository.total(),
      statsRepository.countByPipeline(),
      statsRepository.countByStatus(),
      statsRepository.avgSelfScore(),
      statsRepository.pendingStages(),
      statsRepository.recentStages(6),
    ]);

    const byPipeline = Object.fromEntries(ALL_PIPELINE.map((p) => [p, 0])) as Record<
      PipelineStage,
      number
    >;
    for (const row of byPipelineRows) byPipeline[row.pipeline] = row._count._all;

    const statusCount = (s: "active" | "closed" | "offered") =>
      byStatusRows.find((r) => r.status === s)?._count._all ?? 0;

    const active = statusCount("active");
    const offers = statusCount("offered");
    const rejected = statusCount("closed");
    const finished = offers + rejected;
    const successRate = finished > 0 ? Math.round((offers / finished) * 100) : 0;

    return {
      total,
      active,
      offers,
      rejected,
      successRate,
      avgSelfScore: avg._avg.selfScore,
      byPipeline,
      pendingStages,
      recentActivity: recent.map((s) => ({
        jobId: s.jobId,
        jobTitle: s.job.title,
        companyName: s.job.company.name,
        stageName: s.stageName,
        status: s.status,
        date: s.date.toISOString(),
      })),
    };
  },
};
