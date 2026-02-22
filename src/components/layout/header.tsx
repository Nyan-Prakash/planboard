"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

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
        <nav className="flex items-center gap-1">
          <Link href="/marketplace">
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--desk-body)] hover:bg-[var(--desk-bg)] hover:text-[var(--desk-ink)]"
            >
              Marketplace
            </Button>
          </Link>
          {user ? (
            <>
              <Link href="/library">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--desk-body)] hover:bg-[var(--desk-bg)] hover:text-[var(--desk-ink)]"
                >
                  My Binder
                </Button>
              </Link>
              <Link href="/wizard/step-1">
                <Button
                  size="sm"
                  className="bg-[var(--desk-teal)] text-white hover:opacity-90 gap-1.5"
                >
                  ✦ Generate
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-[var(--desk-muted)] hover:text-[var(--desk-ink)]"
              >
                Sign Out
              </Button>
            </>
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
        </nav>
      </div>
    </header>
  );
}
