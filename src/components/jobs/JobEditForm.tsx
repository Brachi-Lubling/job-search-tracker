"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/client/api";
import { TagInput } from "@/components/TagInput";
import { pipelineOrder, pipelineLabel, jobLocationLabel } from "@/lib/ui";
import type { JobDetailDTO, JobLocation, PipelineStage, ResumeListItemDTO } from "@/domain/types";

const TAG_SUGGESTIONS = ["FE", "BE", "Full-Stack", "DevOps", "Data", "Mobile", "QA", "Management", "React", "Node", "Python"];
const LOCATIONS: JobLocation[] = ["remote", "hybrid", "onsite"];

export function JobEditForm({ job, onClose }: { job: JobDetailDTO; onClose: () => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(job.title);
  const [jobUrl, setJobUrl] = useState(job.jobUrl ?? "");
  const [tags, setTags] = useState<string[]>(job.tags);
  const [pipeline, setPipeline] = useState<PipelineStage>(job.pipeline);
  const [location, setLocation] = useState<JobLocation | "">(job.location ?? "");
  const [salary, setSalary] = useState(job.salary ?? "");
  const [source, setSource] = useState(job.source ?? "");
  const [contact, setContact] = useState(job.contact ?? "");
  const [notes, setNotes] = useState(job.notes ?? "");
  const [resumeId, setResumeId] = useState(job.resume?.id ?? "");
  const [resumes, setResumes] = useState<ResumeListItemDTO[]>([]);

  useEffect(() => {
    api.resumes.list().then(setResumes).catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.jobs.update(job.id, {
        title,
        jobUrl: jobUrl || undefined,
        tags,
        pipeline,
        resumeId: resumeId || null,
        location: location || null,
        salary,
        source,
        contact,
        notes,
      });
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-12" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-lg space-y-3 p-6"
      >
        <h2 className="text-lg font-semibold heading">עריכת משרה</h2>

        <Field label="כותרת">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </Field>

        <Field label="תגיות / תחומים">
          <TagInput value={tags} onChange={setTags} suggestions={TAG_SUGGESTIONS} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="שלב בצינור">
            <select value={pipeline} onChange={(e) => setPipeline(e.target.value as PipelineStage)} className="input">
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

        <Field label="קישור למשרה">
          <input value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} className="input" placeholder="https://…" />
        </Field>

        <Field label="הערות">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input" />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost">
            ביטול
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "שומר..." : "שמור שינויים"}
          </button>
        </div>
      </form>
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
