---
description: "UI/UX design intelligence — search 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types. Use when designing or reviewing UI components, choosing colors/fonts, or improving UX."
---

# UI/UX Pro Max Design Intelligence

You have access to a comprehensive design intelligence database. Use the search tool to find relevant design guidance.

## Search Tool Location

The search tool is at: `/tmp/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py`

If the tool is not available, apply the design principles below directly.

## Search Commands

```bash
# Domain search
python3 /tmp/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> [-n <max_results>]

# Stack-specific search
python3 /tmp/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>
```

**Domains:** `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`
**Stacks:** `html-tailwind`, `react`, `nextjs`, `astro`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`

## When To Use

- Designing new UI components or pages
- Choosing color palettes for a project
- Selecting font pairings
- Reviewing UX patterns and anti-patterns
- Building landing pages or product pages
- Creating data visualizations
- Implementing responsive layouts

## Core Design Principles

### UX Guidelines Summary
- **Clarity over cleverness** — users should understand the interface immediately
- **Consistency** — maintain patterns across the entire application
- **Feedback** — every action should have visible feedback
- **Efficiency** — minimize steps to complete tasks
- **Accessibility** — design for all users (WCAG 2.1 AA minimum)
- **Progressive disclosure** — show only what's needed, reveal complexity on demand
- **Error prevention** — design to prevent mistakes, not just handle them
- **Mobile-first** — start with constraints, enhance for larger screens

### Color Application Rules
- Use 60-30-10 rule: 60% dominant, 30% secondary, 10% accent
- Ensure 4.5:1 contrast ratio for text, 3:1 for large text
- Test colors in both light and dark contexts
- Limit palette to 3-5 colors for cohesion

### Typography Rules
- Maximum 2 font families (1 for headings, 1 for body)
- Maintain a modular scale (1.25 or 1.333 ratio)
- Line height: 1.5-1.75 for body text, 1.1-1.3 for headings
- Measure (line length): 45-75 characters optimal

### Spacing System
- Use a consistent base unit (4px or 8px)
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Whitespace is a feature, not empty space
