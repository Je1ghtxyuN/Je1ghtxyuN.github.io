---
name: docs-memory-to-claudemd-migration
description: Key decisions from docs/AI_PROJECT_MEMORY/ have been distilled into CLAUDE.md "Project Decisions & Constraints" section — no longer need to read all docs files every session
type: project
---

As of 2026-05-09, the key architectural decisions from docs/AI_PROJECT_MEMORY/ have been distilled into CLAUDE.md's "Project Decisions & Constraints" section.

**Why:** The user previously added "Before doing anything, always read all files inside docs/AI_PROJECT_MEMORY/" to every session. This wasted tokens reading ~1000 lines of history every time. The essential decisions are now in CLAUDE.md (auto-loaded), while full detail remains in docs/ for on-demand reading.

**How to apply:**
- Do NOT read all docs/AI_PROJECT_MEMORY/ files at session start
- CLAUDE.md already contains the essential constraints and current status
- Only read specific docs files when the task requires deep historical context (e.g., reviewing past architecture decisions, checking roadmap details, appending to worklog)
- The "Detailed References" section in CLAUDE.md lists when to read each file
