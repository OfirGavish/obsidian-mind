# om-capture Routing Reference

Lookup table for proactive capture. Search first, then update the canonical destination instead of creating duplicates.

> Keep this file in sync with the `.claude/skills/om-capture/` ports in `.openclaw/skills/` and `.hermes/skills/`.

| Signal / situation | Destination | Template / structure | Notes |
|---|---|---|---|
| Decision with rejected alternative | `work/active/` decision note + `brain/Key Decisions.md` + `work/Index.md` Decisions Log | `templates/Decision Record.md` | Use the decision template for the durable record; add rationale, rejected option, consequences, and backlinks. |
| Decision reversal / supersession | Original decision note + new decision note if needed + `brain/Key Decisions.md` | `templates/Decision Record.md` | Mark the original status appropriately, link the replacement, and correction-sweep restatements. |
| Project status change / milestone / blocker | Existing project note in `work/active/` | `templates/Work Note.md` for new project notes; otherwise update the living note | Keep volatile status single-sourced here; brag entries link back to this note. |
| Project-specific constraint or discovery | Existing project note in `work/active/` | `templates/Work Note.md` for a new note; otherwise append to the existing note | Promote to `brain/Patterns.md` too only when the lesson generalizes beyond the project. |
| Non-obvious breakage / root cause | `brain/Gotchas.md` or a linked domain note beside it | Append to living note; split if size/topic requires | Use `(unverified)` or `(inferred)` markers when root cause was not directly confirmed. |
| Reusable constraint / invariant / behavior | `brain/Patterns.md` or a linked domain note beside it | Append to living note; split if size/topic requires | Prefer `brain/` for cross-cutting lessons; use `reference/` only for broader architecture docs. |
| Architecture discussion that ended in a durable design choice | Decision note in `work/active/` and possibly `reference/` | `templates/Decision Record.md` for the choice; `reference/` note only if explanatory architecture doc is needed | Reuse the hook vocabulary: architecture can resolve into either a decision or a reusable reference note. |
| Incident / outage / RCA | `work/incidents/` and related project note | No repository template file; follow the incident schema from `[[CLAUDE]]` | Usually prefer `/om-incident-capture` when the source is a Slack reconstruction. |
| 1:1 content with durable follow-through | `work/1-1/` note + related person note | No repository template file; follow the 1:1 schema from `[[CLAUDE]]` | Only auto-capture when the content is durable, not every conversational aside. |
| New person or changed relationship | `org/people/<Name>.md` + `org/People & Context.md` when needed | No repository template file; use the existing person-note structure from `[[CLAUDE]]` | Capture role, relationship, or working-style shifts that future sessions need. |
| Team-level org context | `org/teams/<Team>.md` | No repository template file; use the team-note structure from `[[CLAUDE]]` | Only when the information is team-scoped rather than person-scoped. |
| Praise / win / measurable impact | `perf/Brag Doc.md` plus an evidence note if needed | Append to living note; evidence usually lives in an existing work/incident/person note | Prefer evidence links over standalone brag prose. |
| Review-ready synthesis requested by the user | `perf/<cycle>/` | `templates/Review Template.md` | Not a default auto-capture destination; use when the user asks for review material. |
| New competency definition | `perf/competencies/` | `templates/Competency Note.md` | Rare for auto-capture; only create when the vault is missing a competency node the user wants to track. |
| Scratch reasoning before capture | `thinking/` | `templates/Thinking Note.md` | Scratchpad only. Promote the durable output elsewhere and do not treat the thinking note as the final capture. |

## Reminders

- Never write to `memories/YYYY/MM/` directly; that tree is MCP-only.
- Every new note needs at least one `[[wikilink]]` and one inbound link from an index or related note.
- Date-stamp volatile facts, mark inference, and split living notes rather than trimming them.
