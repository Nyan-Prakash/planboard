import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireOrgAdmin } from "@/lib/org";

// GET /api/orgs/[orgId]/members — list all members (admin only)
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

  // Fetch membership rows first (stable, direct table query).
  const { data: memberRows, error: memberError } = await admin
    .from("organization_members")
    .select("user_id, role, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });

  if (memberError) return NextResponse.json({ error: memberError.message }, { status: 500 });

  const userIds = (memberRows ?? []).map((row) => row.user_id);

  let profileMap = new Map<string, { email: string | null; name: string | null }>();
  if (userIds.length > 0) {
    const { data: profiles, error: profileError } = await admin
      .from("profiles")
      .select("id, email, name")
      .in("id", userIds);

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

    profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, { email: p.email ?? null, name: p.name ?? null }])
    );
  }

  const members = (memberRows ?? []).map((row) => {
    const profile = profileMap.get(row.user_id);
    return {
      user_id: row.user_id,
      email: profile?.email ?? null,
      name: profile?.name ?? null,
      role: row.role,
      created_at: row.created_at,
    };
  });

  return NextResponse.json({ members });
}
