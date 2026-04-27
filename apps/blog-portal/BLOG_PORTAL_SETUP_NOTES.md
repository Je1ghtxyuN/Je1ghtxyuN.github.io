# Blog Portal Setup Notes

## Why Hexo Is Chosen

- Hexo matches the static-first portal direction locked in the architecture memory.
- It supports long-term blog publishing, strong SEO fundamentals, and straightforward content management through markdown and data files.
- It gives the public website a stable publishing surface while the Study Room and backend evolve separately.
- It helps us migrate content out of the legacy React SPA without preserving the old browser-heavy architecture.

## What Butterfly Handles In This Pass

- main portal theme activation
- top navigation shell
- archive/category/tag presentation support
- article TOC and code block presentation
- sidebar cards and author panel
- local search integration hook
- dark-mode-capable foundation

## What Is Deliberately Not Final Yet

- pixel-perfect visual polish
- Giscus wiring
- final contact handling implementation
- Decap CMS integration

## Current Butterfly Configuration Decisions

- root Hexo config remains focused on site metadata, permalink rules, and plugin-level search generation
- Butterfly-specific settings live in `_config.butterfly.yml`
- dark display mode is the default base
- the menu mirrors `source/_data/navigation.yml`
- local search is enabled through `hexo-generator-searchdb`
- comments are intentionally left disabled while a future Giscus slot is reserved in theme config

## Shared Asset Mapping

To avoid duplicating assets into the portal source tree, the portal now mounts shared assets through:

- `source/shared-assets -> ../../../packages/shared-assets`

Current public-facing asset references:

- avatar: `/shared-assets/images/profile.jpg`
- icon/favicon: `/shared-assets/images/icon.png`
- default page and archive top image: `/shared-assets/images/background.jpg`
- portfolio preview seeds: `/shared-assets/images/works/GSSJ1.jpeg` and `/shared-assets/images/works/REBORN1.jpg`

Editing rule:

- update the canonical files under `packages/shared-assets/`
- do not manually duplicate those files into `apps/blog-portal/source/`

## Data Files Introduced In This Pass

- `source/_data/site_profile.yml`
- `source/_data/portfolio.yml`
- `source/_data/navigation.yml`

These are intended to become human-editable content sources and later CMS-friendly content entry points.

## Custom Layout Structure

The portal no longer uses static placeholder markdown copy for its main branded surfaces.

Main branded page shells live in normal Hexo page files:

- `source/index.md`
- `source/about/index.md`
- `source/portfolio/index.md`
- `source/study-room/index.md`

Those routes are intentionally thin and delegate rendering to custom Hexo tags:

- `scripts/portal-tags.js`

Current tag entry points:

- `{% portal_home %}`
- `{% portal_about %}`
- `{% portal_portfolio %}`
- `{% portal_study_room %}`

That script reads the YAML data files and produces the branded HTML blocks inserted into Butterfly's standard page layout.

Custom CSS for these layouts lives in:

- `source/css/portal-custom.css`

Theme injection loads that stylesheet through `_config.butterfly.yml`.

Implementation note:

- an initial site-local `layout/` override attempt was discarded because Hexo resolves page `layout:` names through the active theme view registry
- an initial source-level Pug approach was also discarded because source rendering did not have reliable access to `site.data`
- the working approach is tag-driven HTML generation inside normal Butterfly page shells

## How Homepage Layout Works

The homepage is now driven by `source/index.md`, which calls the custom `{% portal_home %}` tag.

Section order on the homepage:

- hero block
- navigation shortcut cards
- recent posts list
- portfolio preview cards
- footer info/connect section

The rendering script does not hardcode the owner profile or project entries. It reads them from YAML data files and from `site.posts`.

## Data Flow Into Templates

Primary data flow:

- `source/_data/site_profile.yml`
  - hero content
  - owner identity
  - subtitle and intro
  - social links
  - about page sections
  - Study Room entry content

- `source/_data/portfolio.yml`
  - homepage portfolio preview cards
  - full portfolio grid page

- `source/_data/navigation.yml`
  - homepage shortcut cards
  - theme navigation sync source

- `site.posts`
  - homepage recent posts section

Additional sync step:

- `scripts/portal-data-sync.js`
  - syncs `navigation.yml` into the Butterfly menu
  - syncs `site_profile.yml` social links into Butterfly social config
  - syncs avatar, favicon, and default top-image settings from profile data

This means the portal now has one content source feeding both custom templates and parts of the Butterfly shell.

## Where To Edit Content

Edit these files for content changes:

- homepage/profile/about/study-room owner text: `source/_data/site_profile.yml`
- portfolio cards: `source/_data/portfolio.yml`
- main navigation and homepage shortcut cards: `source/_data/navigation.yml`
- blog articles: `source/_posts/`

Edit these files for layout behavior:

- page shells: `source/index.md`, `source/about/index.md`, `source/portfolio/index.md`, `source/study-room/index.md`
- portal renderer logic: `scripts/portal-tags.js`
- shared custom styles: `source/css/portal-custom.css`

## Routing And Page Foundation Added

Custom portal pages added in this pass:

- `/`
- `/archives/`
- `/about/`
- `/contact/`
- `/portfolio/`
- `/study-room/`
- `/categories/`
- `/tags/`

## Comments And Contact Note

This portal pass reserves structure for future Giscus and Formspree integration because that is the current requested implementation direction.

However, the architecture memory still records a preference for self-hosted comments and contact ownership in the long term. That decision should be revisited before production rollout.
