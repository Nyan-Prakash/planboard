"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizard-store";
import { WizardProgress } from "@/components/wizard/wizard-progress";
import { ActivityCard } from "@/components/wizard/activity-card";
import { Button } from "@/components/ui/button";
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

      // Parse the JSON from the plain text stream response
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
          isSaved: false,
          createdAt: new Date().toISOString(),
        })
      );

      // Validate resource URLs server-side and remove broken links
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
          // If validation fails, keep URLs as-is
        }
      }

      setGeneratedActivities(activities);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
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
          <h1 className="text-2xl font-bold text-gray-900">
            Generated Activities
          </h1>
          <p className="mt-1 text-gray-500">
            Here are AI-generated activities tailored to your lesson. Click any
            activity to see full details.
          </p>
        </div>

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="mt-4 text-lg font-medium text-gray-600">
              Generating activities...
            </p>
            <p className="mt-1 text-sm text-gray-400">
              This may take 10-20 seconds
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-800 font-medium">Error: {error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setHasGenerated(false);
                setGeneratedActivities([]);
                generate();
              }}
            >
              Try Again
            </Button>
          </div>
        )}

        {!isGenerating && !error && generatedActivities.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {generatedActivities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                category={activity.category}
                summary={activity.summary}
                index={index}
                onViewDetail={() =>
                  router.push(`/wizard/step-3/${index}`)
                }
              />
            ))}
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/wizard/step-2")}
          >
            Back
          </Button>
          {!isGenerating && generatedActivities.length > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setGeneratedActivities([]);
                setHasGenerated(false);
                generate();
              }}
            >
              Regenerate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
