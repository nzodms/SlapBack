export interface Sound {
  id: string;
  label: string;
  emoji: string;
  file: string;
}

export const SOUNDS: Sound[] = [
  { id: "scream-short", label: "Quick Scream", emoji: "😱", file: "/sounds/scream-short.mp3" },
  { id: "ouch", label: "Ouch", emoji: "🤕", file: "/sounds/ouch.mp3" },
  { id: "cartoon-hit", label: "Cartoon Hit", emoji: "💥", file: "/sounds/cartoon-hit.mp3" },
  { id: "slap", label: "Slap", emoji: "👋", file: "/sounds/slap.mp3" },
  { id: "alarm", label: "Alarm", emoji: "🚨", file: "/sounds/alarm.mp3" },
  { id: "demon", label: "Demon", emoji: "👹", file: "/sounds/demon.mp3" },
  { id: "calm-down", label: "Calm Down", emoji: "🧘", file: "/sounds/calm-down.mp3" },
  { id: "click-again", label: "Click Again", emoji: "🖱️", file: "/sounds/click-again.mp3" },
  { id: "why-screaming", label: "Why Are You Screaming?", emoji: "🗣️", file: "/sounds/why-are-you-screaming.mp3" },
  { id: "dramatic-scream", label: "Dramatic Scream", emoji: "🎭", file: "/sounds/dramatic-scream.mp3" },
];

export function getSoundById(id: string): Sound | undefined {
  return SOUNDS.find((s) => s.id === id);
}
