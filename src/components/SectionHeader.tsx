import type { ReactNode } from "react";

type Props = {
  id: string;
  /** Shell command shown above the title, e.g. "ls ~/projects". */
  command: string;
  children: ReactNode;
  action?: ReactNode;
};

// Every section opens with the command that would "print" it, then a plain title.
export function SectionHeader({ id, command, children, action }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-divider pb-4">
      <div>
        <p className="font-mono text-sm text-muted" aria-hidden="true">
          <span className="text-accent">$</span> {command}
        </p>
        <h2 id={id} className="mt-2 text-3xl font-semibold tracking-tight text-fg">
          {children}
        </h2>
      </div>
      {action}
    </div>
  );
}
