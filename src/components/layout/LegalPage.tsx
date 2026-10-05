import Link from "next/link";
import { Brand } from "./AppShell";
import { ThemeSwitcher } from "./ThemeProvider";

export function LegalPage({ title, summary, children }: { title: string; summary: string; children: React.ReactNode }) {
  const supportEmail = process.env.EVA_SUPPORT_EMAIL;
  const operator = process.env.EVA_LEGAL_OPERATOR_NAME;
  return <div className="e-legal">
    <a className="e-skip" href="#legal-content">Skip to content</a>
    <header className="e-legal-header"><Brand /><ThemeSwitcher /></header>
    <main id="legal-content" className="e-legal-content">
      <p className="e-eyebrow">EVA / LEGAL</p>
      <h1>{title}</h1>
      <p className="e-legal-date">Effective 5 October 2026</p>
      <p className="e-legal-summary">{summary}</p>
      {children}
      {(operator || supportEmail) && <section><h2>Contact</h2>
        {operator && <p>Service operator: {operator}.</p>}
        {supportEmail && <p>Questions about this policy or a payment? Email <a href={`mailto:${supportEmail}`}>{supportEmail}</a>. Include your account email and transaction reference, but never your password, OTP or complete card details.</p>}
      </section>}
      <nav className="e-legal-links" aria-label="Legal and account links">
        <Link href="/terms">Terms &amp; Conditions</Link>
        <Link href="/refund-policy">Cancellation &amp; Refund Policy</Link>
        <Link href="/login">Sign in</Link>
      </nav>
    </main>
  </div>;
}
