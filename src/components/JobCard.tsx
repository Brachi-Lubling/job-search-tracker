import Link from "next/link";
import type { DashboardCard } from "@/domain/types";
import {
  pipelineLabel,
  pipelineBadge,
  pipelineBorder,
  stageStatusLabel,
  stageStatusBadge,
  formatDate,
} from "@/lib/ui";

export function JobCard({ job }: { job: DashboardCard }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className={`block card card-hover p-5 ${pipelineBorder[job.pipeline]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold heading">{job.title}</h3>
          <p className="truncate text-sm muted">{job.companyName}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${pipelineBadge[job.pipeline]}`}>
          {pipelineLabel[job.pipeline]}
        </span>
      </div>

      <div className="mt-4 border-t divider pt-3">
        <p className="text-xs muted">שלב אחרון</p>
        {job.latestStage ? (
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="truncate text-sm muted">{job.latestStage.stageName}</span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${stageStatusBadge[job.latestStage.status]}`}
            >
              {stageStatusLabel[job.latestStage.status]}
            </span>
          </div>
        ) : (
          <p className="mt-1 text-sm muted">עדיין אין שלבים</p>
        )}
      </div>

      <p className="mt-3 text-xs muted">נוצר: {formatDate(job.createdAt)}</p>
    </Link>
  );
}
