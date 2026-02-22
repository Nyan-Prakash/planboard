import { cn } from "@/lib/utils";

interface StickyCardProps {
  children: React.ReactNode;
  className?: string;
  /** Strip color at top of the card */
  color?: "yellow" | "teal" | "rose" | "sage";
}

const stripMap: Record<string, string> = {
  yellow: "before:!bg-[var(--desk-accent)]",
  teal:   "before:!bg-[var(--desk-teal)]",
  rose:   "before:!bg-[var(--desk-rose)]",
  sage:   "before:!bg-[var(--desk-sage)]",
};

/**
 * StickyCard — a card that looks like a sticky note.
 * Has a coloured strip at the top and a slight shadow offset.
 */
export function StickyCard({ children, className, color = "yellow" }: StickyCardProps) {
  return (
    <div className={cn("sticky-card p-5", stripMap[color], className)}>
      {children}
    </div>
  );
}
