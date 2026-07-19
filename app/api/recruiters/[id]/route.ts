import { handle } from "@/server/http";
import { updateRecruiterSchema } from "@/domain/schemas";
import { recruiterService } from "@/server/services/recruiter.service";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(async () => {
    const body = updateRecruiterSchema.parse(await req.json());
    return recruiterService.update(id, body);
  });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(() => recruiterService.remove(id));
}
