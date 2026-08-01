---
date: "{{date}}"
description: Fill-in-the-blanks block for a consuming project's agent instruction file — wires vault consultation and memory recording via the om MCP server.
tags:
  - template
---

# MCP Consumer Instructions Template

Drop the block below into the consuming project's agent instruction file
(`CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`, or equivalent).
Fill in the `<placeholder>` fields. Delete this header section.

> **Why it is worded as prohibitions and requirements, not suggestions.**
>
> Two things were measured during development of this layer:
>
> 1. A session with the server wired but *no* repo-side instruction made **zero**
>    vault calls and implemented a design the vault had recorded as explicitly
>    rejected.
> 2. A **prohibition** propagates into a session reliably. A positive
>    *"go consult the vault"* is advisory and gets skipped whenever a nearer
>    source exists.
>
> The block below is therefore shaped as requirements ("before changing X, the
> result must appear in Y") rather than suggestions ("check the vault"). An
> artifact-anchored requirement fires at the moment of commitment; an
> intention-anchored reminder fires once, at the moment the session knows least.

---

<!-- Paste everything from here to the end of the file into the consuming project's agent doc -->

## Where design decisions live

Design rationale for this project is recorded outside this repo, reachable
through the `om` MCP server.

- **`search`** reaches the written record: why a choice was made, what was
  rejected, what a constraint was set against. **Start here.**
- **`expand`** shows a known note's links and backlinks — cheaper than a second
  search for the same neighbourhood.
- **`recall`** returns short durable lessons scoped to this project. It is empty
  until sessions write to it, so early on it returns nothing, and that is *not*
  evidence the record is missing.
- **`health`** when something that should be there cannot be found. Every failure
  in this layer looks identical from outside (no results), and this tells them
  apart.

Consult the record before changing:

- <trigger-1: e.g. "the storage format or schema">
- <trigger-2: e.g. "the ID or key semantics">
- <trigger-3: e.g. "the public surface: CLI flags, API shape, exported names">

<!--
  Replace the three triggers above with three to five specific nouns from this
  project — the surfaces where past decisions are most likely to matter.

  Good triggers name a concrete thing:
    "the storage format or schema"
    "the authentication or session model"
    "the event processing pipeline: ordering guarantees, retry logic"

  Bad triggers are vague:
    "before making any changes"     — too broad, provides no signal
    "when you're unsure"            — model is rarely uncertain at the right moment
    "check the vault for context"   — exactly the advisory form that gets skipped

  Three to five is the right count. More dilutes attention; fewer misses the
  highest-risk surfaces.
-->

If the vault record and this repo disagree, the record holds the *why*.
Reconcile before changing behaviour.

**Say what came back, in whatever you write before implementing:** a plan, a
design note, an issue comment. Name the recorded decisions the work rests on,
anything you found that argues *against* the approach, and an explicit "nothing
recorded on this" when the record is empty — which is a finding, not a blank
to skip.

## Recording what you learn

Two tools, and picking the wrong one is the common mistake. The test is whether
the lesson would help someone working on a **different** project.

- **`remember`** stores a durable lesson: a constraint discovered, a gotcha
  that cost time, a rule that generalises. Set `confidence`
  (`verified` / `inferred` / `unverified`) honestly and supply `verification`
  when claiming `verified`. For something specific to this project use
  `scope: "project"` with `projects: ["<this-repo-name>"]`. Reach for
  `scope: "platform"` before `"general"`: a dependency's quirk or a language's
  rule is platform-level however hard-won, and `general` claims it would help
  someone whose stack shares nothing with yours. When claiming `general`,
  supply `generality` explaining why.
- **`record_work`** files what happened *here*: changes, decisions and the
  alternatives rejected, what was learned, what is still open, how it was
  verified.

A dependency limitation that bites any project is a `remember`. "Landed the
watch engine and here is what it cost" is a `record_work`. Do both when both
are true.

<!--
  Replace <this-repo-name> with the consuming project's folder name (the name
  `health` will report as the repo identity). If two repos share a folder name,
  add a .om-project file at the repo root with a distinct name to separate them.
-->
