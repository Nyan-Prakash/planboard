"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizard-store";
import { WizardProgress } from "@/components/wizard/wizard-progress";
import { ActivityCard } from "@/components/wizard/activity-card";
import { Button } from "@/components/ui/button";
import { ConjureLoader, DeskEmptyState } from "@/components/ui-desk";
import type { Activity, ActivityContent } from "@/types";

interface GeneratedActivity {
  title: string;
  category: string;
  summary: string;
  content: ActivityContent;
}

export default function Step3Page() {
  const router = useRouter();
  const {
    gradeLevel,
    subject,
    activityType,
    lessonInfo,
    learningObjectives,
    generatedActivities,
    setGeneratedActivities,
    setGenerationRequestId,
    isGenerating,
    setIsGenerating,
  } = useWizardStore();

  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generate = useCallback(async () => {
    if (!gradeLevel || !subject || !activityType) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gradeLevel,
          subject,
          activityType,
          lessonInfo,
          learningObjectives,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate activities");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (!reader) throw new Error("No response stream");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not parse AI response");

      const parsed = JSON.parse(jsonMatch[0]);
      const activities: Activity[] = (parsed.activities || []).map(
        (a: GeneratedActivity, i: number) => ({
          id: `generated-${i}`,
          title: a.title,
          category: a.category,
          summary: a.summary,
          content: a.content,
          createdAt: new Date().toISOString(),
        })
      );

      const allUrls = activities.flatMap(
        (a) => a.content.resources?.filter((r) => r.url).map((r) => r.url!) || []
      );
      if (allUrls.length > 0) {
        try {
          const validateRes = await fetch("/api/validate-urls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls: allUrls }),
          });
          if (validateRes.ok) {
            const { valid } = await validateRes.json();
            const validSet = new Set(valid);
            for (const activity of activities) {
              if (activity.content.resources) {
                activity.content.resources = activity.content.resources.map((r) =>
                  r.url && !validSet.has(r.url) ? { ...r, url: undefined } : r
                );
              }
            }
          }
        } catch {
          // Keep URLs as-is if validation fails
        }
      }

      setGeneratedActivities(activities);

      try {
        const persistRes = await fetch("/api/activities/persist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gradeLevel,
            subject,
            activityType,
            lessonInfo,
            learningObjectives,
            activities: activities.map((a) => ({
              title: a.title,
              category: a.category,
              summary: a.summary,
              content: a.content,
            })),
          }),
        });
        if (persistRes.ok) {
          const { generationRequestId, activities: saved } = await persistRes.json();
          setGenerationRequestId(generationRequestId);
          const persisted = activities.map((a, i) => ({
            ...a,
            id: saved[i]?.id || a.id,
          }));
          setGeneratedActivities(persisted);
        }
      } catch {
        console.error("Failed to persist activities to database");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  }, [
    gradeLevel,
    subject,
    activityType,
    lessonInfo,
    learningObjectives,
    setGeneratedActivities,
    setGenerationRequestId,
    setIsGenerating,
  ]);

  useEffect(() => {
    if (!gradeLevel || !subject || !activityType) {
      router.push("/wizard/step-1");
      return;
    }
    if (!hasGenerated && generatedActivities.length === 0) {
      setHasGenerated(true);
      generate();
    }
  }, [gradeLevel, subject, activityType, hasGenerated, generatedActivities.length, generate, router]);

  if (!gradeLevel || !subject || !activityType) return null;

  return (
    <div>
      <WizardProgress currentStep={3} />

      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--desk-teal)" }}>
            Step 3
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
          >
            Your activities
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--desk-muted)" }}>
            Four AI-crafted lesson plans tailored to your context. Click any card to see the full plan.
          </p>
        </div>

        {/* Loading state */}
        {isGenerating && (
          <ConjureLoader
            label="Conjuring your activities…"
            sublabel="Brewing up 4 tailored lesson plans — this takes 10–20 seconds"
          />
        )}

        {/* Error state */}
        {error && !isGenerating && (
          <DeskEmptyState
            icon="pencil"
            heading="Something went wrong"
            body={error}
            actionLabel="Try again"
            onAction={() => {
              setHasGenerated(false);
              setGeneratedActivities([]);
              generate();
            }}
          />
        )}

        {/* Results grid */}
        {!isGenerating && !error && generatedActivities.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {generatedActivities.map((activity, i) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                category={activity.category}
                summary={activity.summary}
                index={i}
                onViewDetail={() => router.push(`/wizard/step-3/${activity.id}`)}
              />
            ))}
          </div>
        )}

        {/* Nav */}
        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/wizard/step-2")}
            className="border-[var(--desk-border)] text-[var(--desk-body)] hover:bg-[var(--desk-bg)]"
          >
            ← Back
          </Button>
          {!isGenerating && generatedActivities.length > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setGeneratedActivities([]);
                setGenerationRequestId(null);
                setHasGenerated(false);
                generate();
              }}
              className="border-[var(--desk-teal)] text-[var(--desk-teal)] hover:bg-[var(--desk-teal)]/5 gap-1.5"
            >
              ↺ Regenerate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

