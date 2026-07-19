"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/client/api";
import { pipelineOrder, pipelineLabel, pipelineDot } from "@/lib/ui";
import type { PipelineStage } from "@/domain/types";

// Small prompt to bump the job's pipeline stage — shown after adding/closing a stage.
export function QuickPipelineModal({
  jobId,
  current,
  title = "לעדכן את שלב המשרה?",
  onClose,
}: {
  jobId: string;
  current: PipelineStage;
  title?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function pick(stage: PipelineStage) {
    if (stage === current) return onClose();
    setSaving(true);
    try {
      await api.jobs.update(jobId, { pipeline: stage });
      router.refresh();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="card w-full max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-1 font-semibold heading">{title}</h3>
        <p className="mb-4 text-sm muted">בחר את השלב הנוכחי בתהליך (או דלג).</p>
        <div className="grid grid-cols-2 gap-2">
          {pipelineOrder.map((stage) => (
            <button
              key={stage}
              disabled={saving}
              onClick={() => pick(stage)}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition disabled:opacity-50 ${
                stage === current
                  ? "border-[#0055DA] bg-[#0055DA]/10 font-medium"
                  : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${pipelineDot[stage]}`} />
              {pipelineLabel[stage]}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="btn-ghost">
            דלג
          </button>
        </div>
      </div>
    </div>
  );
}
