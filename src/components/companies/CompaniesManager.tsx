"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/client/api";
import { accentByIndex } from "@/lib/ui";
import type { CompanyListItemDTO } from "@/domain/types";

export function CompaniesManager({ initial }: { initial: CompanyListItemDTO[] }) {
  const [companies, setCompanies] = useState(initial);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [notes, setNotes] = useState("");

  const refetch = () => api.companies.list().then(setCompanies).catch(() => {});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.companies.create({
        name,
        website: website || undefined,
        industry: industry || undefined,
        notes: notes || undefined,
      });
      setName("");
      setWebsite("");
      setIndustry("");
      setNotes("");
      setOpen(false);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setOpen((v) => !v)} className="btn-primary">
          {open ? "סגור" : "+ חברה חדשה"}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mb-6 grid gap-3 card border-s-[#00C68D] p-4 sm:grid-cols-3">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="שם החברה" className="input" />
          <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="תחום (אופציונלי)" className="input" />
          <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="אתר (https://…)" className="input" dir="ltr" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="הערות (אופציונלי)" rows={2} className="input sm:col-span-3" />
          {error && <p className="text-sm text-red-600 sm:col-span-3">{error}</p>}
          <div className="sm:col-span-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "שומר…" : "צור חברה"}
            </button>
          </div>
        </form>
      )}

      {companies.length === 0 ? (
        <div className="card-dashed p-10 text-center muted">עדיין אין חברות. הוסף אחת.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {companies.map((c, i) => (
            <Link
              key={c.id}
              href={`/companies/${c.id}`}
              className={`flex items-center justify-between gap-3 card card-hover p-5 ${accentByIndex(i)}`}
            >
              <div className="min-w-0">
                <h3 className="truncate font-semibold heading">{c.name}</h3>
                <p className="truncate text-xs muted">
                  {c.industry || "—"}
                  {c.website && <> · {c.website.replace(/^https?:\/\//, "")}</>}
                </p>
              </div>
              <div className="flex shrink-0 gap-2 text-xs">
                <span className="chip bg-[#0055DA]/10 text-[#0055DA]">{c.jobCount} משרות</span>
                <span className="chip bg-[#00C68D]/15 text-[#00C68D]">{c.recruiterCount} אנשי קשר</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
