"use client";

const MOCK_INPUT = "Climate Science — Grade 8";

const MOCK_ACTIVITIES = [
  {
    category: "debate",
    title: "Carbon Tax: Who Pays the Price?",
    summary:
      "Students form industry, government, and citizen groups to argue economic vs. environmental trade-offs in a structured parliamentary debate.",
    prepTime: "20 min",
    groupSize: "Groups of 5",
    energy: "High",
    accentColor: "var(--desk-rose)",
    energyColor: "var(--desk-rose)",
    cardClass: "mockup-card-1",
    badgeDelay: "1.3s",
  },
  {
    category: "experiment",
    title: "Greenhouse Effect in a Jar",
    summary:
      "Pairs trap CO₂ in sealed jars under lamps, measuring temperature rise over 10 minutes to model atmospheric warming.",
    prepTime: "15 min",
    groupSize: "Pairs",
    energy: "Medium",
    accentColor: "var(--desk-teal)",
    energyColor: "var(--desk-accent)",
    cardClass: "mockup-card-2",
    badgeDelay: "1.8s",
  },
  {
    category: "simulation",
    title: "Arctic Ice Negotiation Summit",
    summary:
      "Each student becomes a nation-state delegate at a mock UN climate summit, negotiating emission targets with economic pressure cards.",
    prepTime: "10 min",
    groupSize: "Whole Class",
    energy: "Medium",
    accentColor: "var(--desk-sage)",
    energyColor: "var(--desk-accent)",
    cardClass: "mockup-card-3",
    badgeDelay: "2.3s",
  },
  {
    category: "documentary",
    title: "One Minute, One Climate Story",
    summary:
      "Students script and film a 60-second phone documentary on one local climate impact, then screen and critique each other's work.",
    prepTime: "5 min",
    groupSize: "Groups of 3",
    energy: "Low",
    accentColor: "var(--desk-accent)",
    energyColor: "var(--desk-sage)",
    cardClass: "mockup-card-4",
    badgeDelay: "2.8s",
  },
];

