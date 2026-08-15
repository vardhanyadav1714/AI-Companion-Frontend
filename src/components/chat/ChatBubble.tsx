"use client";

import { motion } from "framer-motion";

import type { ChatMessage } from "@/hooks/useChat";

export function ChatBubble({ message }: { message: ChatMessage }) {
  return (
    <motion.div
      className={`chat-bubble-row chat-bubble-${message.role}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="chat-bubble">{message.content}</div>
    </motion.div>
  );
}
