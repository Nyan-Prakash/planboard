import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ActivityDetail } from "@/components/activity/activity-detail";
import { SaveButton } from "@/components/activity/save-button";
import { RatingForm } from "@/components/activity/rating-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GRADE_LEVELS, SUBJECTS } from "@/lib/constants";
import type { ActivityContent } from "@/types";

function getGradeLabel(value: string) {
  return GRADE_LEVELS.find((g) => g.value === value)?.label || value;
}

function getSubjectLabel(value: string) {
  return SUBJECTS.find((s) => s.value === value)?.label || value;
}

export default async function MarketplaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch activity
  const { data: activity, error } = await supabase
    .from("activities")
    .select("*, profiles(name)")
    .eq("id", id)
    .single();

  if (error || !activity) {
    notFound();
  }

  // Fetch ratings
  const { data: ratings } = await supabase
    .from("ratings")
    .select("*, profiles(name)")
    .eq("activity_id", id)
    .order("created_at", { ascending: false });

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check save status and existing rating
  let isSaved = false;
  let userRating: {
    suitability: number;
    goalAchievement: number;
    recommendation: number;
    overallRating?: number | null;
    reviewText?: string | null;
    comment?: string | null;
  } | null = null;

  if (user) {
    const { data: save } = await supabase
      .from("saves")
      .select("id")
      .eq("user_id", user.id)
      .eq("activity_id", id)
      .single();
    isSaved = !!save;

    const existingRating = ratings?.find(
      (r: { user_id: string }) => r.user_id === user.id
    );
    if (existingRating) {
      userRating = {
        suitability: existingRating.suitability,
        goalAchievement: existingRating.goal_achievement,
        recommendation: existingRating.recommendation,
        overallRating: existingRating.overall_rating,
        reviewText: existingRating.review_text,
        comment: existingRating.comment,
      };
    }
  }

  // Compute aggregates
  const ratingCount = ratings?.length ?? 0;
  const ratingsWithOverall = ratings?.filter(
    (r: { overall_rating: number | null }) => r.overall_rating
  ) ?? [];
  const avgOverall =
    ratingsWithOverall.length > 0
      ? ratingsWithOverall.reduce(
          (sum: number, r: { overall_rating: number | null }) =>
            sum + (r.overall_rating || 0),
          0
        ) / ratingsWithOverall.length
      : null;

  const avgSuitability =
    ratingCount > 0
      ? ratings!.reduce(
          (sum: number, r: { suitability: number }) => sum + r.suitability,
          0
        ) / ratingCount
      : null;
  const avgGoalAchievement =
    ratingCount > 0
      ? ratings!.reduce(
          (sum: number, r: { goal_achievement: number }) =>
            sum + r.goal_achievement,
          0
        ) / ratingCount
      : null;
  const avgRecommendation =
    ratingCount > 0
      ? ratings!.reduce(
          (sum: number, r: { recommendation: number }) =>
            sum + r.recommendation,
          0
        ) / ratingCount
      : null;

  const content = activity.content as ActivityContent;
  const authorName =
    (activity.profiles as { name: string | null } | null)?.name || "Anonymous";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link href="/marketplace">
        <Button variant="ghost" size="sm" className="mb-4">
          &larr; Back to Marketplace
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {activity.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="capitalize">
                {activity.category.replace(/_/g, " ")}
              </Badge>
              <Badge variant="outline">
                {getGradeLabel(activity.grade_level)}
              </Badge>
              <Badge variant="outline">
                {getSubjectLabel(activity.subject)}
              </Badge>
            </div>
            <p className="mt-3 text-gray-600">{activity.summary}</p>
            <p className="mt-2 text-sm text-gray-400">
              Created by {authorName}
            </p>
          </div>
          {user && (
            <div className="ml-4 shrink-0">
              <SaveButton activityId={activity.id} initialSaved={isSaved} />
            </div>
          )}
        </div>
      </div>

      {/* Rating Summary */}
      {ratingCount > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ratings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {avgOverall !== null && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">
                    &#9733; {avgOverall.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Overall</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {ratingCount}
                </div>
                <div className="text-xs text-gray-500">Total Ratings</div>
              </div>
              {avgSuitability !== null && (
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {avgSuitability.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Avg Suitability</div>
                </div>
              )}
              {avgGoalAchievement !== null && (
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {avgGoalAchievement.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Avg Goal Achievement
                  </div>
                </div>
              )}
              {avgRecommendation !== null && (
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {avgRecommendation.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Avg Recommendation
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Detail Sections */}
      <ActivityDetail content={content} />

      {/* Reviews */}
      {ratings && ratings.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Reviews ({ratings.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ratings
              .filter(
                (r: { review_text: string | null }) => r.review_text
              )
              .map(
                (
                  r: {
                    id: string;
                    overall_rating: number | null;
                    review_text: string | null;
                    profiles: { name: string | null } | null;
                    created_at: string;
                  },
                  i: number
                ) => (
                  <div
                    key={r.id}
                    className={
                      i > 0
                        ? "border-t pt-4"
                        : ""
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {(r.profiles as { name: string | null } | null)?.name ||
                          "Anonymous"}
                      </span>
                      {r.overall_rating && (
                        <span className="text-sm text-yellow-500">
                          &#9733; {r.overall_rating}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{r.review_text}</p>
                  </div>
                )
              )}
          </CardContent>
        </Card>
      )}

      {/* Rating Form */}
      {user && (
        <div className="mt-6 pb-8">
          <RatingForm
            activityId={activity.id}
            initialRating={userRating ?? undefined}
          />
        </div>
      )}

      {!user && (
        <div className="mt-6 pb-8 text-center">
          <p className="text-gray-500">
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>{" "}
            to rate this activity and save it to your library.
          </p>
        </div>
      )}
    </div>
  );
}
