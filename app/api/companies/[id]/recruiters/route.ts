import { handle } from "@/server/http";
import { createRecruiterSchema } from "@/domain/schemas";
import { recruiterService } from "@/server/services/recruiter.service";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(async () => {
    const body = createRecruiterSchema.parse(await req.json());
    return recruiterService.create(id, body);
  }, 201);
}
