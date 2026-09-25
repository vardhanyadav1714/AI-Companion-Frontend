"use client";
import { useEffect, useState } from "react";
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem("eva-favorites") || "[]"); if (Array.isArray(saved)) setFavorites(saved.filter(v => typeof v === "string")); } catch {} setReady(true); }, []);
  function toggle(id: string) { setFavorites(current => { const next = current.includes(id) ? current.filter(v => v !== id) : [...current, id]; try { localStorage.setItem("eva-favorites", JSON.stringify(next)); } catch {} return next; }); }
  return { favorites, toggle, ready };
}
