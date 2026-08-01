---
mode: 'agent'
description: 'Self-maintenance pass — acts on every hygiene flag: archives completed work, groups loose clusters, splits oversized notes, reports stale open loops, fixes links. Safe by construction: never deletes, never commits, zero content loss.'
---

The acting half of the hygiene system. The SessionStart/Stop hooks and the PostToolUse write-time flags DETECT drift; this command ACTS on it.

> **Note for VS Code Copilot:** Lifecycle hooks do not fire automatically. Run the **`om: session start`** task first to populate context, and the **`om: validate write`** task after editing notes to validate frontmatter and wikilinks.

## Hard rails (safe by construction)

- **Never delete.** Reorganization is `git mv` + splits with verbatim content moves. Zero content loss.
- **Never commit.** Git sync stays the user's call — leave the working tree for review.
- **Judgment calls get flagged, not executed.** Anything ambiguous is listed for the user instead of acted on.

## The mechanical tier (act on these)

Work through the current hygiene flags in order:

1. **Completed-not-archived** — `git mv` from `work/active/` to `work/archive/YYYY/`; clusters keep their folder; update `work/Index.md`.
2. **Ungrouped clusters** — when the loose notes genuinely share context (judge, don't trust token overlap): create `work/active/<Topic>/`, `git mv` the members in.
3. **Oversized notes (25KB+)** — SPLIT, never trim: move whole sections verbatim into domain notes, event-log satellites, or an archive note; leave a one-liner index behind in the original; retarget links that pointed at the moved sections. `*Archive*` names are exempt by design.
4. **Index drift, orphans, broken links** — new notes must be linked from at least one note; fix wikilinks broken by any moves this pass made; update `work/Index.md` / `org/People & Context.md` / `perf/Brag Doc.md` as touched.
5. **Semantic-linking pass** — for notes created or split this pass, search their core concepts and add the links the graph is missing.
6. **Memory-inbox promotion (`memories/YYYY/MM/`)** — durable captures get copied into the right `brain/` topic note. **Promotion is ADDITIVE: copy, never move.** Then mark the capture with a `promoted:` frontmatter field pointing to the brain note anchor.

## The report tier (list, never act)

- **Open loops** — stale follow-up flags. List them with paths + counts.
- **Competency evidence freshness** — for each `perf/competencies/*.md`, count inbound links from notes modified this half. Report competencies with ZERO fresh evidence.

## Report

Write `thinking/YYYY-MM-DD-tidy-report.md`: actions taken (moves, splits, links), flags cleared, judgment calls deferred, open loops listed. Delete it once findings are resolved.

## Related

- `/om-weekly` § hygiene sweep — the scheduled home of this pass
- `/om-project-archive` · `/om-vault-audit` (deep audit, agent-backed)
