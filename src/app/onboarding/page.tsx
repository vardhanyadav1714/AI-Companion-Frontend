"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { Brand } from "@/components/layout/AppShell";
import { ThemeSwitcher } from "@/components/layout/ThemeProvider";

export default function Onboarding() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <main className="e-auth"><header><Brand /><ThemeSwitcher /></header><section className="e-auth-content"><form className="e-form" onSubmit={async event => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await apiRequest("/profile", { method: "PUT", body: JSON.stringify({ preferredName: name, dateOfBirth: birthday }) });
      if (!result.success) throw new Error(result.error.message);
      router.replace("/companions");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save profile"); }
    finally { setBusy(false); }
  }}><h1>A little about you</h1>
    <label>What should we call you?<input required maxLength={80} autoComplete="nickname" value={name} onChange={event => setName(event.target.value)} /></label>
    <label>Birthday<input required type="date" autoComplete="bday" value={birthday} onChange={event => setBirthday(event.target.value)} /></label>
    <p>Your companions can remember these details. You must be 18 or older.</p>
    {error && <p role="alert">{error}</p>}
    <button className="e-button e-primary" disabled={busy}>{busy ? "Saving..." : "Continue"}</button>
  </form></section></main>;
}
