# Content Map

This document explains where the blog portal content is stored, where it is used, and how it flows into the branded homepage.

## Site Profile Data

Source of truth:

- `apps/blog-portal/source/_data/site_profile.yml`

Used by:

- `apps/blog-portal/scripts/portal-renderer.js`
- `apps/blog-portal/scripts/portal-data-sync.js`

Main responsibilities:

- owner name and subtitle
- avatar, icon, and background asset paths
- homepage intro text
- footer social and contact data
- about page text, skills, and experience
- Study Room landing-page copy

UI surfaces fed by this file:

- homepage hero
- homepage footer panel
- about page
- Study Room entry page
- Butterfly shell metadata such as avatar, favicon, and subtitle

## Portfolio Data

Source of truth:

- `apps/blog-portal/source/_data/portfolio.yml`

Used by:

- `apps/blog-portal/scripts/portal-renderer.js`

Main responsibilities:

- project card titles
- project summaries
- preview images
- tags
- tech stack lists
- project links

UI surfaces fed by this file:

- homepage portfolio preview section
- `/portfolio/` full project grid

## Navigation Data

Source of truth:

- `apps/blog-portal/source/_data/navigation.yml`

Used by:

- `apps/blog-portal/scripts/portal-renderer.js`
- `apps/blog-portal/scripts/portal-data-sync.js`

Main responsibilities:

- main portal navigation items
- homepage shortcut card definitions

UI surfaces fed by this file:

- Butterfly top navigation
- homepage shortcut section

## Blog Posts

Source of truth:

- `apps/blog-portal/source/_posts/`

Used by:

- Hexo post generation
- `apps/blog-portal/scripts/portal-home-generator.js`
- `apps/blog-portal/scripts/portal-renderer.js`

Main responsibilities:

- article content
- article metadata such as title, date, tags, categories, and description

UI surfaces fed by posts:

- homepage recent-post section
- `/blog/`
- `/archives/`
- `/categories/`
- `/tags/`
- search index

## Homepage Rendering Flow

The homepage does not read from a handwritten markdown page anymore.

Flow:

1. Hexo loads posts, pages, and `_data` YAML files into `locals`.
2. `apps/blog-portal/scripts/portal-home-generator.js` creates the root `index.html` route.
3. The generator calls `renderHome({ siteLocals: locals })` from `apps/blog-portal/scripts/portal-renderer.js`.
4. `portal-renderer.js` reads `site_profile.yml`, `portfolio.yml`, `navigation.yml`, and the loaded post collection.
5. The renderer builds the hero, shortcut cards, recent posts, portfolio preview, and footer sections.
6. Butterfly wraps that generated content in the normal page shell.

## Structural Control Points

These values are intentionally controlled in code:

- homepage recent-post count: `PORTAL_CONFIG.HOMEPAGE_POST_LIMIT`
- homepage portfolio preview count: `PORTAL_CONFIG.PORTFOLIO_PREVIEW_LIMIT`
- Study Room dev link: `PORTAL_CONFIG.STUDY_ROOM_DEV_URL`
- Study Room production placeholder path: `PORTAL_CONFIG.STUDY_ROOM_PROD_URL`

These values live in:

- `apps/blog-portal/scripts/portal-renderer.js`

Reason:

- content editors should be able to change text and data safely without accidentally changing homepage structure or routing behavior
