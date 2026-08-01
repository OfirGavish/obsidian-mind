# MCP Integration Guide

A practical reference for wiring a *consuming* repository to this vault via the `om` MCP server. Read this alongside the `README.md` → *🧠 Reach Your Vault From Any Repo* section, which covers the same ground at a higher level. This guide adds the mechanics, the per-agent registration, and the memory-scoping decisions.

## Contents

- [Two steps, both required](#two-steps-both-required)
- [Step 1 — Registration](#step-1--registration)
  - [User scope (recommended)](#user-scope-recommended)
  - [Per-repo `.mcp.json`](#per-repo-mcpjson)
  - [The absolute-path trap](#the-absolute-path-trap)
  - [Per-agent registration reference](#per-agent-registration-reference)
- [Step 2 — The repo-side instruction block](#step-2--the-repo-side-instruction-block)
  - [Copy-pasteable template](#copy-pasteable-template)
  - [Why each part is shaped the way it is](#why-each-part-is-shaped-the-way-it-is)
  - [Choosing triggers](#choosing-triggers)
- [Recording what you learn](#recording-what-you-learn)
  - [`remember` vs `record_work`](#remember-vs-record_work)
  - [Scope selection](#scope-selection)
  - [Confidence and verification](#confidence-and-verification)
  - [Why `recall` must not lead](#why-recall-must-not-lead)
  - [Decision table](#decision-table)
- [Capture path: inside the vault vs from another repo](#capture-path-inside-the-vault-vs-from-another-repo)
  - [Inside the vault — `om-capture` → `brain/`](#inside-the-vault--om-capture--brain)
  - [From another repo — MCP → `memories/YYYY/MM/`](#from-another-repo--mcp--memoriesyyyymm)
  - [Promotion](#promotion)
- [Health checks and troubleshooting](#health-checks-and-troubleshooting)

---

## Two steps, both required

> **Registering the server is not sufficient.** Measured: with the server wired and no repo-side instruction, a session made **zero** vault calls and implemented a design the vault had recorded as explicitly rejected. With the instruction present, it refused and cited the note.

Registration makes the tools *available*. The repo-side instruction tells the session to *use* them. Both are required.

The asymmetry is not a surface detail — it is a property of how context propagation works:

- A **prohibition** in the MCP `instructions` field propagates into the calling session reliably. The server can stop a session doing something.
- A positive *"go consult the vault"* is advisory and gets skipped whenever a nearer source exists. Only the project's own instruction file makes a session go looking.

This asymmetry decides which side a rule belongs on. Routing belongs repo-side because it must; constraints can go server-side because they reliably hold there.

---

## Step 1 — Registration

### User scope (recommended)

```bash
claude mcp add --scope user om node "/absolute/path/to/your-vault/.claude/scripts/om-mcp.mjs"
```

User scope registers in your personal config, so the server is available in **every directory on the machine** with nothing added to any repository. No environment variable is needed — the launcher resolves the vault from its own location.

This is the right default for a personal vault.

### Per-repo `.mcp.json`

If you want a specific repo to carry the wiring (so a collaborator gets it on clone):

```json
{
  "mcpServers": {
    "om": {
      "command": "node",
      "args": ["/absolute/path/to/your-vault/.claude/scripts/om-mcp.mjs"]
    }
  }
}
```

Cost: that path is **absolute and machine-specific**, so committing it breaks every collaborator and every other machine. Solutions:

- Put the file in `.gitignore` and add a `mcp.json.example` without the path filled in
- Use the user-scope approach instead and document it in `README.md`

### The absolute-path trap

This vault's own `.mcp.json` registers `qmd` with a *relative* path (`.claude/scripts/qmd-mcp.mjs`). That is correct there, because a relative path resolves against the current working directory and a session *in the vault* is already in it.

Copying that shape for `om` in a *consuming project* silently resolves against that project's directory instead, and the server never starts. **Always use an absolute path for `om` in a consuming repo.**

### Per-agent registration reference

How to register an MCP server varies by agent family. The `om` server speaks plain MCP over stdio, so any MCP-capable agent can use it.

| Agent | Registration mechanism | Notes |
|---|---|---|
| **Claude Code** | `claude mcp add --scope user om node "/path/to/om-mcp.mjs"` or per-repo `.mcp.json` | User scope registers in `~/.claude/mcp.json`. Verified. |
| **Codex CLI** | `.codex/mcp.json` — same JSON shape as `.mcp.json` | ¹ Provisional — verify the exact discovery path against your Codex version. |
| **Gemini CLI** | `.gemini/mcp.json` or the `--mcp-server` flag | ¹ Provisional — verify against [Gemini CLI docs](https://github.com/google-gemini/gemini-cli). |
| **OpenClaw** | `.openclaw/settings.json` → `mcpServers` key | ¹ Provisional — verify the exact key name against your OpenClaw version. |
| **Hermes** | `.hermes/settings.json` → `mcpServers` key | ¹ Provisional — verify the exact key name against your Hermes version. |
| **Copilot Cowork** | `.cowork/settings.json` → `mcpServers` key | ¹ Provisional — verify against your Cowork version. |
| **Microsoft Scout** | `.scout/settings.json` → `mcpServers` key | ¹ Provisional — verify against your Scout version. |
| **VS Code Copilot** | `settings.json` → `github.copilot.advanced.mcpServers` or workspace `.mcp.json` | ¹ Provisional — the VS Code Copilot MCP integration schema has evolved; verify against the [VS Code Copilot customization docs](https://code.visualstudio.com/docs/copilot/copilot-customization). |
| **Copilot Studio** | MCP connector configuration in the Studio portal | ¹ Provisional — verify against [Copilot Studio connector docs](https://learn.microsoft.com/en-us/microsoft-copilot-studio/). |
| **GitHub Copilot CLI / Copilot App** | No native MCP support | Run scripts in `.claude/scripts/` manually or invoke via VS Code Tasks. |

¹ **Provisional.** These registration paths are based on available documentation at time of writing (2026-08-01). MCP config conventions have evolved rapidly across agent families. Verify the exact key names and discovery paths against the docs for your installed version before committing a config.

In every case the JSON value shape is the same:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/vault/.claude/scripts/om-mcp.mjs"]
}
```

---

## Step 2 — The repo-side instruction block

### Copy-pasteable template

Add this to the consuming project's agent instruction file (`CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`, or equivalent depending on the agent):

```markdown
## Where design decisions live

Design rationale for this project is recorded outside this repo, reachable
through the `om` MCP server.

- **`search`** reaches the written record: why a choice was made, what was
  rejected, what a constraint was set against. **Start here.**
- **`expand`** shows a known note's links and backlinks, which is cheaper than
  searching again for its neighbourhood.
- **`recall`** returns short durable lessons scoped to this project. It is empty
  until sessions put things in it, so early on it returns nothing, and that is
  *not* evidence the record is missing.
- **`health`** when something that should be there cannot be found. Every failure
  in this layer looks identical from outside (no results), and this tells them
  apart.

Consult the record before changing:

- <the storage format or schema>
- <the ID or key semantics>
- <the public surface: CLI flags, API shape, exported names>

If that record and this repo disagree, the record holds the *why*. Reconcile
before changing behaviour.

**Say what came back, in whatever you write before implementing:** a plan, a
design note, an issue comment. Name the recorded decisions the work rests on,
anything you found that argues *against* the approach, and an explicit "nothing
recorded on this" when the record is empty, which is a finding rather than a
blank to skip.

## Recording what you learn

Two tools, and picking the wrong one is the common mistake. The test is whether
it would help someone working on a **different** project.

- **`remember`** stores a durable lesson: a constraint you discovered, a gotcha
  that cost time, a rule that generalises. Set `confidence`
  (`verified` / `inferred` / `unverified`) honestly and supply `verification`
  when you claim `verified`. For something specific to this project use
  `scope: "project"` with `projects: ["<this-repo>"]`. Reach for
  `scope: "platform"` before `"general"`: a dependency's quirk or a language's
  rule is platform-level however hard-won, and `general` claims it would help
  someone whose stack shares nothing with yours. When you do claim `general`,
  supply `generality` saying why.
- **`record_work`** files what happened *here*: changes, decisions and the
  alternatives rejected, what was learned, what is still open, how it was
  verified.

A dependency limitation that would bite any project is a `remember`. "Landed the
watch engine and here is what it cost" is a `record_work`. Do both when both are
true.
```

Then fill in the trigger list. See [Choosing triggers](#choosing-triggers) below.

### Why each part is shaped the way it is

**The tool list with `search` first.** The session needs to know which tools exist and which one to reach for first. Without `search` named explicitly as the entry point, sessions default to `recall` — which is empty on first run and returns nothing, appearing to confirm the vault has no relevant content. See [Why `recall` must not lead](#why-recall-must-not-lead).

**"Start here" on `search`.** Not decorative. A session choosing between tools will reach for the one with the most specific description. `recall` looks more targeted (it "returns lessons scoped to this project"), so it wins on specificity unless `search` is explicitly elevated.

**`health` in the tool list.** Every failure in this layer — server not running, no content indexed, identity mismatch, qmd not installed — presents identically as "no results." `health` distinguishes them. Without it, a session that gets no results has no way to tell "nothing recorded" from "server is broken."

**"Not evidence the record is missing" on `recall`.** This is the single most important sentence in the block. On first session, `recall` returns nothing *by construction* (see [Why `recall` must not lead](#why-recall-must-not-lead)). Without this sentence, a session concludes the vault has no relevant content and stops looking.

**"If that record and this repo disagree, the record holds the why."** This encodes the authority relationship. Without it, a session that finds a disagreement silently patches the vault's notes to match the code rather than flagging the conflict.

**"Say what came back, in whatever you write before implementing."** This is the anchor-to-artifact principle. "Consult before changing X" fires once, at the start of a task, when the session knows least about what it will need. Requiring the result to appear in whatever the project writes before implementing turns consultation from something a session *intends* to do into something an artifact is *incomplete without*. Event-triggered behaviour happens; intention-triggered behaviour decays.

**The trigger list.** See the next section.

**`remember` description with `scope` guidance.** Without explicit scope guidance, sessions default to `scope: "general"` for everything, making every lesson appear universally applicable. The real cost is calibration: a vault full of narrowly-scoped lessons filed as `general` trains readers to ignore scope, defeating it.

**`record_work` distinct from `remember`.** Sessions conflate them without explicit contrast. The difference is not format — it is reach. `record_work` is always project-scoped; `remember` may reach further.

### Choosing triggers

The trigger list is the part most projects get wrong. Replacing the three `<placeholders>` with real nouns is what makes the block work.

**Three to five triggers. Name specific nouns.**

Good trigger examples:
- `the storage format or schema`
- `the ID or key semantics`
- `the public CLI surface: flag names, output format, exit codes`
- `the API shape: request/response structure, error codes, versioning`
- `the authentication or session model`
- `the event processing pipeline: ordering guarantees, retry logic, backpressure`

**Why specificity matters.** "Check the vault for context" gives the model nothing to match against the task in front of it — it is exactly the advisory phrasing that gets skipped. `Consult before changing the storage format, ID semantics, or the CLI surface` fires when the session is about to change one of those things, because the task description mentions the thing.

**Bad trigger examples:**
- `before making any changes` — too broad, matches everything, provides no signal
- `when you're unsure` — the model is rarely uncertain at the point it would need to check
- `check the vault for context` — the advisory form measured to be skipped
- `for background information` — no noun to match against the task

**The coverage principle.** Triggers should name the parts of the project where past decisions are most likely to matter. A project's highest-risk change surfaces — schema, API shape, public names, critical algorithms — are the right nouns. A change to a test fixture probably does not need to consult the vault. A change to the wire format does.

---

## Recording what you learn

### `remember` vs `record_work`

The distinction is reach, not format.

**`remember`** stores a lesson that *might* help someone working on a different project. It has a declared scope that determines which repos it reaches. It is the right tool for:

- A dependency limitation discovered the hard way
- A language or platform behaviour that is non-obvious
- A gotcha that cost time and would bite anyone repeating the work
- A constraint that generalises beyond this project

**`record_work`** files what happened *here*, at *this* moment. It is always project-scoped. It is the right tool for:

- What changed and why
- The alternatives considered and rejected
- What was learned during the work
- What is still open
- How the result was verified

**The test:** would this help someone working on a *different* project? Yes → `remember`. No → `record_work`. Both → use both.

**Examples:**

| Situation | Tool | Reasoning |
|---|---|---|
| "We landed the watch engine — here is what it cost and what changed" | `record_work` | About this project, this moment. No one else benefits. |
| "Dependency X silently ignores config key Y when Z is true" | `remember` | Bites any project using X regardless of context. |
| "We decided to use event sourcing for the order pipeline" | Both | `record_work` for the project-specific rationale; `remember` if the constraint that forced it generalises. |
| "The auth middleware must be registered before any route handler or it is bypassed" | `remember` | A platform/framework constraint. Would bite anyone else in the same stack. |
| "We deferred the cache invalidation work to Q3" | `record_work` | Status, not a lesson. Always project-scoped. |

### Scope selection

Every `remember` call requires a `scope`. Get it wrong and the memory either reaches nobody (`project` when it should be `general`) or poisons repos it has nothing useful to say to (`general` when it should be `project`).

The ladder, from narrowest to widest:

**`scope: "project"` with `projects: ["repo-name"]`**

Use when the lesson is specific to this repo and would not help — or would actively mislead — anyone working elsewhere. Examples: why a particular migration was structured the way it was, what the project's own naming conventions are, a constraint tied to a specific vendor agreement.

The `projects` list is matched against the repo identity (the folder name unless `.om-project` overrides it). A memory with `projects: ["my-api"]` is served only when the calling session is identified as `my-api`.

**`scope: "platform"` with `platforms: ["node", "ios", "python"]`**

Use when the lesson applies to everyone using a particular runtime, language, or framework, but not to people on different stacks. This is the *most commonly under-used* scope level — many lessons that get filed as `general` are actually platform-level.

Examples:
- A Node.js event loop behaviour that causes a surprise ordering
- A Python packaging constraint that bites everyone using that version
- An iOS memory management rule relevant to all Swift projects
- A Rust lifetime rule that applies to a specific async pattern

Reach for `platform` before `general`. A dependency's quirk or a language's rule is platform-level however hard-won.

**`scope: "general"`**

Use when the lesson would help someone whose stack shares *nothing* with yours. The bar is high. Most hard-won lessons are not general — they are platform-level masquerading as universal.

When claiming `general`, supply `generality` explaining why. The same way `verification` backs `verified`, `generality` backs the claim. Without it, `general` scope is just an unfounded assertion.

Valid `general` examples:
- A fundamental data structure tradeoff not tied to a language
- A distributed systems theorem that applies regardless of technology
- A security pattern that holds across all frameworks and languages

### Confidence and verification

Every `remember` call requires `confidence`: one of `verified`, `inferred`, or `unverified`.

**`verified`** — you confirmed this against a primary source (docs, reproducible test, code path traced through). Requires a `verification` field explaining what was checked and how.

**`inferred`** — logically follows from what you observed, but you did not directly test or confirm it.

**`unverified`** — you heard it, read it, or believe it is probably true, but did not confirm it.

**Why honest confidence matters — the failure mode.** A vault full of confidently-wrong `verified` memories is *worse* than one with honest `unverified` ones, because it defeats the reader's ability to calibrate. When every memory claims `verified`, readers stop applying skepticism. When memories are honestly calibrated, `unverified` is a signal to double-check and `verified` is a signal to trust.

The `verification` field is required when claiming `verified`. Without it, the claim is unfalsifiable — which is the same failure mode as a `verified` without grounds. Example:

```json
{
  "confidence": "verified",
  "verification": "Confirmed by running a minimal reproduction: npm install with peerDeps=false, observing the resolution failure. Node 20.x, npm 10.x."
}
```

Volatile facts (counts, versions, org structure, maturity) must be dated even when `verified`. What was true in Node 18 may not be true in Node 22.

### Why `recall` must not lead

The memory store is **empty on a project's first session by construction.**

`remember` refuses when called from inside the vault — a memory written inside the vault would be scoped to the vault itself and would reach nobody. So memories only ever arrive from sessions in *other* repos. A brand-new project has had no such sessions, so `recall` returns nothing.

A session that leads with `recall`, gets nothing, and concludes the vault has no relevant content has drawn exactly the wrong inference. The vault may have extensive written records about this exact project — they just live as ordinary notes, not as memories. `search` reaches those notes.

**Use `search` first.** It reaches the written record regardless of whether memories have been accumulated. `recall` is a complement to `search`, not a replacement — and it is most useful once a project has been active long enough for memories to accumulate.

The correct sequence on a new project:

1. `search` for the topic — finds notes, decision records, architecture docs
2. If search returns something useful, `expand` to follow its graph neighbourhood
3. `recall` after `search` to check whether scoped lessons exist — with the expectation that it returns nothing early on and that is fine

### Decision table

| Situation | Tool | Scope | Confidence |
|---|---|---|---|
| Constraint specific to this project | `remember` | `project` | as warranted |
| Platform/framework behaviour | `remember` | `platform` | as warranted |
| Universally applicable lesson | `remember` | `general` | requires `generality` |
| What changed in this project right now | `record_work` | *(always project)* | N/A |
| What changed AND the lesson generalises | Both | `record_work` always; `remember` as above | as warranted |
| Past decisions, design rationale | `search` | N/A — read | N/A |
| Links and backlinks of a known note | `expand` | N/A — read | N/A |
| Scoped lessons for this project | `recall` after `search` | N/A — read | N/A |
| Wiring health check | `health` | N/A | N/A |

---

## Capture path: inside the vault vs from another repo

These two paths are distinct and must not be confused. Using the wrong one results in content landing in the wrong place or being silently refused.

### Inside the vault — `om-capture` → `brain/`

When an agent is running *inside* the vault and captures durable knowledge mid-conversation, it writes to `brain/` topic notes via the normal file-writing tools — not via MCP.

The `om-capture` skill (`.claude/skills/om-capture/SKILL.md`) governs this path:

- Recognises capture-worthy moments using the `classify-message.ts` vocabulary
- Routes to the correct `brain/` note or `work/` note
- Asks for confirmation before writing (by default)
- Enforces write-correctness laws (single-source status, correction sweep, inference marking)

**`remember` refuses when called from inside the vault.** This is intentional: a memory recorded inside the vault would be scoped to the vault as a project, reaching no other repo. If you want to write a lesson while working inside the vault, write it to `brain/` directly.

### From another repo — MCP → `memories/YYYY/MM/`

When an agent is running in a *different repository* and records a lesson via the `om` MCP server, the server writes to `memories/YYYY/MM/` inside the vault.

**Never edit `memories/YYYY/MM/` by hand.** That tree is written exclusively by the MCP server. The scoping, provenance, and identity metadata the server attaches at write time cannot be reconstructed manually. Direct edits bypass the epistemic contract and produce memories with incorrect or missing provenance.

Browse memories via `bases/Memories.base`. Search via `mcp__qmd__query` or the `search` tool. Correct a memory by writing a superseding memory (the server applies supersession rather than overwriting).

### Promotion

A memory in `memories/YYYY/MM/` may eventually become durable cross-cutting knowledge worth folding into a `brain/` topic note. When that happens:

1. A session working inside the vault reads the memory (via search or the Memories base)
2. Synthesises it with related knowledge already in `brain/`
3. Writes the promoted content to the appropriate `brain/` topic note
4. Adds a `promoted: brain/Note#^block-id` marker to the original memory capture (the `^block-id` anchor points to the specific block in the topic note)

When the `promoted:` marker carries an anchor (`brain/Note#^om-id`), `recall` in a foreign session serves the *promoted content* rather than the original capture — so consuming repos get the current, corrected version rather than the capture as first written.

**No automation currently exists for this.** The promotion pass is manual. A rough checklist for a manual promotion pass:

1. `search` for memories related to a topic (or browse `bases/Memories.base`)
2. For each memory worth promoting, find or create the appropriate `brain/` topic note section
3. Write the content into that section with a block id (`^om-xxxxxx`)
4. Update the original memory file's `promoted:` field to `brain/Note#^om-xxxxxx`
5. Verify the anchor resolves by reading the `brain/` note at that anchor

The fact that no automation exists is stated plainly here rather than implied otherwise. If the promotion pass never runs, `recall` serves original captures rather than promoted content — which is still useful, just not as current as the `brain/` notes.

---

## Health checks and troubleshooting

Every failure in this layer presents identically as "no results." `health` tells them apart.

```
# From a session in the consuming repo
om: health
```

`health` reports:
- Which repo identity it is using (folder name or `.om-project`)
- Whether the qmd search index is live
- Memory store counts and promotion health
- Any broken or withheld promotions by capture name

**Common failures and their signals:**

| Symptom | Likely cause | Check |
|---|---|---|
| `search` returns nothing | Server not running, or qmd not installed | `health` — will report qmd status |
| `recall` returns nothing | No memories yet (normal on first session) | Expected; try `search` instead |
| `recall` returns another project's memories | Repo identity collision | `health` — check which repo it thinks is calling; add `.om-project` file |
| Server errors on startup | Wrong path in registration | Check the absolute path in the MCP config points at the actual vault |
| Notes missing from `search` results | Note is outside `user_content_roots`, tagged `private`, or in `mcp_never_expose` | Check `vault-manifest.json` |
| Promoted content not serving | Anchor missing or stale | `health` reports stale promotions by capture name |

If `health` reports the wiring is intact but results are still empty, the vault may genuinely not have content on this topic yet. That is a finding, not a failure — and it is the correct output for a new project on its first session.

---

*Source of truth for tool behaviour: `.claude/scripts/om-mcp.mjs` and the modules it loads. If this doc and the code disagree, trust the code.*
