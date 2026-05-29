export type TriggerType =
  | "mic-tap"
  | "space-key"
  | "enter-key"
  | "backspace-key"
  | "custom-key"
  | "spam-click"
  | "mouse-shake"
  | "caps-lock";

export interface Trigger {
  id: TriggerType;
  label: string;
  emoji: string;
  description: string;
  requiresMic?: boolean;
}

export const TRIGGERS: Trigger[] = [
  {
    id: "mic-tap",
    label: "Physical Tap",
    emoji: "🎤",
    description: "Tape sur ton bureau — détecté via le micro",
    requiresMic: true,
  },
  {
    id: "space-key",
    label: "Space Key",
    emoji: "⎵",
    description: "Appuie sur Espace dans la page",
  },
  {
    id: "enter-key",
    label: "Enter Key",
    emoji: "↵",
    description: "Appuie sur Entrée dans la page",
  },
  {
    id: "backspace-key",
    label: "Backspace Key",
    emoji: "⌫",
    description: "Appuie sur Backspace dans la page",
  },
  {
    id: "custom-key",
    label: "Custom Key",
    emoji: "⌨️",
    description: "Choisis n'importe quelle touche",
  },
  {
    id: "spam-click",
    label: "Spam Click",
    emoji: "🖱️",
    description: "6 clics en moins de 2 secondes",
  },
  {
    id: "mouse-shake",
    label: "Mouse Shake",
    emoji: "🐭",
    description: "Secoue ta souris comme un fou",
  },
  {
    id: "caps-lock",
    label: "Caps Lock",
    emoji: "⇪",
    description: "Active/désactive Caps Lock dans la page",
  },
];

export const KEYBOARD_TRIGGERS: TriggerType[] = [
  "space-key",
  "enter-key",
  "backspace-key",
  "caps-lock",
  "custom-key",
];

export function isKeyboardTrigger(t: TriggerType): boolean {
  return KEYBOARD_TRIGGERS.includes(t);
}
