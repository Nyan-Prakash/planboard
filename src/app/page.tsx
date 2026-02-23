import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PaperPage,
  StickyCard,
  StampBadge,
  HighlighterHeading,
  NotebookSection,
  Reveal,
  AnimatedCounter,
} from "@/components/ui-desk";
import { WaitlistForm } from "@/components/landing/waitlist-form";

export default function Home() {
  return (
    <div className="space-y-0">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20">
        {/* Background decorative elements */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="float-slow absolute top-16 left-[8%] w-3 h-3 rounded-full" style={{ background: "var(--desk-teal)", opacity: 0.2 }} />
          <div className="float-medium absolute top-32 right-[12%] w-2 h-2 rounded-full" style={{ background: "var(--desk-rose)", opacity: 0.25 }} />
          <div className="float-fast absolute bottom-24 left-[15%] w-2.5 h-2.5 rounded-full" style={{ background: "var(--desk-sage)", opacity: 0.2 }} />
          <div className="float-slow absolute top-48 right-[25%] w-2 h-2 rounded-full" style={{ background: "var(--desk-accent)", opacity: 0.3 }} />
          <div className="float-medium absolute bottom-16 right-[8%] w-3 h-3 rounded-full" style={{ background: "var(--desk-teal)", opacity: 0.15 }} />
          {/* Extra floating shapes */}
          <div className="float-fast absolute top-20 left-[45%] w-1.5 h-1.5 rounded-full" style={{ background: "var(--desk-rose)", opacity: 0.15 }} />
          <div className="float-slow absolute bottom-32 left-[60%] w-2 h-2 rounded-full" style={{ background: "var(--desk-sage)", opacity: 0.18 }} />
        </div>

        <div className="container mx-auto max-w-5xl px-4 text-center relative">
          {/* Overline stamp */}
          <div className="animate-fade-in-up mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{ borderColor: "var(--desk-border)", background: "var(--desk-paper)" }}>
            <span className="inline-block h-2 w-2 rounded-full glow-dot" style={{ background: "var(--desk-teal)" }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--desk-muted)" }}>
              AI-powered lesson planning
            </span>
          </div>

          {/* Logo mark with sparkles */}
          <div className="animate-fade-in-up animate-delay-1 flex items-center justify-center mb-5">
            <div className="relative">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-white text-3xl shadow-lg select-none"
                style={{ background: "linear-gradient(135deg, var(--desk-teal), #1f7a6f)" }}
              >
                ✦
              </div>
              {/* Sparkle particles around logo */}
              <svg className="sparkle absolute -top-2 -right-2 w-4 h-4" viewBox="0 0 16 16" fill="var(--desk-accent)" aria-hidden>
                <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
              </svg>
              <svg className="sparkle absolute -bottom-1 -left-3 w-3 h-3" viewBox="0 0 16 16" fill="var(--desk-teal)" aria-hidden>
                <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
              </svg>
              <svg className="sparkle absolute top-1 -left-4 w-2.5 h-2.5" viewBox="0 0 16 16" fill="var(--desk-rose)" aria-hidden>
                <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
              </svg>
            </div>
          </div>

          <HighlighterHeading as="h1" className="animate-fade-in-up animate-delay-2 text-5xl md:text-6xl lg:text-7xl mb-4">
            Planboard
          </HighlighterHeading>

          <p className="animate-fade-in-up animate-delay-3 text-xl md:text-2xl font-semibold mb-3"
            style={{ color: "var(--desk-ink)", fontFamily: "var(--font-fraunces)" }}>
            Turn lesson goals into classroom-ready activities<span className="type-cursor" />
          </p>
          <p className="animate-fade-in-up animate-delay-4 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--desk-muted)" }}>
            Describe your lesson, and our ML-driven engine generates four structured,
            standards-aligned activity plans in seconds — refined by real teacher feedback
            through our custom feedback loop.
          </p>

          <div className="animate-fade-in-up animate-delay-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/wizard/step-1">
              <Button
                size="lg"
                className="shimmer-btn pulse-ring px-10 py-6 bg-desk-teal text-white hover:opacity-90 shadow-md gap-2 text-lg"
              >
                Generate activities
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-6 border-desk-border text-desk-ink hover:bg-desk-bg text-lg"
              >
                Explore marketplace
              </Button>
            </Link>
          </div>

          {/* Meta stamps */}
          <div className="animate-fade-in-up animate-delay-5 mt-10 flex flex-wrap items-center justify-center gap-3">
            <StampBadge color="teal">4 activities per run</StampBadge>
            <StampBadge color="sage">K-12 aligned</StampBadge>
            <StampBadge color="rose">10–20 sec generation</StampBadge>
            <StampBadge color="accent">Design thinking framework</StampBadge>
          </div>
        </div>
      </section>

      {/* ── Social proof bar ──────────────────────────────────── */}
      <section className="border-y py-6" style={{ borderColor: "var(--desk-border)", background: "var(--desk-paper)" }}>
        <div className="container mx-auto max-w-5xl px-4 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { value: "4", label: "Activities per generation" },
            { value: "<20s", label: "Generation time" },
            { value: "K-12", label: "Grade coverage" },
            { value: "ML", label: "Feedback-refined" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter
                value={stat.value}
                className="block text-2xl md:text-3xl font-bold"
                style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-teal)" }}
              />
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--desk-muted)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="relative container mx-auto max-w-5xl px-4 py-20 md:py-28">
        {/* Background floating decorations */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="float-slow absolute top-8 right-[5%] w-2.5 h-2.5 rounded-full" style={{ background: "var(--desk-teal)", opacity: 0.15 }} />
          <div className="float-medium absolute top-24 left-[3%] w-2 h-2 rounded-full" style={{ background: "var(--desk-rose)", opacity: 0.12 }} />
          <div className="float-fast absolute bottom-16 right-[10%] w-3 h-3 rounded-full" style={{ background: "var(--desk-sage)", opacity: 0.1 }} />
          <div className="float-slow absolute bottom-32 left-[8%] w-1.5 h-1.5 rounded-full" style={{ background: "var(--desk-accent)", opacity: 0.2 }} />
        </div>

        <Reveal>
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--desk-teal)" }}>
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold ribbon-text" style={{ fontFamily: "var(--font-fraunces)" }}>
              Three steps, four activities
            </h2>
            <p className="mt-3 text-base max-w-lg mx-auto" style={{ color: "var(--desk-muted)" }}>
              From idea to implementation-ready lesson plans in under 20 seconds.
            </p>
          </div>
        </Reveal>

        {/* Animated dotted connector line (desktop only) */}
        <div className="hidden sm:block relative mb-4">
          <svg className="absolute top-5 left-[16.67%] w-[66.66%] h-6 pointer-events-none" viewBox="0 0 800 24" fill="none" preserveAspectRatio="none" aria-hidden>
            {/* Background track */}
            <path d="M0 12h800" stroke="var(--desk-border)" strokeWidth="2" strokeDasharray="6 6" opacity="0.35" />
            {/* Animated flowing dots */}
            <path className="dash-animate" d="M0 12h800" stroke="var(--desk-teal)" strokeWidth="2.5" strokeDasharray="4 12" opacity="0.5" style={{ animationDuration: "2s" }} />
            {/* Step node circles */}
            <circle cx="0" cy="12" r="6" fill="var(--desk-teal)" opacity="0.9" />
            <circle cx="0" cy="12" r="3" fill="white" />
            <circle cx="400" cy="12" r="6" fill="var(--desk-rose)" opacity="0.9" />
            <circle cx="400" cy="12" r="3" fill="white" />
            <circle cx="800" cy="12" r="6" fill="var(--desk-sage)" opacity="0.9" />
            <circle cx="800" cy="12" r="3" fill="white" />
          </svg>
        </div>

        <Reveal variant="stagger">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                num: "1",
                color: "teal" as const,
                title: "Grade & Subject",
                body: "Pick your target age group and subject so every suggestion is age-appropriate and curriculum-relevant.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" />
                  </svg>
                ),
              },
              {
                num: "2",
                color: "rose" as const,
                title: "Lesson context",
                body: "Describe your lesson and learning objectives. The more specific you are, the more tailored the activities.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                ),
              },
              {
                num: "3",
                color: "sage" as const,
                title: "Ready-to-run plans",
                body: "Receive four detailed activity blueprints with materials, evaluation criteria, differentiation tips, and reflection prompts.",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                ),
              },
            ].map((step, i) => (
              <div key={step.num} className="reveal-child relative">
                {/* Mobile dotted connector (between cards, not after last) */}
                {i < 2 && (
                  <div className="sm:hidden flex justify-center -mb-3 mt-1">
                    <svg width="4" height="40" viewBox="0 0 4 40" fill="none" aria-hidden>
                      <path className="dash-animate" d="M2 0v40" stroke={`var(--desk-${step.color})`} strokeWidth="2" strokeDasharray="4 4" opacity="0.4" style={{ animationDuration: "1.5s" }} />
                    </svg>
                  </div>
                )}
                <StickyCard color={step.color} className="magnetic-card flex flex-col gap-4 h-full relative overflow-hidden">
                  {/* Decorative corner glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06]"
                    style={{ background: `radial-gradient(circle, var(--desk-${step.color}), transparent 70%)` }}
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className="step-number-pop w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-md relative"
                      style={{ background: `linear-gradient(135deg, var(--desk-${step.color}), color-mix(in srgb, var(--desk-${step.color}) 70%, #000))` }}
                    >
                      {step.num}
                      {/* Subtle ring pulse */}
                      <span className="absolute inset-0 rounded-xl step-ring-pulse" style={{ boxShadow: `0 0 0 0 var(--desk-${step.color})` }} />
                    </div>
                    <div className="icon-bob opacity-40" style={{ color: `var(--desk-${step.color})` }}>
                      {step.icon}
                    </div>
                    {/* Step label pill */}
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: `color-mix(in srgb, var(--desk-${step.color}) 10%, transparent)`, color: `var(--desk-${step.color})` }}>
                      Step {step.num}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--desk-muted)" }}>
                    {step.body}
                  </p>
                  {/* Bottom accent bar */}
                  <div className="mt-auto pt-3 flex items-center gap-2">
                    <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: "color-mix(in srgb, var(--desk-border) 40%, transparent)" }}>
                      <div className="h-full rounded-full storefront-bar" style={{ background: `var(--desk-${step.color})`, opacity: 0.4, width: "100%" }} />
                    </div>
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke={`var(--desk-${step.color})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                    </svg>
                  </div>
                </StickyCard>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Bottom result teaser */}
        <Reveal>
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border px-5 py-2.5 shadow-sm magnetic-card"
              style={{ borderColor: "var(--desk-border)", background: "var(--desk-paper)" }}>
              <div className="flex -space-x-1">
                {["var(--desk-teal)", "var(--desk-rose)", "var(--desk-sage)", "var(--desk-accent)"].map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                    style={{ background: c, zIndex: 4 - i }}>
                    <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5" stroke="white" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    </svg>
                  </div>
                ))}
              </div>
              <span className="text-xs font-semibold" style={{ color: "var(--desk-muted)" }}>
                4 unique activities generated every run
              </span>
              <span className="glow-dot w-2 h-2 rounded-full" style={{ background: "var(--desk-teal)" }} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Design Thinking Framework ─────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: "var(--desk-paper)" }}>
        <div className="container mx-auto max-w-5xl px-4">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--desk-rose)" }}>
                Methodology
              </p>
              <h2 className="text-3xl md:text-4xl font-bold ribbon-text" style={{ fontFamily: "var(--font-fraunces)" }}>
                Rooted in Design Thinking
              </h2>
              <p className="mt-3 text-base max-w-2xl mx-auto" style={{ color: "var(--desk-muted)" }}>
                Every activity Planboard generates follows the five stages of design thinking —
                ensuring lessons that empathize with student needs, challenge assumptions,
                and produce innovative learning experiences.
              </p>
            </div>
          </Reveal>

          {/* Animated connector SVG (desktop) */}
          <div className="hidden md:block relative mb-2">
            <svg className="absolute top-6 left-[10%] w-[80%] h-4 pointer-events-none" viewBox="0 0 800 16" fill="none" preserveAspectRatio="none" aria-hidden>
              <path className="dash-animate" d="M0 8h800" stroke="var(--desk-border)" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>

          <Reveal variant="stagger">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                {
                  stage: "Empathize",
                  color: "var(--desk-teal)",
                  description: "Understand student needs, learning styles, and prior knowledge to shape activity context.",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  ),
                },
                {
                  stage: "Define",
                  color: "var(--desk-rose)",
                  description: "Frame precise learning objectives and success criteria from your lesson goals.",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                    </svg>
                  ),
                },
                {
                  stage: "Ideate",
                  color: "var(--desk-accent)",
                  description: "AI generates diverse activity variations — divergent thinking at machine speed.",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" />
                      <path d="M9 21h6M10 17v4M14 17v4" />
                    </svg>
                  ),
                },
                {
                  stage: "Prototype",
                  color: "var(--desk-sage)",
                  description: "Structured blueprints with materials, phases, and rubrics — ready to test in class.",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><path d="M3 9h18M9 21V9" />
                    </svg>
                  ),
                },
                {
                  stage: "Test",
                  color: "var(--desk-teal)",
                  description: "Rate, reflect, and refine — your feedback trains the model to generate better activities.",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <div key={item.stage} className="reveal-child relative">
                  <PaperPage className="magnetic-card text-center h-full flex flex-col items-center gap-3 px-4 py-6">
                    <div
                      className="icon-bob w-12 h-12 rounded-xl flex items-center justify-center mb-1"
                      style={{ background: `color-mix(in srgb, ${item.color} 12%, transparent)`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <h3
                      className="font-bold text-sm"
                      style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
                    >
                      {item.stage}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--desk-muted)" }}>
                      {item.description}
                    </p>
                  </PaperPage>
                  {/* Connector arrow (hidden on last item and on mobile) */}
                  {i < 4 && (
                    <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-desk-border">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Custom ML Feedback Loop ───────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Visual */}
          <Reveal variant="scale">
            <div className="flex items-center justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                {/* Outer orbit ring */}
                <div className="orbit-ring absolute inset-0 rounded-full border-2 border-dashed" style={{ borderColor: "color-mix(in srgb, var(--desk-teal) 25%, transparent)" }} />
                {/* Middle orbit ring */}
                <div className="orbit-ring-reverse absolute inset-6 rounded-full border border-dashed" style={{ borderColor: "color-mix(in srgb, var(--desk-sage) 15%, transparent)" }} />
                {/* Inner orbit ring */}
                <div className="orbit-ring absolute inset-12 rounded-full border-2 border-dashed" style={{ borderColor: "color-mix(in srgb, var(--desk-rose) 20%, transparent)" }} />

                {/* Ambient glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
                  <div className="w-32 h-32 rounded-full glow-dot" style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--desk-teal) 8%, transparent), transparent 70%)" }} />
                </div>

                {/* Center hub */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center shadow-lg"
                    style={{ background: "linear-gradient(135deg, var(--desk-teal), #1f7a6f)" }}>
                    <span className="text-white text-2xl mb-0.5">✦</span>
                    <span className="text-white/80 text-[9px] font-bold uppercase tracking-widest">ML Engine</span>
                  </div>
                </div>

                {/* Orbiting nodes */}
                {[
                  { label: "Generate", angle: 0, color: "var(--desk-teal)", icon: "M12 5v14M5 12h14" },
                  { label: "Teach", angle: 90, color: "var(--desk-sage)", icon: "M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" },
                  { label: "Rate", angle: 180, color: "var(--desk-rose)", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
                  { label: "Improve", angle: 270, color: "var(--desk-accent)", icon: "M23 6l-9.5 9.5-5-5L1 18" },
                ].map((node) => {
                  const radius = 120;
                  const rad = (node.angle * Math.PI) / 180;
                  const x = Math.cos(rad) * radius;
                  const y = Math.sin(rad) * radius;
                  return (
                    <div
                      key={node.label}
                      className="absolute flex flex-col items-center gap-1"
                      style={{
                        top: `calc(50% + ${y}px - 20px)`,
                        left: `calc(50% + ${x}px - 24px)`,
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md magnetic-card"
                        style={{ background: "var(--desk-paper)", border: `2px solid ${node.color}` }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke={node.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={node.icon} />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--desk-muted)" }}>
                        {node.label}
                      </span>
                    </div>
                  );
                })}

                {/* Flow arrows SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 320" fill="none" aria-hidden>
                  <path className="dash-animate" d="M200 160 A40 40 0 0 1 160 200" stroke="var(--desk-teal)" strokeWidth="1.5" opacity="0.3" />
                  <path className="dash-animate" d="M160 200 A40 40 0 0 1 120 160" stroke="var(--desk-sage)" strokeWidth="1.5" opacity="0.3" />
                  <path className="dash-animate" d="M120 160 A40 40 0 0 1 160 120" stroke="var(--desk-rose)" strokeWidth="1.5" opacity="0.3" />
                  <path className="dash-animate" d="M160 120 A40 40 0 0 1 200 160" stroke="var(--desk-accent)" strokeWidth="1.5" opacity="0.3" />
                </svg>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--desk-teal)" }}>
                  Continuous improvement
                </p>
                <h2 className="text-3xl md:text-4xl font-bold ribbon-text" style={{ fontFamily: "var(--font-fraunces)" }}>
                  Custom ML Feedback Loop
                </h2>
              </div>
              <p className="text-base leading-relaxed" style={{ color: "var(--desk-body)" }}>
                Planboard doesn&apos;t just generate activities — it learns from every teacher interaction.
                Our custom machine learning pipeline captures your ratings, preferences, and classroom outcomes
                to continuously refine the quality and relevance of generated content.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Generate",
                    desc: "Our ML model produces four activity blueprints tailored to your grade, subject, and lesson context.",
                    color: "teal" as const,
                  },
                  {
                    title: "Teach & observe",
                    desc: "Run the activities in your classroom and note what works and what needs adjustment.",
                    color: "sage" as const,
                  },
                  {
                    title: "Rate & reflect",
                    desc: "Score each activity on relevance, engagement, and clarity — feeding structured signals back to the model.",
                    color: "rose" as const,
                  },
                  {
                    title: "Model improves",
                    desc: "Aggregated feedback tunes our generation pipeline, so future activities are smarter and more classroom-ready.",
                    color: "rose" as const,
                  },
                ].map((item) => (
                  <NotebookSection key={item.title} label={item.title} color={item.color}>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--desk-muted)" }}>
                      {item.desc}
                    </p>
                  </NotebookSection>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What's included (Feature bullets) ─────────────────── */}
      <section className="relative py-20 md:py-28" style={{ background: "var(--desk-paper)" }}>
        {/* Background decorative elements */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="float-medium absolute top-12 left-[6%] w-2 h-2 rounded-full" style={{ background: "var(--desk-sage)", opacity: 0.15 }} />
          <div className="float-slow absolute top-28 right-[4%] w-3 h-3 rounded-full" style={{ background: "var(--desk-teal)", opacity: 0.1 }} />
          <div className="float-fast absolute bottom-20 left-[12%] w-2 h-2 rounded-full" style={{ background: "var(--desk-rose)", opacity: 0.12 }} />
          <div className="float-medium absolute bottom-12 right-[15%] w-2.5 h-2.5 rounded-full" style={{ background: "var(--desk-accent)", opacity: 0.15 }} />
          {/* Decorative corner SVG patterns */}
          <svg className="absolute top-0 left-0 w-40 h-40 opacity-[0.04]" viewBox="0 0 160 160" fill="none" aria-hidden>
            <circle cx="0" cy="0" r="140" stroke="var(--desk-teal)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="0" cy="0" r="100" stroke="var(--desk-sage)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="0" cy="0" r="60" stroke="var(--desk-rose)" strokeWidth="1" strokeDasharray="4 8" />
          </svg>
          <svg className="absolute bottom-0 right-0 w-40 h-40 opacity-[0.04]" viewBox="0 0 160 160" fill="none" aria-hidden>
            <circle cx="160" cy="160" r="140" stroke="var(--desk-sage)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="160" cy="160" r="100" stroke="var(--desk-teal)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="160" cy="160" r="60" stroke="var(--desk-accent)" strokeWidth="1" strokeDasharray="4 8" />
          </svg>
        </div>

        <div className="container mx-auto max-w-5xl px-4 relative">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--desk-sage)" }}>
                What&apos;s included
              </p>
              <h2 className="text-3xl md:text-4xl font-bold ribbon-text" style={{ fontFamily: "var(--font-fraunces)" }}>
                Everything you need to run it tomorrow
              </h2>
              <p className="mt-3 text-base max-w-lg mx-auto" style={{ color: "var(--desk-muted)" }}>
                Each generation delivers a complete toolkit — no extra prep required.
              </p>
            </div>
          </Reveal>

          {/* Animated dotted connector grid lines (desktop) */}
          <div className="hidden sm:block absolute inset-x-4 pointer-events-none" aria-hidden style={{ top: "55%", height: "1px" }}>
            <svg className="w-full h-8 -translate-y-1/2" viewBox="0 0 1000 32" fill="none" preserveAspectRatio="none">
              <path d="M250 16h500" stroke="var(--desk-border)" strokeWidth="1" strokeDasharray="6 8" opacity="0.3" />
              <path className="dash-animate" d="M250 16h500" stroke="var(--desk-sage)" strokeWidth="1.5" strokeDasharray="3 14" opacity="0.3" style={{ animationDuration: "2.5s" }} />
              {/* Center crossover dot */}
              <circle cx="500" cy="16" r="4" fill="var(--desk-sage)" opacity="0.25" />
              <circle cx="500" cy="16" r="2" fill="var(--desk-paper)" />
            </svg>
          </div>

          <Reveal variant="stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  title: "4 activity blueprints",
                  desc: "Complete, structured plans with phases, materials, and timing — every generation.",
                  color: "var(--desk-teal)",
                  num: "01",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                  ),
                },
                {
                  title: "Evaluation criteria & rubrics",
                  desc: "Built-in assessment frameworks with optional rubrics for every activity type.",
                  color: "var(--desk-rose)",
                  num: "02",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                  ),
                },
                {
                  title: "Reflection & differentiation",
                  desc: "Embedded reflection questions and differentiation tips for diverse learners.",
                  color: "var(--desk-sage)",
                  num: "03",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  ),
                },
                {
                  title: "Validated resource links",
                  desc: "Curated external resources — every URL is validated before it reaches you.",
                  color: "var(--desk-accent)",
                  num: "04",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="reveal-child">
                  <PaperPage className="magnetic-card flex items-start gap-4 relative overflow-hidden group">
                    {/* Background number watermark */}
                    <span
                      aria-hidden
                      className="absolute -top-2 -right-1 text-6xl font-black pointer-events-none select-none opacity-[0.035]"
                      style={{ fontFamily: "var(--font-fraunces)", color: item.color }}
                    >
                      {item.num}
                    </span>
                    {/* Corner glow */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -bottom-10 -left-10 w-28 h-28 rounded-full opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.1]"
                      style={{ background: `radial-gradient(circle, ${item.color}, transparent 70%)` }}
                    />
                    <div
                      className="icon-bob w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative"
                      style={{ background: `color-mix(in srgb, ${item.color} 12%, transparent)`, color: item.color }}
                    >
                      {item.icon}
                      {/* Decorative dots around icon */}
                      <svg className="absolute -top-1 -right-1 w-2.5 h-2.5 opacity-40" viewBox="0 0 10 10" fill={item.color} aria-hidden>
                        <circle cx="5" cy="5" r="2" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}>
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--desk-muted)" }}>
                        {item.desc}
                      </p>
                      {/* Animated bottom accent line */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-px overflow-hidden" style={{ background: "color-mix(in srgb, var(--desk-border) 40%, transparent)" }}>
                          <div className="h-full included-line-sweep" style={{ background: item.color, opacity: 0.35 }} />
                        </div>
                        <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 shrink-0 opacity-30 group-hover:opacity-60 transition-opacity" aria-hidden>
                          <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill={item.color} />
                        </svg>
                      </div>
                    </div>
                  </PaperPage>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Bottom connector from features to CTA feel */}
          <Reveal>
            <div className="mt-10 flex flex-col items-center gap-2">
              <svg width="2" height="32" viewBox="0 0 2 32" fill="none" aria-hidden>
                <path className="dash-animate" d="M1 0v32" stroke="var(--desk-sage)" strokeWidth="2" strokeDasharray="3 5" opacity="0.3" style={{ animationDuration: "1.5s" }} />
              </svg>
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm"
                style={{ borderColor: "var(--desk-border)", background: "var(--desk-paper)" }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="var(--desk-sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                <span className="text-xs font-semibold" style={{ color: "var(--desk-muted)" }}>
                  All included in every generation
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Marketplace teaser ────────────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-20 md:py-28">
        <Reveal variant="scale">
          <PaperPage className="relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 right-0 w-64 h-64 opacity-10"
              style={{
                background: "radial-gradient(circle at top right, var(--desk-teal), transparent 70%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 opacity-5"
              style={{
                background: "radial-gradient(circle at bottom left, var(--desk-rose), transparent 70%)",
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <StampBadge color="teal" animateIn>Community</StampBadge>
                <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}>
                  Activity Marketplace
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "var(--desk-body)" }}>
                  Browse, save, and rate activities shared by other educators.
                  Discover what works across classrooms and build on collective teaching intelligence.
                </p>
                <Link href="/marketplace">
                  <Button
                    variant="outline"
                    size="lg"
                    className="shimmer-btn mt-2 text-base border-desk-teal text-desk-teal hover:bg-(--desk-teal)/5"
                  >
                    Browse marketplace
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-1.5">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Button>
                </Link>
              </div>
              <Reveal variant="scale" className="flex items-center justify-center md:justify-end">
                <div
                  className="marketplace-storefront relative w-full max-w-100 rounded-2xl border overflow-hidden"
                  style={{ borderColor: "var(--desk-border)", background: "var(--desk-paper)", boxShadow: "0 8px 32px rgba(44,36,22,0.08), 0 2px 8px rgba(44,36,22,0.04)" }}
                >
                  {/* Storefront header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--desk-border)", background: "color-mix(in srgb, var(--desk-teal) 6%, var(--desk-paper))" }}>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--desk-rose)", opacity: 0.7 }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--desk-accent)", opacity: 0.7 }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--desk-sage)", opacity: 0.7 }} />
                    </div>
                    {/* Search bar */}
                    <div className="flex-1 flex items-center gap-1.5 rounded-md px-2.5 py-1 ml-2" style={{ background: "var(--desk-paper)", border: "1px solid var(--desk-border)" }}>
                      <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 shrink-0" stroke="var(--desk-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                      </svg>
                      <span className="text-[9px] font-medium" style={{ color: "var(--desk-muted)" }}>Search activities…</span>
                    </div>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--desk-teal)" }}>
                      <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  </div>

                  {/* Mini activity cards grid */}
                  <div className="p-3 grid grid-cols-2 gap-2.5">
                    {[
                      { title: "Ecosystem Web", subject: "Science", grade: "Grade 5", color: "var(--desk-teal)", rating: 4.8, saves: 124, initials: "SC" },
                      { title: "Fraction Quest", subject: "Math", grade: "Grade 4", color: "var(--desk-rose)", rating: 4.6, saves: 89, initials: "RP" },
                      { title: "Story Builders", subject: "ELA", grade: "Grade 3", color: "var(--desk-sage)", rating: 4.9, saves: 203, initials: "LD" },
                      { title: "History Timeline", subject: "Social Studies", grade: "Grade 6", color: "var(--desk-accent)", rating: 4.7, saves: 67, initials: "MH" },
                    ].map((card, i) => (
                      <div
                        key={card.title}
                        className="storefront-card magnetic-card rounded-lg border p-2.5 flex flex-col gap-1.5"
                        style={{
                          borderColor: "var(--desk-border)",
                          background: "var(--desk-paper)",
                          animationDelay: `${i * 0.15}s`,
                        }}
                      >
                        {/* Card color strip */}
                        <div className="h-1 w-full rounded-full" style={{ background: card.color, opacity: 0.6 }} />
                        {/* Subject & grade pills */}
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm" style={{ background: `color-mix(in srgb, ${card.color} 12%, transparent)`, color: card.color }}>
                            {card.subject}
                          </span>
                          <span className="text-[7px] font-medium px-1 py-0.5 rounded-sm" style={{ background: "color-mix(in srgb, var(--desk-border) 40%, transparent)", color: "var(--desk-muted)" }}>
                            {card.grade}
                          </span>
                        </div>
                        {/* Title */}
                        <p className="text-[10px] font-bold leading-tight" style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}>
                          {card.title}
                        </p>
                        {/* Rating & saves row */}
                        <div className="flex items-center justify-between mt-auto pt-1" style={{ borderTop: "1px solid color-mix(in srgb, var(--desk-border) 50%, transparent)" }}>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} viewBox="0 0 16 16" className="w-2.5 h-2.5" fill={star <= Math.floor(card.rating) ? card.color : "none"} stroke={card.color} strokeWidth="1.5">
                                <path d="M8 1.5l2 4.1 4.5.6-3.25 3.2.77 4.5L8 11.7l-4.02 2.2.77-4.5L1.5 6.2l4.5-.6L8 1.5z" />
                              </svg>
                            ))}
                            <span className="text-[8px] font-bold ml-0.5" style={{ color: "var(--desk-muted)" }}>{card.rating}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5" stroke="var(--desk-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                            </svg>
                            <span className="text-[8px] font-medium" style={{ color: "var(--desk-muted)" }}>{card.saves}</span>
                          </div>
                        </div>
                        {/* Author */}
                        <div className="flex items-center gap-1">
                          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold text-white" style={{ background: card.color }}>
                            {card.initials}
                          </div>
                          <div className="flex-1 h-0.75 rounded-full" style={{ background: "color-mix(in srgb, var(--desk-border) 30%, transparent)" }}>
                            <div className="h-full rounded-full storefront-bar" style={{ background: card.color, opacity: 0.5, width: `${(card.rating / 5) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom bar with community stats */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-t" style={{ borderColor: "var(--desk-border)", background: "color-mix(in srgb, var(--desk-teal) 3%, var(--desk-paper))" }}>
                    <div className="flex items-center gap-1">
                      {/* Overlapping avatars */}
                      <div className="flex -space-x-1.5">
                        {["var(--desk-teal)", "var(--desk-rose)", "var(--desk-sage)", "var(--desk-accent)"].map((c, i) => (
                          <div key={i} className="w-4 h-4 rounded-full border border-white flex items-center justify-center" style={{ background: c, zIndex: 4 - i }}>
                            <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                        ))}
                      </div>
                      <span className="text-[8px] font-semibold ml-1" style={{ color: "var(--desk-muted)" }}>2.4k educators</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5 text-[8px] font-semibold" style={{ color: "var(--desk-teal)" }}>
                        <svg viewBox="0 0 24 24" fill="none" className="w-2.5 h-2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 6l-9.5 9.5-5-5L1 18" />
                        </svg>
                        Trending
                      </span>
                      <span className="glow-dot w-1.5 h-1.5 rounded-full" style={{ background: "var(--desk-sage)" }} />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </PaperPage>
        </Reveal>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{ background: "var(--desk-paper)" }}>
        {/* Background decorative elements */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="float-slow absolute top-12 left-[10%] w-2.5 h-2.5 rounded-full" style={{ background: "var(--desk-teal)", opacity: 0.15 }} />
          <div className="float-medium absolute bottom-12 right-[10%] w-3 h-3 rounded-full" style={{ background: "var(--desk-sage)", opacity: 0.12 }} />
          <div className="float-fast absolute top-24 right-[20%] w-2 h-2 rounded-full" style={{ background: "var(--desk-rose)", opacity: 0.15 }} />
        </div>

        <Reveal className="container mx-auto max-w-5xl px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold ribbon-text mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>
            Ready to plan smarter?
          </h2>
          <p className="text-base max-w-xl mx-auto mb-8" style={{ color: "var(--desk-muted)" }}>
            Join educators using Planboard to create engaging, standards-aligned activities
            in seconds — powered by AI and refined by real classroom feedback.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/wizard/step-1">
              <Button
                size="lg"
                className="shimmer-btn pulse-ring px-10 py-6 bg-desk-teal text-white hover:opacity-90 shadow-md text-lg"
              >
                Start generating
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-6 border-desk-border text-desk-ink hover:bg-desk-bg text-lg"
              >
                Create free account
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Waitlist ───────────────────────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
        <Reveal variant="scale">
          <PaperPage className="relative overflow-hidden px-6 py-7 md:px-8 md:py-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -right-16 h-52 w-52 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, var(--desk-teal), transparent 70%)" }}
            />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <StampBadge color="accent" animateIn>Early Access</StampBadge>
                <h3
                  className="text-2xl md:text-3xl font-bold"
                  style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
                >
                  Join the waitlist
                </h3>
                <p className="text-sm md:text-base max-w-xl" style={{ color: "var(--desk-muted)" }}>
                  Be first to try upcoming marketplace features, smarter recommendations,
                  and collaborative planning tools.
                </p>
              </div>
              <WaitlistForm />
            </div>
          </PaperPage>
        </Reveal>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t" style={{ borderColor: "var(--desk-border)", background: "var(--desk-paper)" }}>
        <div className="container mx-auto max-w-5xl px-4 py-12 md:py-14">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <div className="mb-3 inline-flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-xl shadow-md select-none"
                  style={{ background: "linear-gradient(135deg, var(--desk-teal), #1f7a6f)" }}
                >
                  ✦
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}>
                    Planboard
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--desk-muted)" }}>
                    AI Activity Planner
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--desk-muted)" }}>
                Create classroom-ready activities in seconds, then refine with community feedback.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
              <Link href="/wizard/step-1" className="font-semibold hover:underline underline-offset-4" style={{ color: "var(--desk-ink)" }}>
                Generate
              </Link>
              <Link href="/marketplace" className="font-semibold hover:underline underline-offset-4" style={{ color: "var(--desk-ink)" }}>
                Marketplace
              </Link>
              <Link href="/library" className="font-semibold hover:underline underline-offset-4" style={{ color: "var(--desk-ink)" }}>
                Library
              </Link>
              <Link href="/login" className="font-semibold hover:underline underline-offset-4" style={{ color: "var(--desk-ink)" }}>
                Sign in
              </Link>
            </div>
          </div>

          <div
            className="mt-8 flex flex-col gap-2 border-t pt-5 text-xs md:flex-row md:items-center md:justify-between"
            style={{ borderColor: "var(--desk-border)", color: "var(--desk-muted)" }}
          >
            <p>© {new Date().getFullYear()} Planboard. Built for educators.</p>
            <div className="flex items-center gap-4">
              <Link href="/register" className="hover:underline underline-offset-4">Create account</Link>
              <Link href="/profile" className="hover:underline underline-offset-4">Profile</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
