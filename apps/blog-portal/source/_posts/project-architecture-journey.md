---
title: Project Architecture Journey
date: 2026-04-27 09:30:00
description: How the original React and Firebase site is being rebuilt into a Hexo portal, an independent Study Room app, and a self-hosted backend platform.
categories:
  - Architecture
tags:
  - Migration
  - Hexo
  - Self-Hosting
  - Prisma
  - Docker
---

## Why This Rebuild Exists

The original website did its job as a personal SPA, but it mixed too many responsibilities into one browser-heavy application. Writing, portfolio content, settings, interaction logic, and Firebase-driven behavior all lived too close together.

That structure made experimentation easy in the short term, but it also made long-term ownership harder:

- public content was tied to frontend runtime decisions
- there was no real backend trust boundary
- migration away from Firebase would have been painful without clearer module lines

This rebuild is the answer to that problem. The goal is no longer to maintain a single homepage app. The goal is to build a long-term personal platform that can grow without collapsing into one bundle.

## From Monolith To Modules

The target platform is intentionally split into separate products with different jobs:

```text
apps/
  blog-portal/
  study-room/
  backend-api/
packages/
  shared-assets/
  shared-config/
legacy_archive/
```

That split matters because each part wants a different kind of architecture:

- the portal wants static rendering, SEO, and clean writing workflows
- the Study Room wants interactive, long-lived client behavior
- the backend wants secure ownership of data, auth, moderation, and future admin operations

## What Gets Migrated Forward

The old SPA is not being preserved as the final product shape. Instead, only the durable pieces move forward:

- writing and ideas
- images, music, and shared media
- locale files
- project knowledge and domain structure
- lessons from the original UX

That rule helps avoid a very common migration mistake: dragging old architecture into a new system just because the old system already exists.

## Boundaries I Want To Protect

The rebuild only stays maintainable if the boundaries remain clear:

```yaml
public_portal: static-first publishing and portfolio presentation
study_room: interactive focus environment with its own runtime
backend_api: trusted writes, auth, moderation, contact intake, and future data ownership
```

A clean split gives the project room to mature in stages. It also makes future decisions easier, because each module can be discussed on its own terms instead of inside one oversized frontend file.

## What This Unlocks

This architecture makes several future moves much more realistic:

- moving fully away from browser-direct Firebase usage
- self-hosting on Ubuntu and Docker with a clearer deployment model
- using MySQL and Prisma for durable structured data
- letting the Study Room evolve faster without destabilizing the blog portal
- building an admin and moderation surface when it is actually needed

## Current Status

The first visible result is already here:

- the Hexo Butterfly portal has real branded page structure
- shared assets have been moved into a common package layer
- the portal now reads profile and portfolio data from YAML instead of hardcoded page copy

That may look like infrastructure work, but it is the foundation that makes everything else cleaner.

## Next Milestones

The next major steps are straightforward:

1. keep strengthening the content layer so the portal becomes a real publishing surface
2. begin the Study Room implementation as a separate interactive application
3. define the backend framework and first Prisma schema for dynamic platform features

The migration is gradual on purpose. A flagship platform should be built to last, not rushed into another monolith.
<!-- managed-by-backend-api -->