import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  children: ReactNode;
  action?: ReactNode;
};

// Small uppercase label over a large headline, the pattern fanout.sh uses for
// every section. Wrap a word in <Pixel> for the pixel-font accent.
export function SectionHeader({ id, eyebrow, children, action }: Props) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2
          id={id}
          className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-4xl"
        >
          {children}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function Pixel({ children }: { children: ReactNode }) {
  return <span className="font-pixel font-normal tracking-normal">{children}</span>;
}
