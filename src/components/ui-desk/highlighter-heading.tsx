import { cn } from "@/lib/utils";

interface HighlighterHeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}

/**
 * HighlighterHeading — a heading with a subtle highlighter-yellow stroke
 * behind the text, produced via the `.highlight-text` CSS pseudo-element.
 */
export function HighlighterHeading({
  children,
  as: Tag = "h2",
  className,
}: HighlighterHeadingProps) {
  return (
    <Tag className={cn("relative inline-block", className)}>
      <span className="highlight-text">{children}</span>
    </Tag>
  );
}
