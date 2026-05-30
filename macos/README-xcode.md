# SlapBack macOS — Xcode Setup Guide

Complete step-by-step to go from these Swift files to a running app on your Mac.

---

## Prerequisites

- Mac with macOS 13 Ventura or later
- Xcode 15+ (free from the App Store)
- No Apple Developer account needed for local testing

---

## Step 1 — Create the Xcode project

1. Open Xcode → **File → New → Project**
2. Choose **macOS → App**
3. Fill in:
   - **Product Name**: `SlapBack`
   - **Bundle Identifier**: `com.slapback.app`
   - **Interface**: SwiftUI
   - **Language**: Swift
4. Save it inside this folder: `macos/SlapBackXcode/` (keep the Swift source files in `macos/SlapBack/`)

---

## Step 2 — Add the Swift source files

1. In Xcode's Project Navigator (left panel), **right-click the SlapBack group → Add Files to "SlapBack"…**
2. Navigate to `macos/SlapBack/` and select **all `.swift` files and subfolders**
3. Make sure **"Add to targets: SlapBack"** is checked
4. Click **Add**

Your file tree should look like:
```
SlapBack/
├── SlapBackApp.swift
├── SoundManager.swift
├── OverlayWindow.swift
├── Models/
│   ├── Preset.swift
│   └── SlapBackSettings.swift
├── Onboarding/
│   ├── OnboardingCoordinator.swift
│   ├── OnboardingContainerView.swift
│   ├── WelcomeView.swift
│   ├── PresetPickerView.swift
│   ├── CalibrationView.swift
│   ├── PermissionsView.swift
│   └── LiveTestView.swift
├── MenuBar/
│   ├── StatusBarController.swift
│   └── MenuBarPopoverView.swift
├── Triggers/
│   ├── TriggerEngine.swift
│   ├── GlobalKeyMonitor.swift
│   ├── ClickSpamDetector.swift
│   └── MicTapDetector.swift
└── Settings/
    └── SettingsView.swift
```

---

## Step 3 — Delete the auto-generated files

Xcode creates placeholder files. Delete these (move to trash):
- `ContentView.swift`
- Any auto-generated `SlapBackApp.swift` that conflicts

---

## Step 4 — Configure Info.plist

1. Select your project in the Navigator → **SlapBack target → Info tab**
2. Add these keys (hover a row → click `+`):

| Key | Type | Value |
|-----|------|-------|
| `NSMicrophoneUsageDescription` | String | `SlapBack uses your microphone to detect desk taps via volume spikes. No audio is recorded or stored.` |
| `NSAccessibilityUsageDescription` | String | `SlapBack uses Accessibility to detect your configured trigger key or click pattern system-wide.` |
| `LSUIElement` | Boolean | YES |

> **LSUIElement = YES** makes SlapBack a pure menu bar app (no Dock icon, no menu bar app menu).

---

## Step 5 — Configure the Entitlements

1. Select your project → **SlapBack target → Signing & Capabilities**
2. Click **+ Capability → App Sandbox** — then **disable** it (menu bar apps with CGEvent tap cannot use the sandbox)
3. Under **Signing**, check **"Automatically manage signing"** and select your personal team

Alternatively, replace the auto-generated `.entitlements` file content with the one in `macos/SlapBack/SlapBack.entitlements`.

---

## Step 6 — Add sound files

1. Copy your MP3s into `macos/SlapBack/Resources/Sounds/`:
   - `scream.mp3`
   - `ouch.mp3`
   - `slap.mp3`
   - `demon.mp3`
2. In Xcode: **right-click SlapBack group → Add Files → select the MP3s**
3. Check **"Add to targets: SlapBack"** and **"Copy items if needed"**

> Without MP3s the app still works — it falls back to `NSSound.beep()` so triggers are always audible.

---

## Step 7 — Build & Run

1. **Product → Run** (⌘R)
2. macOS will ask: **"SlapBack wants access to control your computer"** — click **Open System Settings** → enable SlapBack in **Accessibility**
3. The app icon appears in your **menu bar** (waveform icon)
4. Click it → the popover opens
5. On first launch, the **onboarding wizard** opens automatically

---

## Step 8 — Test each preset

### Spacebar scream
- Start SlapBack → onboarding selects "Spacebar scream"
- Press Space anywhere → you should hear the sound + see the overlay

### Spam clicks
- Select "My Mac hates spam clicks" in Settings
- Click 8 times in 2 seconds in any app

### Tap desk
- Select "Tap desk = scream"
- Grant microphone access
- Tap your physical desk — the mic detects the thud

### Caps Lock demon
- Select "Caps Lock demon"
- Press Caps Lock → demon sound + overlay

---

## Troubleshooting

**No sound plays**
- Check that MP3 files are in the bundle: Product → Show Build Folder → look for `SlapBack.app/Contents/Resources/`
- Or just drop your MP3s into the Xcode project and rebuild

**Trigger doesn't fire**
- Check System Settings → Privacy & Security → Accessibility → SlapBack is checked
- For mic tap: check Microphone permissions

**Overlay doesn't appear**
- Make sure `OverlayWindow` is initialized in `AppDelegate.showOnboarding()` — `overlayWindow` must not be nil
- The overlay panel uses `.screenSaver` level — it appears above everything

**App doesn't show in menu bar**
- Confirm `LSUIElement = YES` in Info.plist
- Confirm `NSApp.setActivationPolicy(.accessory)` is called in `applicationDidFinishLaunching`

---

## Architecture overview

```
AppDelegate
├── SlapBackSettings (UserDefaults-backed, @Published)
├── SoundManager (preloaded AVAudioPlayer instances)
├── StatusBarController
│   ├── NSStatusItem (menu bar icon)
│   ├── NSPopover → MenuBarPopoverView (SwiftUI)
│   ├── TriggerEngine
│   │   ├── GlobalKeyMonitor (CGEvent tap — space/caps lock)
│   │   ├── ClickSpamDetector (CGEvent tap — left click)
│   │   └── MicTapDetector (AVAudioEngine — RMS spike)
│   └── OverlayWindow (NSPanel, .screenSaver level)
└── OnboardingWindow (shown once on first launch)
    └── OnboardingContainerView → 5 steps
```

---

## Privacy architecture

| What | How | Why it's safe |
|------|-----|---------------|
| Keyboard trigger | CGEvent tap, keyCode only | Only the integer keyCode is read, never text |
| Click detection | CGEvent tap, count only | Only click timestamps are stored, no position |
| Mic detection | AVAudioEngine RMS | Buffer samples read for amplitude only; buffer is never saved |
| Audio output | AVAudioPlayer, local MP3 | No network, no recording |
| Settings | UserDefaults | Stored locally, no analytics |

No data leaves the device. No background processes when the app is quit.
