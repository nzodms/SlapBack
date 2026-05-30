export interface Vibe {
  id: string;
  label: string;
  emoji: string;
  description: string;
  soundId: string; // maps to a sound in lib/sounds.ts
  color: string;
  glow: string;
  border: string;
  bg: string;
}

export const VIBES: Vibe[] = [
  {
    id: "screamy",
    label: "Screamy",
    emoji: "😱",
    description: "Short screams and panic sounds.",
    soundId: "quick-scream",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.3)",
    border: "rgba(239,68,68,0.5)",
    bg: "rgba(239,68,68,0.08)",
  },
  {
    id: "cartoon",
    label: "Cartoon",
    emoji: "💥",
    description: "Slaps, hits and stupid impact sounds.",
    soundId: "cartoon-hit",
    color: "#facc15",
    glow: "rgba(250,204,21,0.3)",
    border: "rgba(250,204,21,0.5)",
    bg: "rgba(250,204,21,0.08)",
  },
  {
    id: "angry-mac",
    label: "Angry Mac",
    emoji: "🗣️",
    description: "Your Mac talks back when you force too much.",
    soundId: "angry-voice",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.3)",
    border: "rgba(167,139,250,0.5)",
    bg: "rgba(167,139,250,0.08)",
  },
];

export type OnboardingTrigger = "tap-desk" | "press-space" | "spam-clicks";

export interface TriggerOption {
  id: OnboardingTrigger;
  label: string;
  emoji: string;
  description: string;
  prompt: string;
  impact: string;
}

export const ONBOARDING_TRIGGERS: TriggerOption[] = [
  {
    id: "tap-desk",
    label: "Tap your desk",
    emoji: "🪵",
    description: "Detected through your microphone. No audio recording.",
    prompt: "Tap your desk now.",
    impact: "SLAP!",
  },
  {
    id: "press-space",
    label: "Press Space",
    emoji: "⎵",
    description: "Works while SlapBack is open.",
    prompt: "Press Space now.",
    impact: "OUCH!",
  },
  {
    id: "spam-clicks",
    label: "Spam clicks",
    emoji: "🖱️",
    description: "Click too much and it talks back.",
    prompt: "Click fast now.",
    impact: "STOP IT!",
  },
];

export const TEST_PUNCHLINES = [
  "Your Mac felt that.",
  "Again?",
  "Okay, that was unnecessary.",
  "It remembers this.",
  "Violence noted.",
];
