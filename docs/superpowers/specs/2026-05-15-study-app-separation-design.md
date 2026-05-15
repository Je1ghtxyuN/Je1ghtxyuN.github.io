# Study App Separation Design

**Date:** 2026-05-15
**Status:** Approved
**Strategy:** Plan A — Local first, then server

---

## Goal

Separate the study-app (React SPA + Hono backend + MySQL) from the monorepo `Je1ghtxyuN.github.io` into a standalone GitHub repository called `study-app`. The two projects become fully independent: separate repos, separate databases, separate Docker stacks, separate domains.

## Decisions

| Decision | Choice |
|----------|--------|
| Domain strategy | Subdomain: `study.je1ght.top` |
| Music API (`/music`) | Moves to study-app backend |
| User data | Migrate existing StudyUser/StudySession/TodoItem to new DB |
| Database | Two completely independent MySQL instances |
| Portal landing page | Delete the study-room landing page from portal |

## Current Interconnections to Sever

| # | Connection | Mechanism |
|---|-----------|-----------|
| 1 | Portal CTA links | `portal-renderer.js` generates links to `/study-app/` |
| 2 | Build-time sync | `sync-study-app.sh` copies study-room dist into portal source |
| 3 | Shared config | Both apps read `packages/shared-config/site-identity.json` |
| 4 | Shared assets | Both apps use `packages/shared-assets/` (videos, music, locales, SE) |
| 5 | Nginx routing | Single nginx config proxies both apps |
| 6 | Backend API | Single Hono server serves portal (admin/blog/portfolio/rebuild) and study-app (user/study-sessions/todos/music) |
| 7 | Database | Single MySQL with 9 models, 6 for portal, 3 for study-app |

---

## Phase 1: Create New Repository Skeleton

Create `study-app/` at `/Users/je1ghtxyun/code/personal-website/study-app/`.

### Directory Structure

```
study-app/
├── client/                    ← React frontend (copied from apps/study-room/)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js         ← MODIFIED: base changed to /, no packages/ reference
│   └── package.json
├── server/                    ← Hono backend (extracted from apps/backend-api/)
│   ├── src/
│   │   ├── app.js             ← ONLY user/study-sessions/todos/music routes
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/
│   ├── prisma/
│   │   └── schema.prisma      ← ONLY StudyUser, StudySession, TodoItem
│   ├── Dockerfile
│   └── package.json
├── infra/
│   ├── docker-compose.yml     ← backend + nginx + mysql (independent stack)
│   └── nginx/default.conf     ← study.je1ght.top SPA + API routing
├── scripts/
│   └── deploy.sh              ← independent deploy script
├── assets/                    ← copied from packages/shared-assets/
│   ├── videos/                ← 3 MP4 + poster PNGs
│   ├── music/                 ← 6 MP3
│   ├── se/                    ← 1 MP3 (BreakOrWork)
│   └── locales/               ← 4 locale files from site-ui/
├── site.config.json           ← extracted from site-identity.json (study-app fields only)
├── CLAUDE.md
├── .claude/
│   ├── commands/              ← applicable skills copied
│   └── settings.local.json
└── .gitignore
```

### Key Code Changes

1. **`client/vite.config.js`**: `base` changes from `/study-app/` to `/` (subdomain root is study-app)
2. **`client/src/state/studySessionRecorder.js`**: API base URL changes to relative paths (same origin via nginx proxy)
3. **`client/src/i18n/config.js`**: locale imports change from `../../../../packages/shared-assets/locales/site-ui/` to local `../../assets/locales/`
4. **`server/src/app.js`**: CORS allows `https://study.je1ght.top`
5. **`server/prisma/schema.prisma`**: only StudyUser, StudySession, TodoItem models
6. **`site.config.json`**: extract study-app-relevant fields from site-identity.json (brand name, study description, locale config)

### Source File Mapping

| New location | Copied from |
|-------------|-------------|
| `client/` | `apps/study-room/` (entire directory) |
| `server/src/routes/user.js` | `apps/backend-api/src/routes/user.js` |
| `server/src/routes/study-sessions.js` | `apps/backend-api/src/routes/study-sessions.js` |
| `server/src/routes/todos.js` | `apps/backend-api/src/routes/todos.js` |
| `server/src/routes/music.js` | `apps/backend-api/src/routes/music.js` |
| `server/src/middleware/` | `apps/backend-api/src/middleware/` (auth-related) |
| `server/src/services/` | `apps/backend-api/src/services/` (study-related only) |
| `server/src/app.js` | `apps/backend-api/src/app.js` (stripped down) |
| `server/prisma/schema.prisma` | `apps/backend-api/prisma/schema.prisma` (3 models only) |
| `server/Dockerfile` | `apps/backend-api/Dockerfile` (adapted, no hexo-cli needed) |
| `server/package.json` | `apps/backend-api/package.json` (stripped to study deps) |
| `assets/` | `packages/shared-assets/` (videos, music, se, locales/site-ui/) |