export function HeroMockup() {
  return (
    <div
      aria-hidden
      className="relative w-full flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient glow behind the mockup */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 60% 50%, color-mix(in srgb, var(--desk-teal) 8%, transparent), transparent 70%)",
        }}
      />

      {/* THE 3D FRAME */}
      <div
        className="mockup-3d-float relative w-full max-w-[480px]"
        style={{
          transformStyle: "preserve-3d",
          borderRadius: "12px",
          boxShadow: `
            0 40px 80px rgba(44, 36, 22, 0.18),
            0 16px 32px rgba(44, 36, 22, 0.10),
            0 4px 8px rgba(44, 36, 22, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.5)
          `,
        }}
      >
        {/* ── BROWSER CHROME — TITLE BAR ── */}
        <div
          className="mockup-titlebar-shimmer flex items-center gap-2 px-3 py-2.5 rounded-t-[12px] border-b"
          style={{ borderColor: "var(--desk-border)" }}
        >
          {/* Traffic lights */}
          <div className="flex gap-1.5 shrink-0">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--desk-rose)", opacity: 0.8 }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--desk-accent)", opacity: 0.8 }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--desk-sage)", opacity: 0.8 }}
            />
          </div>

          {/* Fake URL bar */}
          <div
            className="flex-1 flex items-center gap-1.5 rounded-md px-2.5 py-1 mx-2"
            style={{
              background: "var(--desk-paper)",
              border: "1px solid var(--desk-border)",
              fontSize: "9px",
              color: "var(--desk-muted)",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            {/* Lock icon */}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-2.5 h-2.5 shrink-0"
              stroke="var(--desk-sage)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="7" width="10" height="7" rx="1.5" />
              <path d="M5 7V5a3 3 0 016 0v2" />
            </svg>
            <span>planboard.app/generate</span>
            <span className="mockup-url-cursor" />
          </div>

          {/* App favicon */}
          <div
            className="w-4 h-4 rounded flex items-center justify-center text-white shrink-0"
            style={{ background: "var(--desk-teal)", fontSize: "7px" }}
          >
            ✦
          </div>
        </div>

        {/* ── APP CONTENT AREA ── */}
        <div
          className="rounded-b-[12px] overflow-hidden"
          style={{ background: "var(--desk-bg)" }}
        >
          {/* Inner app header bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{
              borderColor: "var(--desk-border)",
              background: "var(--desk-paper)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-white"
                style={{ background: "var(--desk-teal)", fontSize: "9px" }}
              >
                ✦
              </div>
              <span
                className="text-[10px] font-bold"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  color: "var(--desk-ink)",
                }}
              >
                Planboard
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-12 h-2 rounded-full"
                style={{ background: "var(--desk-border)", opacity: 0.5 }}
              />
              <div
                className="w-5 h-5 rounded-full"
                style={{ background: "var(--desk-border)", opacity: 0.4 }}
              />
            </div>
          </div>

          {/* Generate input strip */}
          <div className="px-4 pt-3 pb-2">
            <div
              className="mockup-input-pulse flex items-center gap-2 rounded-lg px-3 py-2 border"
              style={{
                borderColor: "var(--desk-teal)",
                background: "var(--desk-paper)",
                borderWidth: "1.5px",
              }}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-3 h-3 shrink-0"
                stroke="var(--desk-teal)"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M8 1l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
              </svg>
              <span
                className="flex-1 text-[9px] font-medium"
                style={{ color: "var(--desk-ink)" }}
              >
                {MOCK_INPUT}
              </span>
              <div
                className="shrink-0 flex items-center gap-1 px-2 py-1 rounded text-white font-bold shimmer-btn"
                style={{ background: "var(--desk-teal)", fontSize: "8px" }}
              >
                Generate
                <svg
                  viewBox="0 0 10 10"
                  fill="none"
                  className="w-2 h-2"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M2 5h6M5 2l3 3-3 3" />
                </svg>
              </div>
            </div>

            {/* Result count label */}
            <div className="mt-1.5 flex items-center gap-1">
              <span
                className="glow-dot w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--desk-teal)" }}
              />
              <span
                className="font-semibold uppercase tracking-widest"
                style={{ color: "var(--desk-teal)", fontSize: "8px" }}
              >
                4 activities generated
              </span>
            </div>
          </div>

          {/* ── THE 4 ACTIVITY CARDS ── */}
          <div className="px-3 pb-3 grid grid-cols-2 gap-2">
            {MOCK_ACTIVITIES.map((activity) => (
              <div
                key={activity.title}
                className={`${activity.cardClass} rounded-lg border overflow-hidden`}
                style={{
                  background: "var(--desk-paper)",
                  borderColor: "var(--desk-border)",
                  boxShadow: "0 2px 6px rgba(44, 36, 22, 0.06)",
                }}
              >
                {/* Top accent bar */}
                <div
                  className="h-1 w-full"
                  style={{ background: activity.accentColor }}
                />

                <div className="p-2">
                  {/* Category badge */}
                  <span
                    className="mockup-badge stamp-badge inline-flex mb-1.5"
                    style={{
                      animationDelay: activity.badgeDelay,
                      color: activity.accentColor,
                      borderColor: activity.accentColor,
                      fontSize: "6.5px",
                      padding: "2px 5px",
                    }}
                  >
                    {activity.category}
                  </span>

                  {/* Title */}
                  <p
                    className="text-[9px] font-bold leading-tight mb-1"
                    style={{
                      fontFamily: "var(--font-fraunces)",
                      color: "var(--desk-ink)",
                    }}
                  >
                    {activity.title}
                  </p>

                  {/* Summary — 2 lines max */}
                  <p
                    className="text-[7.5px] leading-relaxed mb-1.5"
                    style={{
                      color: "var(--desk-muted)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {activity.summary}
                  </p>

                  {/* Metadata stamps */}
                  <div
                    className="flex flex-wrap gap-0.5 pt-1 border-t"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--desk-border) 50%, transparent)",
                    }}
                  >
                    {[
                      { icon: "⏱", label: activity.prepTime },
                      { icon: "👥", label: activity.groupSize },
                    ].map((meta) => (
                      <span
                        key={meta.label}
                        className="stamp-badge"
                        style={{
                          fontSize: "6px",
                          padding: "1px 4px",
                          color: "var(--desk-muted)",
                          borderColor: "var(--desk-border)",
                          background: "transparent",
                        }}
                      >
                        {meta.icon} {meta.label}
                      </span>
                    ))}
                    <span
                      className="stamp-badge"
                      style={{
                        fontSize: "6px",
                        padding: "1px 4px",
                        color: activity.energyColor,
                        borderColor: activity.energyColor,
                      }}
                    >
                      ⚡ {activity.energy}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shadow plane beneath the mockup — deepens the 3D illusion */}
      <div
        className="absolute bottom-0 left-1/2 w-3/4 h-8 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(44, 36, 22, 0.15) 0%, transparent 70%)",
          transform: "translateX(-50%) scaleY(0.3)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}
