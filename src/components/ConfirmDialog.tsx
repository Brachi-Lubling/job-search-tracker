"use client";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "מחק",
  cancelLabel = "ביטול",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl card p-5 shadow-xl"
      >
        <h3 className="font-semibold heading">{title}</h3>
        <p className="mt-2 text-sm muted">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-ghost">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
