# Obsidian Mind — Copilot Vault Operating Guide

This guide covers VS Code Copilot, GitHub App (Copilot cloud agent), and GitHub Copilot CLI.

**Primary reference: `CLAUDE.md`** — it is the full operating manual. This file summarises the essential rules for Copilot-family agents.

---

## Vault Folder Structure

| Folder | Purpose | Key Files |
|--------|---------|-----------|
| `Home.md` | **Vault entry point** — embedded Base views, quick links | Open this first |
| `vault-manifest.json` | **Template metadata** — version, infrastructure vs user content boundaries, frontmatter schemas, version fingerprints | Used by `/om-vault-upgrade` for migration |
| `CHANGELOG.md` | **Version history** — tracks template releases with what changed | Reference for upgrade paths |
| `bases/` | **All Bases centralized** — dynamic views for navigation | `Work Dashboard`, `Recently Touched`, `Incidents`, `People Directory`, `1-1 History`, `Review Evidence`, `Competency Map`, `Templates` |
| `work/` | Work notes index | `Index.md` (detailed MOC) |
| `work/active/` | **Current projects only** (1–3 files) | Move here when starting, move to archive when done |
| `work/archive/YYYY/` | Completed work organized by year | Grows over time |
| `work/incidents/` | Incident docs (main note + RCA + deep dive + drafts) | Per-incident grouping |
| `work/1-1/` | 1:1 meeting notes (accumulate weekly) | Named `<Person> YYYY-MM-DD.md` |
| `work/meetings/` | **Meeting notes inbox** — staging area for raw exports | Drop files, run `/om-intake` |
| `perf/` | Performance framework, brag doc | `Brag Doc.md` (index) |
| `perf/brag/` | Quarterly brag notes | One per quarter, e.g. `Q1 2025.md` |
| `perf/competencies/` | Atomic competency notes (link targets) | One note per competency |
| `perf/evidence/` | PR deep scans, data extracts for reviews | Named `<Person> PRs - <Period>.md` |
| `perf/<cycle>/` | Review cycle briefs + artifacts | Review briefs (private, manager, peer) |
| `brain/` | Agent operational knowledge | `Memories.md`, `Key Decisions.md`, `Patterns.md`, `Gotchas.md`, `Skills.md`, `North Star.md` |
| `memories/YYYY/MM/` | **Cross-repo agent memory** — durable lessons recorded over MCP by sessions in *other* repositories | Browse via `bases/Memories.base`; never edit by hand |
| `org/` | Organizational knowledge index | `People & Context.md` (MOC) |
| `org/people/` | Atomic person notes | One note per person |
| `org/teams/` | Team notes as graph nodes | One note per team |
| `reference/` | Codebase knowledge, architecture maps | Flow docs, architecture docs |
| `thinking/` | Scratchpad for drafts and reasoning | Named `YYYY-MM-DD-topic.md` |
| `templates/` | Obsidian templates | `Work Note.md`, `Decision Record.md`, etc. |
| `.claude/commands/` | Slash commands (catalog in `brain/Skills.md`) | One `.md` per command |
| `.claude/scripts/` | Hook scripts + MCP server | Agent-agnostic TypeScript |

---

## Required Frontmatter

Every note needs at minimum:

```yaml
---
date: YYYY-MM-DD
description: ~150-character summary of the note
tags: [tag1, tag2]
---
```

Work notes also require:

```yaml
status: active   # or: completed, archived
quarter: Q1-2026
```

Incidents additionally need `ticket`, `severity`, and `role`.

---

## Wikilink Rule

**Every note must link to at least one existing note. A note without links is a bug.**

Always add wikilinks before finishing a note. Use `[[Note Title]]` syntax. Every new note must have at least one inbound link from an index or related note.

---

## Placement Rules

Place new notes in the correct folder:

