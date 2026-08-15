"use client";

import { MoreHorizontal, Phone, Search, SendHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useChat } from "@/hooks/useChat";
import { getCompanionById, getCompanionThemeVars } from "@/lib/companions";

const starterReplies = [
  "Tell me the part that stayed with you after everything else got quiet.",
  "I am listening. Start messy if you need to.",
  "That sounds like it has a story behind it."
];

export function ChatExperience() {
  const params = useSearchParams();
  const companion = getCompanionById(params.get("companion"));
  const [draft, setDraft] = useState("");
  const initialMessages = useMemo(
    () => [
      {
        id: "m1",
        role: "assistant" as const,
        content: companion.greeting
      },
      {
        id: "m2",
        role: "user" as const,
        content: "Hey. Really?"
      },
      {
        id: "m3",
        role: "assistant" as const,
        content: "Yeah, especially how you see things differently. It is refreshing."
      },
      {
        id: "m4",
        role: "user" as const,
        content: "That means a lot coming from you."
      },
      {
        id: "m5",
        role: "assistant" as const,
        content: "Always. So, what is on your mind tonight?"
      }
    ],
    [companion.greeting]
  );
  const { messages, isTyping, sendMessage } = useChat(initialMessages);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = draft.trim();

    if (!content) {
      return;
    }

    const reply = starterReplies[Math.floor(Math.random() * starterReplies.length)] ?? starterReplies[0];
    sendMessage(content, reply);
    setDraft("");
  }

  return (
    <main className="app-shell chat-reference-shell" style={getCompanionThemeVars(companion)}>
      <AppSidebar active="chats" />

      <section className="reference-chat-stage">
        <div className="chat-photo-backdrop">
          <CompanionAvatar companion={companion} size="hero" />
        </div>
        <header className="reference-chat-header">
          <div className="chat-person">
            <CompanionAvatar companion={companion} size="small" />
            <span>
              <b>{companion.name}</b>
              <small>{companion.status}</small>
            </span>
            <i />
          </div>
          <div className="reference-chat-tools">
            <button aria-label="Search conversation">
              <Search size={18} />
            </button>
            <button aria-label="Voice call">
              <Phone size={18} />
            </button>
            <button aria-label="More options">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        <div className="reference-message-list" aria-live="polite">
          <span className="day-pill">Today</span>
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isTyping ? (
            <div className="chat-bubble-row chat-bubble-assistant">
              <div className="chat-bubble">
                <TypingIndicator />
              </div>
            </div>
          ) : null}
        </div>

        <form className="reference-composer" onSubmit={handleSubmit}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Message ${companion.name.split(" ")[0]}...`}
            aria-label={`Message ${companion.name}`}
          />
          <button type="submit" aria-label="Send message">
            <SendHorizontal size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}
