"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, UserRound, Trash2, LogOut } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiRequest } from "@/lib/api-client";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [birthday, setBirthday] = useState("");
  const [busy, setBusy] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [original, setOriginal] = useState("");
  const values = JSON.stringify({ displayName: name.trim(), preferredName: preferredName.trim(), occupation: occupation.trim(), ...(birthday ? { dateOfBirth: birthday } : {}) });
  useEffect(() => { let current = true; void (async () => {
    try {
      const result = await apiRequest<{ displayName?: string; preferredName?: string; occupation?: string; dateOfBirth?: string }>("/profile");
      if (!result.success) throw new Error(result.error.message);
      if (current) {
        const data = { displayName: result.data.displayName || "", preferredName: result.data.preferredName || "", occupation: result.data.occupation || "", ...(result.data.dateOfBirth ? { dateOfBirth: result.data.dateOfBirth.slice(0, 10) } : {}) };
        setName(data.displayName); setPreferredName(data.preferredName); setOccupation(data.occupation); setBirthday(data.dateOfBirth || "");
        setOriginal(JSON.stringify(data)); setLoaded(true);
      }
    } catch (e) { if (current) setNotice(e instanceof Error ? e.message : "Could not load your account."); }
    finally { if (current) setBusy(false); }
  })(); return () => { current = false; }; }, []);
  return <AppShell active="profile" title="Your account"><section className="e-billing-page"><div className="e-page-heading"><div><p className="e-eyebrow">JUST YOU</p><h1>Your account</h1></div></div>
    {notice && <p role="status">{notice}</p>}
    {loaded ? <form className="e-form e-account-form" onSubmit={async e => { e.preventDefault(); if (busy || values === original) return; setBusy(true); setNotice(""); try { const result = await apiRequest("/profile", { method: "PUT", body: values }); if (!result.success) throw new Error(result.error.message); setOriginal(values); setNotice("Your profile has been saved."); } catch (e) { setNotice(e instanceof Error ? e.message : "Could not save profile."); } finally { setBusy(false); } }}>
      <h2 className="e-account-heading"><UserRound size={20} />Your details</h2>
      <label>Your name<input required disabled={busy} maxLength={80} value={name} autoComplete="name" onChange={e => setName(e.target.value)} /></label>
      <label>Preferred name<input disabled={busy} maxLength={80} value={preferredName} autoComplete="nickname" onChange={e => setPreferredName(e.target.value)} /></label>
      <label>Occupation<input disabled={busy} maxLength={120} value={occupation} onChange={e => setOccupation(e.target.value)} /></label>
      <label>Birthday<input disabled={busy} type="date" autoComplete="bday" value={birthday} onChange={e => setBirthday(e.target.value)} /></label>
      <button className="e-button e-primary" disabled={busy || !name.trim() || values === original}><Check size={18} />{busy ? "Saving..." : "Save changes"}</button><Link className="e-text-button" href="/subscription">Manage subscription</Link>
      <Link className="e-text-button" href="/privacy">Privacy policy</Link>
      <a className="e-text-button" href="https://api.merigf.com/account/delete"><Trash2 size={18} />Delete account and data</a>
      <button type="button" className="e-button" disabled={busy} onClick={async () => { setBusy(true); try { const result = await apiRequest("/auth/logout", { method: "POST", body: "{}" }); if (!result.success) throw new Error(result.error.message); window.location.assign("/login"); } catch (error) { setNotice(error instanceof Error ? error.message : "Could not sign out. Please try again."); setBusy(false); } }}><LogOut size={18} />Sign out</button>
    </form> : busy ? <p role="status">Loading your account...</p> : <Link className="e-button e-primary" href="/login">Sign in</Link>}
  </section></AppShell>;
}
