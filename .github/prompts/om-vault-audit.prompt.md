---
mode: 'agent'
description: 'Deep structural audit of the vault. Checks indexes, folder placement, frontmatter, links, Bases, and consistency. Fix what can be fixed, flag what needs user input.'
---

Deep structural audit of the vault. Checks indexes, folder placement, frontmatter, links, Bases, and consistency. Fix what can be fixed, flag what needs user input.

**When to use**: After substantial sessions, after reorganization, or periodically. For lighter end-of-session checks, use `/om-wrap-up` instead.

> **Note for VS Code Copilot:** This command orchestrates two analysis passes that correspond to the **Vault Librarian** and **Cross-Linker** chat modes in `.github/chatmodes/`. Switch to each mode in turn for the deep analysis, then return to this prompt to review findings. Chat modes in VS Code Copilot run in the same context window rather than isolated subagent sessions — coordinate them sequentially rather than in parallel.

## Workflow

### 1. Check Folder Structure

Verify the vault matches the expected layout:
- `Home.md` exists at vault root
- `bases/` contains all `.base` files (none scattered elsewhere)
- `work/active/` contains only notes with `status: active`
- `work/archive/` contains only `status: completed` notes
- `work/incidents/` contains only notes tagged `incident`
- `org/people/` contains only notes tagged `person`
- `templates/` contains only template files (with `{{placeholders}}`)
- Nothing unexpected at vault root

### 2. Check Indexes

Read and verify each index file:
- `Home.md` — do embedded Base views reference existing Bases?
- `work/Index.md` — are active projects still active? Are completed items archived?
- `brain/Memories.md` — is the "Recent Context" section current?
- `org/People & Context.md` — are roles and project assignments current?
- `perf/Brag Doc.md` — do PR counts and project descriptions match reality?

### 3. Check Frontmatter Completeness

For each note type, verify required properties exist. See `CLAUDE.md` for full schema.

Key checks:
- Work notes: `date`, `quarter`, `description`, `status`, `tags: [work-note]`
- Incident notes: `date`, `quarter`, `description`, `ticket`, `severity`, `role`, `status`
- Person notes: `date`, `description`, `tags: [person]`

### 4. Check for Duplicate Tags

Scan all notes for duplicate entries in the `tags` array. Fix any found.

### 5. Check Status/Folder Alignment

- Notes in `work/active/` must have `status: active`
- Notes in `work/archive/` must have `status: completed`

### 6. Check for Orphans

- Notes in `work/active/` or `work/archive/` not linked from `work/Index.md`
- Notes without any inbound links at all
- Thinking notes that should have been promoted or deleted

### 7. Check Links

- Scan for wikilinks that reference notes that don't exist (broken links)
- Check that bidirectional links exist where expected (work note ↔ person, work note ↔ competency)
- Verify `## Related` sections aren't empty on work notes

### 8. Fix and Report

- Fix what's clearly wrong (broken links, missing frontmatter, duplicate tags, wrong folder)
- For ambiguous issues, list them and ask the user
- Summarize:
  - **Fixed**: issues resolved
  - **Flagged**: needs user input
  - **Suggested**: improvements for the vault

## Important

- Don't delete anything without asking
- Don't create new notes during audit — just fix existing ones
- Preserve existing frontmatter when editing
- If a note is in the wrong folder, move it with `git mv`
