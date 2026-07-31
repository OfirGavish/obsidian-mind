# Obsidian Mind — Hermes

This vault is built for AI coding agents with a full operating manual in `CLAUDE.md`.

**Read `CLAUDE.md` for all vault conventions** — structure, note types, linking rules, frontmatter schemas, indexes, and workflows.

## Hooks

The hook scripts in `.claude/scripts/` are agent-agnostic TypeScript, executed natively by Node via `--experimental-strip-types` — no build step, no runtime dependencies. Hermes hooks are configured in `.hermes/settings.json`.

| Script | Purpose | Hermes event |
|--------|---------|--------------|
| `session-start.ts` | Inject vault context at startup | SessionStart |
| `classify-message.ts` | Classify messages, inject routing hints | UserPromptSubmit |
| `validate-write.ts` | Validate frontmatter and wikilinks | PostToolUse (Write\|Edit) |
| `pre-compact.ts` | Back up transcript before compaction | PreCompact |
| `stop-checklist.ts` | End-of-session hygiene checklist | Stop |

## Commands

Commands live in `.claude/commands/` — agent-agnostic markdown with YAML frontmatter. `brain/Skills.md` is the catalog.

## Memory

> [!important] Hermes skill memory is ephemeral — `brain/` is the record.
>
> Hermes's internal skill memory is session-level only. Anything you want to persist across sessions **must** be written to the relevant `brain/` topic note (`brain/Patterns.md`, `brain/Gotchas.md`, `brain/Key Decisions.md`) with a wikilink to context. Hermes skills are convenient shortcuts for the current session; `brain/` is the durable source of truth.

The vault's memory lives in `brain/` — `Memories.md`, `Patterns.md`, `Key Decisions.md`, `Gotchas.md`. When you learn something worth remembering, write it there.

## Reaching this vault from another repo

The `om` MCP server (`.claude/scripts/om-mcp.mjs`) exposes this vault over MCP so sessions running in other repositories can search it, read notes, follow the graph, and record durable lessons back into it.

Register it in the consuming project's MCP config:

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

Both the MCP registration and a short instruction in the consuming project's agent doc are required. See `CLAUDE.md` for full wiring details.
