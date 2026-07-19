import Link from "next/link";
import type { PipelineStage } from "@/domain/types";
import { pipelineOrder, pipelineLabel, pipelineDot } from "@/lib/ui";

// Bar length encodes the count per pipeline stage; bar color = the stage's
// four-color accent (stage names are direct labels, so identity is not color-alone).
export function PipelineFunnel({ byPipeline }: { byPipeline: Record<PipelineStage, number> }) {
  const max = Math.max(1, ...pipelineOrder.map((s) => byPipeline[s]));

  return (
    <div className="card border-s-[#0055DA] p-5">
      <h2 className="text-sm font-semibold heading">מפת הצינור (Pipeline)</h2>
      <p className="mb-4 text-xs muted">מספר המשרות בכל שלב בצינור</p>
      <div className="space-y-2.5">
        {pipelineOrder.map((stage) => {
          const count = byPipeline[stage];
          const pct = Math.round((count / max) * 100);
          return (
            <Link
              key={stage}
              href={`/jobs?pipeline=${stage}`}
              className="group grid grid-cols-[7rem_1fr_2rem] items-center gap-3"
            >
              <span className="text-xs muted group-hover:heading">{pipelineLabel[stage]}</span>
              <span className="h-5 overflow-hidden rounded bg-black/[0.05] dark:bg-white/[0.08]">
                <span
                  className={`block h-5 rounded transition-all ${pipelineDot[stage]}`}
                  style={{ width: `${count === 0 ? 0 : Math.max(pct, 6)}%` }}
                />
              </span>
              <span className="text-sm font-semibold tabular-nums heading">{count}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
