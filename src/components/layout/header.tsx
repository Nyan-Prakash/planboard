"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";

function getInitials(user: { email?: string | null; user_metadata?: { full_name?: string; name?: string } }): string {
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name;
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  // Fall back to email: first letter + first letter after @
  const email = user.email ?? "";
  const local = email.split("@")[0] ?? "";
  return local.length >= 2 ? (local[0] + local[1]).toUpperCase() : local[0]?.toUpperCase() ?? "?";
}

export function Header() {
  const { user } = useAuth();

  return (
    <header
      className="sticky top-0 z-40 border-b bg-[var(--desk-paper)] border-[var(--desk-border)]"
      style={{ boxShadow: "0 1px 4px var(--desk-shadow)" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold text-sm select-none"
            style={{ background: "var(--desk-teal)" }}
          >
            ✦
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
          >
            Planboard
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          {/* Primary nav links */}
          <div className="flex items-center gap-1">
            <Link href="/marketplace">
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--desk-body)] hover:bg-[var(--desk-bg)] hover:text-[var(--desk-ink)]"
              >
                Marketplace
              </Button>
            </Link>
            {user && (
              <Link href="/library">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--desk-body)] hover:bg-[var(--desk-bg)] hover:text-[var(--desk-ink)]"
                >
                  My Binder
                </Button>
              </Link>
            )}
            {user && (
              <Link href="/wizard/step-1">
                <Button
                  size="sm"
                  className="bg-[var(--desk-teal)] text-white hover:opacity-90"
                >
                  Generate
                </Button>
              </Link>
            )}
          </div>

          {/* Account actions */}
          <div className="flex items-center gap-1.5">
            {user ? (
              <Link href="/profile" aria-label="Profile" title="Profile">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold select-none cursor-pointer ring-2 ring-transparent hover:ring-[var(--desk-border)] transition-all"
                  style={{ background: "var(--desk-teal)" }}
                  aria-label="Go to profile"
                >
                  {getInitials(user)}
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--desk-body)] hover:bg-[var(--desk-bg)]"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-[var(--desk-teal)] text-white hover:opacity-90"
                  >
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
