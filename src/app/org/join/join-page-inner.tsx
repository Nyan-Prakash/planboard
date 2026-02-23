"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaperPage } from "@/components/ui-desk";
import { useAuth } from "@/components/auth/auth-provider";

type InviteInfo = {
  organization_id: string;
  email: string;
  role: "teacher" | "admin";
  status: string;
  organizations?: { name: string } | { name: string }[];
};

export function JoinPageInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const router = useRouter();
  const { user } = useAuth();

  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Lookup invite by token (public endpoint returns pending invites)
  useEffect(() => {
    if (!token) {
      setFetchError("No invite token found in the URL.");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/org-invites/lookup?token=${encodeURIComponent(token)}`);
        const json = await res.json();
        if (!res.ok) {
          setFetchError(json.error ?? "Invalid or expired invite link.");
          return;
        }
        setInvite(json.invite);
        const org = json.invite?.organizations;
        const orgRecord = Array.isArray(org) ? org[0] : org;
        setOrgName(orgRecord?.name ?? null);
      } catch {
        setFetchError("Failed to load invite details. Please try again.");
      }
    })();
  }, [token]);

  const handleAccept = () => {
    setAcceptError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/org-invites/accept", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const json = await res.json();
        if (!res.ok) {
          setAcceptError(json.error ?? "Failed to accept invite.");
          return;
        }
        // Successfully joined — redirect to wizard
        router.push("/wizard/step-1");
        router.refresh();
      } catch {
        setAcceptError("Network error. Please try again.");
      }
    });
  };

  // ── Render states ──────────────────────────────────────────

  if (!token) {
    return (
      <div className="flex items-center justify-center px-4 py-12 min-h-[80vh]">
        <PaperPage className="w-full max-w-md text-center">
          <p className="text-2xl mb-3">🔗</p>
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}>
            Invalid invite link
          </h1>
          <p className="text-sm" style={{ color: "var(--desk-muted)" }}>
            This invite link is missing a token. Please ask your admin for a valid link.
          </p>
        </PaperPage>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center px-4 py-12 min-h-[80vh]">
        <PaperPage className="w-full max-w-md text-center">
          <p className="text-2xl mb-3">❌</p>
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}>
            Invite not found
          </h1>
          <p className="text-sm" style={{ color: "var(--desk-muted)" }}>
            {fetchError}
          </p>
          <div className="mt-6">
            <Link href="/" className="text-sm underline" style={{ color: "var(--desk-teal)" }}>
              Go home
            </Link>
          </div>
        </PaperPage>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="text-sm" style={{ color: "var(--desk-muted)" }}>Loading invite…</span>
      </div>
    );
  }

  // If not logged in, prompt login
  if (!user) {
    const loginUrl = `/login?redirectTo=${encodeURIComponent(`/org/join?token=${token}`)}`;
    return (
      <div className="flex items-center justify-center px-4 py-12 min-h-[80vh]">
        <PaperPage className="w-full max-w-md text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--desk-teal)" }}
          >
            School invite
          </p>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
          >
            You&apos;ve been invited to join
          </h1>
          {orgName && (
            <p className="text-lg font-semibold mb-4" style={{ color: "var(--desk-teal)" }}>
              {orgName}
            </p>
          )}
          <p className="text-sm mb-6" style={{ color: "var(--desk-muted)" }}>
            Sign in or create an account to accept this invitation.
          </p>
          <div className="flex flex-col gap-3 items-center">
            <Link href={loginUrl}>
              <Button style={{ background: "var(--desk-teal)", color: "white" }} className="hover:opacity-90 px-8">
                Log in to accept
              </Button>
            </Link>
            <Link
              href={`/register?redirectTo=${encodeURIComponent(`/org/join?token=${token}`)}`}
              className="text-sm underline"
              style={{ color: "var(--desk-muted)" }}
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </PaperPage>
      </div>
    );
  }

  // Logged in — show accept button
  return (
    <div className="flex items-center justify-center px-4 py-12 min-h-[80vh]">
      <PaperPage className="w-full max-w-md text-center">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "var(--desk-teal)" }}
        >
          School invite
        </p>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
        >
          Join {orgName ?? "your school"}
        </h1>
        <p className="text-sm mb-1" style={{ color: "var(--desk-muted)" }}>
          You&apos;ve been invited as a <strong>{invite.role}</strong>.
        </p>
        <p className="text-xs mb-6" style={{ color: "var(--desk-muted)" }}>
          Signed in as <strong>{user.email}</strong>
        </p>

        {acceptError && (
          <div
            className="mb-4 rounded-lg border px-4 py-3 text-sm text-left"
            style={{ background: "#fef2f2", borderColor: "#fca5a5", color: "#b91c1c" }}
          >
            {acceptError}
          </div>
        )}

        <Button
          onClick={handleAccept}
          disabled={isPending}
          style={{ background: "var(--desk-teal)", color: "white" }}
          className="hover:opacity-90 px-10"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Joining…
            </span>
          ) : (
            "Accept invitation"
          )}
        </Button>
      </PaperPage>
    </div>
  );
}
