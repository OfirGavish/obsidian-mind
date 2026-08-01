/**
 * verify-ports.ts — port drift detector for obsidian-mind
 *
 * PURPOSE
 * -------
 * Many files in this repo are ported copies of canonical content from
 * .claude/ (commands, agents, skills). Each port carries a "keep in sync
 * with" comment so authors know the source. Comments don't enforce anything.
 * This script does.
 *
 * HOW IT WORKS
 * ------------
 * 1. Walk the repo tree looking for markdown files that contain
 *    "Keep this file in sync with `<source-path>`".
 * 2. For each declared (port, source) pair, check:
 *    a. "Port whose source no longer exists" — source path is missing
 *    b. "Port whose substantive content has diverged" — body content differs
 *       after stripping the per-agent preamble (see WHAT WE COMPARE below)
 * 3. Also discover "missing ports" by reading the canonical source's own
 *    sync declaration (the reverse direction: "keep these paths in sync with
 *    this file") and checking whether each declared port path exists.
 * 4. Exit non-zero when any drift is found so the check can gate CI.
 *
 * WHAT WE COMPARE
 * ---------------
 * We compare the "body" of each file, defined as everything from the first
 * level-2 heading (## ...) onward. This strips:
 *   - YAML frontmatter (between opening and closing ---)
 *   - The H1 title line
 *   - Agent-specific preamble text between the title and the first ## section
 *     (provisional callouts, ephemerality warnings, sync-note reminders, etc.)
 *
 * We do NOT compare the preamble because that is where legitimate per-agent
 * differences live. We do compare every ## section body, including examples.
 *
 * Consequence: a port that OMITS a ## section that exists in the source, or
 * that changes the text inside a section, will be flagged as drifted.
 * A port that ADDS a new ## section absent from the source will NOT be
 * flagged — added context is intentional (e.g. the Hermes ephemerality note
 * and Scout's warnings are in the preamble, not in ## sections).
 *
 * For reference.md files and similar short files without ## sections, we
 * compare everything after the frontmatter (same stripping logic, just no
 * ## boundary to find, so all content after frontmatter is compared).
 *
 * WHAT WE DO NOT CHECK
 * --------------------
 *   - Frontmatter schemas: legitimately differ per agent
 *   - Preamble text: legitimately differs (provisional notes, agent-specific
 *     callouts, sync-note reminders, Hermes/Scout ephemerality warnings)
 *   - VS Code chatmodes: these are intentional summaries, not verbatim copies,
 *     so they will typically show as drifted — that is expected and should be
 *     reviewed manually when the source changes
 *
 * SYNC COMMENT FORMATS
 * --------------------
 * This script recognises two formats used in the repo:
 *
 *   Forward (in a port, pointing at its source):
 *     Keep this file in sync with `.claude/skills/om-capture/SKILL.md`.
 *
 *   Reverse (in the source, listing its ports):
 *     Keep this file in sync with `.claude/skills/om-capture/` ports in
 *     `.openclaw/skills/`, `.hermes/skills/`, and `.github/chatmodes/`.
 *
 * The forward format uses a single backtick-quoted path ending in .md or /.
 * The reverse format lists multiple backtick-quoted paths.
 *
 * RUNNING
 * -------
 *   node --disable-warning=ExperimentalWarning --experimental-strip-types \
 *     .claude/scripts/verify-ports.ts
 *
 * Returns exit code 0 if no drift found, 1 if any drift found.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isMainModule } from "./lib/main-guard.ts";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../..");

// ─── PARSING ────────────────────────────────────────────────────────────────

/** Strip YAML frontmatter (the --- ... --- block at the top of the file). */
function stripFrontmatter(content: string): string {
  if (!content.startsWith("---")) return content;
  const end = content.indexOf("\n---", 3);
  if (end === -1) return content;
  return content.slice(end + 4).replace(/^\n/, "");
}

/**
 * Extract the "substantive body" for comparison.
 * For files that have ## sections: everything from the first ## onward.
 * For files without ## sections: everything after frontmatter.
 */
function extractBody(content: string): string {
  const withoutFrontmatter = stripFrontmatter(content);
  const firstH2 = withoutFrontmatter.indexOf("\n##");
  if (firstH2 === -1) return withoutFrontmatter.trim();
  return withoutFrontmatter.slice(firstH2 + 1).trim();
}

/**
 * Parse "Keep this file in sync with `<path>`" declarations.
 *
 * Returns an array of objects describing the relationship:
 *   - sourceFile: the file that contains the declaration
 *   - direction: "forward" = this file is a port pointing at its source;
 *               "reverse" = this file is the source listing its port destinations
 *   - paths: the paths extracted from the declaration
 */
interface SyncDecl {
  sourceFile: string; // abs path of the file containing the declaration
  direction: "forward" | "reverse";
  paths: string[]; // abs paths extracted from the declaration
}

