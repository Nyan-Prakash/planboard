"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { GRADE_LEVELS, SUBJECTS, ACTIVITY_TYPES, CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "a-z", label: "A → Z" },
  { value: "z-a", label: "Z → A" },
];

const FILTER_COLORS = {
  grade: {
    pill: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    pillExpanded: "bg-violet-600 text-white border-violet-600",
    option: "hover:border-violet-300 hover:text-violet-600",
    optionSelected: "bg-violet-600 text-white border-violet-600",
    active: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    row: "bg-violet-50/50 border-violet-100",
  },
  subject: {
    pill: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
    pillExpanded: "bg-sky-600 text-white border-sky-600",
    option: "hover:border-sky-300 hover:text-sky-600",
    optionSelected: "bg-sky-600 text-white border-sky-600",
    active: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
    row: "bg-sky-50/50 border-sky-100",
  },
  type: {
    pill: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    pillExpanded: "bg-amber-600 text-white border-amber-600",
    option: "hover:border-amber-300 hover:text-amber-600",
    optionSelected: "bg-amber-600 text-white border-amber-600",
    active: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    row: "bg-amber-50/50 border-amber-100",
  },
  category: {
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    pillExpanded: "bg-emerald-600 text-white border-emerald-600",
    option: "hover:border-emerald-300 hover:text-emerald-600",
    optionSelected: "bg-emerald-600 text-white border-emerald-600",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    row: "bg-emerald-50/50 border-emerald-100",
  },
} as const;

type FilterKey = keyof typeof FILTER_COLORS;

export function BinderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expandedSection, setExpandedSection] = useState<FilterKey | null>(null);

  const currentGrade = searchParams.get("grade") || "";
  const currentSubject = searchParams.get("subject") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("q") || "";
  const currentType = searchParams.get("type") || "";
  const currentCategory = searchParams.get("category") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/library?${params.toString()}`);
  }

  function selectFilter(key: string, value: string) {
    const current = searchParams.get(key) || "";
    updateFilter(key, current === value ? "" : value);
    setExpandedSection(null);
  }

  function handleSearchChange(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilter("q", value.trim());
    }, 350);
  }

  function clearFilters() {
    router.push("/library");
  }

  const hasFilters = currentGrade || currentSubject || currentSearch || currentType || currentCategory;

  const activeFilters: { key: FilterKey; paramKey: string; label: string }[] = [];
  if (currentGrade) {
    const g = GRADE_LEVELS.find((g) => g.value === currentGrade);
    activeFilters.push({ key: "grade", paramKey: "grade", label: g?.label || currentGrade });
  }
  if (currentSubject) {
    const s = SUBJECTS.find((s) => s.value === currentSubject);
    activeFilters.push({ key: "subject", paramKey: "subject", label: s?.label || currentSubject });
  }
  if (currentType) {
    const t = ACTIVITY_TYPES.find((t) => t.value === currentType);
    activeFilters.push({ key: "type", paramKey: "type", label: t?.label || currentType });
  }
  if (currentCategory) {
    const c = CATEGORIES.find((c) => c.value === currentCategory);
    activeFilters.push({ key: "category", paramKey: "category", label: c?.label || currentCategory });
  }

  const filterSections: {
    key: FilterKey;
    label: string;
    paramKey: string;
    currentValue: string;
    options: readonly { value: string; label: string }[];
  }[] = [
    { key: "grade", label: "Grade Level", paramKey: "grade", currentValue: currentGrade, options: GRADE_LEVELS },
    { key: "subject", label: "Subject", paramKey: "subject", currentValue: currentSubject, options: SUBJECTS },
    { key: "type", label: "Activity Type", paramKey: "type", currentValue: currentType, options: ACTIVITY_TYPES },
    { key: "category", label: "Category", paramKey: "category", currentValue: currentCategory, options: CATEGORIES },
  ];

  return (
    <div className="space-y-3">
      {/* Search bar and sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--desk-muted)" }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            placeholder="Search your binder..."
            defaultValue={currentSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                updateFilter("q", (e.target as HTMLInputElement).value.trim());
              }
            }}
            className="w-full rounded-xl border pl-9 pr-3 py-2 text-sm focus:outline-none transition-colors"
            style={{
              background: "var(--desk-paper)",
              borderColor: "var(--desk-border)",
              color: "var(--desk-ink)",
            }}
          />
        </div>

        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="rounded-xl border px-3 py-2 text-sm focus:outline-none transition-colors"
          style={{
            background: "var(--desk-paper)",
            borderColor: "var(--desk-border)",
            color: "var(--desk-ink)",
          }}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter toggle pills */}
      <div className="flex flex-wrap items-center gap-2">
        {filterSections.map((section) => {
          const colors = FILTER_COLORS[section.key];
          const isExpanded = expandedSection === section.key;
          const isActive = !!section.currentValue;

          return (
            <button
              key={section.key}
              onClick={() => setExpandedSection(isExpanded ? null : section.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 border shadow-sm",
                isExpanded
                  ? colors.pillExpanded
                  : isActive
                    ? colors.pill
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              {section.label}
              {isActive && !isExpanded && (
                <span className="inline-flex items-center justify-center rounded-full bg-white/30 w-1.5 h-1.5" />
              )}
              <svg
                className={cn("h-3 w-3 transition-transform duration-200", isExpanded && "rotate-180")}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M3 4.5l3 3 3-3" />
              </svg>
            </button>
          );
        })}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="ml-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            style={{ color: "var(--desk-muted)" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expanded filter options */}
      {expandedSection && (
        <div
          className={cn(
            "flex flex-wrap gap-2 rounded-xl border p-3 animate-in fade-in slide-in-from-top-1 duration-200",
            FILTER_COLORS[expandedSection].row
          )}
        >
          {filterSections
            .find((s) => s.key === expandedSection)
            ?.options.map((opt) => {
              const section = filterSections.find((s) => s.key === expandedSection)!;
              const isSelected = section.currentValue === opt.value;
              const colors = FILTER_COLORS[expandedSection];

              return (
                <button
                  key={opt.value}
                  onClick={() => selectFilter(section.paramKey, opt.value)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 border shadow-sm",
                    isSelected
                      ? colors.optionSelected
                      : cn("bg-white text-gray-600 border-gray-200", colors.option)
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
        </div>
      )}

      {/* Active filter pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {activeFilters.map((f) => {
            const colors = FILTER_COLORS[f.key];
            return (
              <button
                key={f.key}
                onClick={() => updateFilter(f.paramKey, "")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 shadow-sm hover:shadow-none",
                  colors.active
                )}
              >
                {f.label}
                <svg className="h-3 w-3 opacity-60" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M3 3l6 6M9 3l-6 6" />
                </svg>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
