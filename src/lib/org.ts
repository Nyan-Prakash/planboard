import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// ============================================================
// Zod Schemas
// ============================================================

export const createOrgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
  seatLimit: z.number().int().min(1).max(10000).optional().default(10),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["teacher", "admin"]),
});

export const createInviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["teacher", "admin"]).optional().default("teacher"),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const revokeInviteSchema = z.object({
  status: z.literal("revoked"),
});

// ============================================================
// Types
// ============================================================

export type OrgRole = "teacher" | "admin";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  seat_limit: number;
  created_by: string;
  created_at: string;
};

export type OrgMembership = {
  organization_id: string;
  user_id: string;
  role: OrgRole;
  created_at: string;
};

export type OrgMemberWithProfile = {
  user_id: string;
  email: string;
  name: string | null;
  role: OrgRole;
  created_at: string;
};

export type OrgInvite = {
  id: string;
  organization_id: string;
  email: string;
  role: OrgRole;
  token: string;
  status: "pending" | "accepted" | "revoked" | "expired";
  created_by: string;
  created_at: string;
  accepted_by: string | null;
  accepted_at: string | null;
};

export type SeatStats = {
  organization_id: string;
  seat_limit: number;
  active_members_count: number;
  pending_invites_count: number;
};

// ============================================================
// Slug Generation
// ============================================================

/**
 * Converts an org name to a URL-safe slug.
 */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a unique slug for an organization name.
 * Appends a numeric suffix if the slug is taken.
 */
export async function generateUniqueSlug(name: string): Promise<string> {
  const admin = getSupabaseAdmin();
  const base = toSlug(name) || "org";

  // Try base slug first, then base-2, base-3, ...
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const { data } = await admin
      .from("organizations")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  // Fallback: base + random suffix
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

// ============================================================
// Seat Counting
// ============================================================

/**
 * Returns current seat stats for an org.
 */
export async function getSeatStats(orgId: string): Promise<SeatStats | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("organization_seat_stats")
    .select("organization_id, seat_limit, active_members_count, pending_invites_count")
    .eq("organization_id", orgId)
    .single();

  if (error || !data) return null;
  return data as SeatStats;
}

/**
 * Returns true if (active + pending) < seat_limit, meaning a new invite can be sent.
 */
export async function hasSeatAvailable(orgId: string): Promise<boolean> {
  const stats = await getSeatStats(orgId);
  if (!stats) return false;
  return stats.active_members_count + stats.pending_invites_count < stats.seat_limit;
}

/**
 * Returns true if active < seat_limit, meaning a new member can join.
 */
export async function hasActiveSeatAvailable(orgId: string): Promise<boolean> {
  const stats = await getSeatStats(orgId);
  if (!stats) return false;
  return stats.active_members_count < stats.seat_limit;
}

// ============================================================
// Auth Helpers (server-side)
// ============================================================

/**
 * Returns the current user's org membership if it exists.
 * Uses the admin client to bypass RLS — this function is server-only.
 */
export async function getMyOrgMembership(): Promise<{
  organization: Organization;
  role: OrgRole;
} | null> {
  // Use anon client only to get the authenticated user identity
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Use admin client to read membership — avoids the self-referential RLS
  // SELECT policy on organization_members (which requires being a member to
  // prove you're a member — a chicken-and-egg problem).
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("organization_members")
    .select("role, organization_id, organizations(id, name, slug, seat_limit, created_by, created_at)")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  const org = (data as { role: string; organizations: Organization | Organization[] }).organizations;
  const orgRecord = Array.isArray(org) ? org[0] : org;
  if (!orgRecord) return null;

  return {
    organization: orgRecord,
    role: data.role as OrgRole,
  };
}

/**
 * Asserts the current user is an admin of the given org.
 * Returns the user id if authorized, null otherwise.
 * Uses the admin client to bypass RLS — this function is server-only.
 */
export async function requireOrgAdmin(orgId: string): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("organization_members")
    .select("role, user_id")
    .eq("organization_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("[requireOrgAdmin] DB error:", error.message, { orgId, userId: user.id });
    return null;
  }
  if (!data || data.role !== "admin") return null;
  return user.id;
}

// ============================================================
// Token Generation
// ============================================================

/**
 * Generates a cryptographically-random invite token.
 */
export function generateInviteToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ============================================================
// Invite link helper
// ============================================================

export function buildInviteLink(token: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  return `${base}/org/join?token=${token}`;
}
