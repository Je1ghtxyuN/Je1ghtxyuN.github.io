# Study App Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the study-app (React frontend + Hono backend + MySQL) from the monorepo into a standalone GitHub repository at `study-app`, with independent Docker stack, database, and subdomain `study.je1ght.top`.

**Architecture:** Two fully independent projects — the existing monorepo (portal + backend-api) and the new study-app repo (client + server). Each has its own MySQL database, nginx, and Docker Compose stack. Data migration moves existing study tables from the shared MySQL to the new dedicated MySQL.

**Tech Stack:** React 19 + Vite 8 (client), Hono + Prisma + MySQL (server), Docker + nginx (infra), Cloudflare (DNS/SSL)

**Design Spec:** `docs/superpowers/specs/2026-05-15-study-app-separation-design.md`

---

## File Structure — New Repository

```
study-app/
├── client/                         ← React SPA (copied from apps/study-room/)
│   ├── src/                        ← all source files
│   ├── public/                     ← favicon.svg, icons.svg
│   ├── index.html
│   ├── vite.config.js              ← MODIFIED: base = '/', local site config
│   ├── eslint.config.js
│   ├── package.json
│   └── package-lock.json
├── server/                         ← Hono backend (extracted from apps/backend-api/)
│   ├── src/
│   │   ├── index.js
│   │   ├── app.js                  ← MODIFIED: only study routes
│   │   ├── config/env.js
│   │   ├── db/client.js
│   │   ├── middleware/auth.js
│   │   ├── middleware/errorHandler.js
│   │   ├── routes/user-auth.js
│   │   ├── routes/study-sessions.js
│   │   ├── routes/todos.js
│   │   ├── routes/music.js
│   │   ├── routes/health.js
│   │   └── services/music.js
│   ├── prisma/schema.prisma        ← MODIFIED: Session + StudyUser + StudySession + TodoItem
│   ├── Dockerfile                  ← MODIFIED: no hexo-cli, port 3002
│   ├── package.json                ← MODIFIED: stripped deps
│   └── .env.example
├── infra/
│   ├── docker-compose.yml          ← NEW: backend + nginx + mysql
│   └── nginx/default.conf          ← NEW: study.je1ght.top routing
├── scripts/
│   └── deploy.sh                   ← NEW: independent deploy
├── assets/
│   ├── videos/                     ← 3 MP4 + 3 poster PNGs
│   ├── music/                      ← 6 MP3
│   ├── se/                         ← 1 MP3 (BreakOrWork)
│   └── locales/site-ui/            ← 4 JSON locale files
├── site.config.json                ← NEW: extracted from site-identity.json
├── CLAUDE.md                       ← NEW
├── .claude/
│   ├── commands/                   ← copied applicable skills
│   └── settings.local.json         ← NEW
├── .gitignore
└── README.md
```

---

## Task 1: Create New Repository Directory Structure

**Files:**
- Create: `study-app/` (at `/Users/je1ghtxyun/code/personal-website/study-app/`)

- [ ] **Step 1: Create directory skeleton**

```bash
mkdir -p /Users/je1ghtxyun/code/personal-website/study-app/{client,server/src/{config,db,middleware,routes,services},server/prisma,infra/nginx,scripts,assets/{videos,music,se,locales/site-ui},.claude/commands}
```

- [ ] **Step 2: Initialize git repo**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git init
```

- [ ] **Step 3: Create .gitignore**

Write to `study-app/.gitignore`:

```
node_modules/
dist/
.env
*.log
.DS_Store
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: initialize study-app repository"
```

---

## Task 2: Copy Frontend Source

**Files:**
- Copy: `apps/study-room/` → `study-app/client/`

- [ ] **Step 1: Copy study-room source to client/**

```bash
cd /Users/je1ghtxyun/code/personal-website
cp -r Je1ghtxyuN.github.io/apps/study-room/ study-app/client/
```

- [ ] **Step 2: Remove copied dist/ and node_modules/ and package-lock.json (will regenerate)**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app/client
rm -rf dist node_modules
```

- [ ] **Step 3: Install dependencies and verify build**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app/client
npm install
npm run build
```

Expected: Vite build succeeds, `dist/` created with `index.html` and hashed assets.

- [ ] **Step 4: Commit**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git add client/
git commit -m "feat: copy study-room frontend as client/"
```

---

## Task 3: Copy and Adapt Shared Assets

**Files:**
- Copy: `packages/shared-assets/videos/` → `study-app/assets/videos/`
- Copy: `packages/shared-assets/music/` → `study-app/assets/music/`
- Copy: `packages/shared-assets/se/` → `study-app/assets/se/`
- Copy: `packages/shared-assets/locales/site-ui/*.json` → `study-app/assets/locales/site-ui/`

- [ ] **Step 1: Copy assets**

```bash
cd /Users/je1ghtxyun/code/personal-website
cp -r Je1ghtxyuN.github.io/packages/shared-assets/videos/* study-app/assets/videos/
cp -r Je1ghtxyuN.github.io/packages/shared-assets/music/* study-app/assets/music/
cp -r Je1ghtxyuN.github.io/packages/shared-assets/se/* study-app/assets/se/
cp Je1ghtxyuN.github.io/packages/shared-assets/locales/site-ui/*.json study-app/assets/locales/site-ui/
```

- [ ] **Step 2: Verify files copied**

