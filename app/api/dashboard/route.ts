import { handle } from "@/server/http";
import { dashboardService } from "@/server/services/dashboard.service";

export async function GET() {
  return handle(() => dashboardService.getActive());
}
