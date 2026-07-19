"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/client/api";
import { TagInput } from "@/components/TagInput";
import { formatDate } from "@/lib/ui";
import type { ResumeListItemDTO } from "@/domain/types";

const RESUME_TAGS = ["FE", "BE", "Full-Stack", "DevOps", "Data", "Mobile", "QA", "Management"];

export function ResumeCard({
  resume,
  onChanged,
  accent = "border-[#FFD400]",
}: {
  resume: ResumeListItemDTO;
  onChanged: () => void;
  accent?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [versionTag, setVersionTag] = useState(resume.versionTag);
  const [language, setLanguage] = useState(resume.language ?? "");
  const [tags, setTags] = useState<string[]>(resume.tags);
  const [notes, setNotes] = useState(resume.notes ?? "");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api.resumes.update(resume.id, {
        versionTag: versionTag || undefined,
        language: language || null,
        tags,
        notes,
      });
      setEditing(false);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("למחוק גרסת קו״ח זו? משרות מקושרות יישארו אך ינותקו מהקובץ.")) return;
    setBusy(true);
    try {
      await api.resumes.remove(resume.id);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`flex flex-col card card-hover p-5 ${accent}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold heading">{resume.versionTag}</h3>
          <p className="text-xs muted">נוצר: {formatDate(resume.createdAt)}</p>
        </div>
        <Link href={`/resumes/${resume.id}`} className="shrink-0 chip bg-[#0055DA]/10 text-[#0055DA] hover:bg-[#0055DA]/20">
          {resume.jobCount} משרות
        </Link>
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <input value={versionTag} onChange={(e) => setVersionTag(e.target.value)} placeholder="שם הגרסה" className="input" />
          <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="שפה (למשל: עברית / אנגלית)" className="input" />
          <TagInput value={tags} onChange={setTags} suggestions={RESUME_TAGS} placeholder="תגית ואנטר…" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input" placeholder="הערות…" />
        </div>
      ) : (
        <div className="mt-3 flex-1 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {resume.language && <span className="chip bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{resume.language}</span>}
            {resume.tags.map((t) => (
              <span key={t} className="chip bg-[#0055DA]/10 text-[#0055DA]">#{t}</span>
            ))}
            {!resume.language && resume.tags.length === 0 && <span className="text-xs text-zinc-400">אין שפה/תגיות</span>}
          </div>
          <p className="text-sm muted">{resume.notes || <span className="text-zinc-300 dark:text-zinc-600">אין הערות</span>}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t divider pt-3 text-sm">
        <a href={resume.fileUrl} target="_blank" className="text-[#0055DA] hover:underline">
          הורדה ↓
        </a>
        {editing ? (
          <>
            <button onClick={save} disabled={busy} className="text-[#0055DA] hover:underline disabled:opacity-50">
              שמור
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setVersionTag(resume.versionTag);
                setLanguage(resume.language ?? "");
                setTags(resume.tags);
                setNotes(resume.notes ?? "");
              }}
              className="muted hover:underline"
            >
              ביטול
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="muted hover:underline">
            עריכה
          </button>
        )}
        <button onClick={remove} disabled={busy} className="mr-auto text-red-600 hover:underline disabled:opacity-50">
          מחק
        </button>
      </div>
    </div>
  );
}
