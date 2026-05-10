#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVER="je1ght-server"
SERVER_PORTAL="/home/je1ght/websites/je1ght-platform/portal-source"
SERVER_DOCKER="/home/je1ght/docker/je1ght-platform"

echo "========================================="
echo " Deploy to je1ght.top"
echo "========================================="

# 1. Build Study Room
echo ""
echo "[1/5] Building Study Room..."
cd "$REPO_ROOT/apps/study-room"
npm run build --silent 2>&1 | tail -1

# 2. Sync Study Room to portal
echo "[2/5] Syncing Study Room to portal..."
bash "$REPO_ROOT/scripts/sync-study-app.sh" 2>&1 | tail -1

# 3. Build Portal
echo "[3/5] Building Portal..."
cd "$REPO_ROOT/apps/blog-portal"
./node_modules/.bin/hexo generate 2>&1 | tail -1

# 4. Sync portal source (entire blog-portal) to server
echo "[4/5] Syncing to server..."
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='public' \
  "$REPO_ROOT/apps/blog-portal/" \
  "$SERVER:$SERVER_PORTAL/" 2>&1 | tail -1

# Also sync the built public/ to portal-source/public/ on server
rsync -avz --delete \
  "$REPO_ROOT/apps/blog-portal/public/" \
  "$SERVER:$SERVER_PORTAL/public/" 2>&1 | tail -1

# 5. Sync infra files to server
echo "[5/5] Syncing infra & rebuilding Docker..."
rsync -avz "$REPO_ROOT/infra/docker-compose.yml" "$SERVER:$SERVER_DOCKER/" 2>&1 | tail -1
rsync -avz "$REPO_ROOT/infra/nginx/default.conf" "$SERVER:$SERVER_DOCKER/nginx/" 2>&1 | tail -1
ssh "$SERVER" "cd $SERVER_PORTAL && npm install --silent 2>&1 | tail -1"
ssh "$SERVER" "cd $SERVER_DOCKER && docker compose build backend-api 2>&1 | tail -3 && docker compose up -d --force-recreate 2>&1"

echo ""
# Also sync admin creds
"$REPO_ROOT/scripts/sync-admin.sh" 2>/dev/null || true

echo ""
echo "========================================="
echo " Deploy complete!"
echo " https://je1ght.top"
echo "========================================="
