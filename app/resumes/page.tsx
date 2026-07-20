import { resumeService } from "@/server/services/resume.service";
import { PageHeader } from "@/components/PageHeader";
import { PageLines } from "@/components/PageLines";
import { ResumesManager } from "@/components/resumes/ResumesManager";

export const dynamic = "force-dynamic";

export default async function ResumesPage() {
  const resumes = await resumeService.list();

  return (
    <div
      className="mx-auto max-w-6xl px-6 py-8"
      style={{ "--page-accent": "#E0B800", "--page-accent-fg": "#000000" } as React.CSSProperties}
    >
      <PageLines />
      <PageHeader title="קורות חיים" subtitle="נהל גרסאות, שפה, תגיות וקבצים" accent="#E0B800" />
      <ResumesManager initial={resumes} />
    </div>
  );
}
