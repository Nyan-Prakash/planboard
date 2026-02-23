import { NextResponse } from "next/server";
import { getMyOrgMembership } from "@/lib/org";

// GET /api/orgs/me — get current user's org membership
export async function GET() {
  const result = await getMyOrgMembership();

  if (!result) {
    return NextResponse.json({ organization: null, role: null });
  }

  return NextResponse.json({ organization: result.organization, role: result.role });
}
