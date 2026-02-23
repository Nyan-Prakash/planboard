"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlistAction } from "@/app/actions/waitlist";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("email", email);

    startTransition(async () => {
      const result = await joinWaitlistAction(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.success) {
        setSuccess(true);
        setEmail("");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@school.edu"
          className="h-12 border-[var(--desk-border)] bg-[var(--desk-paper)]"
        />
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="shimmer-btn w-full sm:w-auto px-6 py-5 bg-desk-teal text-white hover:opacity-90 shadow-md"
        >
          {isPending ? "Joining..." : "Join waitlist"}
        </Button>
      </div>
      {error ? (
        <p className="text-xs" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-xs" style={{ color: "var(--desk-teal)" }}>
          You are in. We will email you when early access opens.
        </p>
      ) : null}
    </form>
  );
}
