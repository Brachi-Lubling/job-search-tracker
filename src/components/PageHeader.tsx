// Pick black/white text for readability over the given accent background.
function readableFg(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

export function PageHeader({
  title,
  subtitle,
  action,
  accent = "#0055DA",
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  accent?: string;
}) {
  const fg = readableFg(accent);
  return (
    <header className="mb-8 pt-2">
      {/* Title as a bookmark tab inserted at the top, filled with the page's primary color. */}
      <div
        className="inline-flex rounded-b-xl px-5 py-3 shadow-md"
        style={{ backgroundColor: accent, color: fg }}
      >
        <h1 className="border-b-2 border-white pb-0.5 text-2xl font-black tracking-tight">
          {title}
        </h1>
      </div>
      {(subtitle || action) && (
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          {subtitle && <p className="text-sm muted">{subtitle}</p>}
          {action}
        </div>
      )}
    </header>
  );
}
