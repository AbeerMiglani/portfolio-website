import { resumeText } from "@/lib/plaintext";

// Plain-text résumé, readable in a browser.
export const dynamic = "force-static";

export function GET() {
  return new Response(resumeText({ color: false }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
