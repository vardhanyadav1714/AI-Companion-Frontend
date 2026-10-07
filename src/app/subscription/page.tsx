"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CreditCard, RefreshCw, Crown, ExternalLink, CircleX } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { apiRequest } from "@/lib/api-client";

type Plan = { amount: number; currency: string; interval: string; planId: string };
type Status = { active: boolean; status: string; provider?: string; autoRenew?: boolean; cancelAtPeriodEnd?: boolean; currentEnd?: string; usage: { premium: boolean; freeRemaining: number | null; freeLimit?: number } };
export default function SubscriptionPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [pending, setPending] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  async function refresh(sync = false, signal?: AbortSignal) {
    setBusy(true); setError("");
    try {
      const result = await apiRequest<Status>(`/subscriptions/${sync ? "sync" : "me"}`, { ...(sync ? { method: "POST", body: "{}" } : {}), signal });
      if (signal?.aborted) return;
      if (!result.success) {
        const signedOut = result.error.code === "AUTHENTICATION_REQUIRED";
        setAuthRequired(signedOut);
        if (signedOut) setStatus(null);
        throw new Error(signedOut ? "Please sign in again to view your membership." : "Could not verify your membership right now. Please refresh payment status to try again.");
      }
      setAuthRequired(false); setStatus(result.data);
      if (result.data.active) { setPending(false); try { sessionStorage.removeItem("eva-checkout-pending"); } catch {} }
    } catch (e) { if (!signal?.aborted) setError(e instanceof Error ? e.message : "Could not load your subscription."); }
    finally { if (!signal?.aborted) setBusy(false); }
  }
  useEffect(() => {
    let current = true;
    const controller = new AbortController();
    let returningFromCheckout = false;
    try { returningFromCheckout = sessionStorage.getItem("eva-checkout-pending") === "true"; setPending(returningFromCheckout); } catch {}
    void refresh(returningFromCheckout, controller.signal);
    void apiRequest<Plan>("/subscriptions/plan").then(result => { if (current && result.success) setPlan(result.data); }).catch(() => {});
    return () => { current = false; controller.abort(); };
  }, []);
  const ready = plan?.amount === 49900 && plan.currency === "INR" && plan.interval === "monthly" && !!plan.planId;
  const membershipLabel = busy ? "Checking status" : authRequired ? "Not signed in" : status?.active ? "Premium active" : ({
    none: "Free account", pending: "Payment pending", created: "Payment pending", authenticated: "Payment pending",
    halted: "Payment needs attention", expired: "Membership ended", completed: "Membership ended", cancelled: "Membership ended"
  } as Record<string, string>)[status?.status ?? ""] ?? "Membership status unavailable";
  async function checkout() {
    if (!ready || busy || error || authRequired || !status || status.active) return;
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
  async function cancelRenewal() {
    setBusy(true); setError("");
    try {
      const result = await apiRequest<{ subscription: Omit<Status, "usage">; usage: Status["usage"] }>("/subscriptions/cancel", { method: "POST", body: "{}" });
      if (!result.success) throw new Error(result.error.message);
      setStatus({ ...result.data.subscription, usage: result.data.usage });
      setConfirmCancel(false);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not cancel future renewals."); }
    finally { setBusy(false); }
  }
  return <AppShell active="subscription" title="Premium"><section className="e-billing-page">
    <header className="e-page-heading"><div><p className="e-eyebrow">MORE TIME TOGETHER</p><h1>Eva Premium</h1><p>One monthly membership across your Eva account.</p></div></header>
    <div className="e-billing-layout"><section className="e-plan"><Crown size={27} /><h2>Monthly membership</h2><div className="e-price">INR 499<span> / month</span></div>
      <ul><li><Check size={18} />Monthly Premium membership</li><li><Check size={18} />Talk with every companion</li><li><Check size={18} />Keep your conversations in one account</li></ul>
      <p className="e-fine">Auto-renews monthly until cancelled. Manage future renewals through your payment provider.</p>
      <p className="e-fine e-legal-consent">By purchasing, you agree to our <Link href="/terms">Terms</Link>. No discretionary refunds for unused time or change of mind; legal and provider exceptions apply. Read the <Link href="/refund-policy">Cancellation &amp; Refund Policy</Link>.</p>
      {status?.active ? <Link className="e-button e-primary" href="/chat">Continue chatting</Link> : authRequired ? <Link className="e-button e-primary" href="/login">Sign in to continue</Link> : <button className="e-button e-primary" disabled={busy || !ready || !status || !!error} onClick={checkout}><CreditCard size={18} />{busy ? "Checking..." : "Continue with Razorpay"}</button>}
      {!busy && !ready && !status?.active && <p className="e-fine">The INR 499 checkout is not available yet. No payment has been taken.</p>}
    </section><section className="e-billing-status"><h2>Your membership</h2>
      <span className="e-label">{membershipLabel}</span>
      {error && status && <p className="e-fine">Showing the last verified membership. The latest refresh did not complete.</p>}
      {status && !status.active && status.usage.freeRemaining !== null && <p>{status.usage.freeRemaining} of {status.usage.freeLimit ?? 10} free messages remaining</p>}
      {status?.currentEnd && <p>Current period ends {new Date(status.currentEnd).toLocaleDateString("en-IN")}</p>}
      {status?.cancelAtPeriodEnd && <p role="status">Future renewals are cancelled. Your current paid period remains available until its end date.</p>}
      {status?.provider === "google_play" && <a className="e-button e-secondary" href="https://play.google.com/store/account/subscriptions?sku=eva_premium_monthly&package=com.eva.ai" target="_blank" rel="noopener noreferrer"><ExternalLink size={17} />Manage in Google Play</a>}
      {status?.provider === "razorpay" && status.active && !status.cancelAtPeriodEnd && (confirmCancel ? <div role="group" aria-label="Confirm renewal cancellation"><p>Cancel future renewals? Your current paid period remains available.</p><button className="e-button e-secondary" disabled={busy} onClick={cancelRenewal}><CircleX size={17} />Confirm cancellation</button><button className="e-button e-secondary" disabled={busy} onClick={() => setConfirmCancel(false)}>Keep membership</button></div> : <button className="e-button e-secondary" disabled={busy} onClick={() => setConfirmCancel(true)}><CircleX size={17} />Cancel future renewals</button>)}
      {pending && !authRequired && !status?.active && <p role="status">Payment confirmation is pending. Your membership activates after verification by the payment provider.</p>}
      {error && <p className="e-form-error" role="alert">{error}</p>}
      <button className="e-button e-secondary" disabled={busy} onClick={() => refresh(true)}><RefreshCw size={17} />Refresh payment status</button>
      <p className="e-fine">Google Play purchases are made in the Android app. Sign in with the same account to check your membership here.</p>
    </section></div>
  </section></AppShell>;
}
