import { handle } from "@/server/http";
import { submitAnalysisSchema } from "@/domain/schemas";
import { analysisService } from "@/server/services/analysis.service";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(async () => {
    const body = submitAnalysisSchema.parse(await req.json());
    return analysisService.submit(id, body);
  });
}
