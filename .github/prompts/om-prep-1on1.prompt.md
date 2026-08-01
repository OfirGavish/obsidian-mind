---
mode: 'ask'
description: 'Prep for an upcoming 1:1 — load person context, surface open items, suggest agenda based on vault state.'
---

# Prep for 1:1

Prepare for an upcoming 1:1 by gathering everything relevant about the person and current work context.

## Usage

Provide the person's name in your message after invoking this prompt.
Example: "Prep for 1:1 with Scott Detweiler"

## Workflow

1. **Load person context** — read `org/people/<Name>.md` for role, relationship, key moments, and any standing dynamics

2. **Load recent 1:1 history** — check `work/1-1/` for prior notes with this person; surface:
   - Unresolved action items from last meeting
   - Topics that recurred across sessions
   - Anything flagged in "What to Watch"

3. **Carry-forward check** — open the person's last THREE 1:1 notes and diff their Action Items: any unchecked item appearing in **two or more consecutive notes is a chronic loop**. List these separately with their first-seen date — "carried 3× since <date>" is the prep signal a single note can never show.

4. **Load active work** — read `work/Index.md` and relevant `work/active/**/*.md` notes; identify:
   - Projects this person is connected to
   - Blockers or open questions needing a decision or support
   - Work in progress worth giving visibility to

5. **Check North Star alignment** — read `brain/North Star.md`; flag:
   - Goals drifting or with no active work
   - Emerging focus that hasn't been written down yet

6. **Surface wins to share** — check `perf/Brag Doc.md` and the current quarter's brag note for completed work or milestones since the last 1:1 with this person

7. **Present the prep brief**:

   - **Who** — one-line reminder: role, relationship, standing dynamics
   - **Since Last Time** — unresolved action items, open "What to Watch" signals
   - **Chronic Loops** — items carried across 2+ consecutive 1:1s, oldest first
   - **Wins to Share** — completed work and milestones worth mentioning
   - **Things to Raise** — blockers needing a decision, projects needing visibility
   - **Questions to Ask** — based on vault gaps or unclear priorities
   - **Suggested Agenda** — rough order if there are 3+ items: wins → updates → asks → questions

## After the Meeting

Run `/om-capture-1on1` to file the notes into `work/1-1/` and update the person note.

## Important

- This is prep, not a script — surface the relevant context, let the user decide what to raise
- Flag sensitive interpersonal items but don't lead with them
- Keep the output scannable — the user is about to walk into a meeting
