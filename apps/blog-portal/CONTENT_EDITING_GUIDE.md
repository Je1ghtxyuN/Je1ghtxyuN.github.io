# Content Editing Guide

This guide explains where to edit portal content in simple terms.

## 1. Blog Posts

Blog posts live in:

- `source/_posts/`

How to use it:

- add one markdown file per post
- the filename becomes the starting point for the post URL
- write normal Hexo front matter at the top, then the article body below

## 2. Profile Text

Profile and site identity seed data lives in:

- `source/_data/site_profile.yml`

Edit this file when you want to change:

- owner name
- subtitle
- avatar path
- intro text
- social placeholders
- contact placeholders

## 3. Portfolio Data

Portfolio card seed data lives in:

- `source/_data/portfolio.yml`

Edit this file when you want to change:

- project titles
- summaries
- preview image paths
- tags
- placeholder links

## 4. Navigation

Human-readable navigation source data lives in:

- `source/_data/navigation.yml`

Important note:

- the live Butterfly menu is synchronized from this file by `scripts/portal-data-sync.js`
- homepage shortcut cards also read from this file

## 5. Custom Pages

Main custom portal pages live here:

- `source/index.md`
- `source/archives/index.md`
- `source/about/index.md`
- `source/contact/index.md`
- `source/portfolio/index.md`
- `source/study-room/index.md`

Important note:

- these files are now lightweight page shells
- the branded page body is rendered by custom Hexo tags in `scripts/portal-tags.js`
- this keeps content in YAML while still using Butterfly's normal page layout
- the current page tags are `{% portal_home %}`, `{% portal_about %}`, `{% portal_portfolio %}`, and `{% portal_study_room %}`

## 6. Shared Images And Media

Shared asset files are maintained in:

- `/packages/shared-assets/`

The blog portal uses them through a mounted source path:

- `source/shared-assets`

Edit the canonical files in `packages/shared-assets/`, not the mounted path.

## 7. Which Files Will Likely Be CMS-Managed Later

These are the best future CMS candidates:

- `source/_posts/`
- `source/_data/site_profile.yml`
- `source/_data/portfolio.yml`
- `source/_data/navigation.yml`
- selected custom page markdown files

## 8. Safest Editing Workflow

- change one content file at a time
- run the local Hexo server to preview
- check navigation after editing `source/_data/navigation.yml`
- check image paths after editing any asset reference
