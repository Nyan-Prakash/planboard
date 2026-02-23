import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createOrgSchema, generateUniqueSlug } from "@/lib/org";

// POST /api/orgs — create a new organization
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Ensure user is not already in an org
  const { data: existing } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "You are already a member of an organization." },
      { status: 409 }
    );
  }

  const body = await req.json();
  const parsed = createOrgSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, seatLimit } = parsed.data;
  const slug = await generateUniqueSlug(name);

  // Use admin client to bypass RLS for the initial org + membership insert
  const admin = getSupabaseAdmin();

  // Insert organization
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name, slug, seat_limit: seatLimit, created_by: user.id })
    .select("id, name, slug, seat_limit, created_by, created_at")
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: orgError?.message ?? "Failed to create organization" }, { status: 500 });
  }

  // Insert creator as admin member
  const { error: memberError } = await admin.from("organization_members").insert({
    organization_id: org.id,
    user_id: user.id,
    role: "admin",
  });

  if (memberError) {
    // Rollback org if member insert fails
    await admin.from("organizations").delete().eq("id", org.id);
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  // Sync profile
  await admin
    .from("profiles")
    .update({ organization_id: org.id, org_role: "admin" })
    .eq("id", user.id);

  return NextResponse.json({ organization: org }, { status: 201 });
}
