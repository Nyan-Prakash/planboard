import { redirect } from "next/navigation";
import { getMyOrgMembership, getSeatStats } from "@/lib/org";
import { OrgAdminDashboard } from "./org-admin-dashboard";

export default async function OrgAdminPage() {
  const membership = await getMyOrgMembership();

  if (!membership) {
    redirect("/org/create");
  }

  if (membership.role !== "admin") {
    redirect("/profile");
  }

  const stats = await getSeatStats(membership.organization.id);

  return (
    <OrgAdminDashboard
      organization={membership.organization}
      stats={stats ?? {
        organization_id: membership.organization.id,
        seat_limit: membership.organization.seat_limit,
        active_members_count: 0,
        pending_invites_count: 0,
      }}
    />
  );
}
