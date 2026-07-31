# Agent Support Extended — Copilot Cowork, Microsoft Scout, Copilot Studio

> **Supplement to `AGENTS.md`:** This file covers the three agent families added in a second integration pass (Copilot Cowork, Microsoft Scout, Microsoft Copilot Studio). It follows the same conventions as `AGENTS.md`. The tables here should be **merged into `AGENTS.md`** in a follow-up once the parallel agent session that owns `AGENTS.md` and `vault-manifest.json` has completed its work.
>
> Additionally, `vault-manifest.json`'s `infrastructure` array should gain `".cowork/**"`, `".scout/**"`, `".copilot-studio/**"`, and `"docs/agents-extended.md"` in that same follow-up — **do not edit `vault-manifest.json` yourself**.

---

## Agent / Config / Status

| Agent | Config file | Hook status |
|-------|-------------|-------------|
| Copilot Cowork | `.cowork/settings.json` | Shared hook scripts |
| Microsoft Scout | `.scout/settings.json` | Shared hook scripts |
| Microsoft Copilot Studio | `.copilot-studio/AGENT.md` | Instructions only — no hooks API |

---

## Script → Event Mapping

The five hook scripts and their lifecycle-event mapping across all supported agents (including those in `AGENTS.md`):

| Script | Purpose | Claude event | Codex event | Gemini event | Cowork event | Scout event |
|--------|---------|--------------|-------------|--------------|--------------|-------------|
| `session-start.ts` | Inject vault context at startup | `SessionStart` | `SessionStart` | `SessionStart` | `SessionStart` | `SessionStart` |
| `classify-message.ts` | Classify messages, inject routing hints | `UserPromptSubmit` | `UserPromptSubmit` | `BeforeAgent` | `UserPromptSubmit` ¹ | `UserPromptSubmit` ¹ |
| `validate-write.ts` | Validate frontmatter and wikilinks | `PostToolUse` | `PostToolUse` | `AfterTool` | `PostToolUse` ¹ | `PostToolUse` ¹ |
| `pre-compact.ts` | Back up transcript before compaction | `PreCompact` | — | `PreCompress` | `PreCompact` ¹ | `PreCompact` ¹ |
| `stop-checklist.ts` | Lightweight end-of-session checklist | `Stop` | `Stop` | `SessionEnd` | `Stop` ¹ | `Stop` ¹ |

¹ **Provisional.** Copilot Cowork and Microsoft Scout do not have fully published hook vocabularies at the time of writing. These names are borrowed from Claude Code's vocabulary and used as closest equivalents. If the agents use different canonical event names, update `settings.json` and the relevant `.md` files accordingly. The hook scripts themselves are event-agnostic and require no changes.

All scripts are in `.claude/scripts/` and executed via:
```
node --disable-warning=ExperimentalWarning --experimental-strip-types "<path>/.claude/scripts/<script>.ts"
```

---

## Setup Instructions

### Copilot Cowork

1. Ensure Node.js ≥ 22 is available in the environment (required for `--experimental-strip-types`).
2. Set the `COWORK_PROJECT_DIR` environment variable to the vault root, or rely on the `${COWORK_PROJECT_DIR:-.}` default (current working directory).
3. The hooks config is at `.cowork/settings.json` — point Copilot Cowork's hook loader at this file.
4. Read `.cowork/COWORK.md` for the hook table, concurrency safety rules, and MCP wiring.
5. Read `CLAUDE.md` for all vault conventions.

**Concurrency note:** Copilot Cowork supports multiple parallel delegated sessions. Always re-read a note before editing it, use `git mv` instead of delete, and never write to another session's in-progress `work/active/` note without coordination.

### Microsoft Scout

1. Ensure Node.js ≥ 22 is available in the environment.
2. Set the `SCOUT_PROJECT_DIR` environment variable to the vault root, or rely on the `${SCOUT_PROJECT_DIR:-.}` default.
3. The hooks config is at `.scout/settings.json` — point Scout's hook loader at this file. Timeouts are in **seconds** (matching Codex CLI convention).
4. Read `.scout/SCOUT.md` for the hook table and guidance on promoting research findings to `brain/`.
5. Read `CLAUDE.md` for all vault conventions.

**Research durability note:** Scout's session state and browsed content are ephemeral. Any durable finding must be written into a `brain/` topic note with at least one wikilink to context before the session ends.

### Microsoft Copilot Studio

Copilot Studio is a hosted, declarative agent builder with no filesystem hooks API.

1. Read `.copilot-studio/AGENT.md` — the full vault operating guide for Copilot Studio agents.
2. For knowledge source configuration, read `.copilot-studio/knowledge-config.md`.
3. **Preferred integration:** register the `om` MCP server (`.claude/scripts/om-mcp.mjs`) rather than ingesting static file snapshots. See `.copilot-studio/AGENT.md` for wiring details.
4. If direct file ingestion is used, index `brain/`, `org/`, `work/active/`, `work/archive/`, `perf/competencies/`, and `reference/`. Exclude `.obsidian/`, `.claude/`, and `memories/YYYY/MM/`.

---

## Manifest Follow-up

The `vault-manifest.json` `infrastructure` array should be updated in a follow-up commit (by whoever owns that file) to include:

```json
".cowork/**",
".scout/**",
".copilot-studio/**",
"docs/agents-extended.md"
```

**Do not edit `vault-manifest.json` as part of this integration** — it is owned by the parallel agent session working on the first wave of agent support.
