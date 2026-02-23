import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyProfile } from "@/lib/profile";
import { getMyOrgMembership } from "@/lib/org";
import { Button } from "@/components/ui/button";
import { PaperPage } from "@/components/ui-desk";
import { ProfileForm } from "./profile-form";
import { signOutAction } from "./actions";
import { DeleteAccountSection } from "./delete-account-section";

export default async function ProfilePage() {
  const [profile, orgMembership] = await Promise.all([
    getMyProfile(),
    getMyOrgMembership(),
  ]);

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <PaperPage>
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "var(--desk-teal)" }}
          >
            Account
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
          >
            Your Profile
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--desk-muted)" }}>
            Update the details that shape your generated activities.
          </p>
        </div>

        {/* Read-only info */}
        <div
          className="rounded-lg border px-4 py-4 mb-8 space-y-1"
          style={{ borderColor: "var(--desk-border)", background: "var(--desk-bg)" }}
        >
          {profile.name && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold w-16" style={{ color: "var(--desk-ink)" }}>Name</span>
              <span style={{ color: "var(--desk-body)" }}>{profile.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold w-16" style={{ color: "var(--desk-ink)" }}>Email</span>
            <span style={{ color: "var(--desk-body)" }}>{profile.email}</span>
          </div>
        </div>

        {/* Editable form */}
        <ProfileForm
          initialSubject={profile.subject ?? ""}
          initialGradeLevel={profile.grade_level ?? ""}
        />

        {/* Organization section */}
        <div
          className="mt-8 pt-6 border-t"
          style={{ borderColor: "var(--desk-border)" }}
        >
          <h2 className="text-base font-semibold mb-1" style={{ color: "var(--desk-ink)" }}>
            Organization
          </h2>
          {orgMembership ? (
            <div
              className="mt-3 rounded-lg border px-4 py-4 space-y-2"
              style={{ borderColor: "var(--desk-border)", background: "var(--desk-bg)" }}
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold w-16" style={{ color: "var(--desk-ink)" }}>Org</span>
                <span style={{ color: "var(--desk-body)" }}>{orgMembership.organization.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold w-16" style={{ color: "var(--desk-ink)" }}>Role</span>
                <span
                  className="capitalize px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    background: orgMembership.role === "admin" ? "var(--desk-teal)" : "var(--desk-border)",
                    color: orgMembership.role === "admin" ? "white" : "var(--desk-ink)",
                  }}
                >
                  {orgMembership.role}
                </span>
              </div>
              {orgMembership.role === "admin" && (
                <div className="pt-1">
                  <Link href="/org/admin">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs border-desk-teal text-desk-teal hover:bg-[color-mix(in_srgb,var(--desk-teal)_10%,white)]"
                    >
                      Manage organization →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div
              className="mt-3 rounded-lg border border-dashed px-4 py-5 text-center"
              style={{ borderColor: "var(--desk-border)" }}
            >
              <p className="text-sm mb-3" style={{ color: "var(--desk-muted)" }}>
                You&apos;re not part of a school organization yet.
              </p>
              <Link href="/org/create">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs border-desk-teal text-desk-teal hover:bg-[color-mix(in_srgb,var(--desk-teal)_10%,white)]"
                >
                  Create a school account
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Sign out */}
        <div
          className="mt-8 pt-6 border-t"
          style={{ borderColor: "var(--desk-border)" }}
        >
          <h2 className="text-base font-semibold mb-1" style={{ color: "var(--desk-ink)" }}>
            Sign out
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--desk-muted)" }}>
            End your current session on this device.
          </p>
          <form action={signOutAction}>
            <Button
              type="submit"
              variant="outline"
              className="border-[var(--desk-rose)] text-[var(--desk-rose)] hover:bg-[color-mix(in_srgb,var(--desk-rose)_10%,white)]"
            >
              Sign out
            </Button>
          </form>
        </div>

        <DeleteAccountSection />
      </PaperPage>
    </div>
  );
}
