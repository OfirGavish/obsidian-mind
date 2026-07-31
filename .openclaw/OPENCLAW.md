# Obsidian Mind — OpenClaw

This vault is built for AI coding agents with a full operating manual in `CLAUDE.md`.

**Read `CLAUDE.md` for all vault conventions** — structure, note types, linking rules, frontmatter schemas, indexes, and workflows.

## Hooks

The hook scripts in `.claude/scripts/` are agent-agnostic TypeScript, executed natively by Node via `--experimental-strip-types` — no build step, no runtime dependencies. OpenClaw hooks are configured in `.openclaw/settings.json`.

| Script | Purpose | OpenClaw event |
|--------|---------|----------------|
| `session-start.ts` | Inject vault context at startup | SessionStart |
| `classify-message.ts` | Classify messages, inject routing hints | BeforeAgent |
| `validate-write.ts` | Validate frontmatter and wikilinks | AfterTool (Write\|Edit) |
| `pre-compact.ts` | Back up transcript before compaction | PreCompress |
| `stop-checklist.ts` | End-of-session hygiene checklist | SessionEnd |

## Commands

Commands live in `.claude/commands/` — agent-agnostic markdown with YAML frontmatter. `brain/Skills.md` is the catalog.

## Memory

The vault's memory lives in `brain/` — `Memories.md`, `Patterns.md`, `Key Decisions.md`, `Gotchas.md`. When you learn something worth remembering, write it to the relevant `brain/` topic note with a wikilink to context.

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
