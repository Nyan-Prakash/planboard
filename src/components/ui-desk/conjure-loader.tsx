"use client";

import { cn } from "@/lib/utils";

interface ConjureLoaderProps {
  className?: string;
  label?: string;
  sublabel?: string;
}

/**
 * ConjureLoader — generation loading state with bouncing dots
 * and a tiny sparkle icon. Subtle 1.2s animation.
 */
export function ConjureLoader({
  className,
  label = "Conjuring activities…",
  sublabel = "This usually takes 10–20 seconds",
}: ConjureLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6 py-20", className)}>
      {/* Sparkle icon */}
      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
          className="text-[var(--desk-teal)]"
        >
          <path
            d="M20 4 L22 16 L34 14 L24 22 L28 34 L20 26 L12 34 L16 22 L6 14 L18 16 Z"
            fill="currentColor"
            opacity="0.9"
          />
          <circle cx="32" cy="8" r="2.5" fill="var(--desk-accent)" />
          <circle cx="8" cy="30" r="1.5" fill="var(--desk-rose)" />
        </svg>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-2" role="status" aria-label={label}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "conjure-dot h-3 w-3 rounded-full bg-[var(--desk-teal)]",
            )}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="text-center">
        <p className="font-display text-lg font-semibold text-[var(--desk-ink)]">
          {label}
        </p>
        {sublabel && (
          <p className="mt-1 text-sm text-[var(--desk-muted)]">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