---

## Phase 2: Clean Up Monorepo

### Files to DELETE

| Path | Reason |
|------|--------|
| `apps/study-room/` | Moved to new repo |
| `scripts/sync-study-app.sh` | No longer needed |
| `apps/blog-portal/source/study-app/` | Built SPA copy (if exists) |

### Files to MODIFY

| File | Changes |
|------|---------|
| `apps/blog-portal/scripts/portal-renderer.js` | Remove `resolveStudyRoomEntryPath()` and all Study Room CTA generation |
| `apps/blog-portal/scripts/portal-data-sync.js` | Remove study-room data sync |
| `apps/blog-portal/source/study-room/index.md` | Delete this landing page |
| `apps/backend-api/src/app.js` | Remove `/user`, `/study-sessions`, `/todos`, `/music` route mounts |
| `apps/backend-api/src/routes/user.js` | Delete |
| `apps/backend-api/src/routes/study-sessions.js` | Delete |
| `apps/backend-api/src/routes/todos.js` | Delete |
| `apps/backend-api/src/routes/music.js` | Delete |
| `apps/backend-api/src/services/` | Delete study-related service files |
| `apps/backend-api/prisma/schema.prisma` | Remove StudyUser, StudySession, TodoItem models |
| `apps/backend-api/package.json` | Remove NeteaseCloudMusicApi and other study-only deps |
| `infra/docker-compose.yml` | Remove study-app related volume mounts |
| `infra/nginx/default.conf` | Remove `/study-app/`, `/user/`, `/study-sessions/`, `/todos`, `/music/` routes |
| `scripts/deploy.sh` | Remove step 1 (Build Study Room) and step 2 (Sync) |
| `packages/shared-config/site-identity.json` | Remove study-room fields and routes |

### Files UNCHANGED

- `packages/shared-assets/` — portal still uses locales; can delete videos/music/se later if desired
- `packages/shared-config/` — portal still uses it

---

## Phase 3: Server Deployment

### 3a. Cloudflare Subdomain Setup

1. Log into Cloudflare dashboard
2. Select `je1ght.top` domain
3. Go to DNS > Records
4. Add A record: `study` → server IP (same IP as `je1ght.top`)
5. Enable Cloudflare proxy (orange cloud) for CDN + SSL
6. SSL mode should already be set (inherits from existing domain config)

### 3b. Server Directory Structure

```
~/docker/
├── je1ght-platform/           ← existing (portal)
│   ├── docker-compose.yml
│   ├── nginx/default.conf
│   ├── backend-api/
│   └── portal-source/
└── study-app/                 ← NEW
    ├── docker-compose.yml     ← backend + nginx + mysql
    ├── nginx/default.conf
    ├── server/                ← study-app backend code
    └── client-dist/           ← study-app frontend build
```

### 3c. Study App Docker Compose

Three services:
- `study-backend` — Hono server, port 3002 (avoids conflict with existing 3001)
- `study-nginx` — nginx:alpine, port 80 (routed via Cloudflare subdomain)
- `study-mysql` — MySQL 8.0, independent volume `study-app-mysql-data`

Networks:
- `study-network` (bridge, internal)
- `internet` (bridge, for external access)

### 3d. Study App nginx Config

```
server {
    listen 80;
    server_name study.je1ght.top;

    # API proxy
    location ~ ^/(api|user|study-sessions|todos|music)/ {
        proxy_pass http://study-backend:3002;
        # standard proxy headers
    }

    # SPA frontend
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

### 3e. Deploy Script

`scripts/deploy.sh` for study-app:
1. Build client (`npm run build` in client/)
2. Copy dist to server via rsync
3. Copy server code to server via rsync
4. Copy infra configs to server
5. SSH to server: `docker compose build && docker compose down && docker compose up -d`
6. Run `prisma migrate deploy` in study-backend container

---

## Phase 4: Data Migration

### Tables to Migrate

| Table | Content | Estimated Size |
|-------|---------|---------------|
| `StudyUser` | Registered users (email/password + GitHub OAuth) | Small |
| `StudySession` | Pomodoro completion records | Medium |
| `TodoItem` | User todo items | Small |

### Migration Steps

```bash
# 1. Backup old database (safety)
ssh je1ght-server
docker exec je1ght-mysql mysqldump -u root -p --all-databases > /tmp/full-backup-$(date +%Y%m%d).sql

# 2. Export study tables
docker exec je1ght-mysql mysqldump -u root -p <db_name> StudyUser StudySession TodoItem > /tmp/study-data.sql

# 3. Copy dump to host
docker cp je1ght-mysql:/tmp/study-data.sql /tmp/study-data.sql

