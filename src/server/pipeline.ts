import type { JobStatus, PipelineStage } from "@/domain/types";

// The pipeline stage is the source of truth for the funnel; status is derived.
export function statusFromPipeline(pipeline: PipelineStage): JobStatus {
  switch (pipeline) {
    case "offer":
    case "accepted":
      return "offered";
    case "rejected":
      return "closed";
    default:
      return "active"; // wishlist, applied, interviewing
  }
}

// When submitting an analysis, the chosen final status maps back to a pipeline stage.
export function pipelineFromFinalStatus(finalStatus: "closed" | "offered"): PipelineStage {
  return finalStatus === "offered" ? "accepted" : "rejected";
}
