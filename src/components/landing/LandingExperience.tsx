"use client";

import { ArrowRight, Brain, MessageCircleHeart, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/design/Buttons";
import { GlassPanel } from "@/components/design/GlassPanel";
import { GradientText } from "@/components/design/GradientText";
import { SectionHeading } from "@/components/design/SectionHeading";
import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { CompanionCard } from "@/components/companions/CompanionCard";
import { companions } from "@/lib/companions";

const floatingMemories = [
  "You told me about your interview.",
  "Rainy evenings calm you down.",
  "You like being called by your name.",
  "Still thinking about that movie?"
];

const features = [
  {
    icon: <Brain size={20} />,
    title: "Memory that feels natural",
    copy: "Important details can return at the right moment instead of flooding every reply."
  },
  {
    icon: <MessageCircleHeart size={20} />,
    title: "Personality-led conversations",
    copy: "Every companion has a distinct tone, mood, and conversation rhythm."
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "User control from day one",
    copy: "The product direction includes transparent memory review and safe account boundaries."
  }
];

export function LandingExperience() {
  const heroCompanion = companions[2];

  return (
    <>
      <section className="hero-section">
        <div className="hero-backdrop" />
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow">Premium AI companion platform</p>
          <h1>
            Someone who <GradientText>remembers you.</GradientText>
          </h1>
          <p>
            Meet companions with real emotional continuity, personal style, and conversations that do not reset every
            time you come back.
          </p>
          <div className="hero-actions">
            <Button href="/companions" icon={<Sparkles size={18} />}>
              Discover companions
            </Button>
            <Button href="/login" icon={<ArrowRight size={18} />} variant="secondary">
              Sign in
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="hero-companion"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <CompanionAvatar companion={heroCompanion} size="hero" />
          {floatingMemories.map((memory, index) => (
            <motion.span
              className={`memory-fragment fragment-${index + 1}`}
              key={memory}
              animate={{ y: [0, index % 2 ? -8 : 8, 0] }}
              transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
            >
              {memory}
            </motion.span>
          ))}
        </motion.div>
      </section>

      <section className="content-section companions-preview">
        <SectionHeading eyebrow="Companion discovery" title="Choose a presence, not a bot.">
          Each companion carries her own mood, voice, interests, and visual identity.
        </SectionHeading>
        <div className="companion-grid preview-grid">
          {companions.slice(0, 3).map((companion, index) => (
            <CompanionCard key={companion.id} companion={companion} index={index} />
          ))}
        </div>
      </section>

      <section className="content-section memory-section">
        <SectionHeading eyebrow="Memory system" title="The interface makes memory visible.">
          Long-term context should feel intimate, but never hidden from the user.
        </SectionHeading>
        <div className="memory-layout">
          {["Preferences", "Interests", "Life context"].map((title, index) => (
            <motion.div
              key={title}
              className="memory-card"
              initial={{ opacity: 0, x: index % 2 ? 18 : -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <span className="memory-kind">{title}</span>
              <strong>{["Likes warm, casual replies", "Loves sci-fi movies", "Preparing for a new role"][index]}</strong>
              <p>{["Style", "Interest", "Important context"][index]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="content-section feature-section">
        <div className="feature-grid">
          {features.map((feature) => (
            <GlassPanel key={feature.title} className="feature-panel">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </GlassPanel>
          ))}
        </div>
      </section>
    </>
  );
}
