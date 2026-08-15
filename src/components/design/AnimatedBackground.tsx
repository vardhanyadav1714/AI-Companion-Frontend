"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="animated-background" aria-hidden="true">
      <motion.div
        className="light-ribbon ribbon-a"
        animate={{ opacity: [0.28, 0.48, 0.28], x: [0, 24, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="light-ribbon ribbon-b"
        animate={{ opacity: [0.18, 0.38, 0.18], y: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grain" />
    </div>
  );
}
