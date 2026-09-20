import type { CSSProperties } from "react";

import { type Companion, companionSheet } from "@/lib/companions";

type CompanionAvatarProps = {
  companion: Companion;
  size?: "small" | "medium" | "large" | "hero";
  className?: string;
};

export function CompanionAvatar({ companion, size = "medium", className = "" }: CompanionAvatarProps) {
  const imageUrl = companion.image.src ?? companionSheet;
  const style = {
    backgroundImage: `url(${imageUrl})`,
    backgroundPosition: companion.image.src ? companion.image.focalPoint : companion.image.sheetPosition,
    backgroundSize: companion.image.src ? "cover" : "300% 300%"
  } as CSSProperties;

  return (
    <div
      className={`companion-avatar companion-avatar-${size} ${className}`}
      style={style}
      aria-label={`${companion.name} portrait`}
      role="img"
    />
  );
}
