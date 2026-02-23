"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaperPage } from "@/components/ui-desk";

export default function OrgCreatePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [seatLimit, setSeatLimit] = useState("10");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim().length >= 2 && !isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/orgs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            seatLimit: parseInt(seatLimit, 10) || 10,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Something went wrong.");
          return;
        }
        router.push("/org/admin");
        router.refresh();
      } catch {
        setError("Network error. Please try again.");
      }
    });
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 min-h-[80vh]">
      <PaperPage className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--desk-teal)" }}
          >
            School Account
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
          >
            Create your organization
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--desk-muted)" }}>
            Set up a school account to manage teachers and seat licences.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="rounded-lg border px-4 py-3 text-sm"
              style={{
                background: "#fef2f2",
                borderColor: "#fca5a5",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          {/* Org Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold"
              style={{ color: "var(--desk-ink)" }}
            >
              Organization name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g. Riverside Elementary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
              minLength={2}
              maxLength={100}
              className="border-[var(--desk-border)] focus-visible:ring-[var(--desk-teal)]"
            />
            <p className="text-xs" style={{ color: "var(--desk-muted)" }}>
              This is the name teachers will see when they join.
            </p>
          </div>

          {/* Seat Limit */}
          <div className="space-y-2">
            <Label
              htmlFor="seatLimit"
              className="text-sm font-semibold"
              style={{ color: "var(--desk-ink)" }}
            >
              Seat limit
            </Label>
            <Input
              id="seatLimit"
              type="number"
              min={1}
              max={10000}
              value={seatLimit}
              onChange={(e) => setSeatLimit(e.target.value)}
              disabled={isPending}
              className="border-[var(--desk-border)] focus-visible:ring-[var(--desk-teal)] w-32"
            />
            <p className="text-xs" style={{ color: "var(--desk-muted)" }}>
              Maximum number of teachers (including admins). Defaults to 10.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit}
              style={{
                background: canSubmit ? "var(--desk-teal)" : undefined,
                color: canSubmit ? "white" : undefined,
              }}
              className="px-10 min-w-40"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating…
                </span>
              ) : (
                "Create organization"
              )}
            </Button>
          </div>
        </form>
      </PaperPage>
    </div>
  );
}
