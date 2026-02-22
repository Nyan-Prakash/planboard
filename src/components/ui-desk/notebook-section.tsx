import { cn } from "@/lib/utils";

interface NotebookSectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  color?: "teal" | "rose" | "sage" | "accent";
}

const colorMap = {
  teal: { bar: "border-l-[var(--desk-teal)]", tab: "bg-[var(--desk-teal)]" },
  rose: { bar: "border-l-[var(--desk-rose)]", tab: "bg-[var(--desk-rose)]" },
  sage: { bar: "border-l-[var(--desk-sage)]", tab: "bg-[var(--desk-sage)]" },
  accent: { bar: "border-l-[var(--desk-accent)]", tab: "bg-[var(--desk-accent)] !text-[var(--desk-ink)]" },
};

/**
 * NotebookSection — a bordered section with a coloured tab label,
 * like a tabbed notebook divider.
 */
export function NotebookSection({
  label,
  children,
  className,
  color = "teal",
}: NotebookSectionProps) {
  const { bar, tab } = colorMap[color];

  return (
    <div className={cn("notebook-section", bar, className)}>
      <span className={cn("notebook-tab text-white", tab)}>{label}</span>
      {children}
    </div>
  );
}
