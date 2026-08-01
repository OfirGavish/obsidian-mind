---
mode: 'agent'
description: 'Write your self-assessment for your company''s review tool. Produces project impact descriptions, competency self-assessments, principles, and growth plan — fact-checked, strategically calibrated.'
---

# Self-Review Writer

Write your self-assessment for your company's review tool. Produces project impact descriptions, competency self-assessments (current level / next level), principles, and growth plan — all within character limits, fact-checked, strategically calibrated.

## Usage

Invoke this prompt and specify the review cycle (or "current" for the current period).

> **Note for VS Code Copilot:** This command uses the **Review Fact Checker** chat mode for verification. After drafting, switch to that mode to verify every factual claim against vault sources.

## Context: Review System

Adapt this to your company's review system:
- **Evaluation axes**: Impact, Competencies, Principles — customize terminology
- **Rating scale**: Below/Meet/Above or 1-5 — configure per your org
- **Your self-assessment sets the anchor** — especially when the manager is new or has limited context

## Workflow

### 1. Load Context

Read in order:
1. `brain/North Star.md` — current goals and focus
2. `perf/<cycle>/Review Brief.md` — the full private review brief
3. `perf/<cycle>/Review Brief - Manager.md` — what the manager has seen
4. Previous cycle review — baselines
5. Quarterly brag notes covering the period
6. All competency notes in `perf/competencies/`
7. `perf/Performance Framework.md` — evaluation structure (if exists)
8. Key work notes for submitted projects

### 2. Draft Projects

For each submitted project (within your tool's character limit):
- Open with your role and scope
- Cover impact dimensions: what was delivered, quality of execution, complexity handled
- Include specific evidence: numbers should be factual (PR counts, team size, timeline)
- End with outcome or significance

### 3. Draft Competencies

For each competency, decide current level (Yes/No) and next level (Yes/No):
- **Competency texts cover HOW you applied the skill** — not what was delivered (that's the project section)
- Lead with behaviors and decisions, not deliverables
- Reference the previous cycle baseline: "Previously Meet, this period X" shows trajectory

### 4. Draft Principles

For each principle:
- Reference the previous cycle baseline and any specific growth feedback
- Lead with the strongest evidence

### 5. Strategic Calibration

Before finalizing:
- Are ratings defensible? Is there one genuine Meet to show calibration?
- Are next-level YES answers defensible on EVERY sub-criterion?
- Would you be comfortable if a calibration reviewer challenged any specific answer?

### 6. Quality Checks

- [ ] All sections within your tool's character limit
- [ ] Watch for special characters (em-dashes) — some review tools count these as multiple characters
- [ ] Every factual claim backed by vault evidence
- [ ] No fabricated decisions ("chose X over Y" when Y was never considered)
- [ ] Dates verified — check day of week before claiming "weekend work"
- [ ] Growth baselines stated for competencies and principles

### 7. Fact-Check Pass (use Review Fact Checker mode)

Switch to the **Review Fact Checker** chat mode. For every claim: Is it in the vault? Which source? Could a reviewer challenge it?

### 8. Save

Save draft to `thinking/review-drafts.md` for copy-pasting. After submission, promote to `perf/<cycle>/Self-Review.md`.

## Tips

1. **Your self-assessment anchors the conversation** — especially with a new manager.
2. **Check character counts early.** Use the charcount script: `node --experimental-strip-types .claude/scripts/charcount.ts <file> "<section>" "" <limit>`
3. **Watch special characters** — em-dashes and en-dashes may count as multiple characters.
4. **Fact-check before submitting.** Catches fabricated claims, wrong dates, and references that shouldn't appear.
