"use client";

import { useEffect, useState } from "react";
import { api } from "@/client/api";
import { TagInput } from "@/components/TagInput";
import { pipelineOrder, pipelineLabel, pipelineBadge, jobLocationLabel, formatDate } from "@/lib/ui";
import type {
  CompanyListItemDTO,
  ResumeListItemDTO,
  JobListItemDTO,
  PipelineStage,
  JobLocation,
} from "@/domain/types";

const TAG_SUGGESTIONS = ["FE", "BE", "Full-Stack", "DevOps", "Data", "Mobile", "QA", "Management"];
const LOCATIONS: JobLocation[] = ["remote", "hybrid", "onsite"];

// Inline creation panel — mirrors CompaniesManager/ResumesManager: the caller owns the
// open/close toggle (a page-accent-colored btn-primary) and renders this card below it.
export function NewJobForm({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [companies, setCompanies] = useState<CompanyListItemDTO[]>([]);
  const [resumes, setResumes] = useState<ResumeListItemDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Jobs already sharing the entered posting URL (duplicate-application warning).
  const [urlDupes, setUrlDupes] = useState<JobListItemDTO[]>([]);
  // Side-panel: this company's previous applications, newest first.
  const [companyJobs, setCompanyJobs] = useState<JobListItemDTO[] | null>(null);
  const [companyLoading, setCompanyLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [pipeline, setPipeline] = useState<PipelineStage>("applied");
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<JobLocation | "">("");
  const [salary, setSalary] = useState("");
  const [source, setSource] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    Promise.all([api.companies.list(), api.resumes.list()])
      .then(([c, r]) => {
        setCompanies(c);
        setResumes(r);
      })
      .catch(() => setError("טעינת הנתונים נכשלה"));
  }, [open]);

  // When an existing company is picked, pull its previous applications for the
  // side-panel. A newly-typed company (no id) has no history to show.
  useEffect(() => {
    if (!companyId) {
      setCompanyJobs(null);
      return;
    }
    let cancelled = false;
    setCompanyLoading(true);
    api.companies
      .get(companyId)
      .then((c) => {
        if (!cancelled) setCompanyJobs(c.jobs);
      })
      .catch(() => {
        if (!cancelled) setCompanyJobs(null);
      })
      .finally(() => {
        if (!cancelled) setCompanyLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  // Warn (don't block) if this exact posting URL is already tracked elsewhere.
  async function checkUrlDupes() {
    const url = jobUrl.trim();
    if (!url) {
      setUrlDupes([]);
      return;
    }
    try {
      setUrlDupes(await api.jobs.list({ jobUrl: url }));
    } catch {
      setUrlDupes([]);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      let cid = companyId;
      if (!cid && newCompany.trim()) {
        const company = await api.companies.create({ name: newCompany.trim() });
        cid = company.id;
      }
      if (!cid) throw new Error("יש לבחור או להזין חברה");

      await api.jobs.create({
        companyId: cid,
        title,
        jobUrl: jobUrl || undefined,
        resumeId: resumeId || undefined,
        pipeline,
        tags,
        location: location || undefined,
        salary: salary || undefined,
        source: source || undefined,
        contact: contact || undefined,
        notes: notes || undefined,
      });
      reset();
      onClose();
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setTitle("");
    setJobUrl("");
    setCompanyId("");
    setNewCompany("");
    setResumeId("");
    setPipeline("applied");
    setTags([]);
    setLocation("");
    setSalary("");
    setSource("");
    setContact("");
    setNotes("");
    setUrlDupes([]);
    setCompanyJobs(null);
  }

  if (!open) return null;

  return (
    <div className="mb-6 flex flex-col items-start gap-4 lg:flex-row">
      <form onSubmit={submit} className="card w-full space-y-3 p-4 lg:max-w-xl">
        <Field label="כותרת המשרה">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="חברה קיימת">
          <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="input">
            <option value="">— בחר או הזן חדשה למטה —</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        {!companyId && (
          <Field label="או חברה חדשה">
            <input
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              className="input"
              placeholder="שם החברה"
            />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="שלב בצינור">
            <select
              value={pipeline}
              onChange={(e) => setPipeline(e.target.value as PipelineStage)}
              className="input"
            >
              {pipelineOrder.map((s) => (
                <option key={s} value={s}>
                  {pipelineLabel[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="קורות חיים">
            <select value={resumeId} onChange={(e) => setResumeId(e.target.value)} className="input">
              <option value="">— ללא —</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.versionTag}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="תגיות / תחומים">
          <TagInput value={tags} onChange={setTags} suggestions={TAG_SUGGESTIONS} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="אופי המשרה">
            <select value={location} onChange={(e) => setLocation(e.target.value as JobLocation | "")} className="input">
              <option value="">— לא צוין —</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {jobLocationLabel[l]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="שכר (טווח/הערכה)">
            <input value={salary} onChange={(e) => setSalary(e.target.value)} className="input" placeholder="₪…" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="דרך איפה הגעת (מקור)">
            <input value={source} onChange={(e) => setSource(e.target.value)} className="input" placeholder="LinkedIn / המלצה…" />
          </Field>
          <Field label="מי העביר / איש קשר">
            <input value={contact} onChange={(e) => setContact(e.target.value)} className="input" />
          </Field>
        </div>

        <Field label="קישור למשרה (אופציונלי)">
          <input
            value={jobUrl}
            onChange={(e) => {
              setJobUrl(e.target.value);
              setUrlDupes([]); // stale until re-checked on blur
            }}
            onBlur={checkUrlDupes}
            className="input"
            placeholder="https://..."
          />
        </Field>

        {urlDupes.length > 0 && (
          <div className="rounded-lg border border-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 text-sm">
            <p className="font-medium text-amber-800 dark:text-amber-300">
              ⚠️ הקישור הזה כבר קיים {urlDupes.length > 1 ? `ב-${urlDupes.length} משרות` : "במשרה אחרת"}:
            </p>
            <ul className="mt-1 space-y-0.5 text-amber-800 dark:text-amber-200">
              {urlDupes.map((j) => (
                <li key={j.id}>
                  {j.title} · {j.company.name} · {formatDate(j.createdAt)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Field label="הערות (אופציונלי)">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input" rows={2} />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            ביטול
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "שומר..." : "צור משרה"}
          </button>
        </div>
      </form>

      {companyId && (
        <aside className="card slide-in-side w-full shrink-0 p-4 lg:w-72">
          <h3 className="text-sm font-semibold">
            הגשות קודמות ל{companies.find((c) => c.id === companyId)?.name ?? "חברה זו"}
          </h3>
          {companyLoading ? (
            <p className="mt-3 text-sm muted">טוען…</p>
          ) : companyJobs && companyJobs.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {companyJobs.slice(0, 6).map((j) => (
                <li key={j.id} className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2 text-sm">
                  <div className="font-medium">{j.title}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className={`rounded px-1.5 py-0.5 text-xs ${pipelineBadge[j.pipeline]}`}>
                      {pipelineLabel[j.pipeline]}
                    </span>
                    <span className="muted text-xs">{formatDate(j.createdAt)}</span>
                  </div>
                </li>
              ))}
              {companyJobs.length > 6 && (
                <li className="text-xs muted">ועוד {companyJobs.length - 6}…</li>
              )}
            </ul>
          ) : (
            <p className="mt-3 text-sm muted">אין הגשות קודמות לחברה זו.</p>
          )}
        </aside>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block muted">{label}</span>
      {children}
    </label>
  );
}
