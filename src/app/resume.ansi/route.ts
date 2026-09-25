import { resumeText } from "@/lib/plaintext";

// Coloured version for terminals. `curl`, `wget` and HTTPie requests for `/`
// are rewritten here in next.config.ts; browsers never see it.
export const dynamic = "force-static";

export function GET() {
  return new Response(resumeText({ color: true }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
