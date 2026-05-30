# SlapBack — Create the .dmg for distribution

This guide takes you from a compiled `SlapBack.app` to a `.dmg` ready to drop on the site.

---

## Prerequisites

- Mac with Xcode 15+
- The Xcode project set up (see `README-xcode.md`)
- `create-dmg` tool (optional, gives a prettier DMG — install below)

---

## Step 1 — Build SlapBack.app in Release

Open the Xcode project, then:

```bash
# From the macos/SlapBackXcode/ directory (wherever you created the Xcode project)
xcodebuild \
  -project SlapBack.xcodeproj \
  -scheme SlapBack \
  -configuration Release \
  -derivedDataPath build/
```

The compiled app lands at:
```
build/Build/Products/Release/SlapBack.app
```

Or do it in Xcode: **Product → Archive → Distribute App → Custom → Copy App**.

---

## Step 2 — (Optional) Code-sign the app

Without a paid Apple Developer account ($99/yr), the app still works locally — macOS will just show a warning the first time it opens.

With a Developer ID:
```bash
codesign \
  --deep \
  --force \
  --verify \
  --verbose \
  --sign "Developer ID Application: YOUR NAME (TEAMID)" \
  --entitlements ../SlapBack/SlapBack.entitlements \
  build/Build/Products/Release/SlapBack.app
```

Verify:
```bash
codesign --verify --verbose=4 build/Build/Products/Release/SlapBack.app
spctl --assess --verbose=4 build/Build/Products/Release/SlapBack.app
```

---

## Step 3 — Create the DMG (manual method)

```bash
APP="build/Build/Products/Release/SlapBack.app"
DMG_NAME="SlapBack"
DMG_TMP="tmp-dmg"

# 1. Create a staging folder
mkdir -p "$DMG_TMP"
cp -r "$APP" "$DMG_TMP/SlapBack.app"

# 2. Add a symlink to /Applications so users can drag-install
ln -sf /Applications "$DMG_TMP/Applications"

# 3. Create the DMG
hdiutil create \
  -volname "$DMG_NAME" \
  -srcfolder "$DMG_TMP" \
  -ov \
  -format UDZO \
  -imagekey zlib-level=9 \
  "$DMG_NAME.dmg"

# 4. Clean up
rm -rf "$DMG_TMP"

echo "Done: $DMG_NAME.dmg"
```

---

## Step 4 — (Recommended) Create the DMG with create-dmg

`create-dmg` gives you a proper, styled installer window with a background.

Install:
```bash
brew install create-dmg
```

Create:
```bash
APP="build/Build/Products/Release/SlapBack.app"

create-dmg \
  --volname "SlapBack" \
  --volicon "$APP/Contents/Resources/AppIcon.icns" \
  --window-pos 200 120 \
  --window-size 660 400 \
  --icon-size 128 \
  --icon "SlapBack.app" 165 185 \
  --hide-extension "SlapBack.app" \
  --app-drop-link 495 185 \
  "SlapBack.dmg" \
  "$APP"
```

---

## Step 5 — (Optional) Notarize the DMG

Required to avoid the "Apple could not verify" warning for users outside your Mac.

```bash
# Submit for notarization (replace with your Apple ID and app-specific password)
xcrun notarytool submit SlapBack.dmg \
  --apple-id "you@example.com" \
  --password "app-specific-password" \
  --team-id "YOURTEAMID" \
  --wait

# Staple the notarization ticket to the DMG
xcrun stapler staple SlapBack.dmg

# Verify
spctl --assess --verbose=4 --type install SlapBack.dmg
```

Until notarization is done, keep `SIGNED_AND_NOTARIZED = false` in `lib/download.ts`.

---

## Step 6 — Test the DMG locally

```bash
open SlapBack.dmg
# Drag SlapBack to Applications
# Launch from Applications
# Verify: menu bar icon appears, onboarding opens, triggers fire
```

---

## Step 7 — Drop the DMG in the repo

```bash
# From the repo root
cp /path/to/SlapBack.dmg public/downloads/SlapBack.dmg
```

> **Git LFS** — `.dmg` files are binary and large. If you haven't already:
> ```bash
> git lfs install
> git lfs track "*.dmg"
> git add .gitattributes
> ```
> Then commit normally. Without LFS the file will still work but may slow down git.

---

## Step 8 — Enable the download button

Open `lib/download.ts` and flip the flag:

```ts
export const DOWNLOAD_READY = true;
```

If the app is signed and notarized, also flip:

```ts
export const SIGNED_AND_NOTARIZED = true;
```

---

## Step 9 — Deploy

```bash
git add public/downloads/SlapBack.dmg lib/download.ts
git commit -m "release: SlapBack v1.0.0 — enable download"
git push
```

Vercel picks up the push and deploys automatically.

---

## Step 10 — Test the live download button

1. Open the live site.
2. Click **Download for Mac**.
3. Browser downloads `SlapBack.dmg`.
4. Open the DMG — window shows SlapBack.app + Applications folder.
5. Drag SlapBack to Applications.
6. Launch from Applications.
7. macOS asks for Accessibility permission — grant it.
8. Menu bar icon appears.
9. First-launch onboarding opens.
10. Pick a preset, test the trigger, confirm the overlay fires.

---

## Quick reference — sizes

| Format | Typical size |
|--------|-------------|
| `SlapBack.app` | 5–15 MB (no bundled sounds) |
| Uncompressed DMG | 10–20 MB |
| UDZO (zlib-9) DMG | 5–12 MB |
| With sounds (4 MP3s ~1MB each) | +4 MB |

---

## Checklist before publishing

- [ ] App builds in Release without warnings
- [ ] Triggers fire (Space, Caps Lock, click spam, mic tap)
- [ ] Overlay appears above all apps
- [ ] Menu bar icon shows and popover opens
- [ ] Onboarding completes and setting persists across relaunch
- [ ] `SlapBack.dmg` tested on a clean Mac (no Xcode, no dev tools)
- [ ] `DOWNLOAD_READY = true` in `lib/download.ts`
- [ ] Deployed to Vercel
- [ ] Download button downloads the file and redirects to `/install`
