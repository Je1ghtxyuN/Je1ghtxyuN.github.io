---
name: explain-while-building
description: User wants every response to explain what was done, how, and why — educational output style, not just code dumps
type: feedback
---

Every response should be educational. Explain what was done, how it was done, and why.

**Why:** The user is learning while building their personal website platform. They want to understand the reasoning, not just receive code.

**How to apply:**
- Before code changes: briefly explain the approach and trade-offs
- After code changes: summarize what changed, how it works, and what to watch for
- Use clear structure: context → action → result → next steps
- Don't over-explain trivial changes, but do explain architectural decisions, security choices, and non-obvious patterns
- When invoking skills automatically, state which skill and why
