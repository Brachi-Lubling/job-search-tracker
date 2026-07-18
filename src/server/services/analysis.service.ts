import { jobRepository } from "@/server/repositories/job.repository";
import { NotFoundError } from "@/server/http";
import { pipelineFromFinalStatus, statusFromPipeline } from "@/server/pipeline";
import { toJobDetailDTO } from "@/server/mappers";
import type { SubmitAnalysisInput } from "@/domain/types";

export const analysisService = {
  async submit(jobId: string, input: SubmitAnalysisInput) {
    // Business rule: job must exist; then upsert post-mortem + set final
    // pipeline/status atomically (handled in the repository transaction).
    const job = await jobRepository.exists(jobId);
    if (!job) throw new NotFoundError("המשרה לא נמצאה");

    const { finalStatus, ...pm } = input;
    const pipeline = pipelineFromFinalStatus(finalStatus);
    const updated = await jobRepository.applyAnalysis(
      jobId,
      {
        rejectionReason: pm.rejectionReason || null,
        improvementTips: pm.improvementTips || null,
        selfScore: pm.selfScore,
      },
      pipeline,
      statusFromPipeline(pipeline),
    );
    return toJobDetailDTO(updated);
  },
};
