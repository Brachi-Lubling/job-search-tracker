"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/client/api";
import { JobEditForm } from "@/components/jobs/JobEditForm";
import { pipelineOrder, pipelineLabel } from "@/lib/ui";
import type { JobDetailDTO, PipelineStage } from "@/domain/types";

export function JobDetailControls({ job }: { job: JobDetailDTO }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [value, setValue] = useState<PipelineStage>(job.pipeline);
  const [editing, setEditing] = useState(false);

  async function changePipeline(next: PipelineStage) {
    setValue(next);
    setSaving(true);
    try {
      await api.jobs.update(job.id, { pipeline: next });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("למחוק את המשרה? פעולה זו תמחק גם את השלבים והסיכום.")) return;
    await api.jobs.remove(job.id);
    router.push("/jobs");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-sm muted">
        שלב:
        <select
          value={value}
          disabled={saving}
          onChange={(e) => changePipeline(e.target.value as PipelineStage)}
          className="input max-w-[11rem] disabled:opacity-60"
        >
          {pipelineOrder.map((s) => (
            <option key={s} value={s}>
              {pipelineLabel[s]}
            </option>
          ))}
        </select>
      </label>
      <button onClick={() => setEditing(true)} className="btn-outline">
        ערוך פרטים
      </button>
      <button
        onClick={remove}
        className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/40"
      >
        מחק משרה
      </button>

      {editing && <JobEditForm job={job} onClose={() => setEditing(false)} />}
    </div>
  );
}
