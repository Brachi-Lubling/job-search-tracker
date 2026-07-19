"use client";

import { useState } from "react";
import Link from "next/link";
import type { JobListItemDTO, PipelineStage } from "@/domain/types";
import { pipelineOrder, pipelineLabel, pipelineDot, pipelineBorder, jobStatusBadge, jobStatusLabel } from "@/lib/ui";

export function KanbanBoard({
  jobs,
  onMove,
}: {
  jobs: JobListItemDTO[];
  onMove: (jobId: string, stage: PipelineStage) => void;
}) {
  const [dragOver, setDragOver] = useState<PipelineStage | null>(null);

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {pipelineOrder.map((stage) => {
        const items = jobs.filter((j) => j.pipeline === stage);
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
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] ${jobStatusBadge[job.status]}`}
                  >
                    {jobStatusLabel[job.status]}
                  </span>
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
