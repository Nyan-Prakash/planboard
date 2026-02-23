"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { profileSchema } from "@/lib/validators";

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const raw = {
    subject: formData.get("subject") as string,
    grade_level: formData.get("grade_level") as string,
  };

  const parsed = profileSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { error: firstError };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      subject: parsed.data.subject,
      grade_level: parsed.data.grade_level,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Failed to save profile. Please try again." };
  }

  revalidatePath("/profile");

  return { success: true };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function deleteAccountAction(formData: FormData) {
  const confirmation = (formData.get("confirmation") as string | null)?.trim() ?? "";
  if (confirmation !== "DELETE") {
    return { error: "Type DELETE to confirm account deletion." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const admin = getSupabaseAdmin();

  // Remove org memberships first so seat counts remain accurate.
  const { error: membershipError } = await admin
    .from("organization_members")
    .delete()
    .eq("user_id", user.id);

  if (membershipError) {
    return { error: "Failed to remove organization membership. Please try again." };
  }

  // Delete profile row; cascades to user-owned app data via FK constraints.
  const { error: profileError } = await admin
    .from("profiles")
    .delete()
    .eq("id", user.id);

  if (profileError) {
    return { error: "Failed to delete profile data. Please try again." };
  }

  // Soft-delete auth user to avoid FK conflicts from audit columns (e.g. created_by).
  const { error: deleteAuthError } = await admin.auth.admin.deleteUser(user.id, true);
  if (deleteAuthError) {
    return { error: "Failed to delete account. Please contact support." };
  }

  await supabase.auth.signOut();
  redirect("/register");
}
