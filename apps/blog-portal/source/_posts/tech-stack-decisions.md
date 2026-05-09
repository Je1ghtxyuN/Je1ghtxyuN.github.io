---
title: Tech Stack Decisions
date: 2026-04-25 18:00:00
description: Why the platform is splitting responsibilities across Hexo, React, and a future backend API instead of trying to keep everything inside one frontend bundle.
categories:
  - Engineering
tags:
  - Hexo
  - React
  - Node.js
  - Prisma
  - MySQL
  - Butterfly
---

## Decision Principle

The main stack decision for this rebuild is simple: each part of the platform should use the tool that matches its job.

I do not want one framework making every decision just because it was chosen first.

## Why Hexo For The Portal

The public portal is mostly a writing and presentation surface. It needs:

- fast static delivery
- strong SEO behavior
- clean article authoring
- predictable content structure

That makes Hexo a strong fit. It keeps the public site lightweight while still allowing theme customization and data-driven pages where needed.

## Why Butterfly Stays

Butterfly is the chosen theme anchor because it already provides:

- a solid navigation shell
- archive, tag, and category support
- article TOC behavior
- code presentation
- a strong base for later visual customization

Using it as the foundation lets me spend effort on branding and content structure instead of rebuilding basic blog features from zero.

## Why React And Vite For The Study Room

The Study Room has different needs from the portal:

- live timers
- media controls
- preference state
- future account-aware data

That is interactive application territory, not static blog territory. React and Vite make sense there because they support iteration speed, component composition, and a dedicated runtime without forcing that complexity onto the portal.

## Why A Backend API Exists

The old browser-direct Firebase model is exactly what I want to grow away from.

Dynamic and trusted operations need a real server boundary:

- authentication
- moderation
- contact intake
- protected admin actions
- structured data ownership

That is why a backend API is part of the plan even though the public portal is static-first.

```yaml
portal:
  runtime: Hexo + Butterfly
  strength: publishing, SEO, static delivery

study_room:
  runtime: React + Vite
  strength: long-lived interactivity, media controls, timer UX

backend_api:
  runtime: Node.js service + Prisma + MySQL
  strength: auth, trusted writes, comments, contact intake
```

## Why Prisma And MySQL

If the platform is going to be self-hosted for the long term, the data layer has to be something I can understand, migrate, and operate with confidence.

Prisma plus MySQL gives me:

- versioned schema control
- explicit migrations
- typed data access on the server
- a durable path away from ad hoc browser data writes

## Deployment Baseline

The infrastructure model is intentionally small but serious:

```bash
Cloudflare -> Ubuntu Server -> Docker services -> private MySQL network
```

This keeps public routing clean while allowing each application to stay modular behind the proxy layer.

## Tradeoffs I Accept

This stack is not the smallest possible stack. It introduces more moving parts than a single static app.

I still think the tradeoff is worth it because the project is being built as a long-term platform, not as a short demo. Clear module boundaries now will save much larger rewrite costs later.
<!-- managed-by-backend-api -->