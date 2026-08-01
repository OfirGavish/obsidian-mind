---
mode: 'ask'
description: 'Morning kickoff. Load today''s context, review yesterday, surface open tasks, and identify priorities.'
---

Run the morning standup.

> **Note for VS Code Copilot:** The `SessionStart` hook does not fire automatically. Before running this prompt, execute the **`om: session start`** VS Code Task (Terminal → Run Task → `om: session start`) to inject vault context. If the task has already run on folder open, you can skip this step.

Gather the following context (VS Code Copilot cannot run shell commands automatically — ask the user to run them or use the Terminal tool if available):

1. Read yesterday's and today's daily notes if they exist (`obsidian daily:read` or browse `work/1-1/` for recent entries)
2. Check `work/active/` for current project statuses
3. Read `brain/North Star.md` for current goals
4. Check `work/Index.md` for active projects and recent notes
5. Scan `brain/Memories.md` for recent context

Present a structured standup summary:
- **Yesterday**: What got done (from recent git changes + daily note)
- **Active Work**: Current projects in `work/active/` with their status
- **Open Tasks**: Pending items (checkbox tasks from active notes)
- **Open Loops**: Stale follow-ups — anything to chase today?
- **North Star Alignment**: How active work maps to current goals
- **Suggested Focus**: What to prioritize today based on goals + open items

Keep it concise. This is a quick orientation, not a deep dive.
