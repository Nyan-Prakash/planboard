import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireOrgAdmin, updateMemberRoleSchema } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ orgId: string; userId: string }> };

// PATCH /api/orgs/[orgId]/members/[userId] — update member role (admin only)
export async function PATCH(req: Request, { params }: Params) {
  const { orgId, userId } = await params;
  const adminUserId = await requireOrgAdmin(orgId);
  if (!adminUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Prevent self-demotion if they are the only admin
  const body = await req.json();
  const parsed = updateMemberRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { role } = parsed.data;

  // Guard: cannot demote yourself if you're the only admin
  if (adminUserId === userId && role !== "admin") {
    const admin = getSupabaseAdmin();
    const { count } = await admin
      .from("organization_members")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("role", "admin");
    if ((count ?? 0) <= 1) {
      return NextResponse.json(
        { error: "Cannot demote yourself — you are the only admin." },
        { status: 409 }
      );
    }
  }

  const admin = getSupabaseAdmin();

  const { data, error } = await admin
    .from("organization_members")
    .update({ role })
    .eq("organization_id", orgId)
    .eq("user_id", userId)
    .select("organization_id, user_id, role, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Sync profile
  await admin.from("profiles").update({ org_role: role }).eq("id", userId);

  return NextResponse.json({ member: data });
}

// DELETE /api/orgs/[orgId]/members/[userId] — remove member (admin only)
export async function DELETE(_req: Request, { params }: Params) {
  const { orgId, userId } = await params;
  const adminUserId = await requireOrgAdmin(orgId);
  if (!adminUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Prevent removing last admin
  const supabase = await createClient();
  const { data: memberToRemove } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", orgId)
    .eq("user_id", userId)
    .single();

  if (memberToRemove?.role === "admin") {
    const admin = getSupabaseAdmin();
    const { count } = await admin
      .from("organization_members")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("role", "admin");
    if ((count ?? 0) <= 1) {
      return NextResponse.json(
        { error: "Cannot remove the only admin of the organization." },
        { status: 409 }
      );
    }
  }

  const admin = getSupabaseAdmin();

  const { error } = await admin
    .from("organization_members")
    .delete()
    .eq("organization_id", orgId)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Clear profile org fields
  await admin
    .from("profiles")
    .update({ organization_id: null, org_role: null })
    .eq("id", userId);

  return NextResponse.json({ removed: true });
}
