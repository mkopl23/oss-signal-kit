#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "../src/cli.js";
import { GitHubClient } from "../src/github.js";
import { collectSignals } from "../src/signals.js";
import { renderMarkdown, renderSummary } from "../src/report.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    process.stdout.write(`${args.helpText}\n`);
    return;
  }

  const client = new GitHubClient({
    token: process.env.GITHUB_TOKEN || "",
    userAgent: "oss-signal-kit/0.1.0",
  });

  const signals = await collectSignals(client, args.repository);
  const markdown = renderMarkdown(signals);

  if (args.format === "json") {
    const json = `${JSON.stringify(signals, null, 2)}\n`;
    if (args.outDir) {
      await writeOutputs(args.outDir, markdown, json);
      process.stdout.write(`Wrote evidence pack to ${path.resolve(args.outDir)}\n`);
    } else {
      process.stdout.write(json);
    }
    return;
  }

  if (args.outDir) {
    await writeOutputs(args.outDir, markdown, `${JSON.stringify(signals, null, 2)}\n`);
    process.stdout.write(`Wrote evidence pack to ${path.resolve(args.outDir)}\n`);
    return;
  }

  process.stdout.write(`${renderSummary(signals)}\n\n`);
  process.stdout.write(markdown);
}

async function writeOutputs(outDir, markdown, json) {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "oss-signal-report.md"), markdown, "utf8");
  await writeFile(path.join(outDir, "oss-signal-report.json"), json, "utf8");
}

main().catch((error) => {
  process.stderr.write(`oss-signal-kit: ${error.message}\n`);
  process.exitCode = 1;
});
