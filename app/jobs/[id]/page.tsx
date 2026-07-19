import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/client/api";
import { StagesSection } from "@/components/jobs/StagesSection";
import { ReflectionSection } from "@/components/ReflectionSection";
import { JobDetailControls } from "@/components/jobs/JobDetailControls";
import { pipelineLabel, pipelineBadge, pipelineBorder, jobStatusLabel, jobStatusBadge, jobLocationLabel } from "@/lib/ui";
import type { JobDetailDTO } from "@/domain/types";
import { PageLines } from "@/components/PageLines";

export const dynamic = "force-dynamic";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let job: JobDetailDTO;
  try {
    job = await api.jobs.get(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div
      className="mx-auto max-w-3xl px-6 py-8"
      style={{ "--page-accent": "#FF0052", "--page-accent-fg": "#ffffff" } as React.CSSProperties}
    >
      <PageLines />
      <Link href="/jobs" className="text-sm text-[#FF0052] hover:underline">
        → חזרה למשרות
      </Link>

      <header className={`mt-4 card p-5 ${pipelineBorder[job.pipeline]}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold heading">{job.title}</h1>
            <Link href={`/companies/${job.company.id}`} className="muted hover:text-[#0055DA]">
              {job.company.name}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`chip ${pipelineBadge[job.pipeline]}`}>{pipelineLabel[job.pipeline]}</span>
              <span className={`chip ${jobStatusBadge[job.status]}`}>{jobStatusLabel[job.status]}</span>
              {job.location && <span className="chip bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{jobLocationLabel[job.location]}</span>}
              {job.tags.map((t) => (
                <span key={t} className="chip bg-[#0055DA]/10 text-[#0055DA]">#{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Key facts */}
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t divider pt-4 text-sm sm:grid-cols-3">
          <Fact label="שכר" value={job.salary} />
          <Fact label="מקור" value={job.source} />
          <Fact label="איש קשר" value={job.contact} />
          <Fact
            label="קו״ח"
            value={job.resume ? job.resume.versionTag : null}
            href={job.resume?.fileUrl}
          />
          <Fact label="מודעה" value={job.jobUrl ? "קישור ↗" : null} href={job.jobUrl ?? undefined} />
        </dl>
        {job.notes && <p className="mt-3 rounded-md surface-2 p-3 text-sm muted">{job.notes}</p>}

        <div className="mt-4 border-t divider pt-4">
          <JobDetailControls job={job} />
        </div>
      </header>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold heading">שלבי התהליך</h2>
        <StagesSection jobId={job.id} pipeline={job.pipeline} initialStages={job.stages} />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold heading">רפלקציה וסיכום</h2>
        <ReflectionSection jobId={job.id} status={job.status} postMortem={job.postMortem} />
      </section>
    </div>
  );
}

function Fact({ label, value, href }: { label: string; value: string | null; href?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs muted">{label}</dt>
      <dd className="heading">
        {href ? (
          <a href={href} target="_blank" className="text-[#0055DA] hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
