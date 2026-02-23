"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AnimatedCounter — displays a value with a pop-in animation
 * when it enters the viewport.
 */
export function AnimatedCounter({ value, className, style }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={visible ? `count-animate ${className ?? ""}` : `opacity-0 ${className ?? ""}`} style={style}>
      {value}
    </span>
  );
}
