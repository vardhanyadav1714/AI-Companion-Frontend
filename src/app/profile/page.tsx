"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { apiRequest } from "@/lib/api-client";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [busy, setBusy] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => { let current = true; void (async () => {
    try {
      const result = await apiRequest<{ preferredName?: string; name?: string; dateOfBirth?: string }>("/auth/me");
      if (!result.success) throw new Error(result.error.message);
      if (current) { setName(result.data.preferredName || result.data.name || ""); setBirthday(result.data.dateOfBirth?.slice(0, 10) || ""); setLoaded(true); }
    } catch (e) { if (current) setNotice(e instanceof Error ? e.message : "Could not load your account."); }
    finally { if (current) setBusy(false); }
  })(); return () => { current = false; }; }, []);
  return <AppShell active="profile" title="Your account"><section className="e-billing-page"><div className="e-page-heading"><div><p className="e-eyebrow">JUST YOU</p><h1>Your account</h1></div></div>
    {notice && <p role="status">{notice}</p>}
    {loaded ? <form className="e-form e-account-form" onSubmit={async e => { e.preventDefault(); setBusy(true); setNotice(""); try { const result = await apiRequest("/profile", { method: "PUT", body: JSON.stringify({ preferredName: name.trim(), dateOfBirth: birthday }) }); if (!result.success) throw new Error(result.error.message); setNotice("Your profile has been saved."); } catch (e) { setNotice(e instanceof Error ? e.message : "Could not save profile."); } finally { setBusy(false); } }}>
      <label>Preferred name<input required maxLength={80} value={name} autoComplete="nickname" onChange={e => setName(e.target.value)} /></label><label>Birthday<input required type="date" autoComplete="bday" value={birthday} onChange={e => setBirthday(e.target.value)} /></label><p className="e-fine">These details are shared with your AI companions.</p><button className="e-button e-primary" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button><Link className="e-text-button" href="/subscription">Manage subscription</Link>
    </form> : busy ? <p role="status">Loading your account...</p> : <Link className="e-button e-primary" href="/login">Sign in</Link>}
  </section></AppShell>;
}
