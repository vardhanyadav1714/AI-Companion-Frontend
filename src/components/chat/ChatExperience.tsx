"use client";

import { ArrowLeft, SendHorizontal, Settings } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/design/Buttons";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { MoodIndicator } from "@/components/companions/MoodIndicator";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useChat } from "@/hooks/useChat";
import { companions, getCompanionById, getCompanionThemeVars } from "@/lib/companions";

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
        id: "greeting",
        role: "assistant" as const,
        content: companion.greeting
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
    <main className="chat-page" style={getCompanionThemeVars(companion)}>
      <aside className="conversation-rail" aria-label="Companion switcher">
        <Link className="rail-back" href="/companions">
          <ArrowLeft size={18} />
          <span>Companions</span>
        </Link>
        <div className="rail-list">
          {companions.map((item) => (
            <Link
              href={`/chat?companion=${item.id}`}
              key={item.id}
              className={`rail-companion ${item.id === companion.id ? "active" : ""}`}
              style={getCompanionThemeVars(item)}
            >
              <CompanionAvatar companion={item} size="small" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </aside>

      <section className="chat-stage">
        <header className="chat-header">
          <div className="chat-identity">
            <CompanionAvatar companion={companion} size="small" />
            <div>
              <h1>{companion.name}</h1>
              <p>{companion.traits.join(" - ")}</p>
            </div>
          </div>
          <div className="chat-header-actions">
            <MoodIndicator mood={companion.mood} />
            <button className="icon-button" aria-label="Chat settings">
              <Settings size={18} />
            </button>
          </div>
        </header>

        <div className="chat-intro">
          <CompanionAvatar companion={companion} size="medium" />
          <p>{companion.greeting}</p>
        </div>

        <div className="message-list" aria-live="polite">
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

        <form className="chat-composer" onSubmit={handleSubmit}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Write to ${companion.name}...`}
            aria-label={`Write to ${companion.name}`}
          />
          <Button icon={<SendHorizontal size={18} />} type="submit">
            Send
          </Button>
        </form>
      </section>
    </main>
  );
}
