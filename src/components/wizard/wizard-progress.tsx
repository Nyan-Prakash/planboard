"use client";

import { cn } from "@/lib/utils";

const steps = [
  {
    number: 1,
    label: "Grade & Subject",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
      </svg>
    ),
  },
  {
    number: 2,
    label: "Lesson Context",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    number: 3,
    label: "Activities",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
      </svg>
    ),
  },
];

export function WizardProgress({ currentStep }: { currentStep: number }) {
  return (
    <nav
      aria-label="Wizard progress"
      className="flex items-center justify-center gap-0 py-6 mb-2"
    >
      {steps.map((step, i) => {
        const isComplete = currentStep > step.number;
        const isActive = currentStep === step.number;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step dot */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
                  isComplete
                    ? "bg-[var(--desk-teal)] text-white shadow-sm"
                    : isActive
                    ? "bg-[var(--desk-teal)] text-white shadow-md ring-4 ring-[var(--desk-teal)]/20"
                    : "bg-[var(--desk-border)] text-[var(--desk-muted)]"
                )}
              >
                {isComplete ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold hidden sm:inline tracking-wide",
                  isActive ? "text-[var(--desk-ink)]" : "text-[var(--desk-muted)]"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-12 sm:w-20 mx-2 rounded-full transition-colors duration-200",
                  currentStep > step.number
                    ? "bg-[var(--desk-teal)]"
                    : "bg-[var(--desk-border)]"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

