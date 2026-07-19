export function StatTile({
  label,
  value,
  hint,
  accent = "heading",
  border = "border-s-[#0055DA]",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
  border?: string;
}) {
  return (
    <div className={`card p-4 ${border}`}>
      <p className="text-xs font-medium muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
      {hint && <p className="mt-0.5 text-xs muted">{hint}</p>}
    </div>
  );
}
