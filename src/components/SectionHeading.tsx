type Props = {
  id: string;
  command: string;
  label: string;
};

// Renders a section title as a shell prompt, e.g. "$ ls projects/". Screen readers
// get the plain label instead of the command.
export function SectionHeading({ id, command, label }: Props) {
  return (
    <h2 id={id} className="mb-8 font-mono text-lg sm:text-xl">
      <span aria-hidden="true">
        <span className="text-accent">$</span> {command}
      </span>
      <span className="sr-only">{label}</span>
    </h2>
  );
}
