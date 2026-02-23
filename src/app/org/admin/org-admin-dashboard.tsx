"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaperPage } from "@/components/ui-desk";
import type { Organization, OrgInvite, OrgMemberWithProfile, SeatStats } from "@/lib/org";

interface Props {
  organization: Organization;
  stats: SeatStats;
}

type Tab = "overview" | "teachers" | "invites";

export function OrgAdminDashboard({ organization, stats: initialStats }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<SeatStats>(initialStats);
  const [members, setMembers] = useState<OrgMemberWithProfile[]>([]);
  const [invites, setInvites] = useState<OrgInvite[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"teacher" | "admin">("teacher");
  const [latestInviteLink, setLatestInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const orgId = organization.id;

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch(`/api/orgs/${orgId}/members`);
      const json = await res.json();
      if (res.ok) setMembers(json.members ?? []);
    } catch { /* noop */ }
  }, [orgId]);

  const fetchInvites = useCallback(async () => {
    try {
      const res = await fetch(`/api/orgs/${orgId}/invites`);
      const json = await res.json();
      if (res.ok) setInvites(json.invites ?? []);
    } catch { /* noop */ }
  }, [orgId]);

  const refreshStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/orgs/me`);
      const json = await res.json();
      if (res.ok && json.organization) {
        setStats((prev) => ({
          ...prev,
          seat_limit: json.organization.seat_limit,
        }));
      }
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (activeTab === "teachers") fetchMembers();
    if (activeTab === "invites") fetchInvites();
  }, [activeTab, fetchMembers, fetchInvites]);

  const showMsg = (msg: string, isError = false) => {
    if (isError) { setError(msg); setSuccess(null); }
    else { setSuccess(msg); setError(null); }
    setTimeout(() => { setError(null); setSuccess(null); }, 5000);
  };

  // ── Member actions ─────────────────────────────────────────
  const handleRoleChange = (userId: string, newRole: "teacher" | "admin") => {
    startTransition(async () => {
      const res = await fetch(`/api/orgs/${orgId}/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (!res.ok) { showMsg(json.error ?? "Failed to update role.", true); return; }
      setMembers((prev) => prev.map((m) => m.user_id === userId ? { ...m, role: newRole } : m));
      showMsg("Role updated.");
    });
  };

  const handleRemoveMember = (userId: string, email: string) => {
    if (!window.confirm(`Remove ${email} from the organization?`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/orgs/${orgId}/members/${userId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) { showMsg(json.error ?? "Failed to remove member.", true); return; }
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
      setStats((prev) => ({ ...prev, active_members_count: Math.max(0, prev.active_members_count - 1) }));
      showMsg("Member removed.");
      router.refresh();
    });
  };

  // ── Invite actions ──────────────────────────────────────────
  const handleCreateInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setLatestInviteLink(null);
    startTransition(async () => {
      const res = await fetch(`/api/orgs/${orgId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim().toLowerCase(), role: inviteRole }),
      });
      const json = await res.json();
      if (!res.ok) { showMsg(json.error ?? "Failed to create invite.", true); return; }
      setLatestInviteLink(json.inviteLink);
      setInvites((prev) => [json.invite, ...prev]);
      setStats((prev) => ({ ...prev, pending_invites_count: prev.pending_invites_count + 1 }));
      setInviteEmail("");
      setInviteRole("teacher");
      showMsg("Invite created!");
    });
  };

  const handleRevokeInvite = (inviteId: string, email: string) => {
    if (!window.confirm(`Revoke invite for ${email}?`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/orgs/${orgId}/invites/${inviteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "revoked" }),
      });
      const json = await res.json();
      if (!res.ok) { showMsg(json.error ?? "Failed to revoke invite.", true); return; }
      setInvites((prev) => prev.map((i) => i.id === inviteId ? { ...i, status: "revoked" } : i));
      setStats((prev) => ({ ...prev, pending_invites_count: Math.max(0, prev.pending_invites_count - 1) }));
      showMsg("Invite revoked.");
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  // Refresh stats when switching to overview
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "overview") refreshStats();
  };

  // ── Render ─────────────────────────────────────────────────
  const TAB_STYLES = (active: boolean) => ({
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: active ? "2px solid var(--desk-teal)" : "2px solid transparent",
    color: active ? "var(--desk-teal)" : "var(--desk-muted)",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    background: "none",
  } as React.CSSProperties);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <PaperPage>
        {/* Header */}
        <div className="mb-6">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "var(--desk-teal)" }}
          >
            Admin Dashboard
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
          >
            {organization.name}
          </h1>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="mb-4 rounded-lg border px-4 py-3 text-sm" style={{ background: "#fef2f2", borderColor: "#fca5a5", color: "#b91c1c" }}>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border px-4 py-3 text-sm" style={{ background: "#f0fdf4", borderColor: "#86efac", color: "#166534" }}>
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0 border-b mb-6" style={{ borderColor: "var(--desk-border)" }}>
          {(["overview", "teachers", "invites"] as Tab[]).map((tab) => (
            <button key={tab} onClick={() => handleTabChange(tab)} style={TAB_STYLES(activeTab === tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div
              className="rounded-lg border px-6 py-5 space-y-3"
              style={{ borderColor: "var(--desk-border)", background: "var(--desk-bg)" }}
            >
              <h2 className="text-base font-semibold" style={{ color: "var(--desk-ink)" }}>Seat Usage</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--desk-body)" }}>Active members</span>
                  <span className="font-semibold" style={{ color: "var(--desk-ink)" }}>{stats.active_members_count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--desk-body)" }}>Pending invites</span>
                  <span className="font-semibold" style={{ color: "var(--desk-ink)" }}>{stats.pending_invites_count}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--desk-body)" }}>Seat limit</span>
                  <span className="font-semibold" style={{ color: "var(--desk-ink)" }}>{stats.seat_limit}</span>
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full rounded-full h-2" style={{ background: "var(--desk-border)" }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, ((stats.active_members_count + stats.pending_invites_count) / stats.seat_limit) * 100)}%`,
                        background: "var(--desk-teal)",
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--desk-muted)" }}>
                    {stats.active_members_count + stats.pending_invites_count} / {stats.seat_limit} seats used (active + pending)
                  </p>
                </div>
              </div>
            </div>
            <div
              className="rounded-lg border px-6 py-5 space-y-2"
              style={{ borderColor: "var(--desk-border)", background: "var(--desk-bg)" }}
            >
              <h2 className="text-base font-semibold" style={{ color: "var(--desk-ink)" }}>Organization details</h2>
              <div className="text-sm space-y-1">
                <div className="flex gap-2"><span className="w-16 font-medium" style={{ color: "var(--desk-muted)" }}>Name</span><span style={{ color: "var(--desk-body)" }}>{organization.name}</span></div>
                <div className="flex gap-2"><span className="w-16 font-medium" style={{ color: "var(--desk-muted)" }}>Slug</span><span style={{ color: "var(--desk-body)" }}>{organization.slug}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── Teachers ── */}
        {activeTab === "teachers" && (
          <div className="space-y-3">
            {members.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: "var(--desk-muted)" }}>
                No members yet. Invite teachers from the Invites tab.
              </p>
            ) : (
              members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                  style={{ borderColor: "var(--desk-border)", background: "var(--desk-bg)" }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--desk-ink)" }}>
                      {member.name ?? member.email ?? member.user_id}
                    </p>
                    {member.name && (
                      <p className="text-xs truncate" style={{ color: "var(--desk-muted)" }}>{member.email}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.user_id, e.target.value as "teacher" | "admin")}
                      disabled={isPending}
                      className="text-xs rounded border px-2 py-1"
                      style={{ borderColor: "var(--desk-border)", color: "var(--desk-body)", background: "white" }}
                    >
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleRemoveMember(member.user_id, member.email ?? member.user_id)}
                      className="text-xs border-[var(--desk-rose)] text-[var(--desk-rose)] hover:bg-[color-mix(in_srgb,var(--desk-rose)_10%,white)]"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Invites ── */}
        {activeTab === "invites" && (
          <div className="space-y-6">
            {/* Create invite form */}
            <div
              className="rounded-lg border px-5 py-5"
              style={{ borderColor: "var(--desk-border)", background: "var(--desk-bg)" }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ color: "var(--desk-ink)" }}>
                Invite a teacher
              </h2>
              <form onSubmit={handleCreateInvite} className="space-y-4">
                <div className="flex gap-3 flex-wrap">
                  <div className="flex-1 min-w-48 space-y-1">
                    <Label htmlFor="inviteEmail" className="text-xs font-semibold" style={{ color: "var(--desk-muted)" }}>
                      Email address
                    </Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="teacher@school.edu"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      disabled={isPending}
                      required
                      className="border-[var(--desk-border)] focus-visible:ring-[var(--desk-teal)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="inviteRole" className="text-xs font-semibold" style={{ color: "var(--desk-muted)" }}>
                      Role
                    </Label>
                    <select
                      id="inviteRole"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as "teacher" | "admin")}
                      disabled={isPending}
                      className="rounded border px-3 py-2 text-sm h-10"
                      style={{ borderColor: "var(--desk-border)", color: "var(--desk-body)", background: "white" }}
                    >
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isPending || !inviteEmail.trim()}
                  style={{ background: "var(--desk-teal)", color: "white" }}
                  className="hover:opacity-90"
                >
                  {isPending ? "Sending…" : "Send invite"}
                </Button>
              </form>

              {/* Show invite link */}
              {latestInviteLink && (
                <div
                  className="mt-4 rounded-lg border px-4 py-3"
                  style={{ borderColor: "var(--desk-teal)", background: "#f0fdfa" }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--desk-teal)" }}>
                    Invite link created — share this with the teacher:
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-xs break-all flex-1" style={{ color: "var(--desk-ink)" }}>
                      {latestInviteLink}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(latestInviteLink)}
                      className="text-xs shrink-0"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Invite list */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold" style={{ color: "var(--desk-ink)" }}>All invites</h2>
              {invites.length === 0 ? (
                <p className="text-sm py-4 text-center" style={{ color: "var(--desk-muted)" }}>
                  No invites sent yet.
                </p>
              ) : (
                invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                    style={{ borderColor: "var(--desk-border)", background: "var(--desk-bg)" }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--desk-ink)" }}>
                        {invite.email}
                      </p>
                      <p className="text-xs" style={{ color: "var(--desk-muted)" }}>
                        {invite.role} ·{" "}
                        <span
                          style={{
                            color:
                              invite.status === "pending"
                                ? "var(--desk-teal)"
                                : invite.status === "accepted"
                                ? "#166534"
                                : "#b91c1c",
                          }}
                        >
                          {invite.status}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      {invite.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleCopy(
                                `${window.location.origin}/org/join?token=${invite.token}`
                              )
                            }
                            className="text-xs"
                          >
                            Copy link
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            onClick={() => handleRevokeInvite(invite.id, invite.email)}
                            className="text-xs border-[var(--desk-rose)] text-[var(--desk-rose)] hover:bg-[color-mix(in_srgb,var(--desk-rose)_10%,white)]"
                          >
                            Revoke
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </PaperPage>
    </div>
  );
}
