import { handle } from "@/server/http";
import { createCompanySchema } from "@/domain/schemas";
import { companyService } from "@/server/services/company.service";

export async function POST(req: Request) {
  return handle(async () => {
    const body = createCompanySchema.parse(await req.json());
    return companyService.create(body);
  }, 201);
}

export async function GET() {
  return handle(() => companyService.list());
}
