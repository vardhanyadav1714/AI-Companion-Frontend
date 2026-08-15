import { LogIn, ShieldCheck } from "lucide-react";

import { AnimatedBackground } from "@/components/design/AnimatedBackground";
import { Button } from "@/components/design/Buttons";
import { GlassPanel } from "@/components/design/GlassPanel";
import { SiteNav } from "@/components/layout/SiteNav";

export default function LoginPage() {
  return (
    <main className="site-page login-page">
      <AnimatedBackground />
      <SiteNav />
      <section className="login-shell">
        <div className="login-copy">
          <p className="eyebrow">Welcome back</p>
          <h1>Step into your private companion space.</h1>
          <p>
            Google sign-in will connect to the backend auth flow in the next phase. The interface is already shaped for
            secure cookie sessions.
          </p>
        </div>
        <GlassPanel className="login-panel">
          <h2>Sign in</h2>
          <p>Continue with your account and keep conversations synced across sessions.</p>
          <Button icon={<LogIn size={18} />} className="wide-button">
            Continue with Google
          </Button>
          <div className="login-note">
            <ShieldCheck size={16} />
            <span>No AI keys or server secrets belong in the browser.</span>
          </div>
        </GlassPanel>
      </section>
    </main>
  );
}
