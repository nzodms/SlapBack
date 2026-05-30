#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# SlapBack DMG packager
# Usage: ./scripts/package-dmg.sh /path/to/SlapBack.app
#
# Run this on your Mac, from the repo root.
# The output lands in: public/downloads/SlapBack.dmg
# Then flip DOWNLOAD_READY = true in lib/download.ts and deploy.
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Args ─────────────────────────────────────────────────────
APP_PATH="${1:-}"
if [[ -z "$APP_PATH" ]]; then
  echo "Usage: $0 /path/to/SlapBack.app"
  exit 1
fi

if [[ ! -d "$APP_PATH" ]]; then
  echo "Error: '$APP_PATH' is not a directory or doesn't exist."
  exit 1
fi

APP_NAME="SlapBack"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$REPO_ROOT/public/downloads"
OUTPUT_DMG="$OUTPUT_DIR/$APP_NAME.dmg"
TMP_DIR="$(mktemp -d)"

echo "→ App:    $APP_PATH"
echo "→ Output: $OUTPUT_DMG"
echo ""

# ── Clean previous build ──────────────────────────────────────
mkdir -p "$OUTPUT_DIR"
rm -f "$OUTPUT_DMG"

# ── Method 1: create-dmg (styled, recommended) ───────────────
if command -v create-dmg &>/dev/null; then
  echo "▶ Using create-dmg (styled window)…"
  create-dmg \
    --volname "$APP_NAME" \
    --window-pos 200 120 \
    --window-size 660 400 \
    --icon-size 128 \
    --icon "$APP_NAME.app" 165 185 \
    --hide-extension "$APP_NAME.app" \
    --app-drop-link 495 185 \
    --no-internet-enable \
    "$OUTPUT_DMG" \
    "$APP_PATH"

# ── Method 2: hdiutil (plain, no brew needed) ─────────────────
else
  echo "▶ create-dmg not found — using hdiutil (plain DMG)."
  echo "  Install create-dmg for a styled installer: brew install create-dmg"
  echo ""

  # Stage
  STAGE="$TMP_DIR/stage"
  mkdir -p "$STAGE"
  cp -r "$APP_PATH" "$STAGE/$APP_NAME.app"
  ln -sf /Applications "$STAGE/Applications"

  # Create
  hdiutil create \
    -volname "$APP_NAME" \
    -srcfolder "$STAGE" \
    -ov \
    -format UDZO \
    -imagekey zlib-level=9 \
    "$OUTPUT_DMG"
fi

# ── Cleanup ───────────────────────────────────────────────────
rm -rf "$TMP_DIR"

# ── Verify ───────────────────────────────────────────────────
if [[ -f "$OUTPUT_DMG" ]]; then
  SIZE=$(du -sh "$OUTPUT_DMG" | cut -f1)
  echo ""
  echo "✅ Done: $OUTPUT_DMG ($SIZE)"
  echo ""
  echo "Next steps:"
  echo "  1. Test: open \"$OUTPUT_DMG\""
  echo "  2. Drag SlapBack to Applications and launch it"
  echo "  3. Confirm triggers work + menu bar icon appears"
  echo "  4. Edit lib/download.ts → set DOWNLOAD_READY = true"
  echo "  5. git add public/downloads/SlapBack.dmg lib/download.ts"
  echo "  6. git commit -m 'release: enable SlapBack download'"
  echo "  7. git push → Vercel deploys"
else
  echo "❌ DMG creation failed."
  exit 1
fi
