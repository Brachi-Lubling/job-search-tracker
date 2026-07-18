import { jobRepository } from "@/server/repositories/job.repository";
import type { DashboardCard } from "@/domain/types";

export const dashboardService = {
  async getActive(): Promise<DashboardCard[]> {
    const jobs = await jobRepository.findActiveWithLatestStage();
    return jobs.map((job) => {
      const latest = job.stages[0];
      return {
        id: job.id,
        title: job.title,
        companyName: job.company.name,
        status: job.status,
        pipeline: job.pipeline,
        latestStage: latest
          ? {
              stageName: latest.stageName,
              status: latest.status,
              date: latest.date.toISOString(),
            }
          : null,
        createdAt: job.createdAt.toISOString(),
      };
    });
  },
};
