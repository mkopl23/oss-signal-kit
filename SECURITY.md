# Security Policy

## Supported Versions

The latest version on the default branch receives security fixes.

## Reporting a Vulnerability

Please open a private security advisory on GitHub if available, or contact the maintainer privately.

Do not include live tokens, private repository data, or other secrets in public issues.

## Design Constraints

`oss-signal-kit` should remain read-only:

- no GitHub write APIs
- no repository mutation
- no telemetry
- no AI provider calls in the core CLI
- no token persistence
