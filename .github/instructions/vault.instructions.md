---
applyTo: "**/*.md"
---

## Frontmatter Schema

Every `.md` note must include at minimum:

```yaml
---
date: YYYY-MM-DD
description: ~150-character summary of this note
tags: [tag1, tag2]
---
```

Work notes additionally require `status` (active / completed / archived) and `quarter` (e.g. `Q1-2026`).  
Incidents additionally require `ticket`, `severity`, and `role`.  
Preserve all existing frontmatter fields when editing a note — never remove fields.

## Mandatory Wikilink Rule

**Every note must link to at least one existing note. A note without links is a bug.**

Use `[[Note Title]]` wikilink syntax. When creating a note, add outbound links first. Ensure at least one other note links back to the new note (update an index or related note).

## Placement Rules

| Content | Folder |
|---------|--------|
| Active work, decisions, review prep | `work/active/` |
| Completed work | `work/archive/YYYY/` |
| Incident docs | `work/incidents/` |
| 1:1 meeting notes | `work/1-1/` |
| Performance / review briefs | `perf/<cycle>/` |
| PR evidence | `perf/evidence/` |
| Competency definitions | `perf/competencies/` |
| People | `org/people/` |
| Teams | `org/teams/` |
| Agent operational context | `brain/` |
| Codebase knowledge | `reference/` |
| Drafts and reasoning | `thinking/` |

Do not create user notes at the vault root.

## Size Rule

When a note approaches ~25 KB, **split** it into atomic notes — never trim or delete content to meet a size target. Move content verbatim; leave a one-liner index entry with a link in the original note.

## Inference Marker Requirement

Anything not verified against a primary source (code, repo, primary doc, the person) must carry an explicit marker:

- `(TBC)` — to be confirmed
- `(unverified)` — not yet checked against source
- `(inferred)` — logical conclusion, not directly stated

Never state an inference as fact without one of these markers.
