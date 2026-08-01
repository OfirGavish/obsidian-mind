---
mode: 'ask'
description: 'Weekly synthesis — cross-session review of vault activity, North Star alignment, patterns, uncaptured wins, and forward priorities.'
---

Cross-session synthesis of the past week. Bridges daily standup (lightweight) and quarterly review brief (comprehensive). This is ANALYSIS, not verification — find patterns, surface drift, detect uncaptured work.

> **Note for VS Code Copilot:** The `brag-spotter` subagent referenced below maps to the **Brag Spotter** chat mode (`.github/chatmodes/brag-spotter.chatmode.md`). Switch to that mode for the uncaptured-win scan, then return here to complete the synthesis.

## Workflow

### 1. Gather Week's Activity

- Read all notes modified in the past 7 days (check `work/active/`, `work/archive/`, `work/1-1/`)
- Run `git log --since="7 days ago" --oneline --no-merges` in the vault terminal
- Read any `work/1-1/*.md` notes from this week
- Check `work/incidents/` for new or updated incidents

### 2. North Star Alignment

Read `brain/North Star.md` and compare actual activity against stated focus:
- **Aligned work**: which Current Focus items got attention this week?
- **Drift**: work that doesn't map to any stated goal (not necessarily bad — flag it)
- **Silent goals**: focus items with zero commits, zero note updates, zero mentions
- **Emerging themes**: work patterns suggesting a focus shift that hasn't been written down yet

### 3. Cross-Day Patterns

Look across the week's notes for:
- Recurring themes (same topic in multiple notes or days)
- Multiple incidents or issues touching the same system
- Topics appearing in BOTH work notes and 1:1s (these are signals)
- Context that evolved across sessions

### 4. Uncaptured Win Detection

Switch to the **Brag Spotter** chat mode to scan for wins from this week, then filter findings to the past 7 days.

Additionally check:
- Were completed items logged in `perf/Brag Doc.md` or the current quarter's brag note?
- Any 1:1 feedback or kudos not captured?

### 5. Competency Signal Mapping

For each competency in `perf/competencies/`:
- Was it exercised this week? (check work note links, incident roles, 1:1 topics)
- If yes, is the competency explicitly linked from the evidence note?

Present as a compact table: competency name, exercised (yes/no), linked (yes/no).

### 6. Hygiene Sweep

Review current vault hygiene:
- Notes in `work/active/` with `status: completed` that should be archived
- Notes not modified in 60+ days still in `work/active/`
- Orphan notes with no inbound links

Invoke `/om-tidy` for the full mechanical pass.

### 7. Forward Look

- Blocked items or upcoming deadlines from active work notes
- North Star goals that need attention next week
- Suggested priority ordering for next week based on goals + momentum + gaps

## Present Synthesis

Structure the output as:

- **This Week**: 3-5 bullet summary of what actually happened
- **North Star Check**: alignment status — what's on track, what drifted, what's silent
- **Patterns**: cross-day themes worth noting
- **Uncaptured Wins**: anything that should be in the brag doc
- **Competency Coverage**: compact table
- **Next Week**: suggested priorities and attention areas

After presenting, offer:
- "Want me to add any of these wins to the brag doc?"
- "Should I update North Star with any focus shifts?"
- "Want me to save this as `thinking/weekly-YYYY-MM-DD.md`?"

## Important

- This is transient analysis by default — do NOT create a file unless the user asks.
- Keep the tone analytical, not cheerful. This is a status check, not a celebration.
- Be honest about drift and silent goals — the value is in surfacing what's NOT happening.
- Don't duplicate standup (daily) or wrap-up (session). This is SYNTHESIS across days.
