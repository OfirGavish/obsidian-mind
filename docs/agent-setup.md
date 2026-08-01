# Agent Setup Guide

A longer-form companion to the [README's "Tell Your Agent To Set It Up" section](../README.md#-tell-your-agent-to-set-it-up). Covers the quick comparison table, full copy-paste setup prompts, and troubleshooting.

---

## Quick Comparison

| Agent | Config file | Tier | Native entry point |
|-------|-------------|------|--------------------|
| Claude Code | `.claude/settings.json` | Full | `CLAUDE.md` |
| Codex CLI | `.codex/hooks.json` | Hooks + commands | `AGENTS.md` (read natively) |
| Gemini CLI | `.gemini/settings.json` | Hooks + commands | `GEMINI.md` (read natively) |
| OpenClaw | `.openclaw/settings.json` | Hooks + commands ² | `.openclaw/OPENCLAW.md` |
| Hermes | `.hermes/settings.json` | Hooks + commands ² | `.hermes/HERMES.md` |
| Copilot Cowork | `.cowork/settings.json` | Hooks + commands | `.cowork/COWORK.md` |
| Microsoft Scout | `.scout/settings.json` | Hooks + commands | `.scout/SCOUT.md` |
| VS Code Copilot | `.github/copilot-instructions.md`, `.github/prompts/`, `.github/chatmodes/`, `.vscode/tasks.json` | Near-full (manual lifecycle) | `.github/copilot-instructions.md` |
| GitHub App / Copilot cloud agent | `.github/copilot-instructions.md` | Instructions only | `.github/copilot-instructions.md` |
| GitHub Copilot CLI | `.github/copilot-instructions.md` | Instructions only | `.github/copilot-instructions.md` |
| Microsoft Copilot Studio | `.copilot-studio/AGENT.md` | Instructions only | `.copilot-studio/AGENT.md` |

**Tier vocabulary:**
- **Full** — hooks, commands, subagents, and memory all wired and confirmed working
- **Near-full (manual lifecycle)** — commands and instructions work; hooks must be triggered manually (no hooks API)
- **Hooks + commands** — hooks and commands wired; subagent support partial or provisional
- **Instructions only** — no hooks API, no native command invocation

² **Provisional.** Command directories (`.openclaw/commands/`, `.openclaw/agents/`, `.hermes/commands/`, `.hermes/agents/`) were created under best-effort conventions — verify discovery paths and frontmatter schemas against your agent's published documentation. See `.openclaw/OPENCLAW.md` and `.hermes/HERMES.md` for details.

All hook-capable agents share the same five scripts in `.claude/scripts/`:

| Script | Purpose |
|--------|---------|
| `session-start.ts` | Inject vault context at session start |
| `classify-message.ts` | Classify messages and inject routing hints |
| `validate-write.ts` | Validate frontmatter and wikilinks after writing `.md` files |
| `pre-compact.ts` | Back up session transcript before context compaction |
| `stop-checklist.ts` | End-of-session hygiene checklist |

---

## Setup Prompts

### Generic (any agent)

Paste this into a fresh session in the vault directory. Works regardless of which agent you are using.

```
Read AGENTS.md and CLAUDE.md in this vault. Identify which agent you are, find your config file (AGENTS.md lists them all), verify that your hooks are wired to the five scripts in .claude/scripts/, and report what is missing or misconfigured. If a config file for your agent already exists, verify it. If not, explain what would need to be created and what the correct event names are for your agent's hook vocabulary.
```

### Hook-capable agents (Codex, Gemini, OpenClaw, Hermes, Cowork, Scout)

```
Read AGENTS.md, CLAUDE.md, and your agent's config file (e.g. .codex/hooks.json, .gemini/settings.json, .openclaw/settings.json, .hermes/settings.json, .cowork/settings.json, or .scout/settings.json). Set the environment variable <AGENT>_PROJECT_DIR (e.g. HERMES_PROJECT_DIR, COWORK_PROJECT_DIR) to the absolute path of this vault. Verify that all five hook scripts in .claude/scripts/ resolve from that path: session-start.ts, classify-message.ts, validate-write.ts, pre-compact.ts, stop-checklist.ts. Report any that are missing or have incorrect paths. Note: for Copilot Cowork and Microsoft Scout, hook event names are provisional — check .cowork/COWORK.md or .scout/SCOUT.md for current names and update settings.json if your agent's vocabulary differs.
```

### OpenClaw (extended)

```
Read .openclaw/OPENCLAW.md and CLAUDE.md. Verify hooks are configured in .openclaw/settings.json. Then verify the command and subagent directories:
- .openclaw/commands/ should contain 19 om-*.md files matching .claude/commands/
- .openclaw/agents/ should contain 9 agent .md files matching .claude/agents/
Confirm that your version of OpenClaw discovers commands from .openclaw/commands/ and subagents from .openclaw/agents/. If the discovery path differs, report what path your agent expects. If the frontmatter schema differs from the Claude Code schema (name, description, tools, model, maxTurns, skills for agents; description for commands), report the expected schema so the files can be adapted. Report OPENCLAW_PROJECT_DIR status and whether all five hook scripts resolve.
```

### Hermes (extended)

```
Read .hermes/HERMES.md and CLAUDE.md. Verify hooks are configured in .hermes/settings.json. Then verify the command and subagent directories:
- .hermes/commands/ should contain 19 om-*.md files with bare-name invocation (om-standup, not /om-standup)
- .hermes/agents/ should contain 9 agent .md files matching .claude/agents/
Confirm that your version of Hermes discovers commands from .hermes/commands/ using bare-name prompts (e.g. typing "om-standup" without a slash). If the discovery path or invocation style differs, report what your agent expects. If the frontmatter schema differs, report the expected schema. Note that Hermes's internal skill memory is session-level only — durable knowledge must be written to brain/ topic notes. Report HERMES_PROJECT_DIR status and whether all five hook scripts resolve.
```

### VS Code Copilot

```
Read .github/copilot-instructions.md — this is your vault operating guide. Also confirm that .github/instructions/vault.instructions.md is present and will be applied to .md files (it has applyTo: "**/*.md" in its frontmatter).

Verify the following VS Code Copilot capabilities:
1. Prompt files: confirm that .github/prompts/ contains om-*.prompt.md files and that they appear as /om-standup, /om-dump, etc. in the Copilot Chat slash-command menu.
2. Chat modes: confirm that .github/chatmodes/ contains *.chatmode.md files and that they appear in the Copilot Chat mode picker.
3. VS Code Tasks: confirm that .vscode/tasks.json is present and contains tasks for session-start, stop-checklist, validate-write, classify-message, and pre-compact. Confirm that "om: session start" has runOn: "folderOpen" so it runs automatically when the vault folder opens in VS Code.

Since there is no hooks API, all hook scripts must be triggered manually via Tasks (Terminal → Run Task) or the command line:
  node --disable-warning=ExperimentalWarning --experimental-strip-types .claude/scripts/session-start.ts
  node --disable-warning=ExperimentalWarning --experimental-strip-types .claude/scripts/stop-checklist.ts

Report whether all three capabilities are wired and summarise the vault conventions you found.
```

> [!NOTE]
> The `om: session start` task runs automatically on folder open (`runOn: folderOpen`). To disable it, use **Terminal → Manage Automatic Tasks in Folder** in VS Code (or `Tasks: Manage Automatic Tasks` in the Command Palette). **Write validation (`om: validate write`) does NOT fire silently after every note edit** — you must run it manually. A user who believes frontmatter is being validated when it is not is worse off than one who knows to run the task.

### GitHub App / Copilot cloud agent, GitHub Copilot CLI

```
Read .github/copilot-instructions.md — this is your vault operating guide. There is no hooks API; the hook scripts in .claude/scripts/ must be run manually. To run manually:
  node --disable-warning=ExperimentalWarning --experimental-strip-types .claude/scripts/session-start.ts
  node --disable-warning=ExperimentalWarning --experimental-strip-types .claude/scripts/stop-checklist.ts
Report whether the instructions file is present and summarise the vault conventions you found.
```

### Copilot Studio

```
Read .copilot-studio/AGENT.md and .copilot-studio/knowledge-config.md. For vault access, register the om MCP server (.claude/scripts/om-mcp.mjs) rather than ingesting static file snapshots — this gives live search and graph traversal. If direct file ingestion is required, index brain/, org/, work/active/, work/archive/, perf/competencies/, and reference/. Exclude .obsidian/, .claude/, and memories/YYYY/MM/. Report the MCP wiring status and any missing configuration.
```

### Bring this vault to another repo

```
I want to reach my Obsidian Mind vault from this repository. The vault is at [/absolute/path/to/vault]. Please: (1) register the om MCP server by running: claude mcp add --scope user om node "/absolute/path/to/vault/.claude/scripts/om-mcp.mjs" (2) add a consultation section to this project's CLAUDE.md (or equivalent agent instructions file) following the template in the README's "🧠 Reach Your Vault From Any Repo" section. Both steps are required — the server wired without the repo-side instruction makes zero vault calls.
```

Cross-reference: see the README's [🧠 Reach Your Vault From Any Repo](../README.md#-reach-your-vault-from-any-repo) section for the full consultation template and the rationale behind the two-step requirement.

---

## Troubleshooting

### Hooks not firing

1. **Check Node version:** run `node --version`. You need ≥ 22.6.0 for `--experimental-strip-types` to work.
2. **Check the config file:** open your agent's config file (e.g. `.openclaw/settings.json`) and confirm the script paths resolve. The path variable (`${HERMES_PROJECT_DIR:-.}`, etc.) must point to the vault root.
3. **Run a script manually** to see raw output:
   ```bash
   node --disable-warning=ExperimentalWarning --experimental-strip-types .claude/scripts/session-start.ts
   ```
4. **Check the event name:** your agent's config must use the correct lifecycle event names. See the per-agent docs below.

### Node version requirement

Hook scripts use `--experimental-strip-types`, available in Node 22.6+ (Aug 2024). It became the default in Node 23.6+ and remains stable in 24 LTS.

To check: `node --version`. To install: [nodejs.org](https://nodejs.org) (use the current LTS).

If you cannot upgrade Node, the scripts can be compiled to plain JavaScript first:
```bash
npx tsx .claude/scripts/session-start.ts   # one-off via npx
```

### Environment variable not set

Each hook-capable agent uses a path variable to find the vault root:

| Agent | Variable |
|-------|---------|
| Codex CLI | `CODEX_PROJECT_DIR` |
| Gemini CLI | `GEMINI_PROJECT_DIR` |
| OpenClaw | `OPENCLAW_PROJECT_DIR` |
| Hermes | `HERMES_PROJECT_DIR` |
| Copilot Cowork | `COWORK_PROJECT_DIR` |
| Microsoft Scout | `SCOUT_PROJECT_DIR` |

All default to `.` (current working directory) if unset. If you run your agent from outside the vault directory, set the variable:

```bash
export HERMES_PROJECT_DIR="/absolute/path/to/vault"
```

Or set it permanently in your shell's rc file.

### Provisional event names (Copilot Cowork and Microsoft Scout)

The hook event names in `.cowork/settings.json` and `.scout/settings.json` are **provisional** — borrowed from Claude Code's hook vocabulary because Copilot Cowork and Microsoft Scout had not published their full hook vocabularies at the time these configs were written.

If your version of those agents uses different event names:
1. Open `.cowork/settings.json` or `.scout/settings.json`
2. Replace the event names (e.g. `SessionStart`, `UserPromptSubmit`, `PostToolUse`, `PreCompact`, `Stop`) with the canonical names from your agent's documentation
3. The hook scripts themselves (`session-start.ts`, etc.) are event-agnostic and require no changes

Once the agents publish their vocabularies, this file will be updated. Check `.cowork/COWORK.md` and `.scout/SCOUT.md` for any updates.

### Copilot Studio: MCP vs. static file ingestion

Copilot Studio can ingest the vault either via the `om` MCP server (live, graph-aware) or as static file snapshots. **MCP is strongly preferred** — it gives live search, graph traversal, and cross-repo memory scoping. Static ingestion gets stale as the vault grows.

If you must use static ingestion, the recommended index roots are:

```
brain/
org/
work/active/
work/archive/
perf/competencies/
reference/
```

**Exclude**: `.obsidian/`, `.claude/`, `memories/YYYY/MM/` (cross-repo memories carry their own scope; indexing them directly bypasses it).

See `.copilot-studio/knowledge-config.md` for the full ingestion configuration.

---

## Per-Agent Docs

| Agent | Config file | Agent-specific doc |
|-------|-------------|-------------------|
| Claude Code | `.claude/settings.json` | `CLAUDE.md` (full operating manual) |
| Codex CLI | `.codex/hooks.json` | `AGENTS.md` |
| Gemini CLI | `.gemini/settings.json` | `GEMINI.md` |
| OpenClaw | `.openclaw/settings.json` | `.openclaw/OPENCLAW.md`, `.openclaw/commands/` ², `.openclaw/agents/` ² |
| Hermes | `.hermes/settings.json` | `.hermes/HERMES.md`, `.hermes/commands/` ², `.hermes/agents/` ² |
| Copilot Cowork | `.cowork/settings.json` | `.cowork/COWORK.md` |
| Microsoft Scout | `.scout/settings.json` | `.scout/SCOUT.md` |
| GitHub Copilot family | `.github/copilot-instructions.md` | `.github/copilot-instructions.md` |
| Copilot Studio | `.copilot-studio/AGENT.md` | `.copilot-studio/AGENT.md`, `.copilot-studio/knowledge-config.md` |

**External docs:**
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Codex CLI](https://github.com/openai/codex)
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [GitHub Copilot](https://docs.github.com/en/copilot)
- [Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/)
