---
mode: 'agent'
description: 'Capture an incident from Slack channels, DMs, and threads into structured vault notes. Produces a complete incident work note with timeline, people, analysis, and brag doc entry.'
---

# Incident Capture

Capture an incident from Slack channels, DMs, and threads into structured vault notes.

## Usage

Provide one or more Slack URLs (incident channels, DM conversations, threads) in your message.

> **Note for VS Code Copilot:** This command references the **Slack Archaeologist** and **People Profiler** chat modes. Run the Slack Archaeologist mode first to gather raw data, then People Profiler to handle person notes, then return here to complete the incident note. Chat modes in VS Code Copilot share the same context window rather than running in isolated subagent sessions.

## Workflow

### 1. Gather Raw Data (use Slack Archaeologist mode)

For each Slack URL provided:
- Read the full channel/DM/thread
- Read ALL sub-threads
- Note every timestamp, person, and message

### 2. Identify People (use People Profiler mode)

For every person who posted or was mentioned:
- Check if they have a person note in `org/people/`
- Note their role, team, and title
- Track who did what (reported, investigated, fixed, confirmed, etc.)

### 3. Build the Timeline

Reconstruct a detailed timeline from all sources:
- Every message with exact timestamp
- Attribution: who said/did what
- Key moments: first report, incident declared, root cause identified, fix created, fix merged, resolution confirmed

### 4. Create the Work Note

Create `work/incidents/<Incident Name>.md` with:

```yaml
---
date: "YYYY-MM-DD"
quarter: QN-YYYY
description: "~150 chars"
project: <relevant project>
status: active
ticket: TICKET-XXXX
severity: high/medium/low
role: <your role>
tags:
  - work-note
  - incident
---
```

Sections: Context, Root Cause, Resolution, Timeline (table), Impact, Involved Personnel, Notes, Analysis, Related.

### 5. Update Indexes

- `work/Index.md` — add to Incidents section
- `brain/Memories.md` — add incident summary to Recent Context
- `brain/Patterns.md` — if this reveals a recurring pattern
- `brain/Gotchas.md` — if this reveals a technical gotcha
- `perf/Brag Doc.md` — add to relevant quarter with competency links

### 6. Offer Next Steps

After capturing, suggest:
- "Want me to prepare the incident ticket fields?"
- "Want me to draft a message for the incident channel?"
- "Want me to create a root cause analysis document?"
- "Should I run `/om-vault-audit` to verify everything links properly?"

## Important

- **Read every message** — don't skim or summarize prematurely
- **Preserve exact timestamps** — incident timelines need precision
- **Attribute everything** — who said what, who did what
- **Be blameless in public docs** — use commit SHAs, not names, in shareable documents
- **Private analysis is honest** — the vault work note can include strategic analysis
