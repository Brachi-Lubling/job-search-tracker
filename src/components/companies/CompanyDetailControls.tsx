"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/client/api";
import type { CompanyDetailDTO } from "@/domain/types";

export function CompanyDetailControls({ company }: { company: CompanyDetailDTO }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(company.name);
  const [website, setWebsite] = useState(company.website ?? "");
  const [industry, setIndustry] = useState(company.industry ?? "");
  const [notes, setNotes] = useState(company.notes ?? "");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.companies.update(company.id, {
        name,
        website: website || null,
        industry: industry || null,
        notes: notes || null,
      });
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("למחוק את החברה? אנשי הקשר יימחקו גם הם.")) return;
    try {
      await api.companies.remove(company.id);
      router.push("/companies");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "המחיקה נכשלה");
    }
  }

  if (editing) {
    return (
      <form onSubmit={save} className="mt-4 grid gap-3 border-t divider pt-4 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="שם" className="input" required />
        <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="תחום" className="input" />
        <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="אתר" className="input" dir="ltr" />
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="הערות" rows={2} className="input sm:col-span-2" />
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={() => setEditing(false)} className="btn-ghost">
            ביטול
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "שומר…" : "שמור"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-4 flex gap-3 border-t divider pt-4">
      <button onClick={() => setEditing(true)} className="btn-outline">
        ערוך חברה
      </button>
      <button
        onClick={remove}
        className="rounded border-2 border-red-500 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
      >
        מחק חברה
      </button>
    </div>
  );
}
