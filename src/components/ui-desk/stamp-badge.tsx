import { cn } from "@/lib/utils";

interface StampBadgeProps {
  children: React.ReactNode;
  color?: "teal" | "rose" | "sage" | "accent" | "ink";
  icon?: React.ReactNode;
  className?: string;
  animateIn?: boolean;
}

const colorMap: Record<string, string> = {
  teal:   "text-[var(--desk-teal)]   border-[var(--desk-teal)]   bg-[var(--desk-teal)]/8",
  rose:   "text-[var(--desk-rose)]   border-[var(--desk-rose)]   bg-[var(--desk-rose)]/8",
  sage:   "text-[var(--desk-sage)]   border-[var(--desk-sage)]   bg-[var(--desk-sage)]/8",
  accent: "text-[var(--desk-ink)]    border-[var(--desk-accent)] bg-[var(--desk-accent)]/50",
  ink:    "text-[var(--desk-muted)]  border-[var(--desk-border)] bg-transparent",
};

/**
 * StampBadge — an uppercase, lettered, bordered chip that looks like a rubber stamp.
 * Use for metadata: prep time, grade, subject, group size, etc.
 */
export function StampBadge({
  children,
  color = "ink",
  icon,
  className,
  animateIn = false,
}: StampBadgeProps) {
  return (
    <span
      className={cn(
        "stamp-badge",
        colorMap[color],
        animateIn && "stamp-animate",
        className
      )}
    >
      {icon && <span className="text-[0.8em] opacity-80">{icon}</span>}
      {children}
    </span>
  );
}
