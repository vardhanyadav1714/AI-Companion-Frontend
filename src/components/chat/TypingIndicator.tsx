"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="typing-indicator" aria-label="Companion is typing">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.14 }}
        />
      ))}
    </div>
  );
}