- Active work notes, decisions, peer review prep → `work/active/`
- Completed work notes → `work/archive/YYYY/`
- Incident docs → `work/incidents/`
- 1:1 meeting notes → `work/1-1/`
- Performance content → `perf/` (cycle subfolder for review briefs)
- PR evidence → `perf/evidence/`
- Competency definitions → `perf/competencies/`
- People → `org/people/`
- Teams → `org/teams/`
- Agent operational context → `brain/`
- Codebase knowledge → `reference/`
- Drafts and reasoning → `thinking/`
- Vault root: only `Home.md`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `vault-manifest.json`, `CHANGELOG.md`, `CONTRIBUTING.md`, `README.md`, `LICENSE`, `.gitignore`. No user notes at root.

---

## Memory System

**Durable knowledge goes in `brain/` topic notes** — `Memories.md`, `Patterns.md`, `Key Decisions.md`, `Gotchas.md`. When you learn something worth remembering, find or create the relevant topic note and add it there with a wikilink to context.

`memories/YYYY/MM/` is written exclusively by other-repo sessions via the `om` MCP server. Never create or edit files there manually.

---

## Session Workflow

### Starting a session

1. Read `Home.md` — vault entry point with embedded dashboards
2. Read `brain/North Star.md` — ground suggestions in current goals
3. Check `work/Index.md` — see active projects and recent notes
4. Scan `brain/Memories.md` — index of memory topics, then read relevant topic notes

### Ending a session

1. **Archive completed projects**: `git mv` from `work/active/` to `work/archive/YYYY/`, update `status: completed`
2. Update `work/Index.md` if new notes or decisions were created
3. Update the relevant brain topic note (`brain/Key Decisions.md`, `brain/Patterns.md`, `brain/Gotchas.md`) with key learnings
4. Update `org/People & Context.md` if org knowledge changed
5. Update `perf/Brag Doc.md` if wins or impact were achieved
6. Verify all new notes link to at least one existing note

---

## VS Code Copilot: Prompt Files, Chat Modes, and Tasks

VS Code Copilot has no lifecycle hooks API — scripts cannot fire automatically the way they do for Claude Code. However, three mechanisms recover most of the practical capability:

