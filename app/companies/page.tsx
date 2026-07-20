import { companyService } from "@/server/services/company.service";
import { PageHeader } from "@/components/PageHeader";
import { PageLines } from "@/components/PageLines";
import { CompaniesManager } from "@/components/companies/CompaniesManager";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await companyService.list();

  return (
    <div
      className="mx-auto max-w-6xl px-6 py-8"
      style={{ "--page-accent": "#00C68D", "--page-accent-fg": "#000000" } as React.CSSProperties}
    >
      <PageLines />
      <PageHeader title="חברות" subtitle="נהל חברות ואנשי קשר (מגייסים)" accent="#00C68D" />
      <CompaniesManager initial={companies} />
    </div>
  );
}
