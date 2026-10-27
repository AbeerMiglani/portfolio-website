import { jsonResponse, projectsJson } from "@/lib/api";

export const dynamic = "force-static";

export function GET() {
  return jsonResponse(projectsJson());
}
