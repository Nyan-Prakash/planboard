import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireOrgAdmin, revokeInviteSchema } from "@/lib/org";

type Params = { params: Promise<{ orgId: string; inviteId: string }> };

// PATCH /api/orgs/[orgId]/invites/[inviteId] — revoke invite (admin only)
export async function PATCH(req: Request, { params }: Params) {
  const { orgId, inviteId } = await params;
  const adminUserId = await requireOrgAdmin(orgId);
  if (!adminUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = revokeInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();

  // Verify invite belongs to this org
  const { data: existing, error: fetchError } = await admin
    .from("organization_invites")
    .select("id, status")
    .eq("id", inviteId)
    .eq("organization_id", orgId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (existing.status !== "pending") {
    return NextResponse.json(
      { error: `Cannot revoke invite with status '${existing.status}'.` },
      { status: 409 }
    );
  }

  const { data, error } = await admin
    .from("organization_invites")
    .update({ status: "revoked" })
    .eq("id", inviteId)
    .select("id, organization_id, email, role, token, status, created_by, created_at, accepted_by, accepted_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invite: data });
}
