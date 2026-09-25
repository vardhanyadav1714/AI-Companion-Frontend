"use client";
import { ArrowLeft, ArrowUpRight, Heart, Send, Crown, Info, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Portrait } from "@/components/companions/Portrait";
import { useChat } from "@/hooks/useChat";
import { useFavorites } from "@/hooks/useFavorites";
import { companions, getCompanionById } from "@/lib/companions";

export function ChatExperience() {
  const params = useSearchParams();
  const companion = getCompanionById(params.get("companion"));
  const [draft, setDraft] = useState("");
  const [info, setInfo] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const activeCompanion = useRef(companion.id); activeCompanion.current = companion.id;
  const initial = useMemo(() => [{ id: "greeting", role: "assistant" as const, content: companion.greeting }], [companion.greeting]);
  const { messages, loading, historyFailed, retryHistory, isTyping, sendMessage, error, paywall, authRequired } = useChat(initial, companion.id);
  const { favorites, toggle, ready } = useFavorites();
  useEffect(() => { setDraft(""); setInfo(false); }, [companion.id]);
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" }); }, [messages, isTyping]);
  async function send(content: string) { const id = companion.id; if (await sendMessage(content.trim()) && activeCompanion.current === id) setDraft(""); }
  const disabled = loading || historyFailed || isTyping || paywall || authRequired;
  return <AppShell active="chat" title="Conversations" className="e-chat-app"><div className="e-chat-workspace">
    <aside className="e-chat-contacts"><h2>Your companions</h2>{companions.map(c => <Link href={`/chat?companion=${c.id}`} key={c.id} aria-current={c.id === companion.id ? "page" : undefined}><Portrait companion={c} small /><span><strong>{c.name}</strong><small>{c.tags.slice(0, 2).join(" / ")}</small></span></Link>)}</aside>
    <section className="e-conversation" aria-label={`Chat with ${companion.name}`}><header className="e-conversation-header"><Link className="e-icon" href="/companions" aria-label="Back to companions"><ArrowLeft size={19} /></Link><Portrait companion={companion} small /><div><h1>{companion.name}</h1><span>AI companion</span></div><button className="e-icon" aria-label={`About ${companion.name}`} aria-expanded={info} title={`About ${companion.name}`} onClick={() => setInfo(!info)}><Info size={21} /></button><button className="e-icon" aria-label="Save companion" title="Save companion" aria-pressed={favorites.includes(companion.id)} disabled={!ready} onClick={() => toggle(companion.id)}><Heart size={21} fill={favorites.includes(companion.id) ? "currentColor" : "none"} /></button></header>
      {info && <div className="e-chat-info"><p>{companion.description} {companion.personality}</p><Link href={`/companions/${companion.id}`}>View profile <ArrowUpRight size={14} /></Link></div>}
      <div className="e-messages" ref={list} role="log" aria-label="Conversation messages" aria-live="polite"><div className="e-chat-welcome"><Portrait companion={companion} small /><h2>A moment with {companion.name}</h2><p>{companion.description}</p></div>{loading ? <p className="e-muted" role="status">Loading your conversation...</p> : messages.map(m => <div className={`e-message e-message-${m.role}`} key={m.id}><span className="e-message-author">{m.role === "user" ? "You" : companion.name}</span><p>{m.content}</p></div>)}{isTyping && <div className="e-message e-message-assistant e-typing" role="status"><span>{companion.name} is thinking</span><i /><i /><i /></div>}</div>
      {paywall ? <div className="e-chat-notice"><Crown size={22} /><div><strong>Your free messages are all used</strong><p>Keep the conversation going with Eva Premium.</p></div><Link className="e-button" href="/subscription">View plan</Link></div> : authRequired ? <div className="e-chat-notice"><MessageCircle size={22} /><div><strong>A conversation starts with hello.</strong><p>Sign in to chat with {companion.name}.</p></div><Link href="/login" className="e-button">Sign in</Link></div> : error && <p className="e-alert" role="alert">{error}</p>}
      <div className="e-composer-area"><div className="e-suggestions">{["How was your day?", "I have something on my mind", "Make me smile"].map(p => <button key={p} disabled={disabled} onClick={() => setDraft(p)}>{p}</button>)}</div><form className="e-composer" onSubmit={e => { e.preventDefault(); void send(draft); }}><textarea rows={1} maxLength={4000} disabled={disabled} aria-label={`Message ${companion.name}`} placeholder={`Message ${companion.name}...`} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); if (!disabled) void send(draft); } }} /><button className="e-send" type="submit" disabled={disabled || !draft.trim()} aria-label="Send message" title="Send message"><Send size={19} /></button></form><p className="e-composer-note">Eva is AI, not a person. Take what helps, leave what doesn&apos;t.</p></div>
      {historyFailed && !authRequired && <button className="e-button e-secondary" onClick={retryHistory}>Retry loading conversation</button>}
    </section>
  </div></AppShell>;
}
