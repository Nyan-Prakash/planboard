import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GRADE_LEVELS, SUBJECTS } from "@/lib/constants";
import { StampBadge, DeskEmptyState } from "@/components/ui-desk";
import { BinderSearch } from "@/components/library/binder-search";

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

type ActivityRow = {
  id: string;
  title: string;
  category: string;
  summary: string;
  grade_level: string;
  subject: string;
  activity_type: string;
  created_at: string;
};

function ActivityGrid({ activities, linkBase }: { activities: ActivityRow[]; linkBase: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {activities.map((activity, i) => {
        const icon =
          categoryIcons[activity.category] ||
          categoryIcons[activity.category.toLowerCase()] ||
          "📝";
        const accentColors = ["teal", "rose", "sage", "accent"] as const;
        const accent = accentColors[i % accentColors.length];
        return (
          <Link key={activity.id} href={`${linkBase}/${activity.id}`}>
            <div className="paper-card h-full flex flex-col gap-3 p-4 cursor-pointer">
              {/* top strip */}
              <div
                className="h-1 -mx-4 -mt-4 rounded-t-xl mb-1"
                style={{
                  background:
                    accent === "teal"
                      ? "var(--desk-teal)"
                      : accent === "rose"
                        ? "var(--desk-rose)"
                        : accent === "sage"
                          ? "var(--desk-sage)"
                          : "var(--desk-accent)",
                }}
              />
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5">{icon}</span>
                <h3 className="font-semibold text-desk-ink leading-snug line-clamp-2 text-base">
                  {activity.title}
                </h3>
              </div>
              <p className="text-sm text-desk-body line-clamp-2 flex-1">{activity.summary}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                <StampBadge color={accent} animateIn>
                  {activity.category.replace(/_/g, " ")}
                </StampBadge>
                <StampBadge color="ink">{getGradeLabel(activity.grade_level)}</StampBadge>
                <StampBadge color="ink">{getSubjectLabel(activity.subject)}</StampBadge>
              </div>
              <p className="text-xs text-desk-muted">
                {new Date(activity.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const searchQuery = (params.q || "").trim().toLowerCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's generated activities
  const { data: myActivities } = await supabase
    .from("activities")
    .select(
      "id, title, category, summary, grade_level, subject, activity_type, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch saved activities
  const { data: savedEntries } = await supabase
    .from("saves")
    .select(
      "activity_id, created_at, activities(id, title, category, summary, grade_level, subject, activity_type, created_at)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const savedActivities: ActivityRow[] =
    (savedEntries
      ?.map((s) => s.activities as unknown as ActivityRow)
      .filter(Boolean) as ActivityRow[]) ?? [];

  // Apply text search
  function filterActivities(list: ActivityRow[]) {
    if (!searchQuery) return list;
    return list.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery) ||
        a.summary?.toLowerCase().includes(searchQuery) ||
        a.category.toLowerCase().includes(searchQuery)
    );
  }

  const filteredMine = filterActivities(myActivities ?? []);
  const filteredSaved = filterActivities(savedActivities);

  const myCount = myActivities?.length ?? 0;
  const savedCount = savedActivities.length;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-desk-ink leading-tight">
            My{" "}
            <span className="highlight-text">Binder</span>
          </h1>
          <p className="mt-2 text-desk-body">
            Everything you&apos;ve created and collected — all in one place.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <BinderSearch />
          <Link href="/wizard/step-1">
            <Button className="bg-desk-teal text-white hover:opacity-90">
              + New Activity
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-activities">
        <TabsList
          className="mb-6 h-auto rounded-xl p-1"
          style={{ background: "var(--desk-border)", gap: "4px" }}
        >
          <TabsTrigger
            value="my-activities"
            className="text-sm font-semibold data-[state=active]:bg-desk-paper data-[state=active]:text-desk-teal data-[state=active]:shadow-sm rounded-lg px-4 py-2"
          >
            ✏️ My Activities
            <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-desk-teal/10 text-desk-teal text-xs font-bold w-5 h-5">
              {myCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="text-sm font-semibold data-[state=active]:bg-desk-paper data-[state=active]:text-desk-teal data-[state=active]:shadow-sm rounded-lg px-4 py-2"
          >
            🔖 Saved
            <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-desk-teal/10 text-desk-teal text-xs font-bold w-5 h-5">
              {savedCount}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* My Activities Tab */}
        <TabsContent value="my-activities">
          {myCount === 0 ? (
            <DeskEmptyState
              icon="pencil"
              heading="Your binder is empty"
              body="You haven't generated any activities yet. Head to the wizard and create your first one."
              actionLabel="Create Your First Activity"
              actionHref="/wizard/step-1"
            />
          ) : filteredMine.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg" style={{ color: "var(--desk-muted)" }}>No activities match &ldquo;{params.q}&rdquo;.</p>
            </div>
          ) : (
            <ActivityGrid activities={filteredMine} linkBase="/marketplace" />
          )}
        </TabsContent>

        {/* Saved Tab */}
        <TabsContent value="saved">
          {savedCount === 0 ? (
            <DeskEmptyState
              icon="binder"
              heading="Nothing saved yet"
              body="Browse the marketplace and save activities that spark your interest."
              actionLabel="Browse Marketplace"
              actionHref="/marketplace"
            />
          ) : filteredSaved.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg" style={{ color: "var(--desk-muted)" }}>No saved activities match &ldquo;{params.q}&rdquo;.</p>
            </div>
          ) : (
            <ActivityGrid activities={filteredSaved} linkBase="/marketplace" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