> **Schema note (as of 2025):** The `mode`, `description`, and `tools` frontmatter fields in `.github/prompts/*.prompt.md` and `.github/chatmodes/*.chatmode.md` are based on VS Code 1.9x documentation. Verify against [VS Code Copilot customization docs](https://code.visualstudio.com/docs/copilot/copilot-customization) if fields are not recognized — the schema has evolved and these docs may have drifted.

### 1. Prompt Files — `/om-*` Commands

Prompt files live in `.github/prompts/*.prompt.md` and provide real `/name` slash invocation in Copilot Chat. Invoke them by typing `/om-standup`, `/om-dump`, etc. in the Chat panel.

Available prompts (ported from `.claude/commands/`):

| Prompt | Invocation | Purpose |
|--------|-----------|---------|
| `om-standup.prompt.md` | `/om-standup` | Morning kickoff — vault context, active work, priorities |
| `om-dump.prompt.md` | `/om-dump` | Freeform capture — routes anything to the right vault notes |
| `om-weekly.prompt.md` | `/om-weekly` | Weekly synthesis across sessions |
| `om-wrap-up.prompt.md` | `/om-wrap-up` | Full session review before ending |
| `om-tidy.prompt.md` | `/om-tidy` | Self-maintenance pass — acts on hygiene flags |
| `om-vault-audit.prompt.md` | `/om-vault-audit` | Deep structural audit of the vault |
| `om-capture-1on1.prompt.md` | `/om-capture-1on1` | Capture a 1:1 meeting into vault notes |
| `om-humanize.prompt.md` | `/om-humanize` | Voice-calibrate AI-drafted text |
| `om-incident-capture.prompt.md` | `/om-incident-capture` | Capture an incident from Slack |
| `om-intake.prompt.md` | `/om-intake` | Process meeting inbox (`work/meetings/`) |
| `om-meeting.prompt.md` | `/om-meeting` | Prep for any meeting by topic |
| `om-peer-scan.prompt.md` | `/om-peer-scan` | Deep scan a peer's GitHub PRs |
| `om-prep-1on1.prompt.md` | `/om-prep-1on1` | Prep for an upcoming 1:1 |
| `om-project-archive.prompt.md` | `/om-project-archive` | Archive a completed project |
| `om-review-brief.prompt.md` | `/om-review-brief` | Generate a performance review brief |
| `om-review-peer.prompt.md` | `/om-review-peer` | Write a peer review |
| `om-self-review.prompt.md` | `/om-self-review` | Write your self-assessment |
| `om-slack-scan.prompt.md` | `/om-slack-scan` | Deep scan Slack for evidence |
| `om-vault-upgrade.prompt.md` | `/om-vault-upgrade` | Migrate content from another Obsidian vault |

**Sync caveat:** These prompt files are ports of `.claude/commands/`. When the canonical commands in `.claude/commands/` change, the corresponding `.github/prompts/` files must be updated to match. The `.claude/commands/` files are always the source of truth.

### 2. Chat Modes — Subagent Equivalents

Chat modes live in `.github/chatmodes/*.chatmode.md` and are the closest VS Code Copilot analogue to Claude Code subagents. Switch to a chat mode in the Copilot Chat mode picker (the dropdown at the top of the Chat panel).

**Important behavioral difference:** Claude Code subagents run in isolated context windows. VS Code Copilot chat modes run in the **same context window** as the calling conversation. They share conversation history and are coordinated sequentially rather than in parallel. Commands that reference subagents (e.g., `/om-wrap-up` → `brag-spotter`) should switch modes manually.

Available chat modes (ported from `.claude/agents/`):

| Chat Mode | Purpose |
|-----------|---------|
| `brag-spotter` | Find uncaptured wins and competency gaps in the brag doc |
| `context-loader` | Load all vault context about a person, project, or concept |
| `cross-linker` | Find missing wikilinks and strengthen the vault graph |
| `people-profiler` | Bulk create or update person notes from Slack profiles |
| `review-fact-checker` | Verify every claim in a review draft against vault sources |
| `review-prep` | Aggregate performance review material for a given period |
| `slack-archaeologist` | Deep reconstruction of Slack conversations |
| `vault-librarian` | Vault maintenance: orphans, broken links, frontmatter validation |
| `vault-migrator` | Classify and migrate content from another Obsidian vault |

### 3. VS Code Tasks — Hook Script Execution

The `.vscode/tasks.json` wires each hook script as a VS Code Task. Run via **Terminal → Run Task** or **Ctrl+Shift+P → Tasks: Run Task**.

| Task Label | Script | When to Run |
|-----------|--------|-------------|
| `om: session start` | `session-start.ts` | **Runs automatically on folder open** (see note below). Also run manually at the start of a session. |
| `om: validate write` | `validate-write.ts` | After Copilot creates or edits a `.md` file — validates frontmatter and wikilinks |
| `om: classify message` | `classify-message.ts` | Before submitting a message — classifies content and injects routing hints |
| `om: pre-compact` | `pre-compact.ts` | Before clearing context — backs up transcript to `thinking/session-logs/` |
| `om: stop checklist` | `stop-checklist.ts` | At the end of a session — hygiene checklist |

**Folder-open auto-task:** `om: session start` has `runOn: "folderOpen"` set, so it runs automatically when you open the vault folder in VS Code. This approximates the `SessionStart` hook. If you don't want this automatic behaviour, disable it via **Terminal → Manage Automatic Tasks in Folder** (or `Tasks: Manage Automatic Tasks` in the Command Palette).

**Honest framing:** Hooks are **one keystroke instead of automatic**. Write validation (`om: validate write`) does NOT fire silently after every note edit — you must run it manually. A user who believes frontmatter is being validated when it is not is worse off than one who knows to run the task.

### Hooks Note

**Copilot has no lifecycle hooks API.** The scripts in `.claude/scripts/` can be run manually or via the VS Code Tasks above:

```
node --disable-warning=ExperimentalWarning --experimental-strip-types .claude/scripts/<script>.ts
```

| Script | Purpose |
|--------|---------|
| `session-start.ts` | Inject vault context at startup |
| `classify-message.ts` | Classify messages, inject routing hints |
| `validate-write.ts` | Validate frontmatter and wikilinks after writing a `.md` file |
| `pre-compact.ts` | Back up transcript before compaction |
| `stop-checklist.ts` | End-of-session hygiene checklist |

---

## Reaching the Vault from Another Repo

Register `.claude/scripts/om-mcp.mjs` in the consuming project's `.mcp.json`:

```json
{
  "mcpServers": {
    "om": {
      "command": "node",
      "args": ["<absolute path to vault>/.claude/scripts/om-mcp.mjs"]
    }
  }
}
```

**Also add a short section to that project's own agent doc** telling it the vault exists — a session with the server wired but no instruction made zero vault calls. Both steps are required. See `CLAUDE.md` for full wiring details.

---

## Write-Correctness Laws

1. **Single-source status.** A project's volatile status lives in exactly ONE place — its note's frontmatter + top status line. Every other note links to it and never restates it.
2. **Correction-sweep protocol.** When a fact is corrected, grep the vault for every restatement and fix them all in the same pass. A correction callout on top of a note whose body still says the wrong thing is NOT a correction.
3. **Mark inference.** Anything not verified against source carries an explicit `(TBC)` / `(unverified)` / `(inferred)` marker. Never state inference bare.
4. **Date-stamp volatile facts.** Counts, versions, org structure, tool maturity: write "as of YYYY-MM-DD" so staleness is self-evident.
5. **No counts in instruction files.** Hardcoded counts in instruction files rot silently — describe, don't count.

---

## Rules

- **Never modify `.obsidian/`** — vault config is untouched.
- **Preserve existing frontmatter** when editing notes.
- **Use `git mv`**, never delete, when reorganizing notes. Zero data loss.
- **Size rule**: when a note approaches ~25 KB, split it into atomic notes — never trim content to meet a size target.

---

## Follow-up for AGENTS.md

The following notes are for the parallel session that owns `AGENTS.md`. This section is scaffolding — fold it in and remove it once the shared docs are updated.

### Tier classification

VS Code Copilot now reaches **Near-full (manual lifecycle)**:
- Prompt files provide real `/om-*` slash invocation (command parity with Claude Code)
- Chat modes provide subagent-equivalent specialised personas (same context window, not isolated)
- VS Code Tasks provide one-click hook execution with a folder-open auto-task for `session-start`
- What remains manual: write validation, classify-message, pre-compact, stop-checklist all require a task run rather than firing automatically

### Table updates (AGENTS.md)

The agent setup table should update VS Code Copilot's entry to reflect:
- Config: `.github/copilot-instructions.md`, `.github/prompts/`, `.github/chatmodes/`, `.vscode/tasks.json`
- Status/Tier: Near-full (manual lifecycle) — hooks are one keystroke, not automatic
- Commands: Real `/om-*` invocation via prompt files
- Subagents: Chat modes (same context window, not isolated subagent sessions)

### Vault structure table

Add rows for:
- `.github/prompts/` | Copilot prompt files — one per `om-*` command, real `/name` invocation in Chat | Keep in sync with `.claude/commands/`
- `.github/chatmodes/` | Copilot chat modes — subagent-equivalent personas | Keep in sync with `.claude/agents/`
- `.vscode/tasks.json` | VS Code Tasks for hook script execution + folder-open auto-task | —
