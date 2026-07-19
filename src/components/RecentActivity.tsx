import Link from "next/link";
import type { StatsDTO } from "@/domain/types";
import { stageStatusBadge, stageStatusLabel, formatDate } from "@/lib/ui";

export function RecentActivity({ items }: { items: StatsDTO["recentActivity"] }) {
  return (
    <div className="card border-s-[#FF0052] p-5">
      <h2 className="text-sm font-semibold heading">פעילות אחרונה</h2>
      <p className="mb-4 text-xs muted">עדכוני שלבים בתוך המשרות (לא ספירת משרות)</p>
      {items.length === 0 ? (
        <p className="text-sm muted">אין עדיין שלבים מתועדים.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((a, i) => (
            <li key={i}>
              <Link href={`/jobs/${a.jobId}`} className="group flex items-start gap-3">
                <span
                  className={`mt-0.5 rounded-full px-2 py-0.5 text-[11px] ${stageStatusBadge[a.status]}`}
                >
                  {stageStatusLabel[a.status]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm muted group-hover:heading">
                    {a.stageName} · {a.jobTitle}
                  </span>
                  <span className="text-xs muted">
                    {a.companyName} · {formatDate(a.date)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
