"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import type { CustomCompanion } from "@/lib/custom-companions";

export function useCustomCompanions() {
  const [characters, setCharacters] = useState<CustomCompanion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signedOut, setSignedOut] = useState(false);
  useEffect(() => {
    const abort = new AbortController();
    void apiRequest<CustomCompanion[]>("/companions", { signal: abort.signal }).then(result => {
      if (abort.signal.aborted) return;
      if (result.success) setCharacters(result.data);
      else { setSignedOut(result.error.code === "AUTHENTICATION_REQUIRED"); setError(result.error.message); }
    }).catch(() => { if (!abort.signal.aborted) setError("Could not load your companions. Please try again."); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, []);
  return { characters, loading, error, signedOut };
}