# 4. Copy to new MySQL container
docker cp /tmp/study-data.sql study-mysql:/tmp/study-data.sql

# 5. Import into new database
docker exec study-mysql mysql -u root -p study_app_db < /tmp/study-data.sql

# 6. Verify
docker exec study-mysql mysql -u root -p study_app_db -e "SELECT COUNT(*) FROM StudyUser; SELECT COUNT(*) FROM StudySession; SELECT COUNT(*) FROM TodoItem;"
```

### Verification Checklist

- [ ] Row counts match between old and new databases
- [ ] Login with existing account works on study.je1ght.top
- [ ] Pomodoro history is visible
- [ ] Todo items are present
- [ ] GitHub OAuth login works

### Rollback

Old database data is untouched (export only, no DELETE). If migration fails, new database can be dropped and recreated.

---

## Phase 5: Clean Up Old Server

**CRITICAL: Only execute after Phase 4 data migration is verified.**

### 5a. Old backend-api Cleanup

- Remove study-related route files from `je1ght-platform/backend-api/`
- Update `prisma/schema.prisma`: delete StudyUser, StudySession, TodoItem
- Run `prisma migrate dev` to drop old tables (after confirming new DB has all data)
- Remove route mounts from `app.js`
- Rebuild: `docker compose build backend-api && docker compose up -d`

### 5b. Old nginx Cleanup

Remove from `je1ght-platform/nginx/default.conf`:
- `/study-app/` route
- `/user/` route
- `/study-sessions` route
- `/todos` route
- `/music/` route

Restart: `docker compose restart nginx`

### 5c. Verification Checklist

- [ ] `je1ght.top` homepage loads, no study-app links
- [ ] `je1ght.top` admin panel works
- [ ] `je1ght.top` blog and portfolio pages work
- [ ] `study.je1ght.top` frontend loads
- [ ] `study.je1ght.top` login/register/pomodoro/todos work
- [ ] Old database study tables are dropped
- [ ] Two Docker stacks run independently

---

## Phase 6: Documentation & Config Updates

### Monorepo Side (Je1ghtxyuN.github.io)

| File | Changes |
|------|---------|
| `docs/AI_PROJECT_MEMORY/PROJECT_CONTEXT.md` | Update: study-app is now independent |
| `docs/AI_PROJECT_MEMORY/MASTER_ARCHITECTURE.md` | Rewrite: 4-part → portal-only architecture |
| `docs/AI_PROJECT_MEMORY/DEVELOPMENT_ROADMAP.md` | Phase 3 marked complete and independent |
| `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md` | Append: record this migration |
| `docs/DEPLOYMENT_CONTRACT.md` | Remove study-app routes, portal-only contract |
| `docs/CONTENT_MAP.md` | Remove study-app content flow |
| `CLAUDE.md` | Major rewrite: remove all study-room references |

### New Repo Side (study-app)

| File | Content |
|------|---------|
| `CLAUDE.md` | Full project docs: tech stack, structure, commands, deploy |
| `docs/AI_PROJECT_MEMORY/` | Slim version: architecture decisions, deploy topology |
| `.claude/commands/` | Applicable skills: ui-ux-design, api-scaffold, db-migrate, deploy-checklist, docker-optimize, tdd |
| `.claude/settings.local.json` | Study-app specific permissions |
| `README.md` | Project intro, local dev guide, deploy guide |

### Migration Record

Create `docs/STUDY_APP_MIGRATION.md` in the monorepo with:
- Migration goals and decisions
- 6-phase execution checklist (tickable)
- Key file changes per phase
- Data migration commands and verification steps
- Rollback plans
- Risk notes

This document serves as the session-recovery anchor: if context is lost, reading this file restores full migration state.

---

## Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Data loss during migration | Low | High | Full backup before migration; export-only, no DELETE on old DB |
| CORS issues on subdomain | Medium | Low | Test API calls early in Phase 3; CORS config is a one-liner fix |
| Cloudflare DNS propagation delay | Low | Low | DNS propagates in minutes for proxied records |
| Nginx misconfiguration | Medium | Medium | Test with curl before switching traffic; keep old config as backup |
| Shared dependency version mismatch | Low | Low | Copy exact package.json, run npm ci |
| OAuth callback URL mismatch | Medium | Medium | Update GitHub OAuth app callback to study.je1ght.top |
| Context loss during implementation | Medium | Medium | Migration record doc at docs/STUDY_APP_MIGRATION.md |

## GitHub OAuth Note

When study-app moves to `study.je1ght.top`, the GitHub OAuth app's callback URL must be updated:
- Old: `https://je1ght.top/user/github/callback`
- New: `https://study.je1ght.top/user/github/callback`

This requires editing the GitHub OAuth app settings in GitHub Developer Settings.
