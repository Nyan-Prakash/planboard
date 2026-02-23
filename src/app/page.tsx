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
      <section className="container mx-auto max-w-5xl px-4 py-20 md:py-28">
        <Reveal>
          <div className="text-center mb-12">
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

        {/* Step connector line (desktop only) */}
        <div className="hidden sm:block relative mb-2">
          <div className="absolute top-5 left-[16.67%] right-[16.67%] h-0.5" style={{ background: "color-mix(in srgb, var(--desk-border) 60%, transparent)" }}>
            <div className="line-grow h-full" style={{ background: "var(--desk-teal)", opacity: 0.3 }} />
          </div>
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
            ].map((step) => (
              <div key={step.num} className="reveal-child magnetic-card">
                <StickyCard color={step.color} className="flex flex-col gap-4 h-full">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: `var(--desk-${step.color})` }}
                    >
                      {step.num}
                    </div>
                    <div className="icon-bob opacity-40" style={{ color: `var(--desk-${step.color})` }}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--desk-muted)" }}>
                    {step.body}
                  </p>
                </StickyCard>
              </div>
            ))}
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
      <section className="py-20 md:py-28" style={{ background: "var(--desk-paper)" }}>
        <div className="container mx-auto max-w-5xl px-4">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--desk-sage)" }}>
                What&apos;s included
              </p>
              <h2 className="text-3xl md:text-4xl font-bold ribbon-text" style={{ fontFamily: "var(--font-fraunces)" }}>
                Everything you need to run it tomorrow
              </h2>
            </div>
          </Reveal>

          <Reveal variant="stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  title: "4 activity blueprints",
                  desc: "Complete, structured plans with phases, materials, and timing — every generation.",
                  color: "var(--desk-teal)",
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
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="reveal-child">
                  <PaperPage className="magnetic-card flex items-start gap-4">
                    <div
                      className="icon-bob w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in srgb, ${item.color} 12%, transparent)`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1" style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}>
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--desk-muted)" }}>
                        {item.desc}
                      </p>
                    </div>
                  </PaperPage>
                </div>
              ))}
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
              <Reveal variant="stagger" className="flex flex-wrap gap-2 justify-center md:justify-end">
                {["Discussion", "Hands-on", "Project-based", "Game / Quiz", "Debate", "Case study", "Lab / Experiment", "Peer review"].map((tag) => (
                  <span
                    key={tag}
                    className="reveal-child magnetic-card inline-block rounded-lg px-3 py-1.5 text-xs font-semibold cursor-default"
                    style={{ background: "color-mix(in srgb, var(--desk-teal) 8%, transparent)", color: "var(--desk-teal)", border: "1px solid color-mix(in srgb, var(--desk-teal) 15%, transparent)" }}
                  >
                    {tag}
                  </span>
                ))}
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

    </div>
  );
}
