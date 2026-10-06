"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { ChatMessage } from "@/hooks/useChat";

export function StoredMedia({ media }: { media: ChatMessage["media"] }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  if (!media || !/^[a-f0-9]{24}$/i.test(media.id)) return null;
  const source = `/api/backend/media/${media.id}?attempt=${attempt}`;
  if (failed) return <button className="e-button e-secondary" onClick={() => { setFailed(false); setAttempt(value => value + 1); }}><RotateCcw size={16} />Retry attachment</button>;
  if (media.mimeType.startsWith("audio/")) return <audio key={source} controls preload="none" src={source} onError={() => setFailed(true)} aria-label="Voice recording" style={{ width: "100%", maxWidth: 320, marginTop: 8 }} />;
  if (["image/png", "image/jpeg", "image/webp"].includes(media.mimeType)) {
    // The authenticated proxy serves private images; Next's public image optimizer must not fetch them.
    // eslint-disable-next-line @next/next/no-img-element
    return <img key={source} src={source} alt="Chat attachment" loading="lazy" onError={() => setFailed(true)} style={{ display: "block", maxWidth: "100%", width: 320, maxHeight: 360, objectFit: "contain", marginTop: 8 }} />;
  }
  return null;
}
