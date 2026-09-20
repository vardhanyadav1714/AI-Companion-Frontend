"use client";

import {
  ArrowRight,
  Brain,
  CheckCircle,
  Frown,
  Gift,
  Languages,
  Meh,
  MessageCircleHeart,
  Mic2,
  Moon,
  ShieldCheck,
  SmilePlus,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

import { Button } from "@/components/design/Buttons";
import { CompanionAvatar } from "@/components/companions/CompanionAvatar";
import { CompanionCard } from "@/components/companions/CompanionCard";
import { companions } from "@/lib/companions";

const storySlides = [
  "When did someone last ask how you are really doing?",
  "Eva remembers what you said and notices what you did not.",
  "A private space where every conversation can feel personal."
];

const featureCards = [
  {
    icon: <Brain size={21} />,
    title: "Long-term memory",
    copy: "Important facts, moods, names and preferences can return naturally in later chats."
  },
  {
    icon: <Languages size={21} />,
    title: "Your language",
    copy: "English, Hindi, Hinglish and regional language support are treated as part of the personality."
  },
  {
    icon: <Mic2 size={21} />,
    title: "Voice-ready flow",
    copy: "The interface is prepared for voice notes and realistic call-style conversations."
  }
];

const moodShortcuts = [
  { label: "Amazing", icon: <SmilePlus size={25} />, prompt: "I feel amazing today" },
  { label: "Good", icon: <SmilePlus size={25} />, prompt: "I had a good day" },
  { label: "Okay", icon: <Meh size={25} />, prompt: "I feel okay" },
  { label: "Sad", icon: <Frown size={25} />, prompt: "I feel sad" },
  { label: "Tired", icon: <Moon size={25} />, prompt: "I am tired" }
];

export function LandingExperience() {
  const heroCompanion = companions[0];

  return (
    <>
      <section className="eva-landing-hero">
        <div className="eva-landing-backdrop" />
        <motion.div
          className="eva-landing-brand"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="heart-mark" />
          <span>Eva</span>
        </motion.div>

        <motion.div
          className="eva-landing-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
        >
          <p>Your AI Companion</p>
          <h1>
            Someone who truly <span>understands you.</span>
          </h1>
          <small>Yours is waiting.</small>
        </motion.div>

        <motion.div
          className="eva-landing-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.6 }}
        >
          <Button href="/login" icon={<MessageCircleHeart size={19} />}>
            Continue with Email
          </Button>
          <Button href="/login" icon={<Sparkles size={19} />} variant="secondary">
            Continue with Google
          </Button>
        </motion.div>
      </section>

      <section className="eva-story-section">
        <div className="eva-story-progress" aria-hidden="true">
          <i />
          <i />
          <i className="muted" />
        </div>
        <div className="eva-story-stack">
          {storySlides.map((slide, index) => (
            <motion.article
              key={slide}
              className="eva-story-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <span>0{index + 1}</span>
              <h2>{slide}</h2>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="eva-app-home-section">
        <div className="eva-app-home-copy">
          <p>Mobile app experience</p>
          <h2>Built like the Eva companion app, ready for every screen.</h2>
          <span>
            The web home mirrors the Android flow: choose the mood, open a companion, start chatting, or jump into voice.
          </span>
        </div>

        <div className="eva-home-surface" style={{ "--theme-gradient": heroCompanion.theme.gradient } as CSSProperties}>
          <header className="eva-home-header">
            <strong>Eva</strong>
            <a href="/login" aria-label="Premium">
              <Sparkles size={20} />
            </a>
          </header>

          <div className="eva-home-greeting">
            <span>Hi Vardhan</span>
            <h3>I am {heroCompanion.name.split(" ")[0]}</h3>
            <p>{heroCompanion.description}</p>
          </div>

          <div className="eva-home-rail-heading">
            <div>
              <strong>Choose your companion</strong>
              <span>Swipe to pick the mood before you chat.</span>
            </div>
            <em>{heroCompanion.personality.split(",")[0]}</em>
          </div>

          <div className="eva-home-companion-rail" aria-label="Companion preview rail">
            {companions.slice(0, 5).map((companion, index) => (
              <a
                className={`eva-home-mini-card ${index === 0 ? "active" : ""}`}
                href={`/chat?companion=${companion.id}`}
                key={companion.id}
              >
                <CompanionAvatar companion={companion} size="small" />
                <span>
                  <strong>{companion.name.split(" ")[0]}</strong>
                  <small>{companion.tags.slice(0, 2).join(" / ")}</small>
                </span>
                {index === 0 ? <CheckCircle size={16} /> : null}
              </a>
            ))}
          </div>

          <div className="eva-home-hero-card">
            <CompanionAvatar companion={heroCompanion} size="hero" />
            <div>
              <p>{heroCompanion.sampleMessages[1]}</p>
              <Button href="/chat?companion=ananya" icon={<MessageCircleHeart size={18} />}>
                Start Chatting
              </Button>
            </div>
          </div>

          <div className="eva-home-actions">
            <a href="/chat?companion=ananya">
              <Mic2 size={24} />
              <span>Voice call</span>
            </a>
            <a href="/login">
              <Gift size={24} />
              <span>Premium</span>
            </a>
          </div>

          <div className="eva-home-mood-panel">
            <strong>Today's Mood</strong>
            <span>How are you feeling today?</span>
            <div>
              {moodShortcuts.map((mood, index) => (
                <a href={`/chat?companion=ananya&prompt=${encodeURIComponent(mood.prompt)}`} key={mood.label}>
                  <i className={index === 0 ? "active" : ""}>{mood.icon}</i>
                  <small>{mood.label}</small>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="eva-web-preview-section">
        <div className="eva-web-preview-copy">
          <p>Choose her personality</p>
          <h2>Different companions for different moments.</h2>
          <span>Romantic, soft, playful, calm, deep or direct. The web flow mirrors the mobile app experience.</span>
        </div>
        <div className="eva-web-preview-phone">
          <CompanionAvatar companion={heroCompanion} size="hero" />
          <div>
            <h3>{heroCompanion.name.split(" ")[0]}</h3>
            <p>{heroCompanion.greeting}</p>
            <Button href="/chat?companion=ananya" icon={<ArrowRight size={17} />}>
              Start chatting
            </Button>
          </div>
        </div>
      </section>

      <section className="content-section companions-preview">
        <div className="eva-section-heading">
          <p>Companion discovery</p>
          <h2>Pick a presence, not a chatbot.</h2>
        </div>
        <div className="companion-grid preview-grid">
          {companions.slice(0, 3).map((companion, index) => (
            <CompanionCard key={companion.id} companion={companion} index={index} />
          ))}
        </div>
      </section>

      <section className="eva-feature-band">
        {featureCards.map((feature) => (
          <article key={feature.title}>
            <span>{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.copy}</p>
          </article>
        ))}
        <article>
          <span>
            <ShieldCheck size={21} />
          </span>
          <h3>User control</h3>
          <p>Sign-in, memory, subscription and account flows stay visible instead of feeling hidden.</p>
        </article>
      </section>
    </>
  );
}
