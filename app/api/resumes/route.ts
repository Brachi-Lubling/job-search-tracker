import { handle } from "@/server/http";
import { createResumeSchema } from "@/domain/schemas";
import { resumeService } from "@/server/services/resume.service";

export async function POST(req: Request) {
  return handle(async () => {
    const body = createResumeSchema.parse(await req.json());
    return resumeService.create(body);
  }, 201);
}

export async function GET() {
  return handle(() => resumeService.list());
}
