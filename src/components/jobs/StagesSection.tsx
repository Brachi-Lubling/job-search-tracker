"use client";

import { useState } from "react";
import { api } from "@/client/api";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { QuickPipelineModal } from "@/components/jobs/QuickPipelineModal";
import {
  stageStatusLabel,
  stageStatusBadge,
  stageStatusBorder,
  stageStatusDot,
  stagePresets,
  formatDate,
} from "@/lib/ui";
import type { StageDTO, StageStatus, PipelineStage } from "@/domain/types";

const STATUSES: StageStatus[] = ["pending", "completed", "failed"];

export function StagesSection({
  jobId,
  pipeline,
  initialStages,
}: {
  jobId: string;
  pipeline: PipelineStage;
  initialStages: StageDTO[];
}) {
  const [stages, setStages] = useState(initialStages);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function sortStages(list: StageDTO[]) {
    return [...list].sort((a, b) => a.date.localeCompare(b.date));
  }

  async function handleAdd(data: StageFormData) {
    const created = await api.jobs.addStage(jobId, {
      stageName: data.stageName,
      status: data.status,
      date: data.date ? new Date(data.date) : undefined,
      notes: data.notes || undefined,
    });
    setStages((prev) => sortStages([...prev, created]));
    setAdding(false);
    setShowPipelineModal(true); // prompt to update the job's pipeline stage
  }

  async function handleEdit(id: string, data: StageFormData) {
    const updated = await api.jobs.updateStage(jobId, id, {
      stageName: data.stageName,
      status: data.status,
      date: data.date ? new Date(data.date) : undefined,
      notes: data.notes,
    });
    setStages((prev) => sortStages(prev.map((s) => (s.id === id ? updated : s))));
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    await api.jobs.removeStage(jobId, id);
    setStages((prev) => prev.filter((s) => s.id !== id));
  }

  // Quick status change straight from the timeline card — no need to open the full edit form.
  async function handleQuickStatus(id: string, status: StageStatus) {
    const prevStages = stages;
    setStages((prev) => sortStages(prev.map((s) => (s.id === id ? { ...s, status } : s))));
    try {
      const updated = await api.jobs.updateStage(jobId, id, { status });
      setStages((prev) => sortStages(prev.map((s) => (s.id === id ? updated : s))));
    } catch {
      setStages(prevStages);
    }
  }

  return (
    <div>
      {stages.length === 0 ? (
        <p className="card-dashed px-4 py-6 text-center text-sm muted">
          עדיין לא נוספו שלבים. הוסף את השלב הראשון למטה.
        </p>
      ) : (
        <ol className="space-y-0">
          {stages.map((stage, i) => (
            <li key={stage.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`mt-2 h-3.5 w-3.5 shrink-0 rounded-full ${stageStatusDot[stage.status]}`} />
                {i < stages.length - 1 && <span className="w-0.5 flex-1 bg-black/15 dark:bg-white/20" />}
              </div>
              <div className={`flex-1 ${i < stages.length - 1 ? "pb-4" : ""}`}>
                {editingId === stage.id ? (
                  <StageForm
                    initial={stage}
                    onSubmit={(d) => handleEdit(stage.id, d)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className={`card p-4 ${stageStatusBorder[stage.status]}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium heading">{stage.stageName}</span>
                      <select
                        value={stage.status}
                        onChange={(e) => handleQuickStatus(stage.id, e.target.value as StageStatus)}
                        aria-label="עדכון מהיר של סטטוס השלב"
                        title="עדכון מהיר של סטטוס"
                        className={`chip cursor-pointer border-0 outline-none ${stageStatusBadge[stage.status]}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="text-black">
                            {stageStatusLabel[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="mt-1 text-xs muted">{formatDate(stage.date)}</p>
                    {stage.notes && <p className="mt-2 text-sm muted">{stage.notes}</p>}
                    <div className="mt-2 flex gap-3 text-xs">
                      <button onClick={() => setEditingId(stage.id)} className="text-[#0055DA] hover:underline">
                        עריכה
                      </button>
                      <button onClick={() => setConfirmDeleteId(stage.id)} className="text-red-600 hover:underline">
                        מחיקה
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {adding ? (
        <div className="mt-3">
          <StageForm onSubmit={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{ borderColor: "var(--page-accent)", color: "var(--page-accent)" }}
          className="mt-3 rounded border-2 px-4 py-2 text-sm font-bold transition hover:bg-black/[0.04] dark:hover:bg-white/10"
        >
          + הוסף שלב
        </button>
      )}

      {showPipelineModal && (
        <QuickPipelineModal jobId={jobId} current={pipeline} onClose={() => setShowPipelineModal(false)} />
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="מחיקת שלב"
        message="לא ניתן לשחזר את השלב לאחר המחיקה."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) handleDelete(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
      />
    </div>
  );
}

type StageFormData = { stageName: string; status: StageStatus; date: string; notes: string };

function StageForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: StageDTO;
  onSubmit: (d: StageFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [stageName, setStageName] = useState(initial?.stageName ?? "");
  const [status, setStatus] = useState<StageStatus>(initial?.status ?? "pending");
  const [date, setDate] = useState(initial ? initial.date.slice(0, 10) : "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ stageName, status, date, notes });
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border divider surface-2 p-4">
      <input
        required
        list="stage-presets"
        value={stageName}
        onChange={(e) => setStageName(e.target.value)}
        placeholder="שם השלב — בחר מהרשימה או הקלד"
        className="input"
      />
      <datalist id="stage-presets">
        {stagePresets.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <div className="flex flex-wrap gap-3">
        <select value={status} onChange={(e) => setStatus(e.target.value as StageStatus)} className="input max-w-[10rem]">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {stageStatusLabel[s]}
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input max-w-[11rem]" />
      </div>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="הערות (אופציונלי)" rows={2} className="input" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          ביטול
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "שומר..." : "שמור"}
        </button>
      </div>
    </form>
  );
}
