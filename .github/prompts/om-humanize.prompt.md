---
mode: 'edit'
description: 'Voice-calibrated editing — makes Copilot-drafted text sound like you wrote it, not like AI wrote it.'
---

Edit a note to match your writing voice. This is voice calibration, not pattern removal — learn HOW you write, not just what to avoid.

## Usage

Reference the file to edit in your message, e.g.: "humanize `work/active/Project Alpha.md`"

## Workflow

### 1. Load Voice Samples

Read 2-3 recent notes you actually wrote or heavily edited to calibrate voice:
- `brain/North Star.md` — how you write about yourself
- The most recent `work/1-1/*.md` note — natural conversational voice
- Any brain note with your authentic writing style

Extract voice fingerprint: sentence length, punctuation habits, how you open sections, how you qualify statements, ratio of direct-to-hedged language, use of dashes and fragments.

### 2. Read Target Note

Read the note specified by the user. Detect context from frontmatter and folder:
- **`work/1-1/`** → conversational, direct, uses "I", okay to be informal
- **`perf/` review content** → corporate-confident but human, evidence-based, respect charcount
- **`work/incidents/`** → precise, factual, timeline-oriented, no filler
- **`brain/`** → terse shorthand, fragments okay
- **Default** → colleague-to-colleague, like explaining something in a 1:1

### 3. Edit In-Place

Rewrite the note's content to match your voice.

**Anti-patterns (kill these):**
- "Notably", "significantly", "demonstrates", "leveraged", "facilitated"
- "It's worth noting that..." — just note it
- "This showcases..." — just describe what happened
- Hedge stacking: "potentially", "arguably", "it could be said that"
- Empty transitions: "Moving forward", "In terms of", "With regard to"
- Passive voice where active is natural: "was identified" → "found"

**Preserve untouched:**
- All YAML frontmatter
- `[[wikilinks]]` and `[[link|aliases]]`
- `![[embeds]]`
- Callout blocks (`> [!type]`)
- Block IDs (`^block-id`)
- Code blocks, tables, checkboxes

### 4. Summarize Changes

Present a brief summary:
- **Tone shift**: what changed overall
- **Key rewrites**: 2-3 examples of before/after
- **Preserved**: confirm what was left untouched

## Important

- This is NOT "remove AI words from a list." It's "make this sound like the same person who wrote the other notes in this vault."
- If the note is already well-written, say so and make minimal changes.
- Respect the context — a peer review needs to stay professional even after humanizing.
