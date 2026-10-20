# Security Policy

## Supported versions

| Version      | Supported |
| ------------ | --------- |
| 1.0.0-beta.x | ✅        |
| < 1.0.0-beta | ❌        |

## Reporting a vulnerability

BEK packages are UI libraries (tokens, React components, charts) and the docs site; they run no server code. Still, if you find something — XSS through a prop, an unsafe `dangerouslySetInnerHTML`, a dependency with a known CVE, a leaked secret in the repo history — please report it privately:

1. Use **GitHub → Security → Report a vulnerability** on this repository (private advisory), or
2. Message the owner privately on GitHub ([@nurxonovn](https://github.com/nurxonovn)).

Please **do not** open a public issue for security reports.

You will get an acknowledgement within 7 days and a fix or a decision within 30 days. Credit is given in the release notes unless you prefer otherwise.

## Scope

- `@bek/tokens`, `@bek/react`, `@bek/charts` published packages
- `apps/site` (GitHub Pages)
- This repository's CI workflows

Out of scope: the Figma file, third-party services linked from the docs.
