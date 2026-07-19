import Link from "next/link";
import { api } from "@/client/api";
import { PageHeader } from "@/components/PageHeader";
import { PageLines } from "@/components/PageLines";
import { StatTile } from "@/components/StatTile";
import { PipelineFunnel } from "@/components/PipelineFunnel";
import { RecentActivity } from "@/components/RecentActivity";
import { JobCard } from "@/components/JobCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, active] = await Promise.all([api.stats.get(), api.dashboard.get()]);

  return (
    <div
      className="mx-auto max-w-6xl px-6 py-8"
      style={{ "--page-accent": "#0055DA", "--page-accent-fg": "#ffffff" } as React.CSSProperties}
    >
      <PageLines />
      <PageHeader title="דשבורד" subtitle="תמונת מצב כללית של חיפוש העבודה" />

      <p className="mb-2 text-xs muted">הספירות הבאות הן לפי משרות (תהליכי הגשה), לא לפי שלבים בתוכן.</p>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="סה״כ משרות" value={stats.total} hint="כל המשרות שנוספו למעקב" border="border-s-[#0055DA]" />
        <StatTile
          label="משרות פעילות"
          value={stats.active}
          hint="בתהליך — טרם נסגרו/התקבלו"
          accent="text-[#0055DA]"
          border="border-s-[#0055DA]"
        />
        <StatTile
          label="משרות עם הצעה"
          value={stats.offers}
          hint="הגיעו לשלב הצעה או התקבלו"
          accent="text-[#00C68D]"
          border="border-s-[#00C68D]"
        />
        <StatTile
          label="אחוז זכייה בהצעה"
          value={`${stats.successRate}%`}
          hint={`${stats.offers} הצעות מתוך ${stats.offers + stats.rejected} משרות שנסגרו`}
          accent="text-[#FF0052]"
          border="border-s-[#FF0052]"
        />
        <StatTile
          label="ציון עצמי ממוצע"
          value={stats.avgSelfScore !== null ? stats.avgSelfScore.toFixed(1) : "—"}
          hint="מתוך 5, ממוצע לפי משרה"
          border="border-s-[#FFD400]"
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PipelineFunnel byPipeline={stats.byPipeline} />
        <RecentActivity items={stats.recentActivity} />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold heading">
            משרות פעילות{stats.pendingStages > 0 && (
              <span className="mr-2 rounded-full bg-[#FFD400]/25 px-2 py-0.5 text-xs font-medium text-black dark:text-[#FFD400]">
                {stats.pendingStages} שלבים ממתינים
              </span>
            )}
          </h2>
          <Link href="/jobs" className="text-sm text-[#0055DA] hover:underline">
            לכל המשרות ←
          </Link>
        </div>

        {active.length === 0 ? (
          <div className="card-dashed p-10 text-center muted">
            אין משרות פעילות. עבור ל״משרות״ כדי להוסיף אחת.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
