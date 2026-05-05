#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STUDY_ROOM_DIR="$REPO_ROOT/apps/study-room"
PORTAL_SOURCE="$REPO_ROOT/apps/blog-portal/source/study-app"

echo "Building study-room..."
cd "$STUDY_ROOM_DIR"
npm run build

echo "Syncing dist to portal source..."
rm -rf "$PORTAL_SOURCE"
cp -r "$STUDY_ROOM_DIR/dist" "$PORTAL_SOURCE"

echo "Done. Study Room synced to $PORTAL_SOURCE"
