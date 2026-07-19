"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/client/api";
import { ResumeCard } from "@/components/resumes/ResumeCard";
import { TagInput } from "@/components/TagInput";
import { accentByIndex } from "@/lib/ui";
import type { ResumeListItemDTO } from "@/domain/types";

const RESUME_TAGS = ["FE", "BE", "Full-Stack", "DevOps", "Data", "Mobile", "QA", "Management"];

// Resume language is chosen as the first step of the creation flow and carried
// through the rest of the workflow (create payload, filtering, display).
const LANGUAGES = [
  { value: "עברית", label: "עברית", flag: "🇮🇱" },
  { value: "אנגלית", label: "English", flag: "🇬🇧" },
];

export function ResumesManager({ initial }: { initial: ResumeListItemDTO[] }) {
  const [resumes, setResumes] = useState(initial);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [versionTag, setVersionTag] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refetch = () => api.resumes.list().then(setResumes).catch(() => {});
  useEffect(() => {
    setResumes(initial);
  }, [initial]);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!language) {
      setError("יש לבחור שפה");
      return;
    }
    if (!file) {
      setError("יש לבחור קובץ");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const { fileUrl } = await api.resumes.upload(file);
      await api.resumes.create({
        versionTag,
        fileUrl,
        language: language || undefined,
        tags,
        notes: notes || undefined,
      });
      setVersionTag("");
      setLanguage("");
      setTags([]);
      setNotes("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setOpen(false);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "העלאה נכשלה");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setOpen((v) => !v)} className="btn-primary">
          {open ? "סגור" : "+ קורות חיים חדשים"}
        </button>
      </div>

      {open && (
      <form onSubmit={upload} className="mb-6 card p-4">
        {/* Step 1 — resume language. Chosen first and used throughout the flow. */}
        <fieldset className="mb-4 border-b border-black/10 pb-4 dark:border-white/10">
          <legend className="mb-2 flex items-center gap-2 text-sm font-bold">
            <span
              className="grid h-5 w-5 place-items-center rounded-full text-xs font-black text-white"
              style={{ backgroundColor: "var(--page-accent)" }}
            >
              1
            </span>
            שפת קורות החיים
          </legend>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => {
              const selected = language === l.value;
              return (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLanguage(l.value)}
                  aria-pressed={selected}
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition"
                  style={
                    selected
                      ? {
                          backgroundColor: "var(--page-accent)",
                          color: "var(--page-accent-fg)",
                          borderColor: "var(--page-accent)",
                        }
                      : undefined
                  }
                >
                  <span aria-hidden>{l.flag}</span>
                  {l.label}
                </button>
              );
            })}
            {language && !LANGUAGES.some((l) => l.value === language) && (
              <span className="flex items-center rounded-lg border border-black/15 px-4 py-2 text-sm font-bold dark:border-white/20">
                {language}
              </span>
            )}
          </div>
        </fieldset>

        {/* Step 2 — version details + file. */}
        <div className="flex flex-wrap items-end gap-3">
          <span className="flex items-center gap-2 text-sm font-bold">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-black/70 text-xs font-black text-white dark:bg-white/25">
              2
            </span>
            פרטי הגרסה
          </span>
          <div className="w-full" />
          <label className="block text-sm">
            <span className="mb-1 block muted">תיוג גרסה</span>
            <input
              required
              value={versionTag}
              onChange={(e) => setVersionTag(e.target.value)}
              placeholder="למשל: Full-Stack-Hebrew"
              className="input max-w-[14rem]"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block muted">קובץ (PDF)</span>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </label>
          <label className="block flex-1 text-sm">
            <span className="mb-1 block muted">הערות (אופציונלי)</span>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="input" />
          </label>
          <button type="submit" disabled={uploading} className="btn-primary">
            {uploading ? "מעלה…" : "העלה גרסה"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>
      )}

      {resumes.length === 0 ? (
        <div className="card-dashed p-10 text-center muted">
          עדיין אין גרסאות קורות חיים. העלה את הראשונה.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r, i) => (
            <ResumeCard key={r.id} resume={r} onChanged={refetch} accent={accentByIndex(i)} />
          ))}
        </div>
      )}
    </div>
  );
}
