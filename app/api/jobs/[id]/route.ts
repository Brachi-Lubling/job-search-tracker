import { handle } from "@/server/http";
import { updateJobSchema } from "@/domain/schemas";
import { jobService } from "@/server/services/job.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(() => jobService.getById(id));
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(async () => {
    const body = updateJobSchema.parse(await req.json());
    return jobService.update(id, body);
  });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(() => jobService.remove(id));
}
