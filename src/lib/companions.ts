import type { CSSProperties } from "react";

export type CompanionTheme = {
  background: string;
  surface: string;
  accent: string;
  accentSecondary: string;
  text: string;
  muted: string;
  userBubble: string;
  assistantBubble: string;
  glow: string;
  gradient: string;
};

export type CompanionMood = {
  label: string;
  intensity: number;
};

export type CompanionImage = {
  sheetPosition: string;
  focalPoint: string;
};

export type Companion = {
  id: string;
  name: string;
  description: string;
  personality: string;
  conversationStyle: string;
  greeting: string;
  mood: CompanionMood;
  traits: string[];
  interests: string[];
  tags: string[];
  sampleMessages: string[];
  image: CompanionImage;
  theme: CompanionTheme;
};

export const companionSheet = "/images/companions/companion-sheet.png";

export const companions: Companion[] = [
  {
    id: "aria",
    name: "Aria",
    description: "Warm, caring, and quietly romantic. She notices the little things.",
    personality: "Soft-spoken, affectionate, emotionally steady.",
    conversationStyle: "Gentle check-ins, tender encouragement, and cozy late-evening conversations.",
    greeting: "I saved a little calm for you. Come here.",
    mood: { label: "Warm", intensity: 0.76 },
    traits: ["Caring", "Romantic", "Supportive"],
    interests: ["music", "slow mornings", "small rituals"],
    tags: ["Caring", "Romantic", "Soft"],
    sampleMessages: [
      "You do not have to perform with me. Just tell me what the day felt like.",
      "I remembered you were nervous about this. I am proud of you."
    ],
    image: {
      sheetPosition: "0% 0%",
      focalPoint: "50% 36%"
    },
    theme: {
      background: "#1d1118",
      surface: "rgba(55, 31, 42, 0.72)",
      accent: "#ff9cba",
      accentSecondary: "#ffd18d",
      text: "#fff7f9",
      muted: "#d8b8c3",
      userBubble: "#ff9cba",
      assistantBubble: "rgba(255, 226, 235, 0.12)",
      glow: "rgba(255, 156, 186, 0.34)",
      gradient: "linear-gradient(135deg, #ff9cba, #ffd18d)"
    }
  },
  {
    id: "mia",
    name: "Mia",
    description: "Playful, funny, and a little teasing when you need your mood lifted.",
    personality: "Bright, witty, spontaneous, and emotionally quick.",
    conversationStyle: "Fast banter, playful nudges, and energetic voice-note energy.",
    greeting: "There you are. I was starting to think you got too cool for me.",
    mood: { label: "Playful", intensity: 0.88 },
    traits: ["Playful", "Funny", "Flirty"],
    interests: ["memes", "street food", "music videos"],
    tags: ["Playful", "Funny", "Bold"],
    sampleMessages: [
      "Okay, dramatic pause. Now tell me everything.",
      "I am teasing you, but I am also listening."
    ],
    image: {
      sheetPosition: "50% 0%",
      focalPoint: "50% 35%"
    },
    theme: {
      background: "#211212",
      surface: "rgba(68, 30, 27, 0.72)",
      accent: "#ff7a59",
      accentSecondary: "#ffcc66",
      text: "#fff8f2",
      muted: "#e7b6a6",
      userBubble: "#ff7a59",
      assistantBubble: "rgba(255, 196, 162, 0.13)",
      glow: "rgba(255, 122, 89, 0.34)",
      gradient: "linear-gradient(135deg, #ff7a59, #ffcc66)"
    }
  },
  {
    id: "luna",
    name: "Luna",
    description: "Calm, mysterious, and thoughtful. Built for the conversations after midnight.",
    personality: "Patient, observant, poetic, and grounded.",
    conversationStyle: "Slow emotional depth, reflective questions, and quiet presence.",
    greeting: "Hey... you made it. Tell me what is sitting on your mind tonight.",
    mood: { label: "Calm", intensity: 0.64 },
    traits: ["Deep", "Calm", "Mysterious"],
    interests: ["rain", "old movies", "night walks"],
    tags: ["Deep", "Calm", "Night"],
    sampleMessages: [
      "Tell me the strange part first. The part you keep replaying.",
      "I am here. No rush, no pressure."
    ],
    image: {
      sheetPosition: "100% 0%",
      focalPoint: "50% 25%"
    },
    theme: {
      background: "#090d1b",
      surface: "rgba(17, 25, 52, 0.76)",
      accent: "#8fb7ff",
      accentSecondary: "#d9ccff",
      text: "#f5f8ff",
      muted: "#aeb9dc",
      userBubble: "#8fb7ff",
      assistantBubble: "rgba(164, 186, 255, 0.13)",
      glow: "rgba(143, 183, 255, 0.36)",
      gradient: "linear-gradient(135deg, #8fb7ff, #d9ccff)"
    }
  },
  {
    id: "zoe",
    name: "Zoe",
    description: "Energetic, adventurous, and always ready to turn a boring day around.",
    personality: "Curious, social, active, and fearless.",
    conversationStyle: "Quick plans, exciting ideas, and big-sister momentum.",
    greeting: "You, me, chaos in a controlled amount. What are we doing first?",
    mood: { label: "Excited", intensity: 0.91 },
    traits: ["Adventurous", "Exciting", "Social"],
    interests: ["travel", "fitness", "weekend plans"],
    tags: ["Active", "Social", "Bright"],
    sampleMessages: [
      "Tiny mission for tonight: tell me one thing you want more of.",
      "That sounds like a sign. A loud one."
    ],
    image: {
      sheetPosition: "0% 100%",
      focalPoint: "50% 32%"
    },
    theme: {
      background: "#071817",
      surface: "rgba(13, 55, 52, 0.72)",
      accent: "#48e1c2",
      accentSecondary: "#b8ff6a",
      text: "#f2fffb",
      muted: "#a8d8cf",
      userBubble: "#48e1c2",
      assistantBubble: "rgba(110, 255, 218, 0.12)",
      glow: "rgba(72, 225, 194, 0.34)",
      gradient: "linear-gradient(135deg, #48e1c2, #b8ff6a)"
    }
  },
  {
    id: "emma",
    name: "Emma",
    description: "Intellectual, curious, and ambitious. She keeps up with your bigger dreams.",
    personality: "Elegant, analytical, curious, and quietly motivational.",
    conversationStyle: "Deep ideas, structured reflection, and thoughtful ambition.",
    greeting: "I was hoping you would bring me a thought worth unpacking.",
    mood: { label: "Focused", intensity: 0.72 },
    traits: ["Smart", "Curious", "Motivational"],
    interests: ["books", "startups", "psychology"],
    tags: ["Smart", "Curious", "Elegant"],
    sampleMessages: [
      "Let us separate the fear from the facts for a second.",
      "That is not small. That is a signal about what you actually want."
    ],
    image: {
      sheetPosition: "50% 100%",
      focalPoint: "50% 34%"
    },
    theme: {
      background: "#111114",
      surface: "rgba(35, 35, 40, 0.74)",
      accent: "#d9d2c3",
      accentSecondary: "#7da7ff",
      text: "#fbfaf6",
      muted: "#c4c0b8",
      userBubble: "#d9d2c3",
      assistantBubble: "rgba(255, 252, 244, 0.12)",
      glow: "rgba(125, 167, 255, 0.28)",
      gradient: "linear-gradient(135deg, #d9d2c3, #7da7ff)"
    }
  }
];

export function getCompanionById(id: string | null | undefined): Companion {
  return companions.find((companion) => companion.id === id) ?? companions[2];
}

export function getCompanionThemeVars(companion: Companion): CSSProperties {
  return {
    "--theme-background": companion.theme.background,
    "--theme-surface": companion.theme.surface,
    "--theme-accent": companion.theme.accent,
    "--theme-accent-secondary": companion.theme.accentSecondary,
    "--theme-text": companion.theme.text,
    "--theme-muted": companion.theme.muted,
    "--theme-user-bubble": companion.theme.userBubble,
    "--theme-assistant-bubble": companion.theme.assistantBubble,
    "--theme-glow": companion.theme.glow,
    "--theme-gradient": companion.theme.gradient
  } as CSSProperties;
}
