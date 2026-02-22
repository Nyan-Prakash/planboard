"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaperPage } from "@/components/ui-desk";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      const redirectTo = searchParams.get("redirectTo") || "/wizard/step-1";
      router.push(redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16 min-h-[80vh]">
      <PaperPage className="w-full max-w-md">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white text-xl select-none"
            style={{ background: "var(--desk-teal)" }}
          >
            ✦
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
          >
            Welcome back
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--desk-muted)" }}>
            Let&apos;s plan something great today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className="rounded-lg border px-4 py-3 text-sm"
              style={{
                background: "#fef2f2",
                borderColor: "#fca5a5",
                color: "#b91c1c",
              }}
            >
              <strong>Heads up: </strong>{error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-sm font-semibold"
              style={{ color: "var(--desk-ink)" }}
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.edu"
              required
              className="border-[var(--desk-border)] bg-[var(--desk-bg)] focus:border-[var(--desk-teal)] focus:ring-[var(--desk-teal)]"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-sm font-semibold"
              style={{ color: "var(--desk-ink)" }}
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border-[var(--desk-border)] bg-[var(--desk-bg)] focus:border-[var(--desk-teal)]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--desk-teal)] text-white hover:opacity-90 py-5 text-base"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--desk-muted)" }}>
          New here?{" "}
          <Link
            href="/register"
            className="font-semibold underline-offset-2 hover:underline"
            style={{ color: "var(--desk-teal)" }}
          >
            Create an account
          </Link>
        </p>
      </PaperPage>
    </div>
  );
}

