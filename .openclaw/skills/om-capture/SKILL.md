---
name: om-capture
description: Proactively spot durable knowledge mid-conversation, ask before writing by default, and record approved learnings into the right vault notes using the existing capture vocabulary.
---

# Vault Auto-Capture Skill

> [!note] Provisional
> The discovery path (`.openclaw/skills/`) and skill frontmatter schema (`name`, `description`) are best-effort because OpenClaw's published native skill documentation is still incomplete. If your version expects a different path or schema, adapt this file but keep the prompt body aligned with `.claude/skills/om-capture/SKILL.md`.

> Keep this file in sync with `.claude/skills/om-capture/SKILL.md`.

Use this skill when the conversation surfaces durable knowledge that would help a future session with no memory of the current chat. Build on the existing classification vocabulary from `classify-message.ts` — decision, incident, 1:1 content, win, architecture, person context, project update — rather than inventing a parallel taxonomy.

## Goal

Move capture from **pull-based** (`/om-dump`, `/om-wrap-up`) to **proactive but reviewable**.

When you notice something durable, surface it in-flight:

> This looks worth capturing — want me to record it in `[[Key Decisions]]` / `[[Gotchas]]` / `[[Patterns]]` / `[[Brag Doc]]` / the project note?

Do **not** silently write by default. Surprise diffs in a git-tracked vault erode trust faster than missed capture. Autonomous capture is opt-in.

## Recognize Capture-Worthy Moments

Treat the classification-hook vocabulary as your first-pass detector, then apply the durability test in the next section.

### Decision

Capture when **a decision was made and an alternative was rejected**.

Route to:
- Decision Record in `work/active/` using `templates/Decision Record.md`
- Summary line in `brain/Key Decisions.md`
- `work/Index.md` Decisions Log if you created a new decision note

Look for language like:
- “we decided”, “let's go with”, “the call is”
- trade-offs, rejected options, reversals, superseded choices
- architecture discussion that ended with a choice

If the conversation is a **decision reversal**, update the original record, mark the old status appropriately, link the new record, and correction-sweep downstream restatements.

### Gotcha

Capture when **something broke and the cause was non-obvious**.

Route to:
- `brain/Gotchas.md` or a linked domain note beside it when size/topic split requires it
- the active project note when the fallout or workaround is project-local

Strong signal:
- “this failed because…”, but the reason was surprising, hidden, or time-consuming to discover
- tooling quirks, platform traps, parsing edge cases, naming laws, environment hazards

### Pattern / Constraint

Capture when **a constraint, invariant, or behavior was discovered that would bite anyone repeating the work**.

Route to:
- `brain/Patterns.md` or a linked domain note beside it
- `reference/` only when the discussion became general codebase architecture rather than a reusable working pattern

Strong signal:
- “always/never do X here”
- “this has to live in Y because…”
- “the system behaves like this even though you'd expect…”

### Win / Impact

Capture when **praise, shipped work, or measurable impact** surfaced.

Route to:
- `perf/Brag Doc.md`
- the underlying evidence note if the win needs one first (for example the relevant project note or incident note)

Strong signal:
- shipped / launched / released work
- customer or teammate praise
- measurable improvement, reduction, saved time, incident resolved, ownership shown

### Person Context

Capture when **a new person matters, or an existing relationship changed in a way future sessions should know**.

Route to:
- `org/people/<Name>.md`
- `org/People & Context.md` if a new person note was created or their role/team changed materially

Strong signal:
- new collaborator, stakeholder, manager, reviewer
- responsibility or relationship shift
- durable preference, style, influence, or context that affects future work

### Project Update

Capture when **project status changed**.

Route to:
- the project's note in `work/active/`
- `perf/Brag Doc.md` too if the update is brag-worthy

Strong signal:
- milestone reached, status changed, blocker discovered or cleared, scope changed, ownership moved

Keep volatile status single-sourced in the project note. Elsewhere, link to it instead of restating it.

## Durability Test

Before proposing a write, ask:

> Would this help a future session that has no memory of this conversation?

Capture it if the answer is **yes**.

### Usually capture
- decisions with rationale and rejected alternatives
- non-obvious root causes and hard-won fixes
- reusable constraints, invariants, workflow laws, or architecture behaviors
- wins with evidence or measurable impact
- meaningful people context
- status changes that alter how future work should proceed

### Usually do not capture
- transient debugging chatter
- speculative hypotheses that were never verified
- step-by-step dead ends with no reusable lesson
- low-signal progress noise (“still looking”, “ran one more command”)
- duplicate status restatements already captured elsewhere

A sparse vault with strong signal is better than a full vault diluted by trivia.

## Default Behavior: Confirm Before Writing

