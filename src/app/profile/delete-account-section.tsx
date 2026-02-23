"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteAccountAction } from "./actions";

export function DeleteAccountSection() {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canDelete = confirmation === "DELETE" && !isPending;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("confirmation", confirmation);

    startTransition(async () => {
      const result = await deleteAccountAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div
      className="mt-8 pt-6 border-t"
      style={{ borderColor: "var(--desk-border)" }}
    >
      <h2 className="text-base font-semibold mb-1" style={{ color: "var(--desk-ink)" }}>
        Delete account
      </h2>
      <p className="text-sm mb-4" style={{ color: "var(--desk-muted)" }}>
        This permanently removes your profile and activity data. Type DELETE to confirm.
      </p>

      {error && (
        <div
          className="mb-4 rounded-lg border px-4 py-3 text-sm"
          style={{ background: "#fef2f2", borderColor: "#fca5a5", color: "#b91c1c" }}
        >
          <strong>Error: </strong>{error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="Type DELETE"
          className="w-full rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: "var(--desk-border)", background: "var(--desk-bg)" }}
        />
        <Button
          type="submit"
          disabled={!canDelete}
          className="bg-[var(--desk-rose)] text-white hover:opacity-90"
        >
          {isPending ? "Deleting account..." : "Delete my account"}
        </Button>
      </form>
    </div>
  );
}
