import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GRADE_LEVELS, SUBJECTS } from "@/lib/constants";
import { StampBadge, DeskEmptyState } from "@/components/ui-desk";
import { BinderFilters } from "@/components/library/binder-filters";
import { DeleteActivityButton } from "@/components/activity/delete-activity-button";
import { CreateFolderButton } from "@/components/library/create-folder-button";
import { AddToFolderButton } from "@/components/library/add-to-folder-button";
import { FoldersPanel } from "@/components/library/folders-panel";

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

function ActivityCategoryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-5 h-5"} aria-hidden="true">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

type FolderRow = {
  id: string;
  name: string;
  color: string;
  created_at: string;
};

type FolderActivityRow = {
  folder_id: string;
  activity_id: string;
};

function ActivityGrid({
  activities,
  linkBase,
  showDelete = false,
  folders = [],
  folderActivities = [],
}: {
  activities: ActivityRow[];
  linkBase: string;
  showDelete?: boolean;
  folders?: FolderRow[];
  folderActivities?: FolderActivityRow[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {activities.map((activity, i) => {
        const accentColors = ["teal", "rose", "sage", "accent"] as const;
        const accent = accentColors[i % accentColors.length];
        return (
          <div key={activity.id} className="relative group">
            <Link href={`${linkBase}/${activity.id}`}>
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
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md mt-0.5"
                    style={{
                      background: `color-mix(in srgb, var(--desk-${accent === "accent" ? "accent" : accent}) 12%, transparent)`,
                      color: `var(--desk-${accent === "accent" ? "ink" : accent})`
                    }}
                  >
                    <ActivityCategoryIcon className="w-4 h-4" />
                  </span>
                  <h3 className="font-semibold text-desk-ink leading-snug line-clamp-2 text-base pr-6">
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
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {folders.length > 0 && (
                <AddToFolderButton
                  activityId={activity.id}
                  folders={folders}
                  memberFolderIds={folderActivities
                    .filter((fa) => fa.activity_id === activity.id)
                    .map((fa) => fa.folder_id)}
                />
              )}
              {showDelete && (
                <DeleteActivityButton activityId={activity.id} activityTitle={activity.title} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function sortActivities(activities: ActivityRow[], sort: string): ActivityRow[] {
  const sorted = [...activities];
  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    case "a-z":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "z-a":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
    default:
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const searchQuery = (params.q || "").trim().toLowerCase();
  const gradeFilter = params.grade || "";
  const subjectFilter = params.subject || "";
  const typeFilter = params.type || "";
  const categoryFilter = params.category || "";
  const sortOption = params.sort || "newest";

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

  // Fetch folders
  const { data: foldersData } = await supabase
    .from("folders")
    .select("id, name, color, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const folders: FolderRow[] = foldersData ?? [];

  // Fetch folder<->activity links
  const { data: folderActivitiesData } = await supabase
    .from("folder_activities")
    .select("folder_id, activity_id")
    .eq("user_id", user.id);

  const folderActivities: FolderActivityRow[] = folderActivitiesData ?? [];

  // All activities (mine + saved, deduped) for the folder panel
  const allActivityMap = new Map<string, ActivityRow>();
  for (const a of myActivities ?? []) allActivityMap.set(a.id, a);
  for (const a of savedActivities) allActivityMap.set(a.id, a);
  const allActivities = Array.from(allActivityMap.values());

  // Apply filters
  function filterActivities(list: ActivityRow[]) {
    return list.filter((a) => {
      if (searchQuery && !(
        a.title.toLowerCase().includes(searchQuery) ||
        a.summary?.toLowerCase().includes(searchQuery) ||
        a.category.toLowerCase().includes(searchQuery)
      )) return false;
      if (gradeFilter && a.grade_level !== gradeFilter) return false;
      if (subjectFilter && a.subject !== subjectFilter) return false;
      if (typeFilter && a.activity_type !== typeFilter) return false;
      if (categoryFilter && a.category !== categoryFilter) return false;
      return true;
    });
  }

  const filteredMine = sortActivities(filterActivities(myActivities ?? []), sortOption);
  const filteredSaved = sortActivities(filterActivities(savedActivities), sortOption);

  const myCount = myActivities?.length ?? 0;
  const savedCount = savedActivities.length;
  const folderCount = folders.length;

  const hasActiveFilters = gradeFilter || subjectFilter || typeFilter || categoryFilter || searchQuery;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
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
          <CreateFolderButton />
          <Link href="/wizard/step-1">
            <Button className="bg-desk-teal text-white hover:opacity-90">
              + New Activity
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <BinderFilters />
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
            My Activities
            <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-desk-teal/10 text-desk-teal text-xs font-bold w-5 h-5">
              {myCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="text-sm font-semibold data-[state=active]:bg-desk-paper data-[state=active]:text-desk-teal data-[state=active]:shadow-sm rounded-lg px-4 py-2"
          >
            Saved
            <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-desk-teal/10 text-desk-teal text-xs font-bold w-5 h-5">
              {savedCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="folders"
            className="text-sm font-semibold data-[state=active]:bg-desk-paper data-[state=active]:text-desk-teal data-[state=active]:shadow-sm rounded-lg px-4 py-2"
          >
            Folders
            <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-desk-teal/10 text-desk-teal text-xs font-bold w-5 h-5">
              {folderCount}
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
              <p className="text-lg" style={{ color: "var(--desk-muted)" }}>
                {hasActiveFilters
                  ? "No activities match your filters."
                  : `No activities match \u201c${params.q}\u201d.`}
              </p>
            </div>
          ) : (
            <ActivityGrid
              activities={filteredMine}
              linkBase="/marketplace"
              showDelete
              folders={folders}
              folderActivities={folderActivities}
            />
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
              <p className="text-lg" style={{ color: "var(--desk-muted)" }}>
                {hasActiveFilters
                  ? "No saved activities match your filters."
                  : `No saved activities match \u201c${params.q}\u201d.`}
              </p>
            </div>
          ) : (
            <ActivityGrid
              activities={filteredSaved}
              linkBase="/marketplace"
              folders={folders}
              folderActivities={folderActivities}
            />
          )}
        </TabsContent>

        {/* Folders Tab */}
        <TabsContent value="folders">
          <FoldersPanel
            folders={folders}
            folderActivities={folderActivities}
            allActivities={allActivities}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