```bash
ls -la study-app/assets/videos/
ls -la study-app/assets/music/
ls -la study-app/assets/se/
ls -la study-app/assets/locales/site-ui/
```

Expected: 3 videos + 3 posters, 6 music files, 1 SE file, 4 locale JSONs.

- [ ] **Step 3: Commit**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git add assets/
git commit -m "feat: copy shared assets (videos, music, locales)"
```

---

## Task 4: Create site.config.json and Fix Frontend Config Imports

**Files:**
- Create: `study-app/site.config.json`
- Modify: `study-app/client/vite.config.js`
- Modify: `study-app/client/src/i18n/config.js`
- Modify: `study-app/client/src/state/studySessionRecorder.js`

- [ ] **Step 1: Create site.config.json**

Write to `study-app/site.config.json`:

```json
{
  "brand": {
    "name": "Je1ghtxyuN",
    "ownerDisplayName": "Kyoka"
  },
  "studyRoom": {
    "name": "Study Room",
    "shortDescription": "A focus workspace with timer, ambient scenes, and task capture."
  },
  "i18n": {
    "defaultLocale": "en",
    "supportedLocales": [
      { "code": "en", "label": "English" },
      { "code": "zh-CN", "label": "简体中文" },
      { "code": "zh-TW", "label": "繁體中文" },
      { "code": "ja", "label": "日本語" }
    ]
  }
}
```

- [ ] **Step 2: Update vite.config.js**

Replace entire content of `study-app/client/vite.config.js` with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

Changes: Removed `site-identity.json` import. Base is always `/` since the subdomain root IS the study-app.

- [ ] **Step 3: Update i18n/config.js**

Replace the 5 import lines at the top of `study-app/client/src/i18n/config.js`:

Old:
```js
import siteIdentity from '../../../../packages/shared-config/site-identity.json'
import enLocale from '../../../../packages/shared-assets/locales/site-ui/en.json'
import jaLocale from '../../../../packages/shared-assets/locales/site-ui/ja.json'
import zhCnLocale from '../../../../packages/shared-assets/locales/site-ui/zh-CN.json'
import zhTwLocale from '../../../../packages/shared-assets/locales/site-ui/zh-TW.json'
```

New:
```js
import siteIdentity from '../../site.config.json'
import enLocale from '../../assets/locales/site-ui/en.json'
import jaLocale from '../../assets/locales/site-ui/ja.json'
import zhCnLocale from '../../assets/locales/site-ui/zh-CN.json'
import zhTwLocale from '../../assets/locales/site-ui/zh-TW.json'
```

- [ ] **Step 4: Update studySessionRecorder.js API_BASE**

In `study-app/client/src/state/studySessionRecorder.js`, line 1:

Old:
```js
const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''
```

New:
```js
const API_BASE = import.meta.env.DEV ? 'http://localhost:3002' : ''
```

Changes: Dev port changed from 3001 to 3002 to match the new backend port.

- [ ] **Step 5: Verify build still works**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app/client
npm run build
```

Expected: Build succeeds with `base: '/'`.

- [ ] **Step 6: Commit**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git add site.config.json client/vite.config.js client/src/i18n/config.js client/src/state/studySessionRecorder.js
git commit -m "feat: localize config imports, remove shared-config dependency"
```

---

## Task 5: Copy and Adapt Backend Source

**Files:**
- Copy: `apps/backend-api/src/index.js` → `study-app/server/src/index.js`
- Copy: `apps/backend-api/src/config/env.js` → `study-app/server/src/config/env.js`
- Copy: `apps/backend-api/src/db/client.js` → `study-app/server/src/db/client.js`
- Copy: `apps/backend-api/src/middleware/auth.js` → `study-app/server/src/middleware/auth.js`
- Copy: `apps/backend-api/src/middleware/errorHandler.js` → `study-app/server/src/middleware/errorHandler.js`
- Copy: `apps/backend-api/src/routes/user-auth.js` → `study-app/server/src/routes/user-auth.js`
- Copy: `apps/backend-api/src/routes/study-sessions.js` → `study-app/server/src/routes/study-sessions.js`
- Copy: `apps/backend-api/src/routes/todos.js` → `study-app/server/src/routes/todos.js`
- Copy: `apps/backend-api/src/routes/music.js` → `study-app/server/src/routes/music.js`
- Copy: `apps/backend-api/src/routes/health.js` → `study-app/server/src/routes/health.js`
- Copy: `apps/backend-api/src/services/music.js` → `study-app/server/src/services/music.js`
- Create: `study-app/server/src/app.js`
- Create: `study-app/server/package.json`
- Create: `study-app/server/prisma/schema.prisma`
- Create: `study-app/server/.env.example`

- [ ] **Step 1: Copy backend source files**

```bash
cd /Users/je1ghtxyun/code/personal-website
SRC="Je1ghtxyuN.github.io/apps/backend-api/src"
DST="study-app/server/src"
cp "$SRC/index.js" "$DST/"
cp "$SRC/config/env.js" "$DST/config/"
cp "$SRC/db/client.js" "$DST/db/"
cp "$SRC/middleware/auth.js" "$DST/middleware/"
cp "$SRC/middleware/errorHandler.js" "$DST/middleware/"
cp "$SRC/routes/user-auth.js" "$DST/routes/"
cp "$SRC/routes/study-sessions.js" "$DST/routes/"
cp "$SRC/routes/todos.js" "$DST/routes/"
cp "$SRC/routes/music.js" "$DST/routes/"
cp "$SRC/routes/health.js" "$DST/routes/"
cp "$SRC/services/music.js" "$DST/services/"
```

- [ ] **Step 2: Create server/src/app.js**

Write to `study-app/server/src/app.js`:

```js
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { errorHandler } from './middleware/errorHandler.js'
import { authMiddleware } from './middleware/auth.js'
import { health } from './routes/health.js'
import { music } from './routes/music.js'
import { userAuth } from './routes/user-auth.js'
import { studySessions } from './routes/study-sessions.js'
import { todos } from './routes/todos.js'

