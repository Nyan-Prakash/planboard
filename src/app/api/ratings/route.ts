import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ratingSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ratingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      activityId,
      suitability,
      goalAchievement,
      recommendation,
      overallRating,
      reviewText,
      comment,
    } = parsed.data;

    const { data, error } = await supabase
      .from("ratings")
      .upsert(
        {
          user_id: user.id,
          activity_id: activityId,
          suitability,
          goal_achievement: goalAchievement,
          recommendation,
          overall_rating: overallRating ?? null,
          review_text: reviewText ?? null,
          comment: comment ?? null,
        },
        { onConflict: "user_id,activity_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Rating upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rating: data });
  } catch (err) {
    console.error("Rating error:", err);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const activityId = searchParams.get("activityId");

    if (!activityId) {
      return NextResponse.json(
        { error: "activityId is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get user's existing rating if logged in
    let userRating = null;
    if (user) {
      const { data } = await supabase
        .from("ratings")
        .select("*")
        .eq("user_id", user.id)
        .eq("activity_id", activityId)
        .single();
      userRating = data;
    }

    return NextResponse.json({ userRating });
  } catch (err) {
    console.error("Get rating error:", err);
    return NextResponse.json(
      { error: "Failed to get rating" },
      { status: 500 }
    );
  }
}
