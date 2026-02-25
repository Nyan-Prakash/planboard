import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  requireOrgAdmin,
  createInviteSchema,
  generateInviteToken,
  buildInviteLink,
  hasSeatAvailable,
} from "@/lib/org";

// GET /api/orgs/[orgId]/invites — list invites (admin only)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  const adminUserId = await requireOrgAdmin(orgId);
  if (!adminUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("organization_invites")
    .select("id, organization_id, email, role, token, status, created_by, created_at, accepted_by, accepted_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invites: data ?? [] });
}

// POST /api/orgs/[orgId]/invites — create invite (admin only)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminUserId = await requireOrgAdmin(orgId);
  if (!adminUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, role } = parsed.data;

  // Check seat availability (active + pending < seat_limit)
  const seatAvailable = await hasSeatAvailable(orgId);
  if (!seatAvailable) {
    return NextResponse.json(
      { error: "Seat limit reached. Remove members or increase the seat limit before inviting more." },
      { status: 409 }
    );
  }

  const admin = getSupabaseAdmin();

  // Check for existing pending invite to this email in this org
  const { data: existingInvite } = await admin
    .from("organization_invites")
    .select("id, status")
    .eq("organization_id", orgId)
    .eq("email", email.toLowerCase())
    .eq("status", "pending")
    .maybeSingle();

  if (existingInvite) {
    return NextResponse.json(
      { error: "A pending invite already exists for this email." },
      { status: 409 }
    );
  }

  // Check if this email belongs to an existing member of this org
  const { data: profileWithEmail } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (profileWithEmail) {
    const { data: alreadyMember } = await admin
      .from("organization_members")
      .select("user_id")
      .eq("organization_id", orgId)
      .eq("user_id", profileWithEmail.id)
      .maybeSingle();

    if (alreadyMember) {
      return NextResponse.json(
        { error: "This user is already a member of the organization." },
        { status: 409 }
      );
    }
  }

  const token = generateInviteToken();

  const { data: invite, error: inviteError } = await admin
    .from("organization_invites")
    .insert({
      organization_id: orgId,
      email: email.toLowerCase(),
      role,
      token,
      created_by: user.id,
    })
    .select("id, organization_id, email, role, token, status, created_by, created_at, accepted_by, accepted_at")
    .single();

  if (inviteError || !invite) {
    return NextResponse.json({ error: inviteError?.message ?? "Failed to create invite" }, { status: 500 });
  }

  const inviteLink = buildInviteLink(token, process.env.NEXT_PUBLIC_APP_URL);

  return NextResponse.json({ invite, inviteLink }, { status: 201 });
}
