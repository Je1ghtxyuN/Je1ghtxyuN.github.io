#!/usr/bin/env bash
# Sync local admin credentials to server
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOCAL_ENV="$SCRIPT_DIR/../apps/backend-api/.env"
SERVER="je1ght-server"

# Read local creds
ADMIN_EMAIL=$(grep '^ADMIN_EMAIL=' "$LOCAL_ENV" | cut -d= -f2 | tr -d '"')
ADMIN_PASSWORD=$(grep '^ADMIN_PASSWORD=' "$LOCAL_ENV" | cut -d= -f2 | tr -d '"')

if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
  echo "ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in $LOCAL_ENV"
  exit 1
fi

echo "Syncing admin: $ADMIN_EMAIL"

# Update server .env
ssh "$SERVER" "sed -i 's/ADMIN_EMAIL=.*/ADMIN_EMAIL=\"$ADMIN_EMAIL\"/' ~/docker/je1ght-platform/.env"
ssh "$SERVER" "sed -i 's/ADMIN_PASSWORD=.*/ADMIN_PASSWORD=\"$ADMIN_PASSWORD\"/' ~/docker/je1ght-platform/.env"

# Update database
ssh "$SERVER" "docker exec je1ght-backend-api node -e \"
const { prisma } = require('./src/db/client.js');
const bcrypt = require('bcryptjs');
(async () => {
  const hash = await bcrypt.hash('$ADMIN_PASSWORD', 12);
  await prisma.adminUser.upsert({
    where: { email: '$ADMIN_EMAIL' },
    update: { password: hash },
    create: { email: '$ADMIN_EMAIL', password: hash },
  });
  console.log('Admin synced:', '$ADMIN_EMAIL');
  await prisma.\\\$disconnect();
})();
\""

echo "Done."
