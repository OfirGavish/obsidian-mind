# Copilot Studio — Knowledge Source Configuration

This guide covers how to configure Copilot Studio knowledge sources against this Obsidian vault. Direct file ingestion creates a static snapshot — for live vault access, prefer the `om` MCP server instead (see `.copilot-studio/AGENT.md`).

---

## Safe Folders to Index

The following folders contain stable, user-authored content suitable for knowledge source ingestion:

| Folder | Content | Notes |
|--------|---------|-------|
| `brain/` | Agent operational knowledge — patterns, gotchas, key decisions, memories index | Primary knowledge base |
| `org/` | People and team notes | Useful for org context |
| `work/active/` | Current in-progress project notes | Changes frequently — re-index regularly |
| `work/archive/` | Completed project notes | Stable; safe for less-frequent re-index |
| `perf/competencies/` | Competency definitions | Stable reference content |
| `reference/` | Codebase knowledge and architecture maps | Stable reference content |

---

## Folders to Exclude

Do **not** index the following:

| Folder / Pattern | Reason |
|-----------------|--------|
| `.obsidian/` | Obsidian vault configuration — binary and JSON config files, not user content |
| `.claude/` | Hook scripts, commands, and the `om` MCP server — infrastructure, not knowledge |
| `.codex/`, `.gemini/`, `.cowork/`, `.scout/`, `.copilot-studio/` | Agent configuration files — infrastructure |
| `memories/YYYY/MM/` | Written exclusively by other-repo sessions via the `om` MCP server. Has its own scope system — indexing the raw files bypasses scope declarations and will surface memories intended only for specific projects. |
| `thinking/` | Ephemeral scratchpads and reasoning drafts — not final knowledge |
| `templates/` | Note templates with `{{placeholder}}` syntax — not substantive content |
| `.git/` | Version control internals |

---

## `memories/YYYY/MM/` — Do Not Index Directly

The `memories/` tree is a cross-repo memory store. Each note declares its reach via frontmatter:

```yaml
scope: project        # reaches only named projects
scope: platform       # reaches any repo on a named platform
scope: general        # reaches everywhere
```

Indexing `memories/` as a flat folder bypasses this scope system entirely, causing memories intended for one project to appear in responses for unrelated projects. Use the `om` MCP server's `recall` tool instead — it applies scope filtering automatically.

---

## Re-indexing Frequency

| Folder | Suggested re-index cadence |
|--------|--------------------------|
| `brain/` | Weekly or on-demand after substantial sessions |
| `work/active/` | Daily (content changes frequently) |
| `work/archive/` | Monthly (rarely changes after archival) |
| `org/` | Weekly |
| `perf/competencies/` | On-demand (changes infrequently) |
| `reference/` | On-demand |

---

## Preferred Alternative: `om` MCP Server

Rather than ingesting static snapshots, register the `om` MCP server for live vault access:

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

The `om` server provides:
- `search` — semantic + keyword search over exposed notes
- `recall` — durable lessons scoped to the calling context
- `expand` — a note's graph neighbourhood (links out and backlinks)
- `remember` — record a lesson back into the vault

This approach always reflects the current state of the vault and respects memory scoping — no stale snapshots, no scope violations.
