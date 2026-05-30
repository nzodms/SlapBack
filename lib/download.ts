// ── SlapBack Mac download config ──────────────────────────────
// Flip DOWNLOAD_READY to true once /public/downloads/SlapBack.dmg exists.
// When false  → CTA opens the "Join Mac beta" modal.
// When true   → CTA downloads the .dmg and opens the install guide.

export const DOWNLOAD_READY = false;
export const DOWNLOAD_URL = "/downloads/SlapBack.dmg";

// Shown on the trust line. Only claim signing once it's actually true.
export const SIGNED_AND_NOTARIZED = false;
export const TRUST_LINE = SIGNED_AND_NOTARIZED
  ? "Signed & notarized for macOS."
  : "Beta build. Signed/notarized release planned for public launch.";

export interface InstallStep {
  n: number;
  title: string;
  body: string;
  emoji: string;
}

export const INSTALL_STEPS: InstallStep[] = [
  {
    n: 1,
    title: "Download SlapBack.dmg",
    body: "Click “Download for Mac”. The .dmg lands in your Downloads folder.",
    emoji: "⬇",
  },
  {
    n: 2,
    title: "Open the DMG",
    body: "Double-click SlapBack.dmg to mount it. A window pops open.",
    emoji: "💿",
  },
  {
    n: 3,
    title: "Drag SlapBack to Applications",
    body: "Drag the SlapBack icon onto the Applications folder shortcut.",
    emoji: "📂",
  },
  {
    n: 4,
    title: "Open SlapBack",
    body: "Launch it from Applications. It lives in your menu bar — no Dock clutter.",
    emoji: "🚀",
  },
  {
    n: 5,
    title: "Enable permissions",
    body: "Allow Accessibility (for key/click triggers) and Microphone (only for desk-tap presets). Nothing is recorded or sent anywhere.",
    emoji: "🔐",
  },
  {
    n: 6,
    title: "Choose your first preset",
    body: "Pick a preset, run the live test, and your Mac starts reacting.",
    emoji: "🎯",
  },
];

// The honest "why does it say coming soon" explainer.
export const BETA_MODAL_TITLE = "Mac app coming soon.";
export const BETA_MODAL_BODY =
  "SlapBack for Mac is being packaged. Join the beta and we’ll send you the download link.";
export const SOURCE_NOTE =
  "The native Mac app is ready as source code, but the downloadable build is being packaged. For now, developers can build it from Xcode using the macOS README.";
