import { handle } from "@/server/http";
import { createJobSchema, jobFiltersSchema } from "@/domain/schemas";
import { jobService } from "@/server/services/job.service";

export async function POST(req: Request) {
  return handle(async () => {
    const body = createJobSchema.parse(await req.json());
    return jobService.create(body);
  }, 201);
}

export async function GET(req: Request) {
  return handle(() => {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const filters = jobFiltersSchema.parse(params);
    return jobService.list(filters);
  });
}
