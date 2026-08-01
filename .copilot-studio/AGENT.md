# Obsidian Mind — Copilot Studio Agent

Copilot Studio is a hosted, declarative agent builder with **no filesystem hooks API**. This file is the sole operating guide for any Copilot Studio agent configured against this vault. There is no `settings.json` to wire — read these instructions instead.

---

## Vault Folder Structure

| Folder | Purpose |
|--------|---------|
| `Home.md` | Vault entry point — embedded Base views, quick links. Open first. |
| `work/active/` | Current projects only (1–3 files). Move here when starting, archive when done. |
| `work/archive/YYYY/` | Completed work organised by year. |
| `work/incidents/` | Incident docs (main note + RCA + deep dive). |
| `work/1-1/` | 1:1 meeting notes — `<Person> YYYY-MM-DD.md`. |
| `work/meetings/` | Meeting-notes inbox — staging area, processed by `/om-intake`. |
| `perf/` | Performance framework and brag doc. |
| `perf/brag/` | Quarterly brag notes — one per quarter. |
| `perf/competencies/` | Atomic competency notes. |
| `perf/evidence/` | PR deep scans and data extracts for reviews. |
| `perf/<cycle>/` | Review-cycle briefs and artefacts. |
| `brain/` | Agent operational knowledge — `Memories.md`, `Key Decisions.md`, `Patterns.md`, `Gotchas.md`. |
| `memories/YYYY/MM/` | Cross-repo agent memory — written only by other-repo sessions via the `om` MCP server. |
| `org/people/` | Atomic person notes — one per person. |
| `org/teams/` | Team notes. |
| `reference/` | Codebase knowledge and architecture maps. |
| `thinking/` | Scratchpad for drafts and reasoning. |
| `templates/` | Obsidian templates. |
| `.claude/commands/` | Slash commands — agent-agnostic, one `.md` per command. |
| `.claude/scripts/` | Hook scripts and the `om` MCP server. |

---

## Required Frontmatter

Every note must include YAML frontmatter with at minimum:

```yaml
---
date: YYYY-MM-DD
description: <~150-character summary of the note>
tags: [<type-tag>, ...]
---
```

Work notes also require:

```yaml
status: active        # or completed, archived
quarter: Q1-2026
```

Incident notes also require:

```yaml
ticket: TICKET-123
severity: high        # or medium, low
role: incident-lead   # or incident-responder, observer
```

---

## Mandatory Wikilink Rule

**A note without links is a bug.** Every new note must link to at least one existing note using `[[Note Title]]` syntax. Add wikilinks immediately after writing content — do not defer.

Link syntax:
- `[[Note Title]]` — standard wikilink
- `[[Note Title|display text]]` — aliased link
- `[[Note Title#Heading]]` — deep link to section
- `![[Note Title]]` — embed content inline

---

## Placement Rules

| Content type | Location |
|-------------|---------|
| Active project work | `work/active/` |
| Completed project work | `work/archive/YYYY/` |
| Incident documentation | `work/incidents/` |
| 1:1 meeting notes | `work/1-1/` |
| Performance content | `perf/` (cycle subfolder for review briefs) |
| PR evidence | `perf/evidence/` |
| Competency definitions | `perf/competencies/` |
| Person notes | `org/people/` |
| Team notes | `org/teams/` |
| Agent operational context | `brain/` |
| Codebase knowledge | `reference/` |
| Drafts and reasoning | `thinking/` |
| Vault root | `Home.md`, `CLAUDE.md`, `AGENTS.md`, `vault-manifest.json` only — no user notes at root |

---

## Size Rule

When a note crosses ~25 KB, **split it — do not trim**. Split into atomic domain notes that link to each other. Never delete content; move it verbatim. Notes whose name contains "Archive" are exempt.

---

## Memory System

- **Durable knowledge** → `brain/` topic notes (`Patterns.md`, `Gotchas.md`, `Key Decisions.md`). Write there with a wikilink to context.
- **`memories/YYYY/MM/`** → written only by other-repo sessions via the `om` MCP server. Do not write there directly.
- Never create memory files anywhere other than `brain/` topic notes when working inside this vault.

---

## Session Workflow

### Starting a session

1. Read `Home.md` — vault entry point with embedded dashboards.
2. Read `brain/North Star.md` — ground suggestions in current goals.
3. Check `work/Index.md` — see active projects and recent notes.
4. Scan `brain/Memories.md` — index of memory topics.

