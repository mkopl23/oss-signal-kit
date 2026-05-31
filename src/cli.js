const helpText = `oss-signal-kit

Generate a read-only OSS maintainer evidence pack from public GitHub signals.

Usage:
  oss-signal-kit <owner/repo|github-url> [--out <dir>] [--format markdown|json]

Environment:
  GITHUB_TOKEN  Optional. Used only for higher GitHub API rate limits.

Examples:
  oss-signal-kit openai/codex
  oss-signal-kit https://github.com/openai/codex --out reports/codex
  oss-signal-kit openai/codex --format json`;

export function parseArgs(argv) {
  const result = {
    repository: null,
    outDir: "",
    format: "markdown",
    help: false,
    helpText,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
      return result;
    }
    if (arg === "--out") {
      result.outDir = readValue(argv, index, "--out");
      index += 1;
      continue;
    }
    if (arg === "--format") {
      result.format = readValue(argv, index, "--format");
      if (!["markdown", "json"].includes(result.format)) {
        throw new Error("--format must be either markdown or json");
      }
      index += 1;
      continue;
    }
    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    if (result.repository) {
      throw new Error("Only one repository can be analyzed at a time");
    }
    result.repository = parseRepository(arg);
  }

  if (!result.repository) {
    throw new Error("Missing repository. Run with --help for usage.");
  }

  return result;
}

export function parseRepository(input) {
  const trimmed = input.trim();
  const match = trimmed.match(/^(?:https:\/\/github\.com\/)?([^/\s]+)\/([^/\s#?]+)(?:[/?#].*)?$/i);
  if (!match) {
    throw new Error("Repository must be owner/repo or a GitHub repository URL");
  }

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/i, ""),
    fullName: `${match[1]}/${match[2].replace(/\.git$/i, "")}`,
  };
}

function readValue(argv, index, option) {
  const value = argv[index + 1];
  if (!value || value.startsWith("-")) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}
