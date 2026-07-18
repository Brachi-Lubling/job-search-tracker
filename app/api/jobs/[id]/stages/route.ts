import { handle } from "@/server/http";
import { createStageSchema } from "@/domain/schemas";
import { stageService } from "@/server/services/stage.service";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(async () => {
    const body = createStageSchema.parse(await req.json());
    return stageService.append(id, body);
  }, 201);
}
