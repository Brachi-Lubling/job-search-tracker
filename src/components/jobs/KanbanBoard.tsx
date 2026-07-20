"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { JobListItemDTO, PipelineStage } from "@/domain/types";
import { pipelineOrder, pipelineLabel, pipelineDot, pipelineBorder, jobStatusBadge, jobStatusLabel } from "@/lib/ui";

export function KanbanBoard({
  jobs,
  onMove,
  onDelete,
}: {
  jobs: JobListItemDTO[];
  onMove: (jobId: string, stage: PipelineStage) => void;
  onDelete: (jobId: string) => void;
}) {
  const [dragOver, setDragOver] = useState<PipelineStage | null>(null);

  const byStage = useMemo(() => {
    const grouped = new Map<PipelineStage, JobListItemDTO[]>(pipelineOrder.map((s) => [s, []]));
    for (const job of jobs) grouped.get(job.pipeline)?.push(job);
    return grouped;
  }, [jobs]);

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {pipelineOrder.map((stage) => {
        const items = byStage.get(stage) ?? [];
        return (
          <div
            key={stage}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(stage);
            }}
            onDragLeave={() => setDragOver((s) => (s === stage ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              setDragOver(null);
              if (id) onMove(id, stage);
            }}
            className={`flex w-64 shrink-0 flex-col rounded-lg border-2 surface-2 ${
              dragOver === stage ? "border-[#0055DA]" : "border-black/10 dark:border-white/15"
            }`}
          >
            <div className="flex items-center gap-2 px-3 py-2.5">
              <span className={`h-2.5 w-2.5 rounded-full ${pipelineDot[stage]}`} />
              <span className="text-sm font-semibold heading">{pipelineLabel[stage]}</span>
              <span className="mr-auto rounded-full border border-black/10 px-2 text-xs muted dark:border-white/15">
                {items.length}
              </span>
            </div>

            <div className="flex min-h-[6rem] flex-col gap-2 px-2 pb-3">
              {items.map((job) => (
                <div
                  key={job.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", job.id)}
                  className={`cursor-grab card p-3 active:cursor-grabbing ${pipelineBorder[stage]}`}
                >
                  <Link href={`/jobs/${job.id}`} className="block">
                    <p className="truncate text-sm font-medium heading hover:text-[#0055DA]">
                      {job.title}
                    </p>
                    <p className="truncate text-xs muted">{job.company.name}</p>
                  </Link>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] ${jobStatusBadge[job.status]}`}
                    >
                      {jobStatusLabel[job.status]}
                    </span>
                    <button
                      onClick={() => onDelete(job.id)}
                      title="מחק משרה"
                      className="shrink-0 rounded p-1 text-red-500/70 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M4 7h16M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7h14z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="px-1 py-4 text-center text-xs text-zinc-300 dark:text-zinc-600">גרור לכאן</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
