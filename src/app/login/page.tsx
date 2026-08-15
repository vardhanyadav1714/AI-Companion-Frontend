import { Apple, EyeOff, Lock, Mail } from "lucide-react";

import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { companions } from "@/lib/companions";

export default function LoginPage() {
  const companion = companions[0];

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-logo">
          <span className="heart-mark" />
          <span>Merigf</span>
        </div>
        <CompanionAvatar companion={companion} size="hero" />
        <div className="auth-visual-copy">
          <h1>
            Your world.
            <br />
            Your <span>companion.</span>
          </h1>
          <p>Real conversations. Real emotions. AI companions who truly understand you.</p>
        </div>
      </section>

      <section className="auth-panel-wrap">
        <div className="auth-panel">
          <p className="signup-line">
            Don&apos;t have an account? <a href="/companions">Sign up</a>
          </p>
          <div className="auth-heading">
            <h2>Welcome back</h2>
            <p>Log in to continue your conversations</p>
          </div>

          <form className="auth-form">
            <label>
              Email address
              <span className="input-shell">
                <Mail size={20} />
                <input type="email" placeholder="Enter your email" />
              </span>
            </label>
            <label>
              Password
              <span className="input-shell">
                <Lock size={20} />
                <input type="password" placeholder="Enter your password" />
                <EyeOff size={20} />
              </span>
            </label>
            <a className="forgot-link" href="/login">
              Forgot password?
            </a>
            <button className="auth-submit" type="button">
              Log in
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <p>or continue with</p>
            <span />
          </div>

          <div className="social-stack">
            <button type="button">
              <b>G</b>
              Continue with Google
            </button>
            <button type="button">
              <Apple size={22} />
              Continue with Apple
            </button>
          </div>

          <p className="terms-copy">
            By continuing, you agree to our <a href="/login">Terms of Service</a> and{" "}
            <a href="/login">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
