import type { CSSProperties } from "react";

import { type Companion, companionSheet } from "@/lib/companions";

type CompanionAvatarProps = {
  companion: Companion;
  size?: "small" | "medium" | "large" | "hero";
  className?: string;
};

export function CompanionAvatar({ companion, size = "medium", className = "" }: CompanionAvatarProps) {
  const style = {
    backgroundImage: `url(${companionSheet})`,
    backgroundPosition: companion.image.sheetPosition,
    "--avatar-focal-point": companion.image.focalPoint
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
