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

Native command files live in `.openclaw/commands/` — invoke as `/om-standup`, `/om-dump`, etc. `brain/Skills.md` is the catalog.

> [!note] Provisional
> The discovery path (`.openclaw/commands/`) and frontmatter schema are best-effort — OpenClaw does not have a fully published command discovery specification at the time of writing. If your version of OpenClaw discovers commands from a different path or expects different frontmatter, move or adapt the files accordingly.

The command files in `.openclaw/commands/` are **copies of `.claude/commands/`** and must be kept in sync manually. When updating a command in `.claude/commands/`, apply the same change to `.openclaw/commands/`. The two directories are identical in content — the only reason for the separate copy is agent-local discovery.

## Subagents

Native subagent files live in `.openclaw/agents/` — 9 definitions for isolated tasks (brag spotting, vault auditing, cross-linking, etc.). These mirror `.claude/agents/` exactly.

> [!note] Provisional
> The discovery path (`.openclaw/agents/`) and frontmatter schema (`name`, `description`, `tools`, `model`, `maxTurns`, `skills`) are best-effort. Verify against your OpenClaw version's subagent documentation. If the schema differs, adapt the frontmatter in each `.openclaw/agents/*.md` file; the prompt body content is agent-agnostic and needs no changes.

The subagent files in `.openclaw/agents/` must be kept in sync with `.claude/agents/` manually. When updating a subagent in `.claude/agents/`, apply the same change to `.openclaw/agents/`.

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
