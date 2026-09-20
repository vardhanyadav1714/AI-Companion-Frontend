import { MessageCircle, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/design/Buttons";

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <Link className="brand-mark" href="/">
        <span className="heart-mark" />
        <span>Eva</span>
      </Link>
      <div className="nav-links">
        <Link href="/companions">Companions</Link>
        <Link href="/chat">Chat</Link>
        <Link href="/login">Login</Link>
      </div>
      <Button href="/companions" icon={<Sparkles size={17} />} className="nav-cta">
        Meet Eva
      </Button>
      <div className="mobile-nav">
        <Link href="/companions" aria-label="Companions">
          <Sparkles size={19} />
        </Link>
        <Link href="/chat" aria-label="Chat">
          <MessageCircle size={19} />
        </Link>
        <Link href="/login" aria-label="Login">
          <UserRound size={19} />
        </Link>
      </div>
    </nav>
  );
}
