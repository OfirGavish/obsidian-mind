# Obsidian Mind — Copilot Cowork

This vault is built for [Claude Code](https://claude.ai/code) with a full operating manual in `CLAUDE.md`.

**Read `CLAUDE.md` for all vault conventions** — structure, note types, linking rules, frontmatter schemas, indexes, and workflows. Most of the content is agent-agnostic.

## Hooks

Hook scripts live in `.claude/scripts/` and are agent-agnostic TypeScript executed natively by Node via `--experimental-strip-types` — no build step, no runtime dependencies.

Copilot Cowork hooks are configured in `.cowork/settings.json`.

| Script | Purpose | Cowork event | Notes |
|--------|---------|--------------|-------|
| `session-start.ts` | Inject vault context at startup | `SessionStart` | matcher: `startup\|resume` |
| `classify-message.ts` | Classify messages, inject routing hints | `UserPromptSubmit` | provisional — closest equivalent to Claude's `UserPromptSubmit` |
| `validate-write.ts` | Validate frontmatter and wikilinks | `PostToolUse` | matcher: `Write\|Edit`; provisional — use closest Cowork tool-completion event |
| `pre-compact.ts` | Back up transcript before compaction | `PreCompact` | provisional — use closest Cowork context-compression event |
| `stop-checklist.ts` | Lightweight end-of-session checklist | `Stop` | provisional — use closest Cowork session-end event |

> **Event name note:** Copilot Cowork's public hook vocabulary is not fully documented at the time of writing. The event names `UserPromptSubmit`, `PostToolUse`, `PreCompact`, and `Stop` are borrowed from Claude Code's vocabulary and used provisionally. If Cowork uses different canonical names for these lifecycle points, substitute them and update this table. The scripts themselves are event-agnostic — only the JSON keys in `settings.json` need changing.

## Commands

Commands live in `.claude/commands/` — agent-agnostic markdown with YAML frontmatter. `brain/Skills.md` is the catalog. Invoke as `/om-standup`, `/om-dump`, etc.

## Memory

Durable knowledge lives in `brain/` topic notes (`Memories.md`, `Patterns.md`, `Key Decisions.md`, `Gotchas.md`). When you learn something worth remembering, write it to the relevant topic note with a wikilink to context. The `brain/` notes are git-tracked and Obsidian-browsable — they are the record, not session state.

## Reaching this vault from another repo

The `om` MCP server (`.claude/scripts/om-mcp.mjs`) exposes this vault over MCP. Register it in the consuming project's `.mcp.json`:

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

Both the server registration **and** a short instruction section in the consuming project's agent doc are required — see `CLAUDE.md` for details on why both steps matter.

## Concurrency Safety

Copilot Cowork can run multiple delegated sessions in parallel. To avoid data races in the vault:

- **Never rewrite another session's in-progress note.** If a file is under active edit by another Cowork session, wait or coordinate before writing.
- **Re-read a note before editing it.** Always fetch the latest content before appending or modifying — a stale read leads to lost edits.
- **Use `git mv` over delete.** Moving or renaming files with `git mv` preserves history and avoids silent data loss. Never `rm` a vault note without explicit user confirmation.
- **Do not move `work/active/` notes** without first confirming no other session is writing to them. The `work/active/` folder is a shared live workspace.
- **Prefer atomic edits.** Write complete note content in one operation rather than multiple partial writes that could interleave with another session.
