import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      gradeLevel,
      subject,
      activityType,
      lessonInfo,
      learningObjectives,
      activities,
    } = await req.json();

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        { error: "No activities provided" },
        { status: 400 }
      );
    }

    // Insert generation request
    const { data: genReq, error: genErr } = await getSupabaseAdmin()
      .from("generation_requests")
      .insert({
        user_id: user.id,
        grade_level: gradeLevel,
        subject,
        activity_type: activityType,
        lesson_info: lessonInfo,
        learning_objectives: learningObjectives,
        status: "completed",
      })
      .select("id")
      .single();

    if (genErr) {
      console.error("Failed to insert generation request:", genErr);
      return NextResponse.json({ error: genErr.message }, { status: 500 });
    }

    // Insert activities
    const activityRows = activities.map(
      (a: { title: string; category: string; summary: string; content: unknown }) => ({
        generation_request_id: genReq.id,
        user_id: user.id,
        title: a.title,
        category: a.category,
        summary: a.summary,
        content: a.content,
        is_public: true,
        grade_level: gradeLevel,
        subject,
        activity_type: activityType,
      })
    );

    const { data: savedActivities, error: actErr } = await getSupabaseAdmin()
      .from("activities")
      .insert(activityRows)
      .select(
        "id, title, category, summary, content, created_at, grade_level, subject, activity_type, is_public"
      );

    if (actErr) {
      console.error("Failed to insert activities:", actErr);
      return NextResponse.json({ error: actErr.message }, { status: 500 });
    }

    return NextResponse.json({
      generationRequestId: genReq.id,
      activities: savedActivities,
    });
  } catch (err) {
    console.error("Persist error:", err);
    return NextResponse.json(
      { error: "Failed to persist activities" },
      { status: 500 }
    );
  }
}
