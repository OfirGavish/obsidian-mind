---
mode: 'agent'
description: 'Full session review before ending. Review context, ways of working, files modified, consistency, and suggest improvements.'
---

Full session review before ending. Run this when the user says "wrap up", "let's wrap", "wrapping up", or similar.

> **Note for VS Code Copilot:** The `brag-spotter` subagent referenced below maps to the **Brag Spotter** chat mode (`.github/chatmodes/brag-spotter.chatmode.md`). Switch to that mode for the brag scan step, then return here to complete the wrap-up.

## Workflow

### 1. Review What Was Done

Scan the conversation for:
- Notes created or modified (list them all with paths)
- People notes created or updated
- Indexes updated
- Brag doc entries added
- Brain notes updated (Patterns, Gotchas, Key Decisions, Memories)

### 2. Verify Note Quality

For each note created or modified this session:
- Frontmatter complete? (`date`, `quarter`, `description`, `tags`, type-specific fields)
- At least one wikilink to another note?
- In the correct folder? (`work/active/` vs `work/archive/` vs `work/incidents/` etc.)
- Description accurate and ~150 chars?
- Status field correct?

### 3. Check Index Consistency

- `work/Index.md` — are new notes linked? Are completed projects in the right section?
- `brain/Memories.md` — does Recent Context reflect what happened this session?
- `org/People & Context.md` — any new people or relationship changes to capture?
- `perf/Brag Doc.md` — any wins or achievements from this session?

### 4. Check for Orphans

- Any new notes not linked from at least one other note?
- Any new people not added to People & Context?
- Any thinking notes that should be promoted or deleted?

### 5. Archive Check

- Are there notes in `work/active/` that should be moved to `work/archive/YYYY/`?
- Any status fields still `active` that should be `completed`?

### 6. Ways of Working Review

Check if this session revealed:
- A new pattern that should be in `brain/Patterns.md`?
- A new gotcha that should be in `brain/Gotchas.md`?
- A workflow improvement for `brain/Skills.md`?
- A CLAUDE.md update needed (new convention, stale reference)?

### 7. Run Brag Spotter

Switch to the **Brag Spotter** chat mode to find uncaptured wins and competency gaps from this session.

### 8. Report

Present a concise summary:
- **Done**: what was captured this session
- **Fixed**: issues found and resolved
- **Flagged**: things that need user input
- **Suggested**: improvements for next time

## Important

- This is a READ + VERIFY pass, not a creation pass. Fix small issues (broken links, missing frontmatter), but flag larger changes for user approval.
- Be honest about what's missing — the goal is leaving the vault in a better state than you found it.
- If North Star goals shifted during the session, suggest updating it.

> **VS Code Copilot reminder:** After wrap-up, run the **`om: stop checklist`** task (Terminal → Run Task → `om: stop checklist`) to complete end-of-session hygiene.