export function createApp() {
  const app = new Hono()

  app.use('*', logger())
  app.use('*', cors({
    origin: ['http://localhost:5173', 'https://study.je1ght.top'],
    credentials: true,
  }))
  app.use('*', errorHandler())
  app.use('*', authMiddleware())

  app.route('/', health)
  app.route('/music', music)
  app.route('/user', userAuth)
  app.route('/study-sessions', studySessions)
  app.route('/todos', todos)

  app.notFound((c) => c.json({ error: 'Not found' }, 404))

  return app
}
```

- [ ] **Step 3: Create server/prisma/schema.prisma**

Write to `study-app/server/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model StudyUser {
  id           String   @id @default(cuid())
  email        String   @unique
  password     String?
  nickname     String?
  avatarUrl    String?
  githubId     String?  @unique
  preferences  Json?
  createdAt    DateTime @default(now())
}

model StudySession {
  id           String   @id @default(cuid())
  userId       String?
  workDuration Int
  completedAt  DateTime @default(now())

  @@index([completedAt])
  @@index([userId])
}

model TodoItem {
  id        String   @id @default(cuid())
  userId    String
  label     String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
}
```

Note: `Session` model is included because the auth middleware and routes use it for session-based auth.

- [ ] **Step 4: Create server/package.json**

Write to `study-app/server/package.json`:

```json
{
  "name": "study-app-server",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "description": "Backend API for Study App.",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "prisma:generate": "prisma generate",
    "prisma:validate": "prisma validate",
    "prisma:migrate:dev": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@hono/node-server": "^1.14.3",
    "@prisma/client": "^6.19.3",
    "bcryptjs": "^3.0.3",
    "dotenv": "^16.5.0",
    "hono": "^4.7.10",
    "NeteaseCloudMusicApi": "^4.31.0",
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "prisma": "^6.19.3"
  }
}
```

- [ ] **Step 5: Create server/.env.example**

Write to `study-app/server/.env.example`:

```
DATABASE_URL="mysql://root:password@localhost:3306/study_app_db"
COOKIE_DOMAIN="localhost"
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

- [ ] **Step 6: Install dependencies and generate Prisma client**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app/server
npm install
npx prisma generate
```

- [ ] **Step 7: Commit**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git add server/
git commit -m "feat: extract backend with study-only routes and schema"
```

---

## Task 6: Verify Backend Locally with Docker MySQL

**Files:**
- Create: `study-app/infra/local-db/docker-compose.yml`

- [ ] **Step 1: Create local-db docker-compose**

Write to `study-app/infra/local-db/docker-compose.yml`:

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: study-app-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: study_dev_password
      MYSQL_DATABASE: study_app_db
    ports:
      - "3307:3306"
    volumes:
      - study_mysql_data:/var/lib/mysql
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --default-authentication-plugin=mysql_native_password

volumes:
  study_mysql_data:
```

Note: Port 3307 to avoid conflict with existing 3306.

- [ ] **Step 2: Create local .env for server**

Write to `study-app/server/.env`:

```
DATABASE_URL="mysql://root:study_dev_password@localhost:3307/study_app_db"
COOKIE_DOMAIN="localhost"
```

- [ ] **Step 3: Start local MySQL and run migration**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app/infra/local-db
docker compose up -d

cd /Users/je1ghtxyun/code/personal-website/study-app/server
npx prisma migrate dev --name init
```

Expected: Migration creates 4 tables (Session, StudyUser, StudySession, TodoItem).

- [ ] **Step 4: Start backend and test health endpoint**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app/server
npm run dev &
sleep 2
curl http://localhost:3002/health
```

Expected: `{"status":"ok"}` or similar health response.

- [ ] **Step 5: Stop backend and MySQL**

```bash
pkill -f "node.*src/index" || true
cd /Users/je1ghtxyun/code/personal-website/study-app/infra/local-db
docker compose down
```

- [ ] **Step 6: Commit**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git add infra/local-db/ server/.env server/.env.example
git commit -m "feat: add local dev MySQL and verify backend starts"
```

---

## Task 7: Create Production Docker Compose and Nginx Config

**Files:**
- Create: `study-app/infra/docker-compose.yml`
- Create: `study-app/infra/nginx/default.conf`
- Create: `study-app/server/Dockerfile`

- [ ] **Step 1: Create server/Dockerfile**

Write to `study-app/server/Dockerfile`:

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src/ ./src/
COPY prisma/ ./prisma/

RUN npx prisma generate

EXPOSE 3002

