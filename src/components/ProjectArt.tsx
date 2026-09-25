import { CascadeDemo } from "./CascadeDemo";
import { FrameDemo } from "./FrameDemo";

// One illustration per project, each drawn from what the project does. Both
// are small interactive demos; they render a complete static picture on the
// server, so they still make sense without JavaScript.
export function ProjectArt({ slug }: { slug: string }) {
  if (slug === "redis") return <FrameDemo />;
  if (slug === "ripple") return <CascadeDemo />;
  return null;
}
