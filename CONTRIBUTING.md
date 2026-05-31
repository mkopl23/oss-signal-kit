# Contributing

Thanks for helping improve `oss-signal-kit`.

## Principles

- Keep the CLI read-only by default.
- Do not add telemetry.
- Do not call AI providers from the core CLI.
- Do not write files unless the user explicitly provides an output path.
- Prefer deterministic reports over opaque scoring.
- Keep dependencies minimal and justified.

## Local Checks

```bash
npm test
npm run check
```

## Pull Requests

Please include:

- what changed
- why it is useful for maintainers
- safety impact, especially if the change touches network calls or file output
- tests for new behavior

## Security

Do not include secrets in issues, pull requests, examples, screenshots, or test fixtures.
