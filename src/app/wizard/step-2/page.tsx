"use client";

import { useRouter } from "next/navigation";
import { useWizardStore } from "@/stores/wizard-store";
import { WizardProgress } from "@/components/wizard/wizard-progress";
import { ACTIVITY_TYPES, type ActivityType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StickyCard } from "@/components/ui-desk";
import { cn } from "@/lib/utils";

export default function Step2Page() {
  const router = useRouter();
  const {
    gradeLevel,
    subject,
    activityType,
    lessonInfo,
    learningObjectives,
    setActivityType,
    setLessonInfo,
    setLearningObjectives,
  } = useWizardStore();

  if (!gradeLevel || !subject) {
    router.push("/wizard/step-1");
    return null;
  }

  const canProceed =
    activityType &&
    lessonInfo.trim().length >= 10 &&
    learningObjectives.trim().length >= 10;

  return (
    <div>
      <WizardProgress currentStep={2} />

      <div className="flex gap-6 items-start">
        {/* Main content */}
        <div className="flex-1 space-y-8 min-w-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--desk-teal)" }}>
              Step 2
            </p>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
            >
              Lesson context
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--desk-muted)" }}>
              The richer your description, the more targeted and implementable the activities.
            </p>
          </div>

          {/* Activity type */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold" style={{ color: "var(--desk-ink)" }}>
              Activity type
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setActivityType(type.value as ActivityType)}
                  aria-pressed={activityType === type.value}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border-2 p-5 text-left transition-all duration-150 hover:-translate-y-0.5",
                    "bg-[var(--desk-paper)]",
                    activityType === type.value
                      ? "border-[var(--desk-teal)] shadow-md"
                      : "border-[var(--desk-border)] hover:border-[var(--desk-teal)]/40"
                  )}
                  style={
                    activityType === type.value
                      ? { background: "color-mix(in srgb, var(--desk-teal) 5%, var(--desk-paper))" }
                      : undefined
                  }
                >
                  <span
                    className="text-sm font-bold"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: activityType === type.value ? "var(--desk-teal)" : "var(--desk-ink)",
                    }}
                  >
                    {type.label}
                  </span>
                  <span className="text-xs leading-relaxed" style={{ color: "var(--desk-muted)" }}>
                    {type.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Lesson info */}
          <div className="space-y-2">
            <Label
              htmlFor="lessonInfo"
              className="text-base font-semibold"
              style={{ color: "var(--desk-ink)" }}
            >
              Lesson information
            </Label>
            <p className="text-sm" style={{ color: "var(--desk-muted)" }}>
              Key topics, content, and context of your lesson
            </p>
            <Textarea
              id="lessonInfo"
              value={lessonInfo}
              onChange={(e) => setLessonInfo(e.target.value)}
              placeholder="e.g. The lesson covers the emergence and disappearance of civilizations, comparing Ibn Khaldun and Arnold Toynbee's perspectives on cyclical history…"
              className="min-h-[140px] border-[var(--desk-border)] bg-[var(--desk-paper)] focus:border-[var(--desk-teal)] resize-y text-sm"
            />
            <p
              className="text-xs"
              style={{ color: lessonInfo.length >= 10 ? "var(--desk-teal)" : "var(--desk-muted)" }}
            >
              {lessonInfo.length} / 10 min characters
              {lessonInfo.length >= 10 && " ✓"}
            </p>
          </div>

          {/* Learning objectives */}
          <div className="space-y-2">
            <Label
              htmlFor="objectives"
              className="text-base font-semibold"
              style={{ color: "var(--desk-ink)" }}
            >
              Learning objectives
            </Label>
            <p className="text-sm" style={{ color: "var(--desk-muted)" }}>
              What should students be able to do after this lesson?
            </p>
            <Textarea
              id="objectives"
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              placeholder="e.g. Students will compare historical perspectives, develop critical thinking through debate, and articulate their own informed position…"
              className="min-h-[120px] border-[var(--desk-border)] bg-[var(--desk-paper)] focus:border-[var(--desk-teal)] resize-y text-sm"
            />
            <p
              className="text-xs"
              style={{ color: learningObjectives.length >= 10 ? "var(--desk-teal)" : "var(--desk-muted)" }}
            >
              {learningObjectives.length} / 10 min characters
              {learningObjectives.length >= 10 && " ✓"}
            </p>
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/wizard/step-1")}
              className="border-[var(--desk-border)] text-[var(--desk-body)] hover:bg-[var(--desk-bg)]"
            >
              ← Back
            </Button>
            <Button
              size="lg"
              disabled={!canProceed}
              onClick={() => router.push("/wizard/step-3")}
              className="bg-[var(--desk-teal)] text-white hover:opacity-90 px-8 gap-2"
            >
              ✦ Generate activities
            </Button>
          </div>
        </div>

        {/* Tip */}
        <aside className="hidden lg:block w-56 shrink-0 mt-16 space-y-4">
          <StickyCard color="yellow">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--desk-teal)" }}>
              💡 Tip
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--desk-body)" }}>
              Good lesson info includes: the unit topic, key concepts, any prior knowledge
              students have, and how this lesson fits in the sequence.
            </p>
          </StickyCard>
          <StickyCard color="teal">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-white">
              ✎ Example objective
            </p>
            <p className="text-xs leading-relaxed text-white/80">
              &ldquo;Students will be able to compare two opposing historical theories and
              support their position with at least two pieces of evidence.&rdquo;
            </p>
          </StickyCard>
        </aside>
      </div>
    </div>
  );
}

