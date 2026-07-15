---
Status: active
Owner: repository maintainers
Created: 2026-07-14
Last verified: 2026-07-15
Kind: context
---

# Current State

## Agent Index

- **Kind:** context
- **Status:** active
- **Read when:** starting work or checking current operational truth.
- **Search terms:** current state, priorities, risks, tests, registry.

## What matters now

The repository builds a read-only static npm registry. GitHub Pages serves
packuments, while allowlisted publisher GitHub Releases serve package bytes.
[`docs/REGISTRY_FORMAT.md`](../REGISTRY_FORMAT.md) is the current architecture.
The [GitHub issues migration ledger](github-issues-migration-ledger.md)
preserves historical issue outcomes and cutover provenance.
New governed reports follow the [repository issue process](../issues/README.md).

`make ci` is the required local gate. It runs TypeScript type checking, ESLint,
Prettier, actionlint, shell syntax checks, and the Node test suite.

## In-flight work

The [automated live smoke decision](../issues/2026-05-17-gh-007-automated-live-smoke.md)
remains open. The smoke is available manually, but the current deployment does
not run it.

## Risks and tests

No red or flaky test is documented. External GitHub Release assets and GitHub
Pages availability remain operational dependencies. `tests/smoke/run.sh`
validates the deployed package path after deployment.
