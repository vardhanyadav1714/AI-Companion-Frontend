"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { Brand } from "@/components/layout/AppShell";
import { ThemeSwitcher } from "@/components/layout/ThemeProvider";
import { apiRequest } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => { if (!cooldown) return; const timer = setTimeout(() => setCooldown(cooldown - 1), 1000); return () => clearTimeout(timer); }, [cooldown]);
  async function send() {
    setBusy(true); setError("");
    try {
      const result = await apiRequest("/auth/email/start", { method: "POST", body: JSON.stringify({ email: email.trim() }) });
      if (!result.success) throw new Error(result.error.message);
      setSent(true); setCode(""); setCooldown(60);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not send your code. Try again."); }
    finally { setBusy(false); }
  }
  async function verify() {
    if (code.length !== 6) return;
    setBusy(true); setError("");
    try {
      const result = await apiRequest<{ user: { dateOfBirth?: string } }>("/auth/email/verify", { method: "POST", body: JSON.stringify({ email: email.trim(), code }) });
      if (!result.success) throw new Error(result.error.message);
      router.replace(result.data.user.dateOfBirth ? "/companions" : "/onboarding");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not verify your code. Try again."); }
    finally { setBusy(false); }
  }
  return <main className="e-auth"><header><Brand /><ThemeSwitcher /></header><section className="e-auth-content">
    <span className="e-auth-mark"><Mail size={25} /></span><p className="e-eyebrow">YOUR LITTLE CORNER</p>
    <h1>{sent ? "Check your inbox" : "Welcome to Eva"}</h1><p>{sent ? `Your sign-in code was sent to ${email.trim()}.` : "A little time. A good conversation."}</p>
    <form className="e-form" onSubmit={e => { e.preventDefault(); if (!busy) void (sent ? verify() : send()); }}>
      {sent ? <label>Six-digit code<input autoFocus autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" required maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} /></label> : <label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></label>}
      {error && <p className="e-form-error" role="alert">{error}</p>}
      <button className="e-button e-primary" disabled={busy || (sent && code.length !== 6)}>{busy ? "Please wait..." : sent ? "Sign in" : "Continue with email"}<ArrowRight size={18} /></button>
    </form>
    {sent && <div className="e-auth-secondary"><button className="e-text-button" disabled={busy || cooldown > 0} onClick={send}>{cooldown ? `Resend in ${cooldown}s` : "Resend code"}</button><button className="e-text-button" disabled={busy} onClick={() => { setSent(false); setError(""); }}>Change email</button></div>}
    <p className="e-fine">For adults 18 and over. Conversations are with AI.</p>
  </section></main>;
}
