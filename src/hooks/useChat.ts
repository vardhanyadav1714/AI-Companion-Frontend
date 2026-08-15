"use client";

import { useEffect, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function useChat(initialMessages: ChatMessage[]) {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMessages(initialMessages);
    setIsTyping(false);
  }, [initialMessages]);

  function sendMessage(content: string, assistantReply: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content
    };

    setMessages((current) => [...current, userMessage]);
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: assistantReply
        }
      ]);
      setIsTyping(false);
    }, 700);
  }

  return {
    messages,
    isTyping,
    sendMessage
  };
}
