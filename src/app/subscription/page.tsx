"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/api-client";

export default function SubscriptionPage() {
  const [premium, setPremium] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  async function refresh(sync = false) {
    setBusy(true); setError("");
    try {
      const result = await apiRequest<{ usage: { premium: boolean; freeRemaining: number | null } }>(`/subscriptions/${sync ? "sync" : "me"}`, sync ? { method: "POST", body: "{}" } : {});
      if (!result.success) throw new Error(result.error.message);
      setPremium(result.data.usage.premium); setRemaining(result.data.usage.freeRemaining);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not load subscription"); }
    finally { setBusy(false); }
  }
  useEffect(() => { void refresh(); }, []);
  async function checkout() {
    setBusy(true); setError("");
    try {
      const result = await apiRequest<{ checkout: { checkoutUrl: string } | null }>("/subscriptions/checkout", { method: "POST", body: "{}" });
      if (!result.success) throw new Error(result.error.message);
      if (result.data.checkout?.checkoutUrl) window.location.assign(result.data.checkout.checkoutUrl);
      else await refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "Could not start checkout"); }
    finally { setBusy(false); }
  }
  return <main className="eva-onboarding"><section className="eva-billing">
    <Link href="/companions" aria-label="Back to companions"><ArrowLeft size={22} /></Link>
    <h1>Eva Premium</h1><p>INR 499 / month</p>
    {premium ? <p>Your subscription is active.</p> : remaining !== null ? <p>{remaining} free messages remaining</p> : null}
    <p>Recurring monthly subscription. Cancel future renewals through your payment provider.</p>
    {error && <p role="alert">{error} <Link href="/login">Sign in</Link></p>}
    {!premium && <button className="eva-primary-pill" disabled={busy} onClick={checkout}><CreditCard size={18} /> Continue with Razorpay</button>}
    <button className="eva-primary-pill" disabled={busy} onClick={() => refresh(true)}><RefreshCw size={18} /> {busy ? "Checking..." : "Refresh payment status"}</button>
    {premium && <Link href="/chat">Continue chatting</Link>}
  </section></main>;
}
