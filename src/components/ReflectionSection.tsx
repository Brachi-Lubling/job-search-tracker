"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/client/api";
import type { JobStatus, PostMortemDTO } from "@/domain/types";

export function ReflectionSection({
  jobId,
  status,
  postMortem,
}: {
  jobId: string;
  status: JobStatus;
  postMortem: PostMortemDTO | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rejectionReason, setRejectionReason] = useState(postMortem?.rejectionReason ?? "");
  const [improvementTips, setImprovementTips] = useState(postMortem?.improvementTips ?? "");
  const [selfScore, setSelfScore] = useState(postMortem?.selfScore ?? 3);
  const [finalStatus, setFinalStatus] = useState<"closed" | "offered">(
    status === "offered" ? "offered" : "closed",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.jobs.submitAnalysis(jobId, {
        rejectionReason: rejectionReason || undefined,
        improvementTips: improvementTips || undefined,
        selfScore: Number(selfScore),
        finalStatus,
      });
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  if (postMortem && !editing) {
    return (
      <div className="space-y-3 card p-4">
        <Field label="סיבת הדחייה" value={postMortem.rejectionReason} />
        <Field label="טיפים לשיפור" value={postMortem.improvementTips} />
        <div className="text-sm">
          <span className="muted">ציון עצמי: </span>
          <span className="font-medium">{postMortem.selfScore} / 5</span>
        </div>
        <button onClick={() => setEditing(true)} className="text-sm text-[#0055DA] hover:underline">
          עריכה
        </button>
      </div>
    );
  }

  if (!postMortem && !editing) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
        <p className="mb-3 text-sm muted">סגירת המשרה עם סיכום עוזרת ללמוד לפעם הבאה.</p>
        <button
          onClick={() => setEditing(true)}
          className="btn-outline"
        >
          סגור וסכם משרה
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border divider surface-2 p-4">
      <label className="block text-sm">
        סיבת הדחייה
        <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={2} className="input mt-1" />
      </label>
      <label className="block text-sm">
        טיפים לשיפור
        <textarea value={improvementTips} onChange={(e) => setImprovementTips(e.target.value)} rows={2} className="input mt-1" />
      </label>
      <div className="flex flex-wrap gap-4">
        <label className="block text-sm">
          ציון עצמי (1-5)
          <input
            type="number"
            min={1}
            max={5}
            value={selfScore}
            onChange={(e) => setSelfScore(Number(e.target.value))}
            className="input mt-1 w-20"
          />
        </label>
        <label className="block text-sm">
          סטטוס סופי
          <select
            value={finalStatus}
            onChange={(e) => setFinalStatus(e.target.value as "closed" | "offered")}
            className="input mt-1"
          >
            <option value="closed">נדחיתי / נסגרה</option>
            <option value="offered">התקבלה הצעה</option>
          </select>
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setEditing(false)} className="btn-ghost">
          ביטול
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "שומר..." : "שמור סיכום"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="text-sm">
      <span className="muted">{label}: </span>
      <span className="muted">{value || "—"}</span>
    </div>
  );
}
