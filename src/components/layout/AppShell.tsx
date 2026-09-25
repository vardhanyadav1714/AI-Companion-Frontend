"use client";

import Link from "next/link";
import { Compass, Heart, HeartHandshake, MessageCircle, Crown, UserRound, ArrowUpRight } from "lucide-react";
import { ThemeSwitcher } from "./ThemeProvider";

const links = [
  { id: "discover", href: "/companions", label: "Discover", icon: Compass },
  { id: "chat", href: "/chat", label: "Chats", icon: MessageCircle },
  { id: "saved", href: "/saved", label: "Saved", icon: Heart },
  { id: "subscription", href: "/subscription", label: "Premium", icon: Crown }
];
export function Brand() { return <Link className="e-brand" href="/" aria-label="Eva home"><HeartHandshake size={29} strokeWidth={1.7} /><span>eva<span className="e-brand-dot">.</span></span></Link>; }
export function AppShell({ children, active = "discover", title, className = "" }: { children: React.ReactNode; active?: string; title: string; className?: string }) {
  return <div className={`e-app ${className}`}>
    <a className="e-skip" href="#main">Skip to content</a>
    <aside className="e-sidebar"><Brand /><p className="e-eyebrow">YOUR LITTLE CORNER</p>
      <nav aria-label="Main navigation">{links.map(({ id, href, label, icon: Icon }) => <Link key={id} href={href} className={active === id ? "is-active" : ""} aria-current={active === id ? "page" : undefined}><Icon size={19} />{label}{active === id && <span className="e-nav-dot" />}</Link>)}</nav>
      <div className="e-sidebar-bottom"><div className="e-premium-note"><Crown size={21} /><strong>A little more time together.</strong><Link href="/subscription">Explore Premium <ArrowUpRight size={16} /></Link></div><Link className="e-account" href="/profile"><UserRound size={20} /><span>Your account</span></Link><p className="e-fine">A real space. AI companions.</p></div>
    </aside>
    <div className="e-workspace"><header className="e-topbar"><div className="e-mobile-brand"><Brand /></div><span className="e-breadcrumb">{title}</span><div className="e-topbar-actions"><ThemeSwitcher /><Link className="e-icon" href="/profile" aria-label="Your account" title="Your account"><UserRound size={19} /></Link></div></header><main id="main" className="e-main">{children}</main></div>
    <nav className="e-mobile-nav" aria-label="Mobile navigation">{links.map(({ id, href, label, icon: Icon }) => <Link href={href} key={id} aria-current={active === id ? "page" : undefined}><Icon size={21} /><span>{label}</span></Link>)}</nav>
  </div>;
}
