"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizard-store";
import { createClient } from "@/lib/supabase/client";
import { WizardProgress } from "@/components/wizard/wizard-progress";
import { SaveButton } from "@/components/activity/save-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { NotebookSection, StampBadge, StickyCard, ConjureLoader, DeskEmptyState } from "@/components/ui-desk";
import type { Activity } from "@/types";

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { generatedActivities } = useWizardStore();
  const activityId = params.activityId as string;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [teacherNotes, setTeacherNotes] = useState("");

  useEffect(() => {
    // Load teacher notes from localStorage
    const saved = localStorage.getItem(`teacher-notes-${activityId}`);
    if (saved) setTeacherNotes(saved);

    const fromStore =
      generatedActivities.find((a) => a.id === activityId) ||
      generatedActivities[parseInt(activityId, 10)];

    if (fromStore) {
      setActivity(fromStore);
      setLoading(false);
      if (!fromStore.id.startsWith("generated-")) {
        checkSaveStatus(fromStore.id);
      }
      return;
    }
    fetchFromDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId]);

  async function fetchFromDb() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("id", activityId)
      .single();

    if (error || !data) {
      setLoading(false);
      return;
    }

    setActivity({
      id: data.id,
      title: data.title,
      category: data.category,
      summary: data.summary,
      content: data.content as Activity["content"],
      createdAt: data.created_at,
      gradeLevel: data.grade_level,
      subject: data.subject,
      activityType: data.activity_type,
      isPublic: data.is_public,
    });
    setLoading(false);
    checkSaveStatus(data.id);
  }

  async function checkSaveStatus(id: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("saves")
      .select("id")
      .eq("user_id", user.id)
      .eq("activity_id", id)
      .single();
    setIsSaved(!!data);
  }

  const handleCopy = async () => {
    if (!activity) return;
    const text = `${activity.title}\n\n${activity.summary}\n\n${activity.content.overview}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotes = (value: string) => {
    setTeacherNotes(value);
    localStorage.setItem(`teacher-notes-${activityId}`, value);
  };

  if (loading) {
    return (
      <div>
        <WizardProgress currentStep={3} />
        <ConjureLoader label="Loading activity…" sublabel="" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div>
        <WizardProgress currentStep={3} />
        <DeskEmptyState
          icon="binder"
          heading="Activity not found"
          body="This activity may have expired from your session. Head back to your generated activities."
          actionLabel="Back to activities"
          onAction={() => router.push("/wizard/step-3")}
        />
      </div>
    );
  }

  const { content } = activity;
  const isPersistedId = !activity.id.startsWith("generated-");

  return (
    <div>
      <WizardProgress currentStep={3} />

      <div className="flex gap-6 items-start">
        {/* ── Main column ────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/wizard/step-3")}
                className="text-desk-muted hover:text-desk-ink -ml-2"
              >
                ← All activities
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="border-desk-border text-desk-body text-xs gap-1"
                >
                  {copied ? "✓ Copied!" : "⎘ Copy activity"}
                </Button>
                {isPersistedId && (
                  <SaveButton activityId={activity.id} initialSaved={isSaved} />
                )}
              </div>
            </div>

            <div>
              <h1
                className="text-2xl font-bold leading-snug"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
              >
                {activity.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="capitalize text-xs"
                  style={{
                    background: "color-mix(in srgb, var(--desk-teal) 12%, transparent)",
                    color: "var(--desk-teal)",
                    border: "1px solid color-mix(in srgb, var(--desk-teal) 30%, transparent)",
                  }}
                >
                  {activity.category.replace(/_/g, " ")}
                </Badge>
                {activity.gradeLevel && (
                  <StampBadge color="ink">{activity.gradeLevel.replace(/_/g, " ")}</StampBadge>
                )}
                {activity.subject && (
                  <StampBadge color="ink">{activity.subject.replace(/_/g, " ")}</StampBadge>
                )}
                <StampBadge color="teal">⏱ {content.structure?.duration || "—"}</StampBadge>
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--desk-muted)" }}>
                {activity.summary}
              </p>
            </div>
          </div>

          {/* Tabbed content */}
          <Tabs defaultValue="plan">
            <TabsList
              className="mb-4 gap-1 rounded-lg p-1"
              style={{ background: "var(--desk-bg)", border: "1px solid var(--desk-border)" }}
            >
              {[
                { value: "plan", label: "📋 Plan" },
                { value: "materials", label: "🛠 Materials" },
                { value: "evaluation", label: "🎯 Evaluation" },
                { value: "reflection", label: "💬 Reflection" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs font-semibold data-[state=active]:bg-desk-paper data-[state=active]:text-desk-teal data-[state=active]:shadow-sm rounded-md px-3 py-1.5"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ── Plan tab ── */}
            <TabsContent value="plan" className="space-y-0 mt-0">
              <NotebookSection label="Overview">
                <p className="text-sm leading-relaxed" style={{ color: "var(--desk-body)" }}>
                  {content.overview}
                </p>
              </NotebookSection>

              <NotebookSection label="Research & Preparation" color="rose">
                <p className="text-sm mb-3" style={{ color: "var(--desk-body)" }}>
                  {content.researchAndPreparation.description}
                </p>
                <ol className="space-y-2 pl-1">
                  {content.researchAndPreparation.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm" style={{ color: "var(--desk-body)" }}>
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold mt-0.5"
                        style={{ background: "var(--desk-rose)" }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </NotebookSection>

              <NotebookSection label="Activity Structure" color="sage">
                <p className="text-xs mb-4 font-semibold" style={{ color: "var(--desk-muted)" }}>
                  Total duration: {content.structure.duration}
                </p>
                <div className="space-y-4">
                  {content.structure.phases.map((phase, i) => (
                    <div key={i}>
                      {i > 0 && <Separator className="mb-4" style={{ background: "var(--desk-border)" }} />}
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                          style={{ background: "var(--desk-sage)" }}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold" style={{ color: "var(--desk-ink)" }}>
                              {phase.name}
                            </h4>
                            <StampBadge color="sage">{phase.duration}</StampBadge>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--desk-body)" }}>
                            {phase.instructions}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </NotebookSection>

              {/* Differentiation */}
              <NotebookSection label="Differentiation" color="accent">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="paper-card p-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--desk-teal)" }}>
                      ↑ Advanced students
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--desk-body)" }}>
                      {content.adaptations.higherLevel}
                    </p>
                  </div>
                  <div className="paper-card p-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--desk-rose)" }}>
                      ↓ Students needing support
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--desk-body)" }}>
                      {content.adaptations.lowerLevel}
                    </p>
                  </div>
                </div>
              </NotebookSection>
            </TabsContent>

            {/* ── Materials tab ── */}
            <TabsContent value="materials" className="mt-0">
              <NotebookSection label="Format">
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--desk-body)" }}>
                  {content.format.description}
                </p>
              </NotebookSection>
              <NotebookSection label="Materials needed" color="rose">
                <ul className="space-y-2">
                  {content.format.materials.map((material, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--desk-body)" }}>
                      <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "var(--desk-rose)" }} />
                      {material}
                    </li>
                  ))}
                </ul>
              </NotebookSection>
              {content.resources && content.resources.length > 0 && (
                <NotebookSection label="Suggested resources" color="sage">
                  <ul className="space-y-3">
                    {content.resources.map((resource, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <StampBadge color="sage" className="shrink-0 mt-0.5">{resource.type}</StampBadge>
                        {resource.url ? (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline-offset-2 hover:underline"
                            style={{ color: "var(--desk-teal)" }}
                          >
                            {resource.title} ↗
                          </a>
                        ) : (
                          <span className="text-sm" style={{ color: "var(--desk-body)" }}>{resource.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </NotebookSection>
              )}
            </TabsContent>

            {/* ── Evaluation tab ── */}
            <TabsContent value="evaluation" className="mt-0">
              <NotebookSection label="Evaluation criteria">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: `1px solid var(--desk-border)`, background: "var(--desk-bg)" }}>
                        <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-widest" style={{ color: "var(--desk-muted)" }}>Criterion</th>
                        <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-widest" style={{ color: "var(--desk-muted)" }}>Weight</th>
                        <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-widest" style={{ color: "var(--desk-muted)" }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.evaluation.criteria.map((criterion, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid var(--desk-border)` }}>
                          <td className="px-3 py-2.5 font-semibold text-sm" style={{ color: "var(--desk-ink)" }}>{criterion.name}</td>
                          <td className="px-3 py-2.5">
                            <StampBadge color="teal">{criterion.weight}%</StampBadge>
                          </td>
                          <td className="px-3 py-2.5 text-sm" style={{ color: "var(--desk-body)" }}>{criterion.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {content.evaluation.rubric && (
                  <div className="mt-4 p-4 rounded-lg" style={{ background: "var(--desk-bg)", border: "1px solid var(--desk-border)" }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--desk-muted)" }}>Rubric</p>
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--desk-body)" }}>
                      {content.evaluation.rubric}
                    </p>
                  </div>
                )}
              </NotebookSection>
            </TabsContent>

            {/* ── Reflection tab ── */}
            <TabsContent value="reflection" className="mt-0">
              <NotebookSection label="Reflection questions" color="rose">
                <ol className="space-y-4">
                  {content.reflection.questions.map((question, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold mt-0.5"
                        style={{ background: "var(--desk-rose)" }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--desk-body)" }}>
                        {question}
                      </p>
                    </li>
                  ))}
                </ol>
              </NotebookSection>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-between pb-8 pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/wizard/step-3")}
              className="border-desk-border text-desk-body"
            >
              ← Back
            </Button>
            {isPersistedId && (
              <Button
                size="lg"
                onClick={() => router.push(`/rate/${activity.id}`)}
                className="bg-desk-teal text-white hover:opacity-90"
              >
                Rate this activity
              </Button>
            )}
          </div>
        </div>

        {/* ── Teacher Notes sidebar ─────────────────── */}
        <aside className="hidden lg:block w-60 shrink-0 mt-4 space-y-4">
          <StickyCard color="yellow">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--desk-teal)" }}>
              ✏️ Teacher notes
            </p>
            <Textarea
              value={teacherNotes}
              onChange={(e) => handleSaveNotes(e.target.value)}
              placeholder="Jot down your thoughts, adaptations, or reminders…"
              className="text-xs min-h-35 resize-none border-(--desk-accent)/30 bg-transparent focus:border-desk-teal p-0"
              style={{ color: "var(--desk-body)", background: "transparent" }}
            />
            <p className="mt-2 text-xs" style={{ color: "var(--desk-muted)" }}>
              Saved locally in your browser.
            </p>
          </StickyCard>
        </aside>
      </div>
    </div>
  );
}
