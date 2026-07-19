import { PageHeader } from "@/components/PageHeader";
import { PageLines } from "@/components/PageLines";
import { JobsBrowser } from "@/components/jobs/JobsBrowser";
import type { PipelineStage } from "@/domain/types";

export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ pipeline?: string; companyId?: string }>;
}) {
  const sp = await searchParams;
  const validStages: PipelineStage[] = [
    "wishlist",
    "applied",
    "interviewing",
    "offer",
    "accepted",
    "rejected",
  ];
  const initialPipeline = validStages.includes(sp.pipeline as PipelineStage)
    ? (sp.pipeline as PipelineStage)
    : undefined;

  return (
    <div
      className="mx-auto max-w-6xl px-6 py-8"
      style={{ "--page-accent": "#FF0052", "--page-accent-fg": "#ffffff" } as React.CSSProperties}
    >
      <PageLines />
      <PageHeader title="משרות" subtitle="כל המועמדויות — ברשימה או בלוח קנבן" accent="#FF0052" />
      <JobsBrowser initialPipeline={initialPipeline} initialCompanyId={sp.companyId} />
    </div>
  );
}
