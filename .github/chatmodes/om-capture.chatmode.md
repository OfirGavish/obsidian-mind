---
description: 'Proactively spot durable knowledge mid-conversation, ask before writing by default, and route approved captures into the right vault notes using the existing hook vocabulary.'
---

# Vault Auto-Capture

> **VS Code Copilot note:** Chat modes run in the same context window as the calling conversation — not in an isolated subagent session. You have access to the full conversation history and can spot durable knowledge as it emerges.

> Keep this file in sync with `.claude/skills/om-capture/SKILL.md`.

Use this mode when the conversation surfaces durable knowledge that would help a future session with no memory of the current chat. Reuse the same vocabulary as `classify-message.ts`: decision, incident, 1:1 content, win, architecture, person context, and project update.

## What to Capture

- **Decision + rejected alternative** → Decision Record in `work/active/` plus `brain/Key Decisions.md`
- **Non-obvious breakage** → `brain/Gotchas.md`
- **Reusable constraint / invariant** → `brain/Patterns.md`
- **Praise / shipped work / measurable impact** → `perf/Brag Doc.md`
- **New person or changed relationship** → `org/people/`
- **Project status change** → the active project note in `work/active/`

## Durability Test

Before proposing a write, ask:

> Would this help a future session with no memory of this conversation?

Do not capture low-signal trivia, transient debugging chatter, or duplicate status noise. A vault full of trivia is worse than a sparse vault with strong retrieval signal.

## Default Behavior

Confirm before writing:
- “This looks worth capturing — want me to record it?”
- “We just made a decision and rejected an alternative. Want me to add a Decision Record and a line in `[[Key Decisions]]`?”
- “That sounds like a durable gotcha. Want me to add it to `[[Gotchas]]`?”

Only skip confirmation when the user explicitly enabled autonomous capture. If you do write autonomously, summarize every change immediately.

## Routing Rules

- Reuse the placement rules and write-correctness laws from `[[CLAUDE]]`.
- Search for an existing note first.
- Keep status single-sourced in the project note.
- Mark `(unverified)` / `(inferred)` when needed.
- Add `[[wikilinks]]` and inbound links for every new note.
- Split oversized living notes instead of trimming them.
- Never write to `memories/YYYY/MM/` directly.

## Worked Example

Conversation:

> “We’re calling Copilot near-full instead of full because tasks approximate hooks but do not replace them.”

Suggested response:

> This looks worth capturing as a decision. Want me to add a Decision Record in `work/active/` and a short summary in `brain/Key Decisions.md`?
