import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaperPage, StickyCard, StampBadge, HighlighterHeading } from "@/components/ui-desk";

export default function Home() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20 space-y-16">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <PaperPage className="text-center relative overflow-hidden">
        {/* Decorative corner mark */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 w-16 h-16 opacity-30"
          style={{
            background: "linear-gradient(225deg, var(--desk-accent) 50%, transparent 50%)",
          }}
        />

        <div className="inline-flex items-center justify-center mb-6">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-white text-2xl shadow-md select-none"
            style={{ background: "var(--desk-teal)" }}
          >
            ✦
          </div>
        </div>

        <HighlighterHeading as="h1" className="text-4xl md:text-5xl mb-3 ml-1">
          Planboard
        </HighlighterHeading>

        <p
          className="text-lg md:text-xl font-semibold mb-2"
          style={{ color: "var(--desk-ink)", fontFamily: "var(--font-fraunces)" }}
        >
          Turn lesson goals into classroom-ready activities.
        </p>
        <p
          className="text-base max-w-xl mx-auto mb-8 leading-relaxed"
          style={{ color: "var(--desk-muted)" }}
        >
          Choose your grade and subject, describe your lesson, and get four
          structured, implementable activity plans in seconds — powered by AI,
          designed for teachers.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/wizard/step-1">
            <Button
              size="lg"
              className="text-base px-8 py-5 bg-[var(--desk-teal)] text-white hover:opacity-90 shadow-sm gap-2"
            >
              ✦ Generate activities
            </Button>
          </Link>
          <Link href="/library">
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-5 border-[var(--desk-border)] text-[var(--desk-ink)] hover:bg-[var(--desk-bg)]"
            >
              Browse my binder
            </Button>
          </Link>
        </div>

        {/* Meta stamps */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <StampBadge color="teal">4 activities per run</StampBadge>
          <StampBadge color="sage">K-12 aligned</StampBadge>
          <StampBadge color="rose">10–20 sec generation</StampBadge>
        </div>
      </PaperPage>

      {/* ── How it works ────────────────────────────────────── */}
      <div className="space-y-4">
        <h2
          className="text-2xl font-bold text-center"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
        >
          Three steps, four activities
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            {
              num: "1",
              color: "teal" as const,
              title: "Grade & Subject",
              body: "Pick your target age group and subject so every suggestion is age-appropriate and curriculum-relevant.",
            },
            {
              num: "2",
              color: "rose" as const,
              title: "Lesson context",
              body: "Describe your lesson and learning objectives. The more specific you are, the better the activities.",
            },
            {
              num: "3",
              color: "sage" as const,
              title: "Ready-to-run plans",
              body: "Receive four detailed activity blueprints with materials, phases, evaluation criteria, and reflection prompts.",
            },
          ].map((step) => (
            <StickyCard key={step.num} color={step.color as "teal" | "rose" | "sage"} className="flex flex-col gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: `var(--desk-${step.color})` }}
              >
                {step.num}
              </div>
              <h3
                className="font-bold text-base"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--desk-muted)" }}>
                {step.body}
              </p>
            </StickyCard>
          ))}
        </div>
      </div>

      {/* ── Feature bullets ─────────────────────────────────── */}
      <PaperPage className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex-1 space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--desk-teal)" }}>
            What's included
          </p>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
          >
            Everything you need to run it tomorrow
          </h2>
        </div>
        <ul className="flex-1 space-y-3">
          {[
            { icon: "📋", text: "4 ready-to-run activity blueprints, every time" },
            { icon: "🎯", text: "Evaluation criteria + optional rubric per activity" },
            { icon: "💡", text: "Reflection questions and differentiation tips" },
            { icon: "🔗", text: "Curated resource links — validated before display" },
          ].map((item) => (
            <li key={item.text} className="flex items-start gap-3">
              <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
              <span className="text-sm leading-relaxed" style={{ color: "var(--desk-body)" }}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </PaperPage>

      {/* ── CTA strip ───────────────────────────────────────── */}
      <div className="text-center py-4">
        <Link href="/wizard/step-1">
          <Button
            size="lg"
            className="text-base px-10 py-5 bg-[var(--desk-teal)] text-white hover:opacity-90 shadow-md gap-2"
          >
            Start your first activity →
          </Button>
        </Link>
      </div>
    </div>
  );
}
