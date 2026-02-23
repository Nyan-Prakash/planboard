"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Use "stagger" to animate children one-by-one, "scale" for scale-in */
  variant?: "default" | "stagger" | "scale";
  /** IntersectionObserver threshold (0-1) */
  threshold?: number;
}

/**
 * Reveal — wraps content in a scroll-triggered animation.
 * Uses IntersectionObserver to add the `.revealed` class when in view.
 */
export function Reveal({
  children,
  className,
  variant = "default",
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const base =
    variant === "stagger"
      ? "reveal-stagger"
      : variant === "scale"
        ? "reveal-scale"
        : "reveal";

  return (
    <div ref={ref} className={cn(base, className)}>
      {children}
    </div>
  );
}
