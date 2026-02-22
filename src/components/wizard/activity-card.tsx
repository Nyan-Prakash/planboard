"use client";

import { StampBadge } from "@/components/ui-desk";

const categoryIcons: Record<string, string> = {
  debate: "🗣️",
  documentary: "🎬",
  acting: "🎭",
  conference: "🎤",
  experiment: "🧪",
  quiz: "📝",
  group_discussion: "👥",
  creative_project: "🎨",
  presentation: "📊",
  simulation: "🎮",
  field_study: "🔍",
  peer_teaching: "👨‍🏫",
  role_play: "🎪",
  research_project: "📚",
};

/** Derives rough metadata stamps from the category label */
function getCategoryMeta(category: string): { prep: string; group: string; energy: string } {
  const energyMap: Record<string, string> = {
    debate: "High",
    acting: "High",
    role_play: "High",
    simulation: "High",
    experiment: "Med",
    conference: "Med",
    group_discussion: "Med",
    creative_project: "Med",
    quiz: "Low",
    research_project: "Low",
    documentary: "Low",
    presentation: "Med",
    peer_teaching: "Med",
    field_study: "Med",
  };
  const prepMap: Record<string, string> = {
    experiment: "30 min",
    documentary: "45 min",
    research_project: "60 min",
    field_study: "60 min",
    quiz: "10 min",
    debate: "20 min",
    presentation: "30 min",
    creative_project: "40 min",
  };
  return {
    prep: prepMap[category] ?? "15 min",
    group: ["debate", "group_discussion", "simulation", "role_play"].includes(category) ? "Groups" : "Flexible",
    energy: energyMap[category] ?? "Med",
  };
}

interface ActivityCardProps {
  title: string;
  category: string;
  summary: string;
  index: number;
  onViewDetail: () => void;
}

export function ActivityCard({
  title,
  category,
  summary,
  index,
  onViewDetail,
}: ActivityCardProps) {
  const icon = categoryIcons[category] || "📋";
  const categoryLabel = category.replace(/_/g, " ");
  const meta = getCategoryMeta(category);

  // Rotate card colors by index for visual variety
  const accentColors = ["teal", "rose", "sage", "accent"] as const;
  const accent = accentColors[index % accentColors.length];

  return (
    <button
      onClick={onViewDetail}
      className="paper-card text-left w-full group flex flex-col p-5 gap-4 focus-visible:ring-2 focus-visible:ring-[var(--desk-teal)]"
      aria-label={`View details for ${title}`}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-base leading-snug line-clamp-2"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--desk-ink)" }}
          >
            {title}
          </h3>
          <span
            className="stamp-badge mt-1.5 inline-block"
            style={{
              color: `var(--desk-${accent === "accent" ? "ink" : accent})`,
              borderColor: `var(--desk-${accent === "accent" ? "accent" : accent})`,
              background: `color-mix(in srgb, var(--desk-${accent === "accent" ? "accent" : accent}) 10%, transparent)`,
              fontSize: "0.625rem",
            }}
          >
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Summary */}
      <p
        className="text-sm leading-relaxed line-clamp-3 flex-1"
        style={{ color: "var(--desk-muted)" }}
      >
        {summary}
      </p>

      {/* Metadata stamps */}
      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[var(--desk-border)]">
        <StampBadge color="ink" icon="⏱">Prep {meta.prep}</StampBadge>
        <StampBadge color="ink" icon="👥">{meta.group}</StampBadge>
        <StampBadge
          color={meta.energy === "High" ? "rose" : meta.energy === "Med" ? "teal" : "ink"}
          icon="⚡"
        >
          {meta.energy} energy
        </StampBadge>
      </div>

      {/* View CTA */}
      <div
        className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
        style={{ color: "var(--desk-teal)" }}
      >
        View full plan →
      </div>
    </button>
  );
}

