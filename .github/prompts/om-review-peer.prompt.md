---
mode: 'agent'
description: 'Write a peer review for a colleague. Produces project feedback, principles, and performance summary — fact-checked against vault evidence.'
---

# Peer Review Writer

Write a peer review for a colleague. Produces project feedback, principles, and performance summary — all fact-checked against vault evidence.

## Usage

Provide the colleague's name in your message.
Example: "Write peer review for Jane Smith"

> **Note for VS Code Copilot:** This command uses the **Review Fact Checker** chat mode to verify claims. After drafting, switch to that mode to verify each factual claim against vault sources, then return here for final edits.

## Workflow

### 1. Gather Evidence

Load in order:
1. Person note from `org/people/<Name>.md`
2. PR evidence from `perf/evidence/<Name> PRs - <cycle>.md` (run `/om-peer-scan` if missing)
3. Any active review writing notes
4. Any brag sheet or impact overview the person shared (user provides)
5. Relevant work notes (search vault for their name)
6. Slack context if available

### 2. Assess Visibility

For each submitted project, classify your evidence level:
- **Direct**: Worked together daily, first-hand observations
- **Reviewed**: Saw their PRs, reviewed some code, aware of the work
- **Informed**: From their brag sheet or shared documents, limited personal observation

Be explicit about this in the review text. Never overclaim visibility.

### 3. Draft

For each project:
- State your visibility level
- Describe what was delivered from your vantage point
- Give specific, behavioral feedback — what you observed them DO, not just what they ARE
- Keep within your tool's character limits (typically ~1000 chars per section)

For principles/values: Pick 1-2 where you have direct evidence. Skip the rest.

For strengths and areas of development:
- Strengths: what you've consistently seen them do well (evidence-based)
- Areas: frame as growth direction, not criticism. Must have vault evidence or direct observation.

### 4. Verify (use Review Fact Checker mode)

Before finalizing, switch to the **Review Fact Checker** chat mode to verify all factual claims.

### 5. Output

Present the draft in Copilot Chat for user review before saving.

## Important

- Never overclaim visibility — if you don't have direct evidence, say "based on what I observed"
- Specific and behavioral > general and evaluative
- Don't include: internal company naming without permission, anything from private conversations, speculation about their private life
