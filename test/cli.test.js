import test from "node:test";
import assert from "node:assert/strict";
import { parseArgs, parseRepository } from "../src/cli.js";

test("parseRepository accepts owner/repo", () => {
  assert.deepEqual(parseRepository("openai/codex"), {
    owner: "openai",
    repo: "codex",
    fullName: "openai/codex",
  });
});

test("parseRepository accepts GitHub URLs", () => {
  assert.deepEqual(parseRepository("https://github.com/openai/codex.git"), {
    owner: "openai",
    repo: "codex",
    fullName: "openai/codex",
  });
});

test("parseArgs reads output directory and format", () => {
  const args = parseArgs(["openai/codex", "--out", "reports", "--format", "json"]);
  assert.equal(args.repository.fullName, "openai/codex");
  assert.equal(args.outDir, "reports");
  assert.equal(args.format, "json");
});

test("parseArgs rejects unknown options", () => {
  assert.throws(() => parseArgs(["openai/codex", "--write"]), /Unknown option/);
});
