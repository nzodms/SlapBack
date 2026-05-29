export const PUNCHLINES = [
  "Aïe.",
  "Refais ça pour voir.",
  "Clique encore, peut-être que ça ira plus vite.",
  "Pourquoi tu cries ?",
  "Doucement, c'est un clavier.",
  "Ton Mac n'a rien demandé.",
  "Violence numérique détectée.",
  "Le bouton a compris la première fois.",
];

export const IMPACT_WORDS = ["SLAP!", "OUCH!", "RAGE!", "WHY?", "STOP!", "AÏE!", "BIM!", "POW!"];

export const RAGE_MAX_PUNCHLINES = [
  "TU ES HORS DE CONTRÔLE.",
  "APPELLE UN MÉDECIN.",
  "LAISSE CE CLAVIER TRANQUILLE.",
  "ÇA VA ??",
];

export function getRandomPunchline(): string {
  return PUNCHLINES[Math.floor(Math.random() * PUNCHLINES.length)];
}

export function getRandomImpact(): string {
  return IMPACT_WORDS[Math.floor(Math.random() * IMPACT_WORDS.length)];
}

export function getRandomRageMaxPunchline(): string {
  return RAGE_MAX_PUNCHLINES[Math.floor(Math.random() * RAGE_MAX_PUNCHLINES.length)];
}