Default behavior:
1. Notice a likely capture-worthy moment
2. Name the signal and destination
3. Ask for confirmation
4. Write only after approval

Suggested phrasing:
- “This sounds like a durable gotcha. Want me to record it in `[[Gotchas]]`?”
- “We just made a decision and rejected an alternative. Want me to add a Decision Record and a line in `[[Key Decisions]]`?”
- “That looks brag-worthy. Want me to add it to `[[Brag Doc]]` and link the evidence note?”

### Autonomous Mode (opt-in)

Only write without asking when the user has explicitly opted into autonomous capture for the current task, session, or vault workflow.

Trade-off:
- **Pro:** fewer missed captures, less user overhead
- **Con:** surprise diffs, more review burden, easier to pollute the vault with low-signal notes

If autonomous mode is enabled, keep the durability bar high and summarize every write immediately after making it.

## Routing Rules

- Reuse the vault placement rules from `[[CLAUDE]]`.
- Durable cross-cutting knowledge goes to `brain/` topic notes.
- Project-specific knowledge goes to the relevant project note in `work/active/`.
- Use templates where they already exist; otherwise append to the canonical living note.
- Search for an existing note first. Prefer updating the existing durable home over creating a duplicate.
- Never write to `memories/YYYY/MM/` directly — that tree is MCP-only.

## Write-Correctness Laws

Follow the existing laws rather than restating them loosely:
- **Single-source status** — keep live project status in the project note
- **Correction sweep** — if a fact changed, update every downstream restatement in the same pass
- **Mark inference** — use `(unverified)` or `(inferred)` when the conversation did not verify the fact directly
- **Date-stamp volatile facts** — counts, versions, org structure, maturity, ownership shifts
- **Mandatory wikilink** — every new note links to at least one existing note and gets linked from an index or related note
- **~25 KB split rule** — split oversized living notes instead of trimming them

## Capture Workflow

1. **Notice the signal** using the same vocabulary as the classification hook.
2. **Apply the durability test**.
3. **Search first** for an existing note or canonical home.
4. **Propose the capture** and ask for approval unless autonomous mode is active.
5. **Write surgically** using the existing template or living note.
6. **Update indexes and backlinks** only when the chosen destination requires them.
7. **Report exactly what changed** so the user can review it.

## Worked Examples

### Example 1 — Decision + rejected alternative

Conversation snippet:

> “We’re going with prompt files plus VS Code tasks for Copilot instead of pretending hooks are automatic. We rejected calling that ‘full support’ because it would mislead users.”

Proposed capture:
- `work/active/Copilot Support Decision.md` from `templates/Decision Record.md`
- append a summary line under `brain/Key Decisions.md` → `## Copilot Support`

Resulting note/section:

````markdown
Path: work/active/Copilot Support Decision.md

# Decision: Copilot support tier

## Context
VS Code Copilot can run prompts, chat modes, and tasks, but has no hooks API.

## Options Considered
1. Call it full support and document manual tasks quietly.
2. Call it near-full (manual lifecycle) and document the missing automation plainly.

## Decision
Choose near-full (manual lifecycle). We rejected “full support” because it would imply automatic validation that does not exist.

## Related
- [[AGENTS]]
- [[Key Decisions]]
````

### Example 2 — Non-obvious breakage

Conversation snippet:

> “The prompt file looked valid, but Copilot ignored it because the folder-open task only approximates SessionStart — there’s no lifecycle hook API.”

Proposed capture:
- append to `brain/Gotchas.md` under `## Copilot`

Resulting section:

````markdown
## Copilot
- VS Code Copilot tasks can approximate `SessionStart`, but prompt/chatmode flows still lack a true lifecycle hooks API as of 2026-08-01. Treat task-based validation as manual, not automatic. [[Key Decisions]]
````

### Example 3 — Reusable constraint

Conversation snippet:

> “Never put user notes at the vault root; only infrastructure files belong there.”

Proposed capture:
- append to `brain/Patterns.md` under `## Vault Layout`

Resulting section:

````markdown
## Vault Layout
- User-authored notes do not belong at the vault root; route them to the typed folders from [[CLAUDE]] so navigation, Bases, and hygiene checks keep working.
````

### Example 4 — Win with evidence

Conversation snippet:

> “The OpenClaw and Hermes parity pass landed, and the README now documents the near-full Copilot workflow.”

Proposed capture:
- append to `perf/Brag Doc.md` under the active quarter with links to the work note or PR evidence

Resulting section:

````markdown
- Documented multi-agent parity work across OpenClaw, Hermes, and VS Code Copilot, including the manual-lifecycle tradeoff for Copilot. Evidence: [[AGENTS]], [[Skills]].
````
