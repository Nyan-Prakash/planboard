import Link from "next/link";
import { cn } from "@/lib/utils";

interface DeskEmptyStateProps {
  icon?: "binder" | "pencil" | "star" | "book";
  heading: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

/** Inline SVG shapes — no external assets */
const icons = {
  binder: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="8" y="6" width="40" height="52" rx="4" fill="#e8e0d0" stroke="#d6cdb8" strokeWidth="1.5"/>
      <rect x="12" y="10" width="32" height="44" rx="2" fill="#fdfaf4"/>
      <rect x="12" y="10" width="32" height="6" rx="2" fill="#2a9d8f" opacity="0.7"/>
      <line x1="16" y1="22" x2="40" y2="22" stroke="#d6cdb8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="28" x2="40" y2="28" stroke="#d6cdb8" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="34" x2="32" y2="34" stroke="#d6cdb8" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="44" y="18" width="8" height="28" rx="4" fill="#d6cdb8" stroke="#c4b89a" strokeWidth="1"/>
      <circle cx="48" cy="24" r="2" fill="#a09080"/>
      <circle cx="48" cy="32" r="2" fill="#a09080"/>
      <circle cx="48" cy="40" r="2" fill="#a09080"/>
    </svg>
  ),
  pencil: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="28" y="8" width="10" height="40" rx="2" fill="#f5c842" stroke="#c9a820" strokeWidth="1.5" transform="rotate(15 32 32)"/>
      <polygon points="30,48 34,48 32,56" fill="#f5c842" stroke="#c9a820" strokeWidth="1" transform="rotate(15 32 32)"/>
      <rect x="28" y="8" width="10" height="8" rx="2" fill="#e76f51" transform="rotate(15 32 32)"/>
      <rect x="29" y="14" width="8" height="4" fill="#d4d4d4" transform="rotate(15 32 32)"/>
    </svg>
  ),
  star: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <polygon points="32,8 38,24 56,24 42,34 48,52 32,42 16,52 22,34 8,24 26,24" fill="#f5c842" stroke="#c9a820" strokeWidth="1.5"/>
    </svg>
  ),
  book: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="10" y="10" width="20" height="44" rx="2" fill="#2a9d8f" opacity="0.8"/>
      <rect x="30" y="10" width="22" height="44" rx="2" fill="#fdfaf4" stroke="#d6cdb8" strokeWidth="1.5"/>
      <line x1="34" y1="20" x2="48" y2="20" stroke="#d6cdb8" strokeWidth="1.5"/>
      <line x1="34" y1="26" x2="48" y2="26" stroke="#d6cdb8" strokeWidth="1.5"/>
      <line x1="34" y1="32" x2="44" y2="32" stroke="#d6cdb8" strokeWidth="1.5"/>
      <path d="M10 10 Q30 8 30 10 L30 54 Q10 54 10 54 Z" fill="#2a9d8f"/>
    </svg>
  ),
};

/**
 * DeskEmptyState — a friendly empty state with CSS/SVG illustration,
 * heading, body text, and optional CTA.
 */
export function DeskEmptyState({
  icon = "binder",
  heading,
  body,
  actionLabel,
  actionHref,
  onAction,
  className,
}: DeskEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-5 py-16 text-center", className)}>
      <div className="opacity-80">{icons[icon]}</div>
      <div className="space-y-2 max-w-sm">
        <p className="font-display text-xl font-semibold text-[var(--desk-ink)]">{heading}</p>
        <p className="text-sm text-[var(--desk-muted)] leading-relaxed">{body}</p>
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[var(--desk-teal)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[var(--desk-teal)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
