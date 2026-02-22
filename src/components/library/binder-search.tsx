"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export function BinderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSearch = searchParams.get("q") || "";

  function updateSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value.trim()) {
      params.delete("q");
    } else {
      params.set("q", value.trim());
    }
    router.push(`/library?${params.toString()}`);
  }

  function handleChange(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateSearch(value), 350);
  }

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4"
        style={{ color: "var(--desk-muted)" }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search your binder..."
        defaultValue={currentSearch}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            updateSearch((e.target as HTMLInputElement).value);
          }
        }}
        className="rounded-xl border pl-8 pr-3 py-2 text-sm focus:outline-none w-60 transition-colors"
        style={{
          background: "var(--desk-paper)",
          borderColor: "var(--desk-border)",
          color: "var(--desk-ink)",
        }}
      />
    </div>
  );
}
