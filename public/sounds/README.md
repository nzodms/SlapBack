# SlapBack — Sound files

Place your MP3 files here. Names must match exactly.

## Required files

| File                   | Label              | Description                         |
|------------------------|--------------------|-------------------------------------|
| `quick-scream.mp3`     | Quick Scream       | Short piercing shriek (< 1s)        |
| `ouch.mp3`             | Ouch               | Cartoon pain reaction (< 0.5s)      |
| `cartoon-hit.mp3`      | Cartoon Hit        | Classic slapstick impact (< 0.5s)   |
| `slap-impact.mp3`      | Slap Impact        | Satisfying face slap (< 0.3s)       |
| `demon-voice.mp3`      | Demon Voice        | Deep demonic growl (0.5–1s)         |
| `calm-down.mp3`        | Calm Down          | Passive aggressive whisper (< 1s)   |
| `click-again.mp3`      | Click Again        | Dares you to click again (< 1s)     |
| `angry-voice.mp3`      | Angry Voice        | Full rage mode activated (< 1s)     |
| `dramatic-scream.mp3`  | Dramatic Scream    | Over the top reaction (0.5–1.5s)    |
| `panic-scream.mp3`     | Panic Scream       | Unhinged panic (< 1s)               |

## ⚠ If files are missing

The app works fine with or without the MP3 files.
If a file is missing, SlapBack automatically uses a **synth fallback** (procedural
Web Audio sound). A small "⚠ Synth" badge appears in the UI.

## Recommended sources (free)

- [Freesound.org](https://freesound.org) — Creative Commons library
- [Mixkit.co](https://mixkit.co/free-sound-effects/) — free commercial use
- [Zapsplat.com](https://www.zapsplat.com) — large free library
- [ElevenLabs.io](https://elevenlabs.io) — generate custom voice reactions

## Format specs

- Format: **MP3** (192kbps+)
- Duration: **< 2 seconds** for best effect
- Peak level: **−3 dBFS** (normalize before saving)
- Sample rate: **44100 Hz**

## Adding a new sound

1. Add the MP3 to this folder.
2. Add an entry to `lib/sounds.ts`:
   ```ts
   { id: "my-sound", label: "My Sound", emoji: "🔥", file: "/sounds/my-sound.mp3", description: "Short description" }
   ```
3. Add a synth fallback to `lib/synthSounds.ts` (optional but recommended).
