# Obsidian Mind

This vault is built for [Claude Code](https://claude.ai/code) with a full operating manual in `CLAUDE.md`.

**Read `CLAUDE.md` for all vault conventions** — structure, note types, linking rules, frontmatter schemas, indexes, and workflows. Most of the content is agent-agnostic.

## Support Tiers

- **Full** — hooks, commands, subagents, and memory all wired and confirmed working
- **Near-full (manual lifecycle)** — commands and instructions work; hooks must be triggered manually (no hooks API)
- **Hooks + commands** — hooks and commands wired; subagent support partial or absent
- **Instructions only** — no hooks API, no native command invocation

## Hooks

The hook scripts in `.claude/scripts/` are agent-agnostic TypeScript and shell, executed natively by Node via `--experimental-strip-types` — no build step, no runtime dependencies, no Claude SDK. Hook configs are provided for five agents:

| Agent | Config | Tier |
|-------|--------|------|
| Claude Code | `.claude/settings.json` | Full |
| Codex CLI | `.codex/hooks.json` | Hooks + commands |
| Gemini CLI | `.gemini/settings.json` | Hooks + commands |
| OpenClaw | `.openclaw/settings.json` | Hooks + commands ² |
| Hermes | `.hermes/settings.json` | Hooks + commands ² |
| VS Code Copilot | `.github/copilot-instructions.md`, `.github/prompts/`, `.github/chatmodes/`, `.vscode/tasks.json` | Near-full (manual lifecycle) |
| GitHub App / Copilot cloud agent | `.github/copilot-instructions.md` | Instructions only |
| GitHub Copilot CLI | `.github/copilot-instructions.md` | Instructions only |
| Copilot Cowork | `.cowork/settings.json` | Hooks + commands |
| Microsoft Scout | `.scout/settings.json` | Hooks + commands |
| Microsoft Copilot Studio | `.copilot-studio/AGENT.md` | Instructions only |

² **Provisional commands + subagents.** Command directories (`.openclaw/commands/`, `.openclaw/agents/`, `.hermes/commands/`, `.hermes/agents/`) have been created and the content ported from `.claude/commands/` and `.claude/agents/`. The discovery paths and frontmatter schemas are best-effort — OpenClaw and Hermes do not have fully published command/subagent documentation at the time of writing. If your version of these agents uses different discovery paths or schemas, update the directories accordingly. Once confirmed working, tier upgrades to **Full**.

| Script | Purpose | Claude event | Codex event | Gemini event | OpenClaw event | Hermes event | Cowork event | Scout event |
|--------|---------|--------------|-------------|--------------|----------------|--------------|--------------|-------------|
| `session-start.ts` | Inject vault context at startup | SessionStart | SessionStart | SessionStart | SessionStart | SessionStart | SessionStart | SessionStart |
| `classify-message.ts` | Classify messages, inject routing hints | UserPromptSubmit | UserPromptSubmit | BeforeAgent | BeforeAgent | UserPromptSubmit | UserPromptSubmit ¹ | UserPromptSubmit ¹ |
| `validate-write.ts` | Validate frontmatter and wikilinks | PostToolUse | PostToolUse | AfterTool | AfterTool | PostToolUse | PostToolUse ¹ | PostToolUse ¹ |
| `pre-compact.ts` | Back up transcript before compaction | PreCompact | — | PreCompress | PreCompress | PreCompact | PreCompact ¹ | PreCompact ¹ |
| `stop-checklist.ts` | End-of-session hygiene checklist | — | Stop | SessionEnd | SessionEnd | Stop | Stop ¹ | Stop ¹ |

¹ **Provisional.** Copilot Cowork and Microsoft Scout do not have fully published hook vocabularies at the time of writing. These names are borrowed from Claude Code's vocabulary as closest equivalents. If the agents use different canonical event names, update `settings.json` and the relevant `.md` files accordingly.

## Commands

The canonical source of commands is `.claude/commands/` — agent-agnostic markdown with YAML frontmatter. `brain/Skills.md` is the catalog.

- **Claude Code / Gemini CLI**: invoke as `/om-standup`, `/om-dump`, etc.
- **OpenClaw**: invoke as `/om-standup`, `/om-dump`, etc. Native command files are in `.openclaw/commands/`. ²
- **Codex CLI**: type the command name as a regular prompt without the `/` prefix (e.g. `om-standup`). The agent will find and execute the command file.
- **Hermes**: type the command name as a regular prompt without the `/` prefix (e.g. `om-standup`). Native command files are in `.hermes/commands/`. ²
- **VS Code Copilot**: real `/om-*` slash invocation via prompt files in `.github/prompts/`. Invoke as `/om-standup`, `/om-dump`, etc. directly in Copilot Chat.
- **GitHub App / Copilot cloud agent, GitHub Copilot CLI**: commands are not auto-invoked; read `brain/Skills.md` for the catalog and run scripts manually.

The `.openclaw/commands/` and `.hermes/commands/` directories mirror `.claude/commands/` verbatim (OpenClaw) and with slash-prefix removed from Usage sections (Hermes). These must be kept in sync with `.claude/commands/` manually — see `.openclaw/OPENCLAW.md` and `.hermes/HERMES.md` for the sync procedure.

## Skills

The `om-capture` skill teaches agents to proactively spot durable knowledge mid-conversation and offer to record it — rather than waiting for a pull-based command like `/om-dump`. **Confirm-before-write is the default**; autonomous capture is opt-in.

The skill is ported to every agent directory:

| Agent | Port location |
|-------|--------------|
| Claude Code | `.claude/skills/om-capture/` |
| Codex CLI | `.agents/skills/om-capture/` ¹ |
| Gemini CLI | `.gemini/skills/om-capture/` ¹ |
| OpenClaw | `.openclaw/skills/om-capture/` ² |
| Hermes | `.hermes/skills/om-capture/` ² |
| VS Code Copilot | `.github/chatmodes/om-capture.chatmode.md` |
| Copilot Cowork | `.cowork/skills/om-capture/` ¹ |
| Microsoft Scout | `.scout/skills/om-capture/` ¹ |
| Microsoft Copilot Studio | `.copilot-studio/AGENT.md` § *Proactive Capture* |

¹ Discovery path is provisional — see the skill file's own note.
² Discovery path and schema are best-effort — see `.openclaw/OPENCLAW.md` and `.hermes/HERMES.md` for details.

Scout and Copilot Studio have the weakest durability story: Scout's research output is ephemeral (no `stop-checklist.ts` nudge at session end), and Copilot Studio has no lifecycle hooks at all. The Scout port carries an explicit ephemerality warning; the Copilot Studio port is a documented section in `AGENT.md` rather than an executable skill file.

## Maintenance Utilities

`.claude/scripts/verify-ports.ts` is a **maintenance script** — not a lifecycle hook. It discovers ported files by reading sync-with declarations in each file, compares each port's substantive body against its canonical `.claude/` source, and exits non-zero when drift is found. Run it to check for stale ports before merging skill changes:

```bash
node --disable-warning=ExperimentalWarning --experimental-strip-types .claude/scripts/verify-ports.ts
```

This script is documented here for visibility; it is **not** added to any agent's hook config and does not run automatically.

## Memory

The vault's memory lives in `brain/` — `Memories.md`, `Patterns.md`, `Key Decisions.md`, `Gotchas.md`. These are plain markdown files that any agent can read and write. When you learn something worth remembering, write it to the relevant `brain/` topic note with a wikilink to context.

The `~/.claude/` auto-loaded memory index is Claude Code-specific — skip that section in `CLAUDE.md`. The vault-side `brain/` notes are the source of truth.

## Reaching this vault from another repo

The `om` MCP server (`.claude/scripts/om-mcp.mjs`) exposes this vault over MCP, so a session running in a **different repository** can search it, read notes, follow the graph, and record durable lessons back into it. It speaks plain MCP over stdio, so any MCP-capable agent can register it — nothing about it is Claude Code-specific.

Register it in the *consuming* project's MCP config, pointing at this vault's absolute path, then add a short section to that project's own agent doc telling it the vault exists. **Both steps are required**: measured, a session with the server wired but no repo-side instruction made zero vault calls, because a prohibition propagates into a session reliably while a positive "go look" does not.

Do not register the raw `qmd` server in a consuming repo — it searches every note directly, so the repo matches against memories written for unrelated projects. Applying each memory's declared scope on top of the index is what `om` adds. Full details in `CLAUDE.md`.

For a step-by-step wiring guide — registration, the repo-side instruction template, per-agent setup, and memory-scoping guidance — see [`docs/mcp-integration.md`](docs/mcp-integration.md).

## Subagents

The canonical source of subagents is `.claude/agents/` — 9 subagent definitions handling isolated tasks (brag spotting, vault auditing, cross-linking, etc.). The prompt content is agent-agnostic markdown.

- **Claude Code**: discovers agents in `.claude/agents/`. Each file's YAML frontmatter (`name`, `description`, `tools`, `model`, `maxTurns`, `skills`) governs invocation.
- **Codex CLI**: as of the [Skills launch (Dec 2025)](https://developers.openai.com/codex/changelog), Codex discovers skills at `.agents/skills/<name>/SKILL.md` (directory-per-skill; frontmatter requires `name` and `description`). Mirror each `.claude/agents/*.md` into a `SKILL.md`, keeping the prompt body intact. See the [Codex Skills docs](https://developers.openai.com/codex/skills) for the full schema.
- **Gemini CLI**: agents live in `.gemini/agents/`. Copy the files and adapt the YAML frontmatter fields to Gemini's schema.
- **OpenClaw**: native subagent files are in `.openclaw/agents/`, mirroring `.claude/agents/` with the same frontmatter schema. ² Discovery path and schema are provisional — verify against your agent version.
- **Hermes**: native subagent files are in `.hermes/agents/`, mirroring `.claude/agents/` with the same frontmatter schema. ² Discovery path and schema are provisional — verify against your agent version.
- **VS Code Copilot**: chat modes in `.github/chatmodes/` are the subagent equivalents. **Important behavioural difference**: chat modes run in the **same context window** as the calling conversation, unlike Claude Code subagents which run in isolated context windows. They share conversation history and are coordinated sequentially rather than in parallel. See `.github/copilot-instructions.md` for details.
- **Copilot-family (GitHub App, Copilot CLI), Copilot Studio**: no native subagent invocation. The prompt content in `.claude/agents/` is readable and can be invoked manually.

## What's Claude Code-specific

Only the `~/.claude/` auto-memory loader is truly Claude Code-specific. Everything else — hooks, commands, subagent prompts, vault memory — is portable.

## Setup

**Codex CLI**: Reads `AGENTS.md` natively. For direct access to `CLAUDE.md`, add to `~/.codex/config.toml`:
```toml
project_doc_fallback_filenames = ["CLAUDE.md"]
```

**Gemini CLI**: Reads `GEMINI.md` natively. For direct access to `CLAUDE.md`, add to `~/.gemini/settings.json`:
```json
{ "context": { "fileName": ["GEMINI.md", "CLAUDE.md"] } }
```

**OpenClaw**: Hooks are configured in `.openclaw/settings.json` using the shared scripts. Commands are in `.openclaw/commands/` (slash-prefix invocation, e.g. `/om-standup`). Subagents are in `.openclaw/agents/`. Read `.openclaw/OPENCLAW.md` for vault conventions, command catalog, and sync instructions. Read `CLAUDE.md` for full vault details. Note: command and subagent discovery paths are provisional — verify against your OpenClaw version's documentation.

**Hermes**: Hooks are configured in `.hermes/settings.json` using the shared scripts. Commands are in `.hermes/commands/` (bare-name invocation, e.g. `om-standup` without the `/` prefix). Subagents are in `.hermes/agents/`. Read `.hermes/HERMES.md` for vault conventions, command catalog, and sync instructions. Read `CLAUDE.md` for full vault details. Note: Hermes's internal skill memory is session-level only — durable learnings must be written to `brain/` topic notes. Command and subagent discovery paths are provisional — verify against your Hermes version's documentation.

**VS Code Copilot**: Read `.github/copilot-instructions.md` for vault conventions. Also auto-applies `.github/instructions/vault.instructions.md` to every `.md` file. Prompt files in `.github/prompts/` provide real `/om-*` slash invocation in Copilot Chat — invoke as `/om-standup`, `/om-dump`, etc. Chat modes in `.github/chatmodes/` are subagent-equivalent personas (switch in the Chat mode picker; note they run in the same context window, not in isolation). VS Code Tasks in `.vscode/tasks.json` wire each hook script to the command palette. The `om: session start` task has `runOn: folderOpen` and runs automatically when the vault folder opens in VS Code — to disable it, use **Terminal → Manage Automatic Tasks in Folder**. There is no hooks API; all other hook scripts (write validation, classify-message, pre-compact, stop-checklist) must be triggered manually via Tasks or the command line:
```
node --disable-warning=ExperimentalWarning --experimental-strip-types .claude/scripts/<script>.ts
```

**GitHub App / Copilot cloud agent, GitHub Copilot CLI**: Read `.github/copilot-instructions.md` for vault conventions. There is no hooks API; run scripts in `.claude/scripts/` manually or wire them as VS Code Tasks:
```
node --disable-warning=ExperimentalWarning --experimental-strip-types .claude/scripts/<script>.ts
```

**Copilot Cowork**: Hooks are configured in `.cowork/settings.json` using the shared scripts. Read `.cowork/COWORK.md` for the hook table and vault conventions. Read `CLAUDE.md` for full details. Note: Copilot Cowork supports multiple parallel delegated sessions — always re-read a note before editing it, use `git mv` instead of delete, and never write to another session's in-progress `work/active/` note without coordination.

**Microsoft Scout**: Hooks are configured in `.scout/settings.json` using the shared scripts. Read `.scout/SCOUT.md` for the hook table and guidance on promoting research findings to `brain/`. Read `CLAUDE.md` for full details. Note: Scout's session state and browsed content are ephemeral — any durable finding must be written into a `brain/` topic note with at least one wikilink to context before the session ends.

**Microsoft Copilot Studio**: Read `.copilot-studio/AGENT.md` — the full vault operating guide for Copilot Studio agents. For knowledge source configuration, read `.copilot-studio/knowledge-config.md`. Preferred integration: register the `om` MCP server (`.claude/scripts/om-mcp.mjs`) rather than ingesting static file snapshots. There is no filesystem hooks API.

**Other agents** (Cursor, Windsurf): Read `AGENTS.md` for vault conventions. Hook support varies by agent.

For more information, see the [README](README.md). For copy-paste setup prompts, a per-agent comparison table, and troubleshooting, see [`docs/agent-setup.md`](docs/agent-setup.md).
