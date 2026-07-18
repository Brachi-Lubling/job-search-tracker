import { handle } from "@/server/http";
import { updateResumeSchema } from "@/domain/schemas";
import { resumeService } from "@/server/services/resume.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(() => resumeService.getById(id));
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(async () => {
    const body = updateResumeSchema.parse(await req.json());
    return resumeService.update(id, body);
  });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(() => resumeService.remove(id));
}
