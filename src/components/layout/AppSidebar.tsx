"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import {
  Compass,
  Crown,
  Heart,
  Home,
  MessageCircle,
  MoreVertical,
  Settings,
  Sparkles,
  User,
  Users
} from "lucide-react";
import Link from "next/link";

import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { companions } from "@/lib/companions";

type AppSidebarProps = {
  active: "home" | "discover" | "chats" | "companions" | "favorites" | "profile" | "settings" | "subscription";
};

const navItems = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "discover", label: "Discover", href: "/companions", icon: Compass },
  { key: "chats", label: "Chats", href: "/chat?companion=eva", icon: MessageCircle },
  { key: "companions", label: "Companions", href: "/companions", icon: Users },
  { key: "favorites", label: "Favorites", href: "/companions", icon: Heart },
  { key: "profile", label: "Profile", href: "/login", icon: User },
  { key: "settings", label: "Settings", href: "/login", icon: Settings },
  { key: "subscription", label: "Subscription", href: "/subscription", icon: Crown }
] as const;

const recentChats = companions.slice(0, 4);

export function AppSidebar({ active }: AppSidebarProps) {
  const [account, setAccount] = useState("Your account");
  useEffect(() => {
    void apiRequest<{ name?: string; preferredName?: string }>("/auth/me").then(result => {
      if (result.success) setAccount(result.data.preferredName || result.data.name || "Your account");
    }).catch(() => {});
  }, []);
  return (
    <aside className="app-sidebar">
      <Link className="app-brand" href="/">
        <span className="heart-mark" />
        <span>Eva</span>
      </Link>

      <nav className="app-nav" aria-label="Application navigation">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.key === active;
          const separated = index === 5;

          return (
            <Link
              className={`app-nav-item ${isActive ? "active" : ""} ${separated ? "separated" : ""}`}
              href={item.href}
              key={item.key}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {active === "chats" ? (
        <div className="recent-chat-list">
          <div className="sidebar-mini-heading">
            <span>Recent chats</span>
            <Link href="/chat?companion=ananya">See all</Link>
          </div>
          {recentChats.map((companion, index) => (
            <Link className="recent-chat-item" href={`/chat?companion=${companion.id}`} key={companion.id}>
              <CompanionAvatar companion={companion} size="small" />
              <span>
                <b>{companion.name.split(" ")[0]}</b>
                <small>{index === 0 ? "typing..." : index === 1 ? "Hey, how are you?" : index === 2 ? "Photo" : "Voice message"}</small>
              </span>
              {index === 0 ? <em>2</em> : null}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="premium-card">
        <div>
        <strong>Eva Premium</strong>
          <Crown size={20} />
        </div>
        <p>Unlimited chats, advanced memory, voice calls and exclusive companions.</p>
        <Link href="/subscription">View plan</Link>
      </div>

      <div className="sidebar-user">
        <CompanionAvatar companion={companions[0]} size="small" />
        <span>
          <b>{account}</b>
          <small>
            <Link href="/subscription">Subscription</Link>
          </small>
        </span>
        <MoreVertical size={18} />
      </div>
    </aside>
  );
}
