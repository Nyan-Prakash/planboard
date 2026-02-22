"use client";

import { GRADE_LEVELS, type GradeLevel } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface GradeSelectorProps {
  value: GradeLevel | null;
  onChange: (grade: GradeLevel) => void;
}

export function GradeSelector({ value, onChange }: GradeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {GRADE_LEVELS.map((grade) => (
        <button
          key={grade.value}
          onClick={() => onChange(grade.value)}
          aria-pressed={value === grade.value}
          className={cn(
            "group flex flex-col items-center gap-2 rounded-xl border-2 p-6 text-center transition-all duration-150 hover:-translate-y-0.5",
            "bg-[var(--desk-paper)]",
            value === grade.value
              ? "border-[var(--desk-teal)] shadow-md shadow-[var(--desk-teal)]/10"
              : "border-[var(--desk-border)] hover:border-[var(--desk-teal)]/40 hover:shadow-sm"
          )}
          style={
            value === grade.value
              ? { background: "color-mix(in srgb, var(--desk-teal) 6%, var(--desk-paper))" }
              : undefined
          }
        >
          <span className="text-4xl">{grade.icon}</span>
          <span
            className="text-base font-bold"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: value === grade.value ? "var(--desk-teal)" : "var(--desk-ink)",
            }}
          >
            {grade.label}
          </span>
          <span className="text-xs" style={{ color: "var(--desk-muted)" }}>
            {grade.description}
          </span>
          {value === grade.value && (
            <span
              className="stamp-badge stamp-animate"
              style={{
                color: "var(--desk-teal)",
                borderColor: "var(--desk-teal)",
                background: "color-mix(in srgb, var(--desk-teal) 10%, transparent)",
                fontSize: "0.625rem",
              }}
            >
              Selected
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

