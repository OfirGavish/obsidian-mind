---
mode: 'agent'
description: 'Generate a performance review context transfer document from vault data. Supports manager version (PO-friendly) and peer version (project-focused).'
---

# Generate Review Brief

Generate a performance review context transfer document from vault data. Supports manager version (PO-friendly) and peer version (project-focused).

## Usage

Provide the audience and period in your message.
Examples:
- "Generate review brief for manager, Q3 2024 + Q4 2024"
- "Generate review brief for peers, Q3 2024 + Q4 2024"

> **Note for VS Code Copilot:** This command uses the **Review Prep** chat mode for aggregating evidence. Switch to that mode first to gather raw material, then return here to generate the brief. Chat modes in VS Code Copilot share the same context window rather than isolated sessions.

## Workflow

### 1. Gather Data (use Review Prep mode)

Read these vault sources:
- `perf/<cycle>/Review Brief.md` — full context
- `perf/Brag Doc.md` — quarterly highlights
- `perf/brag/Q*.md` — quarterly detail notes for the period
- `perf/evidence/Your PRs - *.md` — PR data
- `work/*.md` — project notes for the period
- `perf/competencies/*.md` — competency definitions
- Previous review notes for baseline comparison

### 2. Generate Content

**For manager audience:**
- Frame for a non-technical audience — outcome language, not technical jargon
- Include: The Arc (narrative), Impact at a Glance (table), Impact Details (per project), Competency Highlights (with baselines), Documentation Trail
- No wikilinks — use plain text or markdown links to external resources

**For peer audience:**
- More technical but still accessible
- Organize by project
- Include "Other things worth mentioning" for non-project work
- Casual tone — "jog your memory", "no pressure to cover everything"
- No competency section — that's for the manager

### 3. Create Files

- Markdown version in `perf/`
- HTML version with professional styling (blue theme, tables, responsive)
- PDF via Chrome headless if available: `--headless --no-pdf-header-footer --print-to-pdf`

### 4. Verify

- Check page breaks in PDF if generated
- Ensure no content is cut mid-section
- Cross-check PR counts and dates against `reference/` data

## Important

- NEVER include: sensitive interpersonal details, 1:1 talking points, peer selection strategy in shared versions
- Always maintain a private version with full context
- Manager version: no wikilinks, non-technical language, professional formatting
- Peer version: project-focused, accessible language
