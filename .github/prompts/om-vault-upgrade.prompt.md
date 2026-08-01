---
mode: 'agent'
description: 'Import and migrate content from an existing Obsidian vault into this obsidian-mind instance. Works with older obsidian-mind versions and arbitrary Obsidian vaults.'
---

# Vault Upgrade

Import and migrate content from an existing Obsidian vault into this obsidian-mind instance.

**When to use**: After downloading or cloning the latest obsidian-mind template, to pull in your existing vault content. Also works for migrating any Obsidian vault into the obsidian-mind structure.

## Usage

Provide the path to the source vault in your message.
Examples:
- "Upgrade from ~/my-old-vault"
- "Upgrade from ~/my-old-vault --dry-run"

> **Note for VS Code Copilot:** This command uses the **Vault Migrator** chat mode for classification and execution. Switch to that mode for the heavy lifting, then return here to review the plan and results. Chat modes in VS Code Copilot share the same context window rather than isolated sessions.

## Workflow

### 1. Validate & Detect

1. Parse the source vault path. Verify it exists and contains `.md` files.
2. Check for `vault-manifest.json` in the source:
   - **Found**: read version directly (known obsidian-mind vault)
   - **Not found**: run version fingerprint detection and/or detect vault structure (PARA, Zettelkasten, daily notes, flat, MOC-based)
3. Report detection result to the user

### 2. Inventory & Classify (use Vault Migrator mode)

Read `vault-manifest.json` from this vault to know infrastructure/scaffold/user_content boundaries.

For each file in the source, classify as: COPY, REPLACE, MERGE, CONFIG, SKIP, or CLASSIFY.

For arbitrary vaults, use the Vault Migrator chat mode to classify files by content.

### 3. Present Migration Plan

Build and present a structured plan **before executing anything**:
- Files found by action type (COPY, REPLACE, MERGE, CONFIG, SKIP)
- Transformations needed (missing frontmatter fields, etc.)
- Conflicts requiring user input

For `--dry-run`: write the plan to `thinking/vault-upgrade-plan-YYYY-MM-DD.md` and stop.

Ask the user: "Does this plan look right? Say 'go' to execute."

### 4. Execute Migration (use Vault Migrator mode)

Once the user approves, switch to the Vault Migrator chat mode to execute: read from source, transform, write to target, rebuild indexes.

### 5. Validate

After completion:
- Spot-check frontmatter on random migrated files
- Check for broken wikilinks in migrated files
- Verify index files reference the migrated content
- Report results with counts and any items needing attention

Offer next steps:
- "Run `/om-vault-audit` for a full structural check"
- "Review `thinking/migrate-review/` for uncategorized files"

## Important

- **The source vault is NEVER modified.** All operations are read-only on source, write-only on target.
- **Plan-first, always.** Never skip the plan presentation step.
- **`CLAUDE.md` is special.** Never copy it from the source — the template's is always authoritative.
- Binary files (images, PDFs) must be copied or embeds break.
- Non-work content is welcome — personal journal entries go to `reference/personal/`, book notes to `reference/learning/`.
