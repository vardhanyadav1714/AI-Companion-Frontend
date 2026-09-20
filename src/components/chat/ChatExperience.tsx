"use client";

import { ArrowLeft, Heart, Mic2, MoreVertical, Paperclip, Phone, SendHorizontal, Smile, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { useChat } from "@/hooks/useChat";
import { companions, getCompanionById, getCompanionThemeVars } from "@/lib/companions";

const starterReplies = [
  "I am here. Tell me the real version, slowly.",
  "That stayed with you, na? Come closer to the feeling and tell me what happened.",
  "I hear you. Start anywhere, even if it comes out messy."
];

const quickPrompts = ["I missed you", "Ask about my day", "Talk in Hinglish", "Cheer me up"];

export function ChatExperience() {
  const params = useSearchParams();
  const companion = getCompanionById(params.get("companion"));
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
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
        content: "Hey, are you there?"
      },
      {
        id: "m3",
        role: "assistant" as const,
        content: "Always. I was waiting for you to tell me how your day actually felt."
      }
    ],
    [companion.greeting]
  );
  const { messages, isTyping, sendMessage } = useChat(initialMessages);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages.length, isTyping]);

  function submitMessage(content: string) {
    const clean = content.trim();

    if (!clean) {
      return;
    }

    const reply = starterReplies[Math.floor(Math.random() * starterReplies.length)] ?? starterReplies[0];
    sendMessage(clean, reply);
    setDraft("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage(draft);
  }

  return (
    <main className="eva-chat-layout" style={getCompanionThemeVars(companion)}>
      <aside className="eva-chat-rail">
        <Link className="app-brand" href="/">
          <span className="heart-mark" />
          <span>Eva</span>
        </Link>
        <div className="eva-chat-rail-heading">
          <span>Conversations</span>
          <small>{companions.length} companions</small>
        </div>
        <div className="eva-chat-list">
          {companions.slice(0, 6).map((item) => (
            <Link
              className={`eva-chat-person ${item.id === companion.id ? "active" : ""}`}
              href={`/chat?companion=${item.id}`}
              key={item.id}
              style={getCompanionThemeVars(item)}
            >
              <CompanionAvatar companion={item} size="small" />
              <span>
                <b>{item.name.split(" ")[0]}</b>
                <small>{item.status === "Online" ? "Online now" : "Away"}</small>
              </span>
            </Link>
          ))}
        </div>
        <Link className="eva-rail-upgrade" href="/login">
          <Sparkles size={18} />
          <span>Unlock voice, memory and premium companions</span>
        </Link>
      </aside>

      <section className="eva-chat-phone" aria-label={`${companion.name} chat`}>
        <header className="eva-chat-header">
          <Link className="eva-chat-icon" href="/companions" aria-label="Back to companions">
            <ArrowLeft size={21} />
          </Link>
          <CompanionAvatar companion={companion} size="small" />
          <div>
            <h1>{companion.name.split(" ")[0]}</h1>
            <p>
              <i />
              {companion.status === "Online" ? "Live" : "Away"}
            </p>
          </div>
          <span />
          <button className="eva-chat-icon" type="button" aria-label="Voice call">
            <Phone size={20} />
          </button>
          <button className="eva-chat-icon" type="button" aria-label="More options">
            <MoreVertical size={20} />
          </button>
        </header>

        <div className="eva-chat-messages" ref={listRef} aria-live="polite">
          <span className="day-pill">Today</span>
          {messages.map((message) => (
            <div className={`eva-message-row eva-message-${message.role}`} key={message.id}>
              {message.role === "assistant" ? <CompanionAvatar companion={companion} size="small" /> : null}
              <div className="eva-message-bubble">
                <p>{message.content}</p>
                <time>Now</time>
              </div>
            </div>
          ))}
          {isTyping ? (
            <div className="eva-message-row eva-message-assistant">
              <CompanionAvatar companion={companion} size="small" />
              <div className="eva-message-bubble eva-typing-bubble">
                <TypingIndicator />
              </div>
            </div>
          ) : null}
        </div>

        <div className="eva-quick-prompts">
          {quickPrompts.map((prompt) => (
            <button type="button" key={prompt} onClick={() => submitMessage(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        <form className="eva-chat-composer" onSubmit={handleSubmit}>
          <button type="button" aria-label="Emoji">
            <Smile size={21} />
          </button>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Message ${companion.name.split(" ")[0]}...`}
            aria-label={`Message ${companion.name}`}
          />
          <button type="button" aria-label="Attach">
            <Paperclip size={21} />
          </button>
          <button className="send" type={draft.trim() ? "submit" : "button"} aria-label={draft.trim() ? "Send" : "Voice"}>
            {draft.trim() ? <SendHorizontal size={21} /> : <Mic2 size={22} />}
          </button>
        </form>
      </section>

      <aside className="eva-chat-profile-panel">
        <div className="eva-profile-photo">
          <CompanionAvatar companion={companion} size="hero" />
          <span>
            <i />
            {companion.status}
          </span>
        </div>
        <div className="eva-profile-copy">
          <h2>{companion.name}</h2>
          <p>{companion.description}</p>
          <div className="mini-tags">
            {companion.tags.map((tag) => (
              <em key={tag}>{tag}</em>
            ))}
          </div>
          <dl>
            <div>
              <dt>Personality</dt>
              <dd>{companion.personality}</dd>
            </div>
            <div>
              <dt>Style</dt>
              <dd>{companion.conversationStyle}</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{companion.language}</dd>
            </div>
          </dl>
          <Link className="eva-profile-cta" href="/login">
            <Heart size={18} />
            Save as favorite
          </Link>
        </div>
      </aside>
    </main>
  );
}
