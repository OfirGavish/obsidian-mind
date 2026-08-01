---
mode: 'ask'
description: 'Prep for any meeting by topic — subject-forward briefing with open tasks, blockers, and brainstormed considerations the user may not have thought of yet.'
---

# Meeting Prep

Deep briefing on a subject before a meeting. Leads with the topic, not the people. Surfaces what's unresolved and brainstorms considerations, risks, and angles that may not have been raised yet.

## Usage

Provide the meeting topic in your message after invoking this prompt.
Examples: "Janus Project", "Legal sign-off workflow", "ComfyUI model server access"

## Workflow

1. **Search the vault** — find everything related to the topic, including semantically related content

2. **Load all related notes** — read every relevant result: work notes, decisions, incidents, person notes, team notes

3. **Build the subject picture** — synthesize what the vault knows:
   - Current status and recent changes
   - How this topic connects to other active work
   - Prior decisions that affect this topic
   - Outstanding items directly tied to this subject

4. **Surface open items** — collect all unresolved threads related to the topic:
   - Open checkboxes (`- [ ]`) from related notes
   - Documented blockers
   - Questions raised but not answered

5. **Brainstorm considerations** — go beyond what's in the vault:
   - What could go wrong that hasn't been written down yet
   - Dependencies on other teams, people, or systems not yet flagged
   - Decisions that will likely need to be made
   - Edge cases or failure modes worth raising
   - Things that have tripped up similar work before (check `brain/Gotchas.md`)
   - Stakeholders who aren't in the room but whose work this affects

6. **Note relevant people** — list who's involved and their role relative to this topic only

7. **Present the briefing**:

   ### Current State
   Concise synthesis of where things stand on this topic right now.

   ### Open Items
   All unresolved tasks, blockers, and unanswered questions — checklist format.

   ### Likely Decisions
   What will probably need to be decided or agreed in this meeting, with options if known.

   ### Considerations Worth Raising
   Brainstormed angles, risks, dependencies, and edge cases — especially things NOT already in the vault.

   ### People Involved
   Who's relevant to this topic and in what capacity.

   ### Questions to Ask
   Suggested questions based on gaps, risks, or unresolved threads.

## After the Meeting

Use `/om-dump` to capture outcomes, decisions, and new context.

## Important

- **Lead with the subject, not the people** — this is a topic briefing, not a relationship prep
- The Considerations section is the core value — push beyond what's already documented
- This is NOT for 1:1 prep — use `/om-prep-1on1` for person-focused meeting prep