function parseSyncDeclarations(filePath: string, content: string): SyncDecl[] {
  // Match lines/blocks containing "Keep this file in sync with"
  const decls: SyncDecl[] = [];
  const fileDir = dirname(filePath);

  // Regex to find all backtick-quoted tokens in a sync declaration line
  const backtickPathRe = /`([^`]+)`/g;

  for (const line of content.split("\n")) {
    if (!line.includes("Keep this file in sync with")) continue;

    // Collect all backtick-quoted tokens on this line, then filter to
    // path-like tokens only (no spaces, must contain a path separator /).
    // This avoids matching prose that describes the pattern — e.g. a doc
    // line that writes `Keep this file in sync with` in backticks as a
    // quoted phrase rather than as an actual file path.
    const allTokens: string[] = [];
    let m: RegExpExecArray | null;
    backtickPathRe.lastIndex = 0;
    while ((m = backtickPathRe.exec(line)) !== null) {
      allTokens.push(m[1]);
    }
    const tokens = allTokens.filter((t) => !t.includes(" ") && t.includes("/"));

    if (tokens.length === 0) continue;

    // Determine direction:
    //   Forward: exactly one token, ends with .md (e.g. `.claude/skills/om-capture/SKILL.md`)
    //   Reverse: multiple tokens, or one token that ends with / (directory)
    const paths = tokens.map((t) => resolve(repoRoot, t));

    if (
      tokens.length === 1 &&
      (tokens[0].endsWith(".md") || tokens[0].endsWith(".chatmode.md"))
    ) {
      decls.push({ sourceFile: filePath, direction: "forward", paths });
    } else {
      // Reverse: source lists its ports. The source itself is implied to be
      // the first token (which is a directory ending in /). The ports are
      // the remaining tokens that are directories. We don't try to enumerate
      // every file in a port directory here — we just record the directories.
      // Downstream code expands them by looking for matching filenames.
      decls.push({ sourceFile: filePath, direction: "reverse", paths });
    }
  }

  return decls;
}

// ─── FILE DISCOVERY ─────────────────────────────────────────────────────────

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  ".obsidian",
  ".shardmind",
  "thinking",
  "work",
  "org",
  "perf",
  "brain",
  "reference",
  "bases",
  "templates",
  "docs",
]);

function walkMarkdown(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!SKIP_DIRS.has(entry) && !entry.startsWith(".obsidian")) {
        results.push(...walkMarkdown(full));
      }
    } else if (entry.endsWith(".md") || entry.endsWith(".chatmode.md")) {
      results.push(full);
    }
  }
  return results;
}

// ─── DRIFT DETECTION ────────────────────────────────────────────────────────

interface DriftResult {
  kind:
    | "source-missing"
    | "port-missing"
    | "body-drifted"
    | "chatmode-summary";
  portFile: string;
  sourceFile: string;
  detail?: string;
}

function comparePort(portFile: string, sourceFile: string): DriftResult | null {
  if (!existsSync(sourceFile)) {
    return {
      kind: "source-missing",
      portFile,
      sourceFile,
      detail: `declared source does not exist`,
    };
  }

  const portContent = readFileSync(portFile, "utf-8");
  const sourceContent = readFileSync(sourceFile, "utf-8");

  const portBody = extractBody(portContent);
  const sourceBody = extractBody(sourceContent);

  if (portBody === sourceBody) return null;

  // VS Code chatmodes are intentional summaries, not verbatim copies.
  // Flag them separately so they can be reviewed without blocking CI.
  if (portFile.includes(".github/chatmodes/")) {
    return {
      kind: "chatmode-summary",
      portFile,
      sourceFile,
      detail: `chatmode is an intentional summary — review manually when source changes`,
    };
  }

  return {
    kind: "body-drifted",
    portFile,
    sourceFile,
    detail: buildDiffSummary(portBody, sourceBody),
  };
}

/**
 * Build a compact summary of what sections differ between port and source.
 * We split on ## headings and compare section-by-section for readability.
 */
function buildDiffSummary(portBody: string, sourceBody: string): string {
  // Split on level-2 and level-3 headings so we can name which section drifted
  const sectionRe = /^(#{2,3} .+)$/m;

  const portSections = splitSections(portBody);
  const sourceSections = splitSections(sourceBody);

  const drifted: string[] = [];

  for (const [heading, sourceText] of sourceSections) {
    const portText = portSections.get(heading);
    if (portText === undefined) {
      drifted.push(`missing section: ${heading}`);
    } else if (portText.trim() !== sourceText.trim()) {
      drifted.push(`section differs: ${heading}`);
    }
  }

  if (drifted.length === 0) {
    // Port has extra sections not in source, or whitespace differs
    return "content differs (port may have extra sections or whitespace differences)";
  }

  return drifted.join("; ");
}

function splitSections(body: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = body.split("\n");
  let currentHeading = "(preamble)";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (/^#{2,3} /.test(line)) {
      sections.set(currentHeading, currentLines.join("\n"));
      currentHeading = line;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  sections.set(currentHeading, currentLines.join("\n"));
  return sections;
}

// ─── MISSING PORT DETECTION ─────────────────────────────────────────────────

/**
 * When the canonical source file (e.g. SKILL.md) declares "Keep this file in
 * sync with ... ports in X/, Y/, Z/", we check whether each declared port
 * directory contains a file with the same basename as the source.
 *
 * This catches ports that were declared but never created, or deleted after
 * the fact.
 */
function findMissingPorts(
  sourceFile: string,
  content: string,
): DriftResult[] {
  const missing: DriftResult[] = [];
  const basename = sourceFile.split("/").pop()!;

  for (const line of content.split("\n")) {
    if (!line.includes("Keep this file in sync with")) continue;

    // Only process the reverse direction (lists port destinations)
    const backtickPathRe = /`([^`]+)`/g;
    const allTokens: string[] = [];
    let m: RegExpExecArray | null;
    backtickPathRe.lastIndex = 0;
    while ((m = backtickPathRe.exec(line)) !== null) {
      allTokens.push(m[1]);
    }
    // Filter to path-like tokens only (no spaces, must contain /)
    const tokens = allTokens.filter((t) => !t.includes(" ") && t.includes("/"));

    if (tokens.length <= 1) continue; // forward declaration, not reverse

    for (const token of tokens) {
      // Skip the self-reference (the source's own directory)
      if (sourceFile.includes(token.replace(/\/$/, ""))) continue;

      // Tokens ending in / are directories. Look for the same basename there.
      if (token.endsWith("/")) {
        const expectedPortFile = resolve(repoRoot, token, basename);
        if (!existsSync(expectedPortFile)) {
          missing.push({
            kind: "port-missing",
            portFile: expectedPortFile,
            sourceFile,
            detail: `declared in source's sync note but file does not exist`,
          });
        }
      } else {
        // Explicit file path
        const expectedPortFile = resolve(repoRoot, token);
        if (!existsSync(expectedPortFile)) {
          missing.push({
            kind: "port-missing",
            portFile: expectedPortFile,
            sourceFile,
            detail: `declared in source's sync note but file does not exist`,
          });
        }
      }
    }
  }

  return missing;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

function main(): void {
  const allMarkdown = walkMarkdown(repoRoot);
  const drift: DriftResult[] = [];
  const seenPairs = new Set<string>(); // avoid double-reporting

  for (const file of allMarkdown) {
    const content = readFileSync(file, "utf-8");
    if (!content.includes("Keep this file in sync with")) continue;

    const decls = parseSyncDeclarations(file, content);

    for (const decl of decls) {
      if (decl.direction === "forward") {
        // This file is a port; compare it against its declared source
        const sourceFile = decl.paths[0];
        const pairKey = `${file}→${sourceFile}`;
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);

        const result = comparePort(file, sourceFile);
        if (result) drift.push(result);
      } else {
        // This file is the source; check for missing ports
        const missing = findMissingPorts(file, content);
        drift.push(...missing);
      }
    }
  }

  // ─── Report ───────────────────────────────────────────────────────────────

  if (drift.length === 0) {
    console.log("✓ No port drift detected.");
    process.exit(0);
  }

  // Separate blocking from informational findings
  const blocking = drift.filter(
    (d) => d.kind !== "chatmode-summary",
  );
  const informational = drift.filter(
    (d) => d.kind === "chatmode-summary",
  );

  if (informational.length > 0) {
    console.log("\n📋 Chatmode summaries (review manually when source changes):");
    for (const d of informational) {
      const rel = relative(repoRoot, d.portFile);
      const src = relative(repoRoot, d.sourceFile);
      console.log(`  ⚠  ${rel}`);
      console.log(`       source: ${src}`);
      console.log(`       note:   ${d.detail}`);
    }
  }

  if (blocking.length === 0) {
    console.log("\n✓ No blocking drift detected.");
    process.exit(0);
  }

  console.error(`\n✖ Port drift found (${blocking.length} issue${blocking.length === 1 ? "" : "s"}):\n`);

  for (const d of blocking) {
    const rel = relative(repoRoot, d.portFile);
    const src = relative(repoRoot, d.sourceFile);

    switch (d.kind) {
      case "source-missing":
        console.error(`  ✖ source-missing: ${rel}`);
        console.error(`       declared source: ${src}`);
        break;
      case "port-missing":
        console.error(`  ✖ port-missing: ${rel}`);
        console.error(`       declared in:   ${src}`);
        break;
      case "body-drifted":
        console.error(`  ✖ body-drifted: ${rel}`);
        console.error(`       against:   ${src}`);
        if (d.detail) {
          console.error(`       detail:    ${d.detail}`);
        }
        break;
    }
  }

  console.error(
    `\n  Fix: update the port(s) to match their canonical source in .claude/`,
  );
  console.error(
    `  or update the source and sync all ports together.\n`,
  );

  process.exit(1);
}

export { stripFrontmatter, extractBody, parseSyncDeclarations, findMissingPorts, comparePort };
export type { SyncDecl, DriftResult };

if (isMainModule(import.meta.url)) main();
