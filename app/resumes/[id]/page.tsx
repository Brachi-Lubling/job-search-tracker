import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/client/api";
import { pipelineLabel, pipelineBadge, jobStatusBadge, jobStatusLabel, formatDate } from "@/lib/ui";
import type { ResumeDetailDTO } from "@/domain/types";
import { PageLines } from "@/components/PageLines";

export const dynamic = "force-dynamic";

export default async function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let resume: ResumeDetailDTO;
  try {
    resume = await api.resumes.get(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div
      className="mx-auto max-w-3xl px-6 py-8"
      style={{ "--page-accent": "#E0B800", "--page-accent-fg": "#000000" } as React.CSSProperties}
    >
      <PageLines />
      <Link href="/resumes" className="text-sm text-[#0055DA] hover:underline">
        → חזרה לקורות חיים
      </Link>

      <header className="mt-4 card border-s-[#FFD400] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold heading">{resume.versionTag}</h1>
            <p className="text-xs muted">נוצר: {formatDate(resume.createdAt)}</p>
          </div>
          <a href={resume.fileUrl} target="_blank" className="text-sm text-[#0055DA] hover:underline">
            הורדת הקובץ ↓
          </a>
        </div>
        {resume.notes && <p className="mt-3 text-sm muted">{resume.notes}</p>}
      </header>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold heading">
          משרות שמשתמשות בגרסה זו ({resume.jobs.length})
        </h2>
        {resume.jobs.length === 0 ? (
          <div className="card-dashed p-8 text-center muted">
            אף משרה לא מקושרת לגרסה זו.
          </div>
        ) : (
          <div className="overflow-hidden card">
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {resume.jobs.map((job) => (
                <li key={job.id}>
                  <Link href={`/jobs/${job.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <span className="min-w-0">
                      <span className="block truncate font-medium heading">{job.title}</span>
                      <span className="text-xs muted">{job.company.name}</span>
                    </span>
                    <span className="flex shrink-0 gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${pipelineBadge[job.pipeline]}`}>
                        {pipelineLabel[job.pipeline]}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${jobStatusBadge[job.status]}`}>
                        {jobStatusLabel[job.status]}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