CMD ["node", "src/index.js"]
```

Note: No hexo-cli needed (unlike the portal backend).

- [ ] **Step 2: Create infra/docker-compose.yml**

Write to `study-app/infra/docker-compose.yml`:

```yaml
services:
  study-backend:
    build:
      context: ../server
    image: study-app-backend:latest
    container_name: study-backend
    restart: unless-stopped
    env_file:
      - .env
    networks:
      - study-network
      - internet
    depends_on:
      study-mysql:
        condition: service_healthy

  study-nginx:
    image: nginx:alpine
    container_name: study-nginx
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - ../client-dist:/usr/share/nginx/html:ro
    networks:
      - study-network
      - internet
    depends_on:
      - study-backend

  study-mysql:
    image: mysql:8.0
    container_name: study-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-study_app_db}
    volumes:
      - study_mysql_data:/var/lib/mysql
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --default-authentication-plugin=mysql_native_password
    healthcheck:
      test: ["CMD", "sh", "c", "mysqladmin ping -h localhost -u root -p$$MYSQL_ROOT_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - study-network

volumes:
  study_mysql_data:
    name: study-app-mysql-data

networks:
  study-network:
    driver: bridge
  internet:
    driver: bridge
```

- [ ] **Step 3: Create infra/nginx/default.conf**

Write to `study-app/infra/nginx/default.conf`:

```nginx
server {
    listen 80;
    server_name study.je1ght.top;

    root /usr/share/nginx/html;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://study-backend:3002/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /user/ {
        proxy_pass http://study-backend:3002/user/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /study-sessions {
        proxy_pass http://study-backend:3002/study-sessions;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /todos {
        proxy_pass http://study-backend:3002/todos;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /music/ {
        proxy_pass http://study-backend:3002/music/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://study-backend:3002/health;
        proxy_http_version 1.1;
    }

    # SPA frontend — fallback to index.html for client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git add infra/docker-compose.yml infra/nginx/default.conf server/Dockerfile
git commit -m "feat: add production Docker Compose and nginx config"
```

---

## Task 8: Create Deploy Script

**Files:**
- Create: `study-app/scripts/deploy.sh`

- [ ] **Step 1: Create deploy.sh**

Write to `study-app/scripts/deploy.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVER="je1ght-server"
SERVER_APP="/home/je1ght/docker/study-app"

echo "========================================="
echo " Deploy Study App to study.je1ght.top"
echo "========================================="

# --- Local build ---

echo ""
echo "[1/5] Building client..."
cd "$REPO_ROOT/client"
npm run build --silent 2>&1 | tail -1

echo "[2/5] Syncing client build to server..."
rsync -avz --delete \
  "$REPO_ROOT/client/dist/" \
  "$SERVER:$SERVER_APP/client-dist/" 2>&1 | tail -1

echo "[3/5] Syncing server source to server..."
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.env' \
  "$REPO_ROOT/server/" \
  "$SERVER:$SERVER_APP/server/" 2>&1 | tail -1

echo "[4/5] Syncing infra configs..."
rsync -avz "$REPO_ROOT/infra/docker-compose.yml" "$SERVER:$SERVER_APP/" 2>&1 | tail -1
rsync -avz "$REPO_ROOT/infra/nginx/default.conf" "$SERVER:$SERVER_APP/nginx/" 2>&1 | tail -1

echo "[5/5] Installing deps & rebuilding Docker..."
ssh "$SERVER" "cd $SERVER_APP/server && npm ci --omit=dev --silent 2>&1 | tail -1"
ssh "$SERVER" "cd $SERVER_APP && docker compose build study-backend 2>&1 | tail -3 && docker compose down 2>&1 | tail -1 && docker compose up -d 2>&1 | tail -1"
ssh "$SERVER" "docker exec study-backend npx prisma migrate deploy 2>&1 | tail -1"

echo ""
echo "========================================="
echo " Deploy complete!"
echo " https://study.je1ght.top"
echo "========================================="
```

- [ ] **Step 2: Make executable**

```bash
chmod +x /Users/je1ghtxyun/code/personal-website/study-app/scripts/deploy.sh
```

- [ ] **Step 3: Commit**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git add scripts/
git commit -m "feat: add independent deploy script"
```

---

## Task 9: Create CLAUDE.md and Project Docs

**Files:**
- Create: `study-app/CLAUDE.md`
- Create: `study-app/README.md`

- [ ] **Step 1: Create CLAUDE.md**

Write to `study-app/CLAUDE.md`:

```markdown
# CLAUDE.md

## Project Overview

Study App — an immersive focus workspace with Pomodoro timer, ambient scenes, music, and task capture. Standalone SPA + API, deployed at `study.je1ght.top`.

## Tech Stack

- **Client:** React 19 + Vite 8 + react-router-dom 7
- **Server:** Hono + Prisma ORM + MySQL 8.0
- **Infra:** Docker Compose (backend + nginx + mysql), Cloudflare CDN

## Repository Structure

```
study-app/
├── client/          ← React SPA
├── server/          ← Hono API (port 3002)
├── infra/           ← Docker Compose + nginx
├── scripts/         ← deploy.sh
├── assets/          ← videos, music, sound effects, locales
└── site.config.json ← brand identity + i18n config
```

## Commands

### Client (`client/`)
```
npm run dev          # Vite dev server (port 5173)
npm run build        # Production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

### Server (`server/`)
```
npm run dev          # Hono with --watch (port 3002)
npm start            # Hono server (port 3002)
npm run prisma:generate    # prisma generate
npm run prisma:migrate:dev # prisma migrate dev
npm run prisma:studio      # prisma studio GUI
```

### Deploy
```
bash scripts/deploy.sh     # Build + sync + Docker rebuild on server
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/health` | GET | Health check |
| `/user/register` | POST | Email/password registration |
| `/user/login` | POST | Email/password login |
| `/user/logout` | POST | Logout |
| `/user/me` | GET | Current user |
| `/user/prefs` | GET/PUT | User preferences |
| `/user/github` | GET | GitHub OAuth URL |
| `/user/github/callback` | POST | GitHub OAuth callback |
| `/study-sessions` | POST | Record Pomodoro |
| `/study-sessions/stats` | GET | Statistics |
| `/study-sessions/daily` | GET | Daily stats for calendar |
| `/todos` | GET/POST | List/add todos |
| `/todos/:id` | PUT/DELETE | Toggle/delete todo |
| `/music/playlist/:id?` | GET | Get playlist |
| `/music/song/:id/url` | GET | Get song URL |
| `/music/login` | POST | NetEase account login |

## Database

MySQL via Prisma. Models: `Session`, `StudyUser`, `StudySession`, `TodoItem`.

## Deployment

- Server: `je1ght-server` via SSH
- Docker dir: `~/docker/study-app/`
- Domain: `study.je1ght.top` (Cloudflare proxied)
- Backend port: 3002 (internal)
- Nginx: port 8080 (mapped to 80 in container, Cloudflare routes HTTPS → 8080)

## Conventions

- ES modules throughout (`"type": "module"`)
- Cookie-based auth (`study_session` HttpOnly cookie)
- CORS: allows `https://study.je1ght.top` and `http://localhost:5173`
- i18n: 4 locales (en, zh-CN, zh-TW, ja) via localStorage key `site-locale`
```

- [ ] **Step 2: Create README.md**

Write to `study-app/README.md`:

```markdown
# Study App

An immersive focus workspace with Pomodoro timer, ambient video scenes, music, and task capture.

**Live:** [study.je1ght.top](https://study.je1ght.top)

## Local Development

### Prerequisites
- Node.js 24+
- Docker (for MySQL)

### Setup

```bash
# Start MySQL
cd infra/local-db
docker compose up -d

# Setup server
cd server
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev

# Setup client (new terminal)
cd client
npm install
npm run dev
```

Client runs at `http://localhost:5173`, API at `http://localhost:3002`.

## Deploy

```bash
bash scripts/deploy.sh
```

## Tech Stack

- React 19 + Vite 8
- Hono + Prisma + MySQL
- Docker + nginx
- Cloudflare CDN
```

- [ ] **Step 3: Commit**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git add CLAUDE.md README.md
git commit -m "docs: add CLAUDE.md and README"
```

---

## Task 10: Copy Claude Skills

**Files:**
- Copy: applicable `.claude/commands/` skills to `study-app/.claude/commands/`

- [ ] **Step 1: Copy relevant skills**

```bash
cd /Users/je1ghtxyun/code/personal-website
SKILLS="Je1ghtxyuN.github.io/.claude/commands"
for skill in api-scaffold db-migrate deploy-checklist docker-optimize docker-development error-analysis ui-ux-design tdd-red tdd-green tdd-refactor karpathy-coder karpathy-guidelines deps-audit; do
  if [ -f "$SKILLS/$skill.md" ]; then
    cp "$SKILLS/$skill.md" "study-app/.claude/commands/"
  fi
done
```

- [ ] **Step 2: Create settings.local.json**

Write to `study-app/.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm run *)",
      "Bash(npm install *)",
      "Bash(npx prisma *)",
      "Bash(node *)",
      "Bash(npx *)",
      "Bash(curl *)",
      "Bash(chmod +x *)",
      "Bash(rsync *)",
      "Bash(ssh je1ght-server *)",
      "Bash(docker *)",
      "Bash(bash *)",
      "Bash(grep *)",
      "Bash(rm -rf *)",
      "Bash(mkdir -p *)",
      "Bash(cp *)",
      "Bash(ln *)",
      "Read(//Users/je1ghtxyun/**)",
      "WebSearch",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:www.npmjs.com)",
      "mcp__filesystem__read_text_file",
      "mcp__filesystem__directory_tree",
      "mcp__filesystem__search_files",
      "mcp__github__search_repositories",
      "mcp__github__get_file_contents",
      "Skill(humanizer)"
    ]
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git add .claude/
git commit -m "chore: add Claude Code skills and settings"
```

---

## Task 11: Create GitHub Repository

- [ ] **Step 1: Create repo on GitHub**

```bash
gh repo create study-app --private --source=/Users/je1ghtxyun/code/personal-website/study-app --push
```

Expected: Creates `Je1ghtxyuN/study-app` as a private repo and pushes the initial commit.

- [ ] **Step 2: Verify repo exists**

```bash
gh repo view Je1ghtxyuN/study-app
```

---

## Task 12: Clean Up Monorepo — Delete Study-Room Source

**Files:**
- Delete: `apps/study-room/`
- Delete: `scripts/sync-study-app.sh`

- [ ] **Step 1: Delete apps/study-room/**

```bash
cd /Users/je1ghtxyun/code/personal-website/Je1ghtxyuN.github.io
rm -rf apps/study-room/
```

- [ ] **Step 2: Delete sync script**

```bash
rm scripts/sync-study-app.sh
```

- [ ] **Step 3: Delete any existing study-app build in portal source**

```bash
rm -rf apps/blog-portal/source/study-app/
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove study-room source and sync script (migrated to study-app repo)"
```

---

## Task 13: Clean Up Monorepo — Remove Portal Study-Room References

**Files:**
- Modify: `apps/blog-portal/scripts/portal-renderer.js`
- Modify: `apps/blog-portal/scripts/portal-shared-config.js`
- Delete: `apps/blog-portal/source/study-room/` (landing page, if exists)

- [ ] **Step 1: Read portal-renderer.js to find study-room references**

```bash
cd /Users/je1ghtxyun/code/personal-website/Je1ghtxyuN.github.io
grep -n "study\|Study" apps/blog-portal/scripts/portal-renderer.js
```

Identify and remove:
- `resolveStudyRoomEntryPath` function
- `STUDY_ROOM_APP_URL` from PORTAL_CONFIG
- `getStudyRoomAppUrl` export
- `renderStudyRoom` function
- All references to `studyRoomAppPath` and `studyRoomLandingPath`
- `getProjectLinks` calls to `resolveStudyRoomEntryPath`

- [ ] **Step 2: Edit portal-renderer.js**

Remove these specific elements:

1. From imports: remove `studyRoomAppPath` and `resolveStudyRoomPublicUrl` from the require statement
2. From `PORTAL_CONFIG`: remove `STUDY_ROOM_APP_URL` property
3. Remove `const studyRoomPublicUrl = resolveStudyRoomPublicUrl(hexo)` line
4. Remove `resolveStudyRoomEntryPath` function
5. Remove `shouldOpenInNewTab` function (or simplify it to always use `isExternalPath`)
6. In `getProjectLinks`: remove the `resolveStudyRoomEntryPath` call, use `item.url` directly
7. Remove the `renderStudyRoom` function and its export
8. From the return object: remove `getStudyRoomAppUrl` and `renderStudyRoom`

- [ ] **Step 3: Edit portal-shared-config.js**

Remove these exports:
- `studyRoomLandingPath`
- `studyRoomAppPath`
- `resolveStudyRoomPublicUrl`

Remove the corresponding variable declarations.

- [ ] **Step 4: Delete study-room landing page**

```bash
rm -rf apps/blog-portal/source/study-room/
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove study-room references from portal renderer"
```

---

## Task 14: Clean Up Monorepo — Backend API

**Files:**
- Modify: `apps/backend-api/src/app.js`
- Delete: `apps/backend-api/src/routes/user-auth.js`
- Delete: `apps/backend-api/src/routes/study-sessions.js`
- Delete: `apps/backend-api/src/routes/todos.js`
- Delete: `apps/backend-api/src/routes/music.js`
- Delete: `apps/backend-api/src/services/music.js`
- Modify: `apps/backend-api/prisma/schema.prisma`
- Modify: `apps/backend-api/package.json`

- [ ] **Step 1: Edit app.js — remove study route imports and mounts**

Remove these import lines:
```js
import { music } from './routes/music.js'
import { userAuth } from './routes/user-auth.js'
import { studySessions } from './routes/study-sessions.js'
import { todos } from './routes/todos.js'
```

Remove these route lines:
```js
app.route('/music', music)
app.route('/user', userAuth)
app.route('/study-sessions', studySessions)
app.route('/todos', todos)
```

Also update CORS origin from `http://localhost:5173` to remove it (portal uses port 4000).

- [ ] **Step 2: Delete study route files**

```bash
rm apps/backend-api/src/routes/user-auth.js
rm apps/backend-api/src/routes/study-sessions.js
rm apps/backend-api/src/routes/todos.js
rm apps/backend-api/src/routes/music.js
rm apps/backend-api/src/services/music.js
rm -rf apps/backend-api/src/modules/study-data/
```

- [ ] **Step 3: Edit prisma/schema.prisma — remove study models**

Remove these models:
```prisma
model StudyUser { ... }
model StudySession { ... }
model TodoItem { ... }
```

Keep: `AdminUser`, `Session`, `BlogPost`, `PortfolioItem`, `SiteProfile`, `MediaAsset`.

- [ ] **Step 4: Edit package.json — remove NeteaseCloudMusicApi**

Remove from dependencies:
```json
"NeteaseCloudMusicApi": "^4.31.0"
```

- [ ] **Step 5: Commit**

```bash
cd /Users/je1ghtxyun/code/personal-website/Je1ghtxyuN.github.io
git add -A
git commit -m "chore: remove study routes, models, and deps from backend-api"
```

---

## Task 15: Clean Up Monorepo — Nginx and Docker Compose

**Files:**
- Modify: `infra/nginx/default.conf`
- Modify: `infra/docker-compose.yml`

- [ ] **Step 1: Edit nginx/default.conf — remove study routes**

Remove these location blocks:
```nginx
location /study-app/ { ... }
location /user/ { ... }
location /music/ { ... }
location /todos { ... }
location /study-sessions { ... }
```

- [ ] **Step 2: Edit docker-compose.yml if needed**

Review if any volumes or configs reference study-app. Remove if found.

- [ ] **Step 3: Commit**

```bash
git add infra/
git commit -m "chore: remove study-app routes from nginx config"
```

---

## Task 16: Clean Up Monorepo — Deploy Script

**Files:**
- Modify: `scripts/deploy.sh`

- [ ] **Step 1: Edit deploy.sh**

Remove steps 1 and 2 (Build Study Room, Sync Study Room). Renumber remaining steps.

Remove these lines:
```bash
echo "[1/7] Building Study Room..."
cd "$REPO_ROOT/apps/study-room"
npm run build --silent 2>&1 | tail -1

echo "[2/7] Syncing Study Room to portal source..."
bash "$REPO_ROOT/scripts/sync-study-app.sh" 2>&1 | tail -1
```

Renumber steps from [3/7] through [7/7] to [1/5] through [5/5].

- [ ] **Step 2: Commit**

```bash
git add scripts/deploy.sh
git commit -m "chore: remove study-room build steps from deploy script"
```

---

## Task 17: Clean Up Monorepo — site-identity.json

**Files:**
- Modify: `packages/shared-config/site-identity.json`

- [ ] **Step 1: Remove study-room fields**

Remove:
```json
"studyRoom": { "name": "Study Room", "shortDescription": "..." },
```

Remove from routes:
```json
"studyRoomLandingPath": "/study-room/",
"studyRoomAppPath": "/study-app/",
```

Update portalTagline to remove focus workspace reference.

- [ ] **Step 2: Commit**

```bash
git add packages/shared-config/site-identity.json
git commit -m "chore: remove study-room fields from site-identity.json"
```

---

## Task 18: Cloudflare Subdomain Setup (Manual)

**This task requires manual action in the Cloudflare dashboard.**

- [ ] **Step 1: Log into Cloudflare**

Go to https://dash.cloudflare.com, select `je1ght.top`.

- [ ] **Step 2: Add DNS record**

Navigate to DNS > Records, add:
- Type: `A`
- Name: `study`
- Content: `<your-server-IP>` (same IP as existing `je1ght.top` A record)
- Proxy status: Proxied (orange cloud)

- [ ] **Step 3: Verify SSL**

Cloudflare should automatically issue SSL for `study.je1ght.top`. Check SSL/TLS mode is set to "Full" or "Full (strict)".

- [ ] **Step 4: Test DNS resolution**

```bash
dig study.je1ght.top
```

Expected: Resolves to Cloudflare IP (proxied).

---

## Task 19: Deploy Study App to Server

**Files:**
- Create: `.env` on server at `~/docker/study-app/infra/.env`

- [ ] **Step 1: Create server directory**

```bash
ssh je1ght-server "mkdir -p /home/je1ght/docker/study-app/{infra/nginx,server,client-dist}"
```

- [ ] **Step 2: Create .env on server**

```bash
ssh je1ght-server "cat > /home/je1ght/docker/study-app/infra/.env << 'EOF'
DATABASE_URL=mysql://root:CHANGE_ME@study-mysql:3306/study_app_db
MYSQL_ROOT_PASSWORD=CHANGE_ME
MYSQL_DATABASE=study_app_db
COOKIE_DOMAIN=study.je1ght.top
EOF"
```

Note: Replace `CHANGE_ME` with actual password.

- [ ] **Step 3: Run deploy script**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
bash scripts/deploy.sh
```

- [ ] **Step 4: Run initial migration on server**

```bash
ssh je1ght-server "docker exec study-backend npx prisma migrate deploy"
```

- [ ] **Step 5: Verify study.je1ght.top loads**

```bash
curl -I https://study.je1ght.top
```

Expected: HTTP 200, serves the SPA.

---

## Task 20: Migrate Data from Old MySQL to New MySQL

- [ ] **Step 1: Backup old database**

```bash
ssh je1ght-server "docker exec je1ght-mysql mysqldump -u root -p --all-databases > /tmp/full-backup-$(date +%Y%m%d).sql"
```

- [ ] **Step 2: Export study tables**

```bash
ssh je1ght-server "docker exec je1ght-mysql mysqldump -u root -p<password> <db_name> StudyUser StudySession TodoItem Session > /tmp/study-data.sql"
```

Note: Include `Session` table since study-app auth depends on it. Filter to only study-user sessions if possible, or export all and clean up later.

- [ ] **Step 3: Import into new database**

```bash
ssh je1ght-server "docker cp /tmp/study-data.sql study-mysql:/tmp/study-data.sql"
ssh je1ght-server "docker exec study-mysql mysql -u root -p<password> study_app_db < /tmp/study-data.sql"
```

- [ ] **Step 4: Verify data counts**

```bash
ssh je1ght-server "docker exec study-mysql mysql -u root -p<password> study_app_db -e 'SELECT COUNT(*) AS users FROM StudyUser; SELECT COUNT(*) AS sessions FROM StudySession; SELECT COUNT(*) AS todos FROM TodoItem;'"
```

- [ ] **Step 5: Test login on study.je1ght.top**

Open `https://study.je1ght.top` in browser, try logging in with an existing account.

---

## Task 21: Update GitHub OAuth App

- [ ] **Step 1: Go to GitHub Developer Settings**

Navigate to https://github.com/settings/developers > OAuth Apps.

- [ ] **Step 2: Update callback URL**

Change from: `https://je1ght.top/user/github/callback`
Change to: `https://study.je1ght.top/user/github/callback`

- [ ] **Step 3: Update server .env with correct GitHub OAuth credentials**

```bash
ssh je1ght-server "nano /home/je1ght/docker/study-app/infra/.env"
```

Ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set.

- [ ] **Step 4: Restart backend**

```bash
ssh je1ght-server "cd /home/je1ght/docker/study-app && docker compose restart study-backend"
```

---

## Task 22: Clean Up Old Server — Backend and Nginx

**CRITICAL: Only execute after Task 20 data migration is verified.**

- [ ] **Step 1: SSH to server and update old backend**

```bash
ssh je1ght-server
cd /home/je1ght/docker/je1ght-platform
```

- [ ] **Step 2: Remove study routes from old backend source**

Remove files:
```bash
rm backend-api/src/routes/user-auth.js
rm backend-api/src/routes/study-sessions.js
rm backend-api/src/routes/todos.js
rm backend-api/src/routes/music.js
rm backend-api/src/services/music.js
```

- [ ] **Step 3: Update old app.js to remove study imports/routes**

Edit `backend-api/src/app.js` to remove the 4 study-related imports and route mounts.

- [ ] **Step 4: Update old prisma schema**

Edit `backend-api/prisma/schema.prisma` to remove `StudyUser`, `StudySession`, `TodoItem` models.

- [ ] **Step 5: Run migration to drop old tables**

```bash
docker exec je1ght-backend-api npx prisma migrate dev --name remove-study-models
```

- [ ] **Step 6: Update old nginx config**

Edit `nginx/default.conf` to remove `/study-app/`, `/user/`, `/music/`, `/todos`, `/study-sessions` location blocks.

- [ ] **Step 7: Rebuild old Docker stack**

```bash
docker compose build backend-api
docker compose restart nginx
```

- [ ] **Step 8: Verify old site still works**

```bash
curl -I https://je1ght.top
curl https://je1ght.top/health
```

Expected: Portal loads, no study-app routes.

---

## Task 23: Clean Up Old Server — Verify Checklist

- [ ] `je1ght.top` homepage loads, no study-app links
- [ ] `je1ght.top/admin/` works
- [ ] `je1ght.top` blog and portfolio pages work
- [ ] `study.je1ght.top` frontend loads
- [ ] `study.je1ght.top` login/register works
- [ ] `study.je1ght.top` Pomodoro timer records sessions
- [ ] `study.je1ght.top` todo list works
- [ ] `study.je1ght.top` music player works
- [ ] Old database study tables are dropped
- [ ] Two Docker stacks run independently

---

## Task 24: Update Monorepo Documentation

**Files:**
- Modify: `docs/AI_PROJECT_MEMORY/PROJECT_CONTEXT.md`
- Modify: `docs/AI_PROJECT_MEMORY/MASTER_ARCHITECTURE.md`
- Modify: `docs/AI_PROJECT_MEMORY/DEVELOPMENT_ROADMAP.md`
- Modify: `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- Modify: `docs/DEPLOYMENT_CONTRACT.md`
- Modify: `docs/CONTENT_MAP.md`
- Modify: `CLAUDE.md`
- Create: `docs/STUDY_APP_MIGRATION.md`

- [ ] **Step 1: Update PROJECT_CONTEXT.md**

Add note that study-app is now an independent repository. Remove study-app from the monorepo description.

- [ ] **Step 2: Update MASTER_ARCHITECTURE.md**

Rewrite architecture diagram: from 4-part system to portal-only. Remove Study Room SPA section. Update deployment topology.

- [ ] **Step 3: Update DEVELOPMENT_ROADMAP.md**

Mark Phase 3 (Study Room) as complete and independent. Add note about repository separation.

- [ ] **Step 4: Update CODEX_WORKLOG.md**

Append entry documenting this migration session.

- [ ] **Step 5: Update DEPLOYMENT_CONTRACT.md**

Remove study-app routes. Update to portal-only contract.

- [ ] **Step 6: Update CONTENT_MAP.md**

Remove study-app content flow entries.

- [ ] **Step 7: Update CLAUDE.md**

Major rewrite: remove all study-room commands, paths, integration points, routing table entries, sync script references.

- [ ] **Step 8: Create STUDY_APP_MIGRATION.md**

Document the full migration: decisions, phases, data migration details, rollback plans.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "docs: update all docs to reflect study-app separation"
```

---

## Task 25: Commit Study-App Repo and Push

- [ ] **Step 1: Final commit in study-app repo**

```bash
cd /Users/je1ghtxyun/code/personal-website/study-app
git add -A
git status
```

Verify clean state or commit any remaining changes.

- [ ] **Step 2: Push to GitHub**

```bash
git push origin main
```

---

## Summary of All Commits

### study-app repo
1. `chore: initialize study-app repository`
2. `feat: copy study-room frontend as client/`
3. `feat: copy shared assets (videos, music, locales)`
4. `feat: localize config imports, remove shared-config dependency`
5. `feat: extract backend with study-only routes and schema`
6. `feat: add local dev MySQL and verify backend starts`
7. `feat: add production Docker Compose and nginx config`
8. `feat: add independent deploy script`
9. `docs: add CLAUDE.md and README`
10. `chore: add Claude Code skills and settings`

### monorepo (Je1ghtxyuN.github.io)
1. `chore: remove study-room source and sync script`
2. `chore: remove study-room references from portal renderer`
3. `chore: remove study routes, models, and deps from backend-api`
4. `chore: remove study-app routes from nginx config`
5. `chore: remove study-room build steps from deploy script`
6. `chore: remove study-room fields from site-identity.json`
7. `docs: update all docs to reflect study-app separation`

### Manual steps (not committed)
- Cloudflare DNS setup
- Server directory creation and .env
- Data migration (mysqldump + mysql import)
- GitHub OAuth app callback URL update
- Old server cleanup (backend + nginx + prisma migration)
