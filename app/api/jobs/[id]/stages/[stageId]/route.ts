import { handle } from "@/server/http";
import { updateStageSchema } from "@/domain/schemas";
import { stageService } from "@/server/services/stage.service";

type Ctx = { params: Promise<{ id: string; stageId: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const { id, stageId } = await params;
  return handle(async () => {
    const body = updateStageSchema.parse(await req.json());
    return stageService.update(id, stageId, body);
  });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id, stageId } = await params;
  return handle(() => stageService.remove(id, stageId));
}
