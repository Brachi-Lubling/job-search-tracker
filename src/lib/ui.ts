import type { JobStatus, StageStatus, PipelineStage } from "@/domain/types";

// Pipeline (funnel) — the kanban columns, in order. Colors are SEMANTIC state
// chips and ALWAYS render beside their text label (secondary encoding), so the
// green/red terminal pair and the gray "wishlist" are accessible by label.
export const pipelineOrder: PipelineStage[] = [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "accepted",
  "rejected",
];

export const pipelineLabel: Record<PipelineStage, string> = {
  wishlist: "רשימת משאלות",
  applied: "הוגש",
  interviewing: "בראיונות",
  offer: "הצעה",
  accepted: "התקבל",
  rejected: "נדחה",
};

export const pipelineBadge: Record<PipelineStage, string> = {
  wishlist: "bg-black text-white dark:bg-white dark:text-black",
  applied: "bg-[#0055DA] text-white",
  interviewing: "bg-[#FFD400] text-black",
  offer: "bg-[#FF0052] text-white",
  accepted: "bg-[#00C68D] text-white",
  rejected: "bg-neutral-600 text-white dark:bg-neutral-400 dark:text-black",
};

// Solid accent dot per stage (kanban headers).
export const pipelineDot: Record<PipelineStage, string> = {
  wishlist: "bg-black dark:bg-white",
  applied: "bg-[#0055DA]",
  interviewing: "bg-[#FFD400]",
  offer: "bg-[#FF0052]",
  accepted: "bg-[#00C68D]",
  rejected: "bg-neutral-500",
};

// Colored accent stripe (inline-start) per stage — applied to cards.
export const pipelineBorder: Record<PipelineStage, string> = {
  wishlist: "border-s-black dark:border-s-white",
  applied: "border-s-[#0055DA]",
  interviewing: "border-s-[#FFD400]",
  offer: "border-s-[#FF0052]",
  accepted: "border-s-[#00C68D]",
  rejected: "border-s-neutral-500",
};

// Rotating accent stripes for generic cards / stat tiles.
export const accentBorders = [
  "border-s-[#0055DA]",
  "border-s-[#00C68D]",
  "border-s-[#FF0052]",
  "border-s-[#FFD400]",
];
export const accentText = ["text-[#0055DA]", "text-[#00C68D]", "text-[#FF0052]", "text-[#c79a00]"];
export function accentByIndex(i: number) {
  return accentBorders[i % accentBorders.length];
}

export const jobStatusLabel: Record<JobStatus, string> = {
  active: "פעילה",
  closed: "סגורה",
  offered: "התקבלה הצעה",
};

export const jobStatusBadge: Record<JobStatus, string> = {
  active: "bg-[#0055DA] text-white",
  closed: "bg-black text-white dark:bg-white dark:text-black",
  offered: "bg-[#00C68D] text-white",
};

export const stageStatusLabel: Record<StageStatus, string> = {
  pending: "ממתין",
  completed: "הושלם",
  failed: "נכשל",
};

export const stageStatusBadge: Record<StageStatus, string> = {
  pending: "bg-[#FFD400] text-black",
  completed: "bg-[#00C68D] text-white",
  failed: "bg-[#FF0052] text-white",
};

// Card frame + dot per stage status (green = done, red = failed, yellow = pending).
export const stageStatusBorder: Record<StageStatus, string> = {
  pending: "border-s-[#FFD400]",
  completed: "border-s-[#00C68D]",
  failed: "border-s-[#FF0052]",
};
export const stageStatusDot: Record<StageStatus, string> = {
  pending: "bg-[#FFD400]",
  completed: "bg-[#00C68D]",
  failed: "bg-[#FF0052]",
};

// Common stage names offered as suggestions (still free-text — user can type any).
export const stagePresets = [
  "שליחת קורות חיים",
  "שיחת HR",
  "ראיון טלפוני",
  "ראיון טכני",
  "מבחן בית",
  "מבחן טכני",
  "ראיון עם מנהל",
  "ראיון צוות",
  "ראיון סופי",
  "מטלת עיצוב",
  "משא ומתן על שכר",
  "קבלת הצעה",
  "דחייה",
];

export const jobLocationLabel: Record<string, string> = {
  remote: "מרחוק",
  hybrid: "היברידי",
  onsite: "במשרד",
};

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
}
