import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { acceptInviteSchema, hasActiveSeatAvailable } from "@/lib/org";

// POST /api/org-invites/accept — accept an invite by token
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = acceptInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { token } = parsed.data;
  const admin = getSupabaseAdmin();

  // Lookup invite by token
  const { data: invite, error: inviteError } = await admin
    .from("organization_invites")
    .select("id, organization_id, email, role, status, organizations(id, name, slug, seat_limit, created_by, created_at)")
    .eq("token", token)
    .single();

  if (inviteError || !invite) {
    return NextResponse.json(
      { error: "Invite not found. The link may be invalid." },
      { status: 404 }
    );
  }

  if (invite.status !== "pending") {
    const messages: Record<string, string> = {
      accepted: "This invite has already been accepted.",
      revoked: "This invite has been revoked by the admin.",
      expired: "This invite has expired.",
    };
    return NextResponse.json(
      { error: messages[invite.status] ?? "This invite is no longer valid." },
      { status: 409 }
    );
  }

  // STRICT email match (case-insensitive)
  const userEmail = user.email?.toLowerCase() ?? "";
  const inviteEmail = invite.email.toLowerCase();
  if (userEmail !== inviteEmail) {
    return NextResponse.json(
      {
        error: `This invite was sent to ${invite.email}. Please sign in with that email address to accept it.`,
      },
      { status: 403 }
    );
  }

  // Check if user is already in an org
  const { data: existingMembership } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingMembership) {
    return NextResponse.json(
      { error: "You are already a member of an organization." },
      { status: 409 }
    );
  }

  const orgId = invite.organization_id;

  // Enforce active seat limit
  const seatAvailable = await hasActiveSeatAvailable(orgId);
  if (!seatAvailable) {
    return NextResponse.json(
      { error: "This organization has reached its seat limit. Please contact your admin." },
      { status: 409 }
    );
  }

  // Insert membership
  const { error: memberError } = await admin.from("organization_members").insert({
    organization_id: orgId,
    user_id: user.id,
    role: invite.role,
  });

  if (memberError) {
    // Handle unique constraint violation (already a member)
    if (memberError.code === "23505") {
      return NextResponse.json(
        { error: "You are already a member of an organization." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  // Sync profile
  await admin
    .from("profiles")
    .update({ organization_id: orgId, org_role: invite.role })
    .eq("id", user.id);

  // Mark invite accepted
  await admin
    .from("organization_invites")
    .update({
      status: "accepted",
      accepted_by: user.id,
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invite.id);

  const org = Array.isArray(invite.organizations)
    ? invite.organizations[0]
    : invite.organizations;

  return NextResponse.json({ organization: org, role: invite.role }, { status: 200 });
}
