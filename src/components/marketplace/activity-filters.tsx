"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { GRADE_LEVELS, SUBJECTS } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "highest_rated", label: "Highest Rated" },
  { value: "most_rated", label: "Most Rated" },
];

export function ActivityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentGrade = searchParams.get("grade") || "";
  const currentSubject = searchParams.get("subject") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("q") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/marketplace?${params.toString()}`);
  }

  function handleSearchChange(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilter("q", value.trim());
    }, 350);
  }

  function clearFilters() {
    router.push("/marketplace");
  }

  const hasFilters = currentGrade || currentSubject || currentSearch;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
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
            placeholder="Search activities..."
            defaultValue={currentSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                updateFilter("q", (e.target as HTMLInputElement).value.trim());
              }
            }}
            className="rounded-md border border-gray-300 bg-white pl-8 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none w-56"
          />
        </div>

        {/* Grade Level Filter */}
        <select
          value={currentGrade}
          onChange={(e) => updateFilter("grade", e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Grade Levels</option>
          {GRADE_LEVELS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.icon} {g.label}
            </option>
          ))}
        </select>

        {/* Subject Filter */}
        <select
          value={currentSubject}
          onChange={(e) => updateFilter("subject", e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.icon} {s.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
