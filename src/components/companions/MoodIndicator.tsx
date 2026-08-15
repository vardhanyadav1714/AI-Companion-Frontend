import type { CompanionMood } from "@/lib/companions";

export function MoodIndicator({ mood }: { mood: CompanionMood }) {
  return (
    <span className="mood-indicator" title={`Mood intensity ${Math.round(mood.intensity * 100)}%`}>
      <span className="mood-pulse" />
      {mood.label}
    </span>
  );
}