### Ending a session

1. Archive completed projects: `git mv work/active/<note> work/archive/YYYY/<note>`, set `status: completed`.
2. Update `work/Index.md` if new notes or decisions were created.
3. Update the relevant `brain/` topic note with key learnings.
4. Update `org/People & Context.md` if org knowledge changed.
5. Update `perf/Brag Doc.md` if wins or impact were achieved.
6. Verify all new notes link to at least one existing note.

---

## Write-Correctness Laws

1. **Single-source status.** A project's volatile status lives in exactly one place — its note's frontmatter and top status line. Every other note links to it and never restates it.
2. **Correction-sweep protocol.** When a fact is corrected, grep the vault for every restatement and fix them all in the same pass. A correction callout on top of a note whose body still says the wrong thing is not a correction.
3. **Mark inference.** Anything not verified against a primary source carries an explicit `(TBC)`, `(unverified)`, or `(inferred)` marker. Never state inference bare.
4. **Date-stamp volatile facts.** Counts, versions, org structure, tool maturity: write "as of YYYY-MM-DD" so staleness is self-evident.
5. **No counts in instruction files.** Hardcoded counts in `CLAUDE.md` or `AGENTS.md` rot silently — describe, don't count.

---

## Surfacing Vault Knowledge via the `om` MCP Server

Copilot Studio has no direct filesystem access. Instead of duplicating vault content into Copilot Studio knowledge sources (which creates a stale copy), configure the `om` MCP server as an integration:

- The `om` server (`.claude/scripts/om-mcp.mjs`) exposes vault notes, memories, and graph relationships over MCP.
- Register it in your integration's MCP config pointing at the vault's absolute path.
- Use the `search`, `recall`, and `expand` tools it exposes rather than ingesting raw files.
- See `.copilot-studio/knowledge-config.md` for guidance on which folders are safe to index if direct file ingestion is preferred.

---

## Proactive Capture

Copilot Studio has **no lifecycle hooks** — there is no `stop-checklist.ts` nudge, and no `UserPromptSubmit` classifier fires automatically. Any knowledge that surfaces mid-conversation is lost unless you capture it yourself before the session ends.

**Capture mid-conversation, not just at the end.** When you notice a durable signal, surface it and ask before writing:

> "This sounds like a durable gotcha — want me to record it in `[[Gotchas]]`?"
> "We just made a decision and rejected an alternative — want me to add a Decision Record and a line in `[[Key Decisions]]`?"
> "That looks brag-worthy — want me to add it to `[[Brag Doc]]` and link the evidence note?"

### What to capture

| Signal | Destination |
|--------|-------------|
| Decision + rejected alternative | Decision Record in `work/active/` + `brain/Key Decisions.md` |
| Non-obvious breakage / root cause | `brain/Gotchas.md` |
| Reusable constraint / invariant | `brain/Patterns.md` |
| Praise / shipped work / measurable impact | `perf/Brag Doc.md` |
| New person or changed relationship | `org/people/<Name>.md` |
| Project status change | Active project note in `work/active/` |

### Durability test

Before proposing a write, ask: *would this help a future session with no memory of this conversation?* Capture it only if yes. Transient debugging chatter, unverified speculation, and duplicate status noise do not pass the test.

### Confirm before writing (default)

Always ask for confirmation before writing. Only skip confirmation when the user has explicitly opted into autonomous capture. If you do write autonomously, summarize every change immediately.

### Write-correctness rules

- Every new note needs at least one `[[wikilink]]` and one inbound link.
- Keep live project status single-sourced in the project note; all other notes link to it.
- Mark facts not verified against a primary source with `(unverified)` or `(inferred)`.
- Date-stamp volatile facts (versions, counts, org structure, tool maturity).
- Never write to `memories/YYYY/MM/` directly — that tree is written by the `om` MCP server.

---

## Hard Rules

- **Never touch `.obsidian/`** — vault configuration is managed by Obsidian and must not be modified.
- **Preserve frontmatter** — when editing an existing note, always keep its frontmatter intact.
- **Use `git mv`, not delete** — moving or renaming files preserves history. Never `rm` a vault note without explicit user confirmation.
- **Do not rewrite git history** — commits are permanent; work forwards, not backwards.
