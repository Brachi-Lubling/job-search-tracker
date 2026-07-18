import { handle } from "@/server/http";
import { statsService } from "@/server/services/stats.service";

export async function GET() {
  return handle(() => statsService.getSummary());
}
