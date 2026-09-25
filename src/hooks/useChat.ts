"use client";
import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api-client";
export type ChatMessage = { id: string; role: "user" | "assistant"; content: string };

export function useChat(initialMessages: ChatMessage[], companionId = "eva") {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [historyFailed, setHistoryFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const generation = useRef(0);
  const sending = useRef(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    const current = ++generation.current;
    const abort = new AbortController(); controller.current = abort;
    sending.current = false; setMessages(initialMessages); setIsTyping(false); setLoading(true);
    setHistoryFailed(false);
    setConversationId(null); setPaywall(false); setError(""); setAuthRequired(false);
    void (async () => {
      try {
        const result = await apiRequest<Array<{ id: string; companionId: string }>>("/conversations", { signal: abort.signal });
        if (generation.current !== current) return;
        if (!result.success) { setAuthRequired(result.error.code === "AUTHENTICATION_REQUIRED"); throw new Error(result.error.message); }
        const existing = result.data.find(item => item.companionId === companionId);
        if (!existing) return;
        const history = await apiRequest<{ messages: ChatMessage[] }>(`/conversations/${existing.id}/messages`, { signal: abort.signal });
        if (generation.current !== current) return;
        if (!history.success) throw new Error(history.error.message);
        setConversationId(existing.id); setMessages(history.data.messages.length ? history.data.messages : initialMessages);
      } catch (e) { if (generation.current === current && !abort.signal.aborted) { setHistoryFailed(true); setError(e instanceof Error ? e.message : "Could not load history"); } }
      finally { if (generation.current === current) setLoading(false); }
    })();
    return () => { generation.current++; abort.abort(); };
  }, [initialMessages, companionId, attempt]);

  async function sendMessage(content: string): Promise<boolean> {
    if (sending.current || loading || historyFailed || paywall || authRequired || !content.trim()) return false;
    sending.current = true;
    const current = generation.current;
    setIsTyping(true); setError("");
    try {
      let id = conversationId;
      if (!id) {
        const created = await apiRequest<{ id: string }>("/conversations", { method: "POST", body: JSON.stringify({ companionId }), signal: controller.current?.signal });
        if (!created.success) { if (generation.current === current) setAuthRequired(created.error.code === "AUTHENTICATION_REQUIRED"); throw new Error(created.error.message); }
        id = created.data.id;
        if (generation.current !== current) return false;
        setConversationId(id);
      }
      const response = await apiRequest<{ userMessage: ChatMessage; assistantMessage: ChatMessage }>(`/conversations/${id}/messages`, { method: "POST", body: JSON.stringify({ content, companionId }), signal: controller.current?.signal });
      if (generation.current !== current) return false;
      if (!response.success) { setPaywall(response.error.code === "MESSAGE_LIMIT_REACHED"); setAuthRequired(response.error.code === "AUTHENTICATION_REQUIRED"); throw new Error(response.error.message); }
      setMessages(previous => [...previous, response.data.userMessage, response.data.assistantMessage]);
      return true;
    } catch (e) { if (generation.current === current) setError(e instanceof Error ? e.message : "Could not send message"); return false; }
    finally { if (generation.current === current) { sending.current = false; setIsTyping(false); } }
  }
  return { messages, isTyping, loading, historyFailed, retryHistory: () => setAttempt(value => value + 1), error, authRequired, paywall, sendMessage };
}
