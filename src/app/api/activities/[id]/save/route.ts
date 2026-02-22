import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: activityId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from("saves")
      .select("id")
      .eq("user_id", user.id)
      .eq("activity_id", activityId)
      .single();

    if (existing) {
      // Unsave
      await supabase.from("saves").delete().eq("id", existing.id);
      return NextResponse.json({ saved: false });
    } else {
      // Save
      const { error } = await supabase
        .from("saves")
        .insert({ user_id: user.id, activity_id: activityId });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ saved: true });
    }
  } catch (err) {
    console.error("Save toggle error:", err);
    return NextResponse.json(
      { error: "Failed to toggle save" },
      { status: 500 }
    );
  }
}
