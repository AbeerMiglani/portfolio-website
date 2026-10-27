import { apiIndex, jsonResponse } from "@/lib/api";

// The JSON API's index. Static, like the rest of the site.
export const dynamic = "force-static";

export function GET() {
  return jsonResponse(apiIndex());
}
