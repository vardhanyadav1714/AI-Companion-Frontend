"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CreditCard, RefreshCw, Crown } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiRequest } from "@/lib/api-client";

type Plan = { amount: number; currency: string; interval: string; planId: string };
type Status = { active: boolean; status: string; currentEnd?: string; usage: { premium: boolean; freeRemaining: number | null } };
export default function SubscriptionPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [pending, setPending] = useState(false);
  async function refresh(sync = false) {
    setBusy(true); setError("");
    try {
      const result = await apiRequest<Status>(`/subscriptions/${sync ? "sync" : "me"}`, sync ? { method: "POST", body: "{}" } : {});
      if (!result.success) { setAuthRequired(result.error.code === "AUTHENTICATION_REQUIRED"); throw new Error(result.error.message); }
      setAuthRequired(false); setStatus(result.data);
      if (result.data.usage.premium) { setPending(false); try { sessionStorage.removeItem("eva-checkout-pending"); } catch {} }
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load your subscription."); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    let current = true;
    try { setPending(sessionStorage.getItem("eva-checkout-pending") === "true"); } catch {}
    void refresh(true);
    void apiRequest<Plan>("/subscriptions/plan").then(result => { if (current && result.success) setPlan(result.data); }).catch(() => {});
    return () => { current = false; };
  }, []);
  const ready = plan?.amount === 49900 && plan.currency === "INR" && plan.interval === "monthly" && !!plan.planId;
  async function checkout() {
    if (!ready || busy || !status || status.usage.premium) return;
    setBusy(true); setError("");
    try {
      const result = await apiRequest<{ checkout: { checkoutUrl: string } | null }>("/subscriptions/checkout", { method: "POST", body: "{}" });
      if (!result.success) throw new Error(result.error.message);
      if (result.data.checkout?.checkoutUrl) {
        const target = new URL(result.data.checkout.checkoutUrl);
        if (target.protocol !== "https:" || !(target.hostname === "rzp.io" || target.hostname.endsWith(".razorpay.com") || target.hostname === "razorpay.com")) throw new Error("The payment provider returned an unexpected checkout address.");
        try { sessionStorage.setItem("eva-checkout-pending", "true"); } catch {}
        window.location.assign(target.href);
      } else await refresh(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not start checkout. Please try again."); }
    finally { setBusy(false); }
  }
  return <AppShell active="subscription" title="Premium"><section className="e-billing-page">
    <header className="e-page-heading"><div><p className="e-eyebrow">MORE TIME TOGETHER</p><h1>Eva Premium</h1><p>Your conversations, without the ten-message trial limit.</p></div></header>
    <div className="e-billing-layout"><section className="e-plan"><Crown size={27} /><h2>Monthly membership</h2><div className="e-price">INR 499<span> / month</span></div>
      <ul><li><Check size={18} />Continue beyond your first 10 messages</li><li><Check size={18} />Talk with every companion</li><li><Check size={18} />Keep your conversations in one account</li></ul>
      <p className="e-fine">Auto-renews monthly until cancelled. Manage future renewals through your payment provider.</p>
      {status?.usage.premium ? <Link className="e-button e-primary" href="/chat">Continue chatting</Link> : authRequired ? <Link className="e-button e-primary" href="/login">Sign in to continue</Link> : <button className="e-button e-primary" disabled={busy || !ready || !status} onClick={checkout}><CreditCard size={18} />{busy ? "Checking..." : "Continue with Razorpay"}</button>}
      {!ready && !status?.usage.premium && <p className="e-fine">The INR 499 checkout is not available yet. No payment has been taken.</p>}
    </section><section className="e-billing-status"><h2>Your membership</h2>
      <span className="e-label">{busy ? "Checking status" : status?.usage.premium ? "Premium active" : status ? "Free account" : "Not signed in"}</span>
      {status && !status.usage.premium && status.usage.freeRemaining !== null && <p>{status.usage.freeRemaining} of 10 free messages remaining</p>}
      {status?.currentEnd && <p>Current period ends {new Date(status.currentEnd).toLocaleDateString("en-IN")}</p>}
      {pending && !status?.usage.premium && <p role="status">Payment confirmation is pending. Your membership activates after verification by the payment provider.</p>}
      {error && <p className="e-form-error" role="alert">{error}</p>}
      <button className="e-button e-secondary" disabled={busy} onClick={() => refresh(true)}><RefreshCw size={17} />Refresh payment status</button>
      <p className="e-fine">Google Play purchases are made in the Android app. Sign in with the same account to check your membership here.</p>
    </section></div>
  </section></AppShell>;
}
