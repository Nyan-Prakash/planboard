import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// GET /api/org-invites/lookup?token=... — public lookup of a pending invite by token
// Only returns non-sensitive fields (no member list, no org secrets).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  const { data, error } = await admin
    .from("organization_invites")
    .select("organization_id, email, role, status, organizations(name)")
    .eq("token", token)
    .eq("status", "pending")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Invite not found or no longer valid." },
      { status: 404 }
    );
  }

  // Return only safe public fields
  return NextResponse.json({
    invite: {
      organization_id: data.organization_id,
      email: data.email,
      role: data.role,
      status: data.status,
      organizations: data.organizations,
    },
  });
}
