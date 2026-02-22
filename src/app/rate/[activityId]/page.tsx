"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useWizardStore } from "@/stores/wizard-store";
import { RatingForm } from "@/components/activity/rating-form";
import { Button } from "@/components/ui/button";

export default function RatePage() {
  const params = useParams();
  const router = useRouter();
  const { generatedActivities } = useWizardStore();
  const activityId = params.activityId as string;

  const [activityTitle, setActivityTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingRating, setExistingRating] = useState<{
    suitability: number;
    goalAchievement: number;
    recommendation: number;
    overallRating?: number | null;
    reviewText?: string | null;
    comment?: string | null;
  } | null>(null);

  useEffect(() => {
    // Try Zustand first
    const fromStore =
      generatedActivities.find((a) => a.id === activityId) ||
      generatedActivities[parseInt(activityId, 10)];

    if (fromStore) {
      setActivityTitle(fromStore.title);
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  async function loadData() {
    const supabase = createClient();

    // Fetch activity title if not from store
    if (!activityTitle) {
      const { data: activity } = await supabase
        .from("activities")
        .select("title")
        .eq("id", activityId)
        .single();
      if (activity) {
        setActivityTitle(activity.title);
      }
    }

    // Fetch existing user rating
    const res = await fetch(`/api/ratings?activityId=${activityId}`);
    if (res.ok) {
      const { userRating } = await res.json();
      if (userRating) {
        setExistingRating({
          suitability: userRating.suitability,
          goalAchievement: userRating.goal_achievement,
          recommendation: userRating.recommendation,
          overallRating: userRating.overall_rating,
          reviewText: userRating.review_text,
          comment: userRating.comment,
        });
      }
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (!activityTitle) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-gray-500">Activity not found.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/wizard/step-3")}
        >
          Back to Activities
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4"
      >
        &larr; Back
      </Button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Rate Activity</h1>
      <p className="text-gray-500 mb-6">
        Rate &ldquo;{activityTitle}&rdquo; to help improve future suggestions
      </p>

      <RatingForm
        activityId={activityId}
        initialRating={existingRating ?? undefined}
        onSuccess={() => {
          // Rating submitted/updated successfully
        }}
      />
    </div>
  );
}
