"use client";

import { ChevronRight, Heart, MessageCircle, MoreVertical, Phone, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { CompanionBadge } from "@/components/companions/CompanionBadge";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { type Companion, companions, getCompanionThemeVars } from "@/lib/companions";

const filters = ["All", "Popular", "New", "Romantic", "Funny", "Study", "Mentor", "Adventure", "Roleplay"];

export function DiscoveryExperience() {
  const [selected, setSelected] = useState<Companion>(companions[0]);

  return (
    <main className="app-shell discovery-shell" style={getCompanionThemeVars(selected)}>
      <AppSidebar active="discover" />

      <section className="discover-main">
        <header className="discover-topbar">
          <div>
            <h1>
              Find <span>your</span> person.
            </h1>
            <p>Every companion has a story. What&apos;s yours?</p>
          </div>
          <div className="discover-search">
            <Search size={19} />
            <input placeholder="Search companions..." aria-label="Search companions" />
          </div>
          <button className="square-tool-button" aria-label="Filter companions">
            <SlidersHorizontal size={18} />
          </button>
        </header>

        <div className="filter-row" aria-label="Companion filters">
          {filters.map((filter, index) => (
            <button className={index === 0 ? "active" : ""} key={filter}>
              {filter}
            </button>
          ))}
          <ChevronRight size={22} />
        </div>

        <div className="discover-card-grid">
          {companions.map((companion) => (
            <button
              className={`discover-card ${selected.id === companion.id ? "active" : ""}`}
              key={companion.id}
              onClick={() => setSelected(companion)}
              style={getCompanionThemeVars(companion)}
            >
              <CompanionAvatar companion={companion} size="large" />
              <span className={`status-pill ${companion.status.toLowerCase()}`}>
                <i />
                {companion.status}
              </span>
              <span className="discover-card-copy">
                <strong>{companion.name}</strong>
                <small>{companion.description}</small>
                <span className="mini-tags">
                  {companion.tags.slice(0, 3).map((tag) => (
                    <em key={tag}>{tag}</em>
                  ))}
                </span>
                <span className="chat-count">
                  <MessageCircle size={14} />
                  {companion.chatCount} chats
                </span>
              </span>
              <span className="card-chat-button">
                <MessageCircle size={18} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <aside className="discover-profile-panel">
        <div className="profile-panel-hero">
          <CompanionAvatar companion={selected} size="hero" />
          <button className="panel-floating-button panel-back" aria-label="Back">
            <ChevronRight size={18} />
          </button>
          <button className="panel-floating-button panel-menu" aria-label="More options">
            <MoreVertical size={18} />
          </button>
          <div className="profile-panel-copy">
            <h2>{selected.name}</h2>
            <p className={`status-line ${selected.status.toLowerCase()}`}>
              <i />
              {selected.status === "Online" ? "Online now" : "Away"}
            </p>
          </div>
        </div>

        <div className="panel-actions">
          <a href={`/chat?companion=${selected.id}`}>
            <MessageCircle size={22} />
            <span>Start Chat</span>
          </a>
          <button>
            <Phone size={22} />
            <span>Voice Call</span>
          </button>
          <button>
            <Heart size={22} />
            <span>Add to Fav</span>
          </button>
        </div>

        <div className="panel-about">
          <h3>About {selected.name.split(" ")[0]}</h3>
          <p>{selected.description} She loves {selected.interests.slice(0, 4).join(", ")} and meaningful conversations.</p>

          <dl>
            <div>
              <dt>Personality</dt>
              <dd>{selected.personality}</dd>
            </div>
            <div>
              <dt>Conversation Style</dt>
              <dd>{selected.conversationStyle}</dd>
            </div>
            <div>
              <dt>Interests</dt>
              <dd>{selected.interests.join(", ")}</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{selected.language}</dd>
            </div>
          </dl>

          <blockquote>{selected.sampleMessages[0]}</blockquote>

          <div className="badge-row">
            {selected.traits.map((trait) => (
              <CompanionBadge key={trait} label={trait} />
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
