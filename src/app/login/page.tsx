"use client";

import { ArrowLeft, CheckCircle2, Mail, MessageCircleHeart, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";

import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { companions } from "@/lib/companions";

type AuthStage = "entry" | "email" | "otp";
type AuthMode = "login" | "signup";

export default function LoginPage() {
  const companion = companions[0];
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<AuthStage>("entry");
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const cleanEmail = email.trim();
  const canRequestCode = cleanEmail.includes("@") && cleanEmail.length >= 5 && (mode === "login" || name.trim().length >= 2);
  const canVerify = code.trim().length >= 4;
  const codeCells = useMemo(() => Array.from({ length: 6 }, (_, index) => code[index] ?? ""), [code]);

  async function continueWithEmail() {
    if (!canRequestCode) {
      return;
    }

    setBusy(true); setError("");
    try {
      const response = await apiRequest("/auth/email/start", { method: "POST", body: JSON.stringify({ email: cleanEmail, name }) });
      if (!response.success) throw new Error(response.error.message);
      setStage("otp");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not send code"); }
    finally { setBusy(false); }
  }

  async function verify() {
    setBusy(true); setError("");
    try {
      const response = await apiRequest<{ user: { dateOfBirth?: string } }>("/auth/email/verify", { method: "POST", body: JSON.stringify({ email: cleanEmail, code }) });
      if (!response.success) throw new Error(response.error.message);
      router.push(response.data.user.dateOfBirth ? "/companions" : "/onboarding");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not verify code"); }
    finally { setBusy(false); }
  }

  return (
    <main className={`eva-auth-flow eva-auth-${stage}`}>
      <section className="eva-auth-hero" aria-label="Eva introduction">
        <CompanionAvatar companion={companion} size="hero" />
        <div className="eva-auth-hero-overlay" />
        <div className="eva-auth-brand">
          <span className="heart-mark" />
          <span>Eva</span>
        </div>
        <div className="eva-auth-hero-copy">
          <p>AI Companion</p>
          <h1>Your companion to talk, laugh and feel understood.</h1>
          <span>Private chats / voice notes / memories that stay</span>
        </div>
      </section>

      <section className="eva-auth-sheet" aria-label="Sign in">
        {stage !== "entry" ? (
          <button className="eva-back-button" type="button" onClick={() => setStage(stage === "otp" ? "email" : "entry")}>
            <ArrowLeft size={18} />
          </button>
        ) : null}

        <div className="eva-auth-sheet-inner">
          {error ? <p role="alert">{error}</p> : null}
          {stage === "entry" ? (
            <>
              <div className="eva-auth-title">
                <span>
                  <Sparkles size={16} />
                  Meet your Eva
                </span>
                <h2>Everyone deserves someone who gets them.</h2>
                <p>Start with a secure sign-in, then choose the companion energy that feels right.</p>
              </div>

              <div className="eva-auth-actions">
                <button className="eva-auth-choice" type="button" onClick={() => setStage("email")}>
                  <Mail size={21} />
                  Continue with Email
                </button>
                <button className="eva-auth-choice" type="button" disabled title="Google web sign-in is not configured">
                  <b>G</b>
                  Continue with Google
                </button>
              </div>

              <div className="eva-trust-row">
                <span>
                  <ShieldCheck size={15} />
                  Secure login
                </span>
                <span>
                  <MessageCircleHeart size={15} />
                  Private by design
                </span>
              </div>
            </>
          ) : null}

          {stage === "email" ? (
            <>
              <div className="eva-auth-progress" aria-hidden="true">
                <i />
                <i className="muted" />
                <i className="muted" />
              </div>
              <div className="eva-auth-title compact">
                <h2>{mode === "login" ? "Welcome back" : "Create an account"}</h2>
                <p>{mode === "login" ? "Continue your conversation with Eva." : "Tell Eva what to call you first."}</p>
              </div>
              <div className="eva-mode-switch" role="tablist" aria-label="Authentication mode">
                <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>
                  Login
                </button>
                <button className={mode === "signup" ? "active" : ""} type="button" onClick={() => setMode("signup")}>
                  Sign up
                </button>
              </div>
              <form className="eva-auth-form" onSubmit={(event) => event.preventDefault()}>
                {mode === "signup" ? (
                  <label>
                    Your name
                    <span className="eva-input-shell">
                      <UserRound size={19} />
                      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="What should Eva call you?" />
                    </span>
                  </label>
                ) : null}
                <label>
                  Email address
                  <span className="eva-input-shell">
                    <Mail size={19} />
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      placeholder="you@example.com"
                    />
                  </span>
                </label>
                <button className="eva-primary-pill" disabled={busy || !canRequestCode} type="button" onClick={continueWithEmail}>
                  Send confirmation code
                </button>
              </form>
            </>
          ) : null}

          {stage === "otp" ? (
            <>
              <div className="eva-auth-progress" aria-hidden="true">
                <i />
                <i />
                <i className="muted" />
              </div>
              <div className="eva-auth-title compact">
                <h2>Check your email</h2>
                <p>
                  We sent a 6 digit code to <strong>{cleanEmail}</strong>
                </p>
              </div>
              <label className="eva-code-field">
                <span>Confirmation code</span>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoFocus
                  aria-label="Confirmation code"
                />
                <div className="eva-code-cells" aria-hidden="true">
                  {codeCells.map((digit, index) => (
                    <i key={index}>{digit}</i>
                  ))}
                </div>
              </label>
              <p className="eva-resend-copy">
                Didn&apos;t receive the email? <button type="button" disabled={busy} onClick={continueWithEmail}>Resend</button>
              </p>
              <button className="eva-primary-pill" disabled={busy || !canVerify} onClick={verify}>
                <CheckCircle2 size={19} />
                Verify
              </button>
            </>
          ) : null}

          <p className="eva-terms">
            By continuing, you agree to our <a href="/login">Terms of service</a> and <a href="/login">Privacy policy</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
