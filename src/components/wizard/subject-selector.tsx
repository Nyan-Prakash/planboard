"use client";

import { SUBJECTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SubjectSelectorProps {
  value: string | null;
  onChange: (subject: string) => void;
}

export function SubjectSelector({ value, onChange }: SubjectSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {SUBJECTS.map((subject) => (
        <button
          key={subject.value}
          onClick={() => onChange(subject.value)}
          aria-pressed={value === subject.value}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-lg border-2 p-4 text-center transition-all duration-150 hover:-translate-y-0.5",
            "bg-[var(--desk-paper)]",
            value === subject.value
              ? "border-[var(--desk-teal)] shadow-sm"
              : "border-[var(--desk-border)] hover:border-[var(--desk-teal)]/40"
          )}
          style={
            value === subject.value
              ? { background: "color-mix(in srgb, var(--desk-teal) 6%, var(--desk-paper))" }
              : undefined
          }
        >
          <span className="text-2xl">{subject.icon}</span>
          <span
            className="text-xs font-semibold"
            style={{
              color: value === subject.value ? "var(--desk-teal)" : "var(--desk-ink)",
            }}
          >
            {subject.label}
          </span>
        </button>
      ))}
    </div>
  );
}

