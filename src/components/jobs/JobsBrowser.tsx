"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/client/api";
import { KanbanBoard } from "@/components/jobs/KanbanBoard";
import { NewJobForm } from "@/components/NewJobForm";
import {
  pipelineOrder,
  pipelineLabel,
  pipelineBadge,
  jobStatusBadge,
  jobStatusLabel,
  formatDate,
} from "@/lib/ui";
import type { JobListItemDTO, CompanyListItemDTO, PipelineStage, JobFilters } from "@/domain/types";

type View = "list" | "kanban";

export function JobsBrowser({
  initialPipeline,
  initialCompanyId,
}: {
  initialPipeline?: PipelineStage;
  initialCompanyId?: string;
}) {
  const [view, setView] = useState<View>("list");
  const [jobs, setJobs] = useState<JobListItemDTO[]>([]);
  const [companies, setCompanies] = useState<CompanyListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewJob, setShowNewJob] = useState(false);

  const [q, setQ] = useState("");
  const [companyId, setCompanyId] = useState(initialCompanyId ?? "");
  const [pipeline, setPipeline] = useState<PipelineStage | "">(initialPipeline ?? "");
  const [tag, setTag] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    api.companies.list().then(setCompanies).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    // In kanban we show every stage as a column, so the pipeline filter is ignored.
    const filters: JobFilters = {
      q: q || undefined,
      companyId: companyId || undefined,
      pipeline: view === "kanban" ? undefined : (pipeline || undefined),
      tag: tag || undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };
    try {
      setJobs(await api.jobs.list(filters));
    } catch {
      setError("טעינת המשרות נכשלה");
    } finally {
      setLoading(false);
    }
  }, [q, companyId, pipeline, tag, from, to, view]);

  // Debounce so typing in the search box doesn't spam the API.
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function move(jobId: string, stage: PipelineStage) {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, pipeline: stage } : j)));
    try {
      const updated = await api.jobs.update(jobId, { pipeline: stage });
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...updated } : j)));
    } catch {
      load(); // revert to server truth on failure
    }
  }

  const hasFilters = q || companyId || pipeline || tag || from || to;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex rounded-lg border border-black/15 p-0.5 shadow-sm dark:border-white/20">
          {(["list", "kanban"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={
                view === v
                  ? { backgroundColor: "var(--page-accent)", color: "var(--page-accent-fg)" }
                  : undefined
              }
              className={`rounded px-3 py-1 text-sm font-bold ${view === v ? "" : "muted"}`}
            >
              {v === "list" ? "רשימה" : "קנבן"}
            </button>
          ))}
        </div>
        <button onClick={() => setShowNewJob((v) => !v)} className="btn-primary">
          {showNewJob ? "סגור" : "+ משרה חדשה"}
        </button>
      </div>

      <NewJobForm
        open={showNewJob}
        onClose={() => setShowNewJob(false)}
        onCreated={load}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="חיפוש לפי תפקיד/חברה…"
          className="input max-w-[16rem]"
        />
        <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="input max-w-[12rem]">
          <option value="">כל החברות</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={pipeline}
          onChange={(e) => setPipeline(e.target.value as PipelineStage | "")}
          disabled={view === "kanban"}
          className="input max-w-[10rem] disabled:opacity-50"
        >
          <option value="">כל השלבים</option>
          {pipelineOrder.map((s) => (
            <option key={s} value={s}>
              {pipelineLabel[s]}
            </option>
          ))}
        </select>
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="תגית/תחום" className="input max-w-[9rem]" title="סינון לפי תגית" />
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input max-w-[9rem]" title="מתאריך" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input max-w-[9rem]" title="עד תאריך" />
        {hasFilters && (
          <button
            onClick={() => {
              setQ("");
              setCompanyId("");
              setPipeline("");
              setTag("");
              setFrom("");
              setTo("");
            }}
            className="btn-ghost"
          >
            ניקוי
          </button>
        )}
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="py-10 text-center text-sm muted">טוען…</p>
      ) : jobs.length === 0 ? (
        <div className="card-dashed p-10 text-center muted">
          לא נמצאו משרות{hasFilters ? " התואמות לסינון" : ""}.
        </div>
      ) : view === "kanban" ? (
        <KanbanBoard jobs={jobs} onMove={move} />
      ) : (
        <JobTable jobs={jobs} />
      )}
    </div>
  );
}

function JobTable({ jobs }: { jobs: JobListItemDTO[] }) {
  return (
    <div className="overflow-x-auto card">
      <table className="w-full text-right text-sm">
        <thead className="border-b divider text-xs muted">
          <tr>
            <th className="px-4 py-3 font-medium">תפקיד</th>
            <th className="px-4 py-3 font-medium">חברה</th>
            <th className="px-4 py-3 font-medium">שלב</th>
            <th className="px-4 py-3 font-medium">סטטוס</th>
            <th className="px-4 py-3 font-medium">נוצר</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <td className="px-4 py-3">
                <Link href={`/jobs/${job.id}`} className="font-medium heading hover:text-[#0055DA]">
                  {job.title}
                </Link>
              </td>
              <td className="px-4 py-3 muted">{job.company.name}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs ${pipelineBadge[job.pipeline]}`}>
                  {pipelineLabel[job.pipeline]}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs ${jobStatusBadge[job.status]}`}>
                  {jobStatusLabel[job.status]}
                </span>
              </td>
              <td className="px-4 py-3 muted">{formatDate(job.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
