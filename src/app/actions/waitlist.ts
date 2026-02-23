"use server";

import { createClient } from "@/lib/supabase/server";
import { waitlistSignupSchema } from "@/lib/validators";

interface WaitlistResult {
  error?: string;
  success?: boolean;
}

export async function joinWaitlistAction(formData: FormData): Promise<WaitlistResult> {
  const raw = {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
  };

  const parsed = waitlistSignupSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email address" };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("waitlist_signups").insert({
    email: parsed.data.email,
    source: "landing_page",
  });

  if (!error) {
    return { success: true };
  }

  if (error.code === "23505") {
    return { error: "This email is already on the waitlist." };
  }

  return { error: "Could not join the waitlist right now. Please try again." };
}
