export interface Sound {
  id: string;
  label: string;
  emoji: string;
  file: string;
  description: string;
}

export const SOUNDS: Sound[] = [
  {
    id: "quick-scream",
    label: "Quick Scream",
    emoji: "😱",
    file: "/sounds/quick-scream.mp3",
    description: "Short piercing shriek",
  },
  {
    id: "ouch",
    label: "Ouch",
    emoji: "🤕",
    file: "/sounds/ouch.mp3",
    description: "Cartoon pain reaction",
  },
  {
    id: "cartoon-hit",
    label: "Cartoon Hit",
    emoji: "💥",
    file: "/sounds/cartoon-hit.mp3",
    description: "Classic slapstick sound",
  },
  {
    id: "slap-impact",
    label: "Slap Impact",
    emoji: "👋",
    file: "/sounds/slap-impact.mp3",
    description: "Satisfying face slap",
  },
  {
    id: "demon-voice",
    label: "Demon Voice",
    emoji: "👹",
    file: "/sounds/demon-voice.mp3",
    description: "Deep demonic growl",
  },
  {
    id: "calm-down",
    label: "Calm Down",
    emoji: "🧘",
    file: "/sounds/calm-down.mp3",
    description: "Passive aggressive whisper",
  },
  {
    id: "click-again",
    label: "Click Again",
    emoji: "🖱️",
    file: "/sounds/click-again.mp3",
    description: "Dares you to click again",
  },
  {
    id: "angry-voice",
    label: "Angry Voice",
    emoji: "🗣️",
    file: "/sounds/angry-voice.mp3",
    description: "Full rage mode activated",
  },
  {
    id: "dramatic-scream",
    label: "Dramatic Scream",
    emoji: "🎭",
    file: "/sounds/dramatic-scream.mp3",
    description: "Over the top reaction",
  },
  {
    id: "panic-scream",
    label: "Panic Scream",
    emoji: "😰",
    file: "/sounds/panic-scream.mp3",
    description: "Pure unhinged panic",
  },
];

export function getSoundById(id: string): Sound | undefined {
  return SOUNDS.find((s) => s.id === id);
}
