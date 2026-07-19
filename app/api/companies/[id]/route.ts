import { handle } from "@/server/http";
import { updateCompanySchema } from "@/domain/schemas";
import { companyService } from "@/server/services/company.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(() => companyService.getById(id));
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(async () => {
    const body = updateCompanySchema.parse(await req.json());
    return companyService.update(id, body);
  });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  return handle(() => companyService.remove(id));
}
