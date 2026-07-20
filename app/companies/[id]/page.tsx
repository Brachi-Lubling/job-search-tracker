import Link from "next/link";
import { notFound } from "next/navigation";
import { companyService } from "@/server/services/company.service";
import { NotFoundError } from "@/server/http";
import { RecruitersManager } from "@/components/companies/RecruitersManager";
import { CompanyDetailControls } from "@/components/companies/CompanyDetailControls";
import { pipelineLabel, pipelineBadge, jobStatusBadge, jobStatusLabel } from "@/lib/ui";
import type { CompanyDetailDTO } from "@/domain/types";
import { PageLines } from "@/components/PageLines";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let company: CompanyDetailDTO;
  try {
    company = await companyService.getById(id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }

  return (
    <div
      className="mx-auto max-w-3xl px-6 py-8"
      style={{ "--page-accent": "#00C68D", "--page-accent-fg": "#000000" } as React.CSSProperties}
    >
      <PageLines />
      <Link href="/companies" className="text-sm font-bold text-[#00C68D] hover:underline">
        → חזרה לחברות
      </Link>

      <header className="mt-4 card border-s-[#00C68D] p-5">
        <h1 className="text-2xl font-bold heading">{company.name}</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 text-sm muted">
          {company.industry && <span>{company.industry}</span>}
          {company.website && (
            <a href={company.website} target="_blank" className="text-[#0055DA] hover:underline" dir="ltr">
              {company.website.replace(/^https?:\/\//, "")} ↗
            </a>
          )}
        </div>
        {company.notes && <p className="mt-3 rounded-md surface-2 p-3 text-sm muted">{company.notes}</p>}
        <CompanyDetailControls company={company} />
      </header>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold heading">אנשי קשר / מגייסים</h2>
        <RecruitersManager companyId={company.id} initial={company.recruiters} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold heading">משרות בחברה ({company.jobs.length})</h2>
        {company.jobs.length === 0 ? (
          <div className="card-dashed p-8 text-center muted">אין משרות מקושרות.</div>
        ) : (
          <div className="card overflow-hidden">
            <ul className="divide-y divide-black/10 dark:divide-white/10">
              {company.jobs.map((job) => (
                <li key={job.id}>
                  <Link href={`/jobs/${job.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-black/[0.03] dark:hover:bg-white/[0.05]">
                    <span className="truncate font-medium heading">{job.title}</span>
                    <span className="flex shrink-0 gap-2">
                      <span className={`chip ${pipelineBadge[job.pipeline]}`}>{pipelineLabel[job.pipeline]}</span>
                      <span className={`chip ${jobStatusBadge[job.status]}`}>{jobStatusLabel[job.status]}</span>
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
