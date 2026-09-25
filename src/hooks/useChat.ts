"use client";

import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api-client";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function useChat(initialMessages: ChatMessage[], companionId = "eva") {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [paywall, setPaywall] = useState(false);
  const generation = useRef(0);
  const sending = useRef(false);

  useEffect(() => {
    const current = ++generation.current;
    setMessages(initialMessages);
    setIsTyping(false);
    setConversationId(null);
    setPaywall(false);
    setError("");
    void apiRequest<Array<{ id: string; companionId: string }>>("/conversations").then(async result => {
      if (!result.success || generation.current !== current || sending.current) return;
      const existing = result.data.find(item => item.companionId === companionId);
      if (!existing) return;
      const history = await apiRequest<{ messages: ChatMessage[] }>(`/conversations/${existing.id}/messages`);
      if (!history.success || generation.current !== current || sending.current) return;
      setConversationId(existing.id); setMessages(history.data.messages);
    }).catch(() => { if (generation.current === current) setError("Could not load history"); });
    return () => { generation.current++; };
  }, [initialMessages, companionId]);

  async function sendMessage(content: string) {
    if (sending.current || paywall) return;
    sending.current = true;
    const current = generation.current;

    setIsTyping(true);
    setError("");
    try {
      let id = conversationId;
      if (!id) {
        const created = await apiRequest<{ id: string }>("/conversations", { method: "POST", body: JSON.stringify({ companionId }) });
        if (!created.success) throw new Error(created.error.message);
        id = created.data.id;
        if (generation.current === current) setConversationId(id);
      }
      const response = await apiRequest<{ userMessage: ChatMessage; assistantMessage: ChatMessage }>(`/conversations/${id}/messages`, {
        method: "POST", body: JSON.stringify({ content, companionId })
      });
      if (generation.current !== current) return;
      if (!response.success) {
        if (response.error.code === "MESSAGE_LIMIT_REACHED") setPaywall(true);
        throw new Error(response.error.message);
      }
      setMessages(previous => [...previous, response.data.userMessage, response.data.assistantMessage]);
    } catch (error) { if (generation.current === current) setError(error instanceof Error ? error.message : "Could not send message"); }
    finally { sending.current = false; setIsTyping(false); }
  }

  return {
    messages,
    isTyping,
    error,
    paywall,
    sendMessage
  };
}
