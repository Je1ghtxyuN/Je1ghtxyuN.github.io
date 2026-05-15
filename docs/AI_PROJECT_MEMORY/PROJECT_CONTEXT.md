# Project Context

Last updated: 2026-05-16
Status: permanent project identity and context memory

## Purpose

This file stores the long-term identity of the project so future engineering sessions do not drift into short-term SPA thinking.

Unless there is an explicit high-level architecture decision recorded later, the assumptions in this document should be treated as stable project context.

## Core Project Identity

- project goal: build a long-term personal flagship website platform, not just a simple SPA homepage
- current repository status: Hexo portal + Hono backend (legacy React SPA frozen, Study Room separated to independent repo)
- architectural direction: modular self-hosted platform — portal at `je1ght.top`, study-app at `study.je1ght.top`
- migration rule: preserve useful content, assets, locale resources, and schema/domain knowledge from the old codebase, but do not treat the old SPA as the final product shape

## Fixed Visual and Product Reference

- preferred only visual reference website: `https://atritium.github.io`
- fixed preferred Hexo theme: `hexo-theme-butterfly` by `jerryc127`
- aesthetic direction: elegant technical blog + personal portfolio + anime subtle atmosphere

Interpretation rule:

- future design work should draw visual direction only from the above reference and the project's own established outputs
- future sessions should not introduce unrelated design references unless explicitly approved

## Product Modules That Must Exist in the Long-Term Vision

### Main Public Portal

- Hexo-based
- serves as the main public website
- carries the personal flagship identity of the project

### Study Room Module

- a StudyWithMiku-like study room module — **completed and separated** (2026-05-16)
- now lives in its own independent repository at `/Users/je1ghtxyun/code/personal-website/study-app/`
- deployed independently to `study.je1ght.top` with its own React frontend, Hono backend, MySQL database, and Docker Compose stack
- portal no longer hosts or syncs the study-app

### Backend/Admin Platform

- the final platform requires a real backend and admin boundary
- browser-direct Firebase architecture is transitional and scheduled for replacement

## Hosting and Infrastructure Constraints

- China mainland accessibility is required
- Firebase services are planned to be fully phased out
- Ubuntu Docker self-hosting is the production base
- Cloudflare is used as the domain, CDN, and reverse-proxy layer

Infrastructure implication:

- future technical choices should be screened for self-hosting practicality and mainland accessibility
- avoid dependencies that become critical-path failures if blocked, unstable, or difficult to self-host

## Technology Direction Anchors

- public portal direction: Hexo
- theme anchor: Butterfly
- dynamic platform data direction: self-hosted MySQL
- server-side data access direction: Prisma ORM
- deployment style: Dockerized services on Ubuntu

These are not minor preferences. They are long-term architecture anchors unless later changed by an explicit recorded decision.

## Current Repository Reality

As of 2026-05-16, this repository is:

- a Hexo 7 portal (`apps/blog-portal/`) + Hono backend (`apps/backend-api/`) serving `je1ght.top`
- the legacy React SPA (`src/`) is frozen, not the active development target
- the Study Room has been fully separated into its own independent repo and deploys to `study.je1ght.top`
- Firebase is transitional and being phased out
- the backend serves portal-only routes: admin auth, comments, contact form, site rebuild

## Migration Principles

- migrate content before blindly migrating code
- extract domain knowledge before choosing final implementations
- establish server-owned trust boundaries before rebuilding admin features
- prefer static-first public rendering and dynamic APIs only where they are truly needed
- keep the Study Room separate enough to evolve independently
- keep future architecture understandable for long-term maintenance by one owner

## What Future Sessions Should Assume By Default

- documentation continuity matters and should be preserved
- architectural decisions should be recorded rather than implied
- Firebase should not be reinforced with new long-term features
- GitHub Pages assumptions are temporary and should not shape the final platform
- self-hosting, maintainability, and modular boundaries matter more than preserving the old SPA structure

## Context Preservation Rule

This file acts as permanent context memory for future engineering sessions.

Future sessions should consult it before:

- proposing architecture changes
- choosing frameworks for new modules
- planning deployment
- making design decisions
- deciding whether legacy code should be migrated or rewritten
