import { cn } from "@/lib/utils";

interface PaperPageProps {
  children: React.ReactNode;
  className?: string;
  /** Adds the subtle ruled-line grid texture */
  lined?: boolean;
}

/**
 * PaperPage — a wrapper that looks like a sheet of cream paper.
 * Use as the main content surface for forms, auth pages, and hero sections.
 */
export function PaperPage({ children, className, lined = false }: PaperPageProps) {
  return (
    <div
      className={cn(
        "paper-card rounded-xl px-6 py-8 md:px-10 md:py-10",
        lined && "paper-card",
        className
      )}
    >
      {children}
    </div>
  );
}
