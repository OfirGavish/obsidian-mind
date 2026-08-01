---
mode: 'agent'
description: 'Process all unread meeting notes in work/meetings/ — reads each file, classifies content, routes to the right vault notes, then clears the inbox.'
---

# Meeting Intake

Scans `work/meetings/` for unprocessed meeting exports and routes everything to the correct vault locations automatically.

## Usage

Drop any exported or raw meeting note into `work/meetings/` first. Then invoke this prompt. Naming convention: `YYYY-MM-DD <Topic or Person>.md`.

## Workflow

### 1. Scan the Inbox

List all `.md` files in `work/meetings/` excluding `README.md`. If empty, say so and stop.

For each file found, read the full content before doing anything else.

### 2. Identify Meeting Type

For each note, determine what kind of meeting it was:
- **1:1** — between two people; personal, career, feedback, or relationship content
- **Project meeting** — status update tied to a specific project
- **Team meeting** — standup, sprint planning, retrospective, or all-hands
- **Decision meeting** — primary purpose was to reach a decision
- **Mixed** — multiple types in one note (process each piece separately)

### 3. Search for Related Vault Context

Before routing, search vault for existing notes the content should attach to. Prefer appending to existing notes over creating new ones for small updates.

### 4. Route Content

| Content Type | Destination |
|---|---|
| 1:1 with a specific person | Create `work/1-1/<Person> YYYY-MM-DD.md` |
| Project status update | Append to relevant `work/active/<Project>.md` |
| New project not in vault | Create `work/active/<Project>.md` |
| Decision reached | Create Decision Record in `work/` + add to Decisions Log in `work/Index.md` |
| Action item / open task | Append as `- [ ]` to the relevant work note |
| Win or recognition | Add to `perf/Brag Doc.md` with link to source note |
| New person mentioned | Create stub in `org/people/<Name>.md` |
| Blocker identified | Append to relevant `work/active/` note |

### 5. Cross-Link

After routing all content:
- Every new note must link to at least one existing note
- If a person was mentioned, link to their `org/people/` note from the work note and vice versa

### 6. Clear the Inbox

After processing each file, confirm what was routed and ask: "Done processing `<filename>`. Delete from inbox?"

After all files are processed, present a summary of what was routed, notes created, action items captured, and any items needing judgment calls.

## Important

- **Never delete a file without confirmation** — always ask first
- If a note is ambiguous, ask before routing
- Prefer appending to existing notes over creating new ones for small updates
- For freeform capture (not meeting notes), use `/om-dump` instead
