"use client";

import { useState } from "react";
import { api } from "@/client/api";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { RecruiterDTO } from "@/domain/types";

export function RecruitersManager({
  companyId,
  initial,
}: {
  companyId: string;
  initial: RecruiterDTO[];
}) {
  const [recruiters, setRecruiters] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function del(id: string) {
    await api.recruiters.remove(id);
    setRecruiters((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-3">
      {recruiters.length === 0 && !adding && (
        <p className="text-sm muted">עדיין לא נוספו אנשי קשר.</p>
      )}

      {recruiters.map((r) =>
        editingId === r.id ? (
          <RecruiterForm
            key={r.id}
            initial={r}
            onSubmit={async (data) => {
              const updated = await api.recruiters.update(r.id, data);
              setRecruiters((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div key={r.id} className="card border-s-[#00C68D] p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium heading">
                  {r.name}
                  {r.role && <span className="mr-2 text-sm muted">· {r.role}</span>}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {r.email && (
                    <a href={`mailto:${r.email}`} className="text-[#0055DA] hover:underline">
                      {r.email}
                    </a>
                  )}
                  {r.phone && (
                    <a href={`tel:${r.phone}`} className="text-[#0055DA] hover:underline" dir="ltr">
                      {r.phone}
                    </a>
                  )}
                </div>
                {r.notes && <p className="mt-1 text-sm muted">{r.notes}</p>}
              </div>
              <div className="flex shrink-0 gap-3 text-xs">
                <button onClick={() => setEditingId(r.id)} className="text-[#0055DA] hover:underline">
                  עריכה
                </button>
                <button onClick={() => setConfirmDeleteId(r.id)} className="text-red-600 hover:underline">
                  מחיקה
                </button>
              </div>
            </div>
          </div>
        ),
      )}

      {adding ? (
        <RecruiterForm
          onSubmit={async (data) => {
            const created = await api.companies.addRecruiter(companyId, data);
            setRecruiters((prev) => [...prev, created]);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button onClick={() => setAdding(true)} className="btn-outline">
          + הוסף איש קשר
        </button>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="מחיקת איש קשר"
        message="לא ניתן לשחזר לאחר המחיקה."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) del(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
      />
    </div>
  );
}

type FormData = { name: string; role: string; email: string; phone: string; notes: string };

function RecruiterForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: RecruiterDTO;
  onSubmit: (d: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ name, role, email, phone, notes });
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border-2 divider surface-2 p-4 sm:grid-cols-2">
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="שם" className="input" />
      <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="תפקיד (HR / מגייס…)" className="input" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="אימייל" className="input" dir="ltr" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="טלפון" className="input" dir="ltr" />
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="הערות" rows={2} className="input sm:col-span-2" />
      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          ביטול
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "שומר…" : "שמור"}
        </button>
      </div>
    </form>
  );
}
