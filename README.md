# oss-signal-kit

Generate a read-only evidence pack for open-source maintainers.

`oss-signal-kit` collects public GitHub repository signals and turns them into a concise Markdown/JSON report that maintainers can use for grant applications, sponsorship pages, project updates, maintainer handoffs, and programs such as Codex for Open Source.

It is intentionally boring and safe: it only reads public GitHub API data. It never modifies repositories, creates issues, opens pull requests, stars projects, uploads source code, or sends data to AI providers.

## Why this exists

Maintainers are often asked to prove that a project matters:

- Is it actively maintained?
- Does it have users or contributors?
- Are there release, issue, and pull request signals?
- Does the project have the basic community files expected by users and sponsors?
- Can the maintainer summarize this in 500 characters without digging through GitHub by hand?

`oss-signal-kit` makes that evidence easy to generate and easy to review.

## Quick Start

```bash
npx oss-signal-kit openai/codex
```

Write a reusable evidence pack:

```bash
npx oss-signal-kit openai/codex --out reports/codex
```

Generate JSON for automation:

```bash
npx oss-signal-kit openai/codex --format json
```

Use a token for higher GitHub API limits:

```bash
GITHUB_TOKEN=your_github_token npx oss-signal-kit openai/codex
```

The token is only sent to GitHub as an authorization header. It is not printed, stored, or written to reports.

## Output

When `--out` is provided, the CLI writes:

- `oss-signal-report.md`
- `oss-signal-report.json`

The Markdown report includes:

- repository description and metadata
- stars, forks, watchers, contributors, and open issues
- release and pull request activity
- GitHub community health percentage when available
- README, license, contributing guide, templates, and security policy presence
- 500-character application draft text
- safety notes explaining what the tool does and does not do

Note: GitHub's issues API includes pull requests in some counts. `oss-signal-kit` subtracts open pull requests from the open issue total to avoid overstating issue load.

## Example Application Drafts

The generated report includes short drafts for fields commonly found in OSS support programs:

```text
Why this repository qualifies
How API credits would be used
```

These are deterministic templates based on public repository signals. They are meant to be reviewed and edited by maintainers, not submitted blindly.

## Safety Model

`oss-signal-kit` is designed to avoid user harm:

- Read-only GitHub API calls only
- No write APIs
- No repository mutation
- No automatic starring or social actions
- No AI provider calls
- No source upload
- No telemetry
- No dependency packages in the runtime path
- Local files are written only when `--out <dir>` is provided

## Install From Source

```bash
git clone https://github.com/mkopl23/oss-signal-kit.git
cd oss-signal-kit
npm test
node bin/oss-signal-kit.js openai/codex
```

## Development

```bash
npm test
npm run check
```

The project uses Node.js built-ins only. Tests use `node:test`.

A GitHub Actions workflow template is available at `docs/github-actions-ci.yml`. Copy it to `.github/workflows/ci.yml` when Actions are available for the repository account.

## Roadmap

- npm package download signals
- PyPI package download signals
- OpenSSF Scorecard import
- GitHub Actions summary mode
- maintainer workload trend report
- sponsor/update page templates

## License

MIT
