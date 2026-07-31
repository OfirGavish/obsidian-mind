# Obsidian Mind — Microsoft Scout

This vault is built for [Claude Code](https://claude.ai/code) with a full operating manual in `CLAUDE.md`.

**Read `CLAUDE.md` for all vault conventions** — structure, note types, linking rules, frontmatter schemas, indexes, and workflows. Most of the content is agent-agnostic.

## Hooks

Hook scripts live in `.claude/scripts/` and are agent-agnostic TypeScript executed natively by Node via `--experimental-strip-types` — no build step, no runtime dependencies.

Microsoft Scout hooks are configured in `.scout/settings.json`. Timeouts are in **seconds** (matching Codex CLI convention).

| Script | Purpose | Scout event | Notes |
|--------|---------|-------------|-------|
| `session-start.ts` | Inject vault context at startup | `SessionStart` | matcher: `startup\|resume` |
| `classify-message.ts` | Classify messages, inject routing hints | `UserPromptSubmit` | provisional — closest equivalent to Claude's `UserPromptSubmit` |
| `validate-write.ts` | Validate frontmatter and wikilinks | `PostToolUse` | matcher: `Write\|Edit`; provisional — use closest Scout tool-completion event |
| `pre-compact.ts` | Back up transcript before compaction | `PreCompact` | provisional — use closest Scout context-compression event |
| `stop-checklist.ts` | Lightweight end-of-session checklist | `Stop` | provisional — use closest Scout session-end event |

> **Event name note:** Microsoft Scout's public hook vocabulary is not fully documented at the time of writing. The event names `UserPromptSubmit`, `PostToolUse`, `PreCompact`, and `Stop` are borrowed from Claude Code's vocabulary and used provisionally. If Scout uses different canonical names (e.g. `BeforeQuery`, `AfterAction`, `PreSummarise`, `SessionEnd`), substitute them in `settings.json` and update this table. The scripts themselves are event-agnostic.

## Commands

Commands live in `.claude/commands/` — agent-agnostic markdown with YAML frontmatter. `brain/Skills.md` is the catalog.

## Research Output Is Ephemeral — Promote Findings to `brain/`

Scout is designed for autonomous research and web-browsing tasks. Its session state, visited pages, and intermediate conclusions are **ephemeral** — they do not survive the session.

**Any durable finding must be written into a `brain/` topic note before the session ends:**

- New patterns or best practices → `brain/Patterns.md` or a domain note under `brain/`
- Pitfalls or failure modes discovered → `brain/Gotchas.md`
- Architectural or strategic decisions informed by research → `brain/Key Decisions.md`

**Rules for promoting research findings:**

1. Every promoted fact must include at least one `[[wikilink]]` to context (the work note, source URL referenced inline, or related vault note).
2. Volatile facts (version numbers, benchmark figures, org structure, tool maturity) must be date-stamped: *"as of YYYY-MM-DD"*.
3. Anything not verified against a primary source (code, official doc, the person) carries an explicit `(unverified)` or `(inferred)` marker.
4. Do **not** restate the same fact in multiple notes — one authoritative location, all other notes link to it.

Research that is not promoted to `brain/` is lost. The vault cannot benefit from Scout's work unless findings are written out.

## Memory

Durable knowledge lives in `brain/` topic notes. The `memories/YYYY/MM/` tree is written only by other-repo sessions via the `om` MCP server — do not write there directly.

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

See `CLAUDE.md` for full wiring details.
