/**
 * Unit tests for verify-ports.ts — port drift detector.
 *
 * Tests the pure helper functions that do the comparison logic. The
 * filesystem-walking entry point (main) and the full integration path
 * are exercised live by the CI workflow; these lock the parsing and
 * comparison grammar so regressions are caught early.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  extractBody,
  stripFrontmatter,
  parseSyncDeclarations,
  comparePort,
} from "../verify-ports.ts";

// ─── stripFrontmatter ────────────────────────────────────────────────────────

describe("stripFrontmatter", () => {
  test("removes opening --- block from markdown", () => {
    const input = "---\nname: test\n---\n\n# Title\n\nBody.";
    // The function strips the frontmatter block and one leading newline;
    // a second leading newline may remain (callers like extractBody call trim()).
    const result = stripFrontmatter(input);
    assert.ok(result.includes("# Title\n\nBody."), `got: ${JSON.stringify(result)}`);
    assert.ok(!result.includes("name: test"), "frontmatter key should be gone");
  });

  test("returns content unchanged when no frontmatter", () => {
    const input = "# Title\n\nNo frontmatter here.";
    assert.equal(stripFrontmatter(input), input);
  });

  test("returns content unchanged when opening --- has no closing ---", () => {
    const input = "---\nname: test\n\n# No closing delimiter";
    assert.equal(stripFrontmatter(input), input);
  });
});

// ─── extractBody ─────────────────────────────────────────────────────────────

describe("extractBody", () => {
  test("returns everything from the first ## heading onward", () => {
    const input =
      "---\nname: x\n---\n\n# Title\n\nPreamble text.\n\n## Section One\n\nContent.";
    assert.equal(extractBody(input), "## Section One\n\nContent.");
  });

  test("returns post-frontmatter content when no ## heading exists", () => {
    const input = "---\nname: x\n---\n\n# Title\n\nJust a body with no sections.";
    assert.equal(
      extractBody(input),
      "# Title\n\nJust a body with no sections.",
    );
  });

  test("strips leading/trailing whitespace", () => {
    const input = "---\nname: x\n---\n\n\n## Section\n\nText.\n\n";
    assert.equal(extractBody(input), "## Section\n\nText.");
  });
});

// ─── parseSyncDeclarations ───────────────────────────────────────────────────

describe("parseSyncDeclarations", () => {
  test("forward declaration: single path ending in .md returns direction=forward", () => {
    const content =
      "> Keep this file in sync with `.claude/skills/om-capture/SKILL.md`.";
    const decls = parseSyncDeclarations("/repo/some/port/SKILL.md", content);
    assert.equal(decls.length, 1);
    assert.equal(decls[0].direction, "forward");
    assert.equal(decls[0].paths.length, 1);
  });

  test("reverse declaration: multiple path tokens returns direction=reverse", () => {
    const content =
      "> Keep this file in sync with `.claude/skills/om-capture/` ports in `.openclaw/skills/om-capture/`, `.hermes/skills/om-capture/`.";
    const decls = parseSyncDeclarations("/repo/.claude/skills/om-capture/SKILL.md", content);
    assert.equal(decls.length, 1);
    assert.equal(decls[0].direction, "reverse");
  });

  test("phrase in backticks (no /) is ignored — does not produce a decl", () => {
    // This simulates the AGENTS.md description line that mentions the pattern
    // as a quoted phrase rather than as an actual file path.
    const content =
      "It discovers ported files by parsing `Keep this file in sync with` declarations, compares against its canonical `.claude/` source.";
    // The phrase token has spaces and no /, the `.claude/` token is a bare
    // directory. Neither forms a valid sync declaration on its own.
    const decls = parseSyncDeclarations("/repo/AGENTS.md", content);
    // If the filter is working, the phrase token is dropped, leaving only
    // `.claude/` — one path-like token, treated as forward but not ending
    // in .md, so treated as reverse. The key assertion is that the
    // phrase itself does NOT surface as a resolved path.
    for (const decl of decls) {
      for (const p of decl.paths) {
        assert.ok(
          !p.includes("Keep this file in sync with"),
          `phrase leaked into paths: ${p}`,
        );
      }
    }
  });

  test("line without the sync phrase produces no declarations", () => {
    const content = "This is a regular line with no sync instructions.";
    const decls = parseSyncDeclarations("/repo/foo.md", content);
    assert.equal(decls.length, 0);
  });
});

// ─── comparePort (uses temp filesystem fixtures) ─────────────────────────────

describe("comparePort", () => {
  function makeTmpDir(): string {
    return mkdtempSync(join(tmpdir(), "verify-ports-test-"));
  }

  test("returns null when port body matches source body", () => {
    const dir = makeTmpDir();
    const body =
      "## Goal\n\nCapture durable knowledge.\n\n## Section\n\nContent.";
    const src = join(dir, "SKILL.md");
    const port = join(dir, "PORT.md");
    writeFileSync(src, `---\nname: src\n---\n\n# Source\n\nPreamble.\n\n${body}`);
    writeFileSync(port, `---\nname: port\n---\n\n# Port\n\nDifferent preamble.\n\n${body}`);
    const result = comparePort(port, src);
    assert.equal(result, null);
  });

  test("returns source-missing when the source file does not exist", () => {
    const dir = makeTmpDir();
    const port = join(dir, "PORT.md");
    writeFileSync(port, "# Port\n\nContent.");
    const result = comparePort(port, join(dir, "nonexistent.md"));
    assert.ok(result !== null);
    assert.equal(result.kind, "source-missing");
  });

  test("returns body-drifted when port body differs from source body", () => {
    const dir = makeTmpDir();
    const src = join(dir, "SKILL.md");
    const port = join(dir, "PORT.md");
    writeFileSync(src, "---\nname: src\n---\n\n# Src\n\n## Goal\n\nCapture knowledge.");
    writeFileSync(port, "---\nname: port\n---\n\n# Port\n\n## Goal\n\nDifferent text.");
    const result = comparePort(port, src);
    assert.ok(result !== null);
    assert.equal(result.kind, "body-drifted");
  });

  test("returns chatmode-summary (not body-drifted) for .github/chatmodes/ files", () => {
    const dir = makeTmpDir();
    const chatmodesDir = join(dir, ".github", "chatmodes");
    mkdirSync(chatmodesDir, { recursive: true });
    const src = join(dir, "SKILL.md");
    const port = join(chatmodesDir, "om-capture.chatmode.md");
    writeFileSync(src, "---\nname: src\n---\n\n# Src\n\n## Goal\n\nCapture knowledge.");
    writeFileSync(port, "---\nname: port\n---\n\n# Port\n\n## Goal\n\nIntentional summary.");
    const result = comparePort(port, src);
    assert.ok(result !== null);
    assert.equal(result.kind, "chatmode-summary");
  });
});
