import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityFilters } from "@/components/marketplace/activity-filters";
import { GRADE_LEVELS, SUBJECTS } from "@/lib/constants";

const categoryIcons: Record<string, string> = {
  debate: "🗣️",
  documentary: "🎬",
  acting: "🎭",
  conference: "🎤",
  experiment: "🧪",
  project: "📋",
  presentation: "📊",
  research: "🔍",
  game: "🎮",
  simulation: "🎯",
  workshop: "🛠️",
  field_trip: "🚌",
};

function getGradeLabel(value: string) {
  return GRADE_LEVELS.find((g) => g.value === value)?.label || value;
}

function getSubjectLabel(value: string) {
  return SUBJECTS.find((s) => s.value === value)?.label || value;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const gradeFilter = params.grade || "";
  const subjectFilter = params.subject || "";
  const sort = params.sort || "newest";
  const searchQuery = (params.q || "").trim().toLowerCase();

  const supabase = await createClient();

  // Build query for activities
  let query = supabase
    .from("activities")
    .select("id, title, category, summary, grade_level, subject, activity_type, created_at, user_id")
    .eq("is_public", true);

  if (gradeFilter) {
    query = query.eq("grade_level", gradeFilter);
  }
  if (subjectFilter) {
    query = query.eq("subject", subjectFilter);
  }

  // Default sort
  if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.limit(50);

  const { data: activities } = await query;

  // Fetch stats for all activities
  let statsMap: Record<
    string,
    { rating_count: number; avg_overall: number | null }
  > = {};
  if (activities && activities.length > 0) {
    const activityIds = activities.map((a) => a.id);
    const { data: stats } = await supabase
      .from("activity_stats")
      .select("*")
      .in("activity_id", activityIds);

    if (stats) {
      statsMap = Object.fromEntries(
        stats.map((s) => [
          s.activity_id,
          { rating_count: s.rating_count, avg_overall: s.avg_overall },
        ])
      );
    }
  }

  // Sort by rating if needed
  let sortedActivities = activities || [];

  // Apply text search filter
  if (searchQuery) {
    sortedActivities = sortedActivities.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery) ||
        a.summary?.toLowerCase().includes(searchQuery) ||
        a.category.toLowerCase().includes(searchQuery)
    );
  }

  if (sort === "highest_rated") {
    sortedActivities = [...sortedActivities].sort((a, b) => {
      const aRating = statsMap[a.id]?.avg_overall ?? 0;
      const bRating = statsMap[b.id]?.avg_overall ?? 0;
      return Number(bRating) - Number(aRating);
    });
  } else if (sort === "most_rated") {
    sortedActivities = [...sortedActivities].sort((a, b) => {
      const aCount = statsMap[a.id]?.rating_count ?? 0;
      const bCount = statsMap[b.id]?.rating_count ?? 0;
      return bCount - aCount;
    });
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Activity Marketplace
        </h1>
        <p className="mt-2 text-gray-500">
          Browse and discover activities created by the community
        </p>
      </div>

      <ActivityFilters />

      <div className="mt-6">
        {sortedActivities.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-500">No activities found.</p>
            <p className="mt-1 text-sm text-gray-400">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedActivities.map((activity) => {
              const stats = statsMap[activity.id];
              const icon =
                categoryIcons[activity.category] ||
                categoryIcons[activity.category.toLowerCase()] ||
                "📝";

              return (
                <Link
                  key={activity.id}
                  href={`/marketplace/${activity.id}`}
                >
                  <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{icon}</span>
                          <CardTitle className="text-lg line-clamp-2">
                            {activity.title}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {activity.category.replace(/_/g, " ")}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getGradeLabel(activity.grade_level)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getSubjectLabel(activity.subject)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {activity.summary}
                      </p>
                      {stats && stats.rating_count > 0 && (
                        <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
                          <span className="text-yellow-500">&#9733;</span>
                          <span className="font-medium">
                            {stats.avg_overall
                              ? Number(stats.avg_overall).toFixed(1)
                              : "N/A"}
                          </span>
                          <span>({stats.rating_count} ratings)</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
