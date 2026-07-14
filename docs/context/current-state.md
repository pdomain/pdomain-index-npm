---
Status: active
Owner: repository maintainers
Created: 2026-07-14
Last verified: 2026-07-14
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

`make ci` is the required local gate. It runs TypeScript type checking, ESLint,
Prettier, actionlint, shell syntax checks, and the Node test suite.

## In-flight work

No product implementation is recorded as in flight.

## Risks and tests

No red or flaky test is documented. External GitHub Release assets and GitHub
Pages availability remain operational dependencies. `tests/smoke/run.sh`
validates the deployed package path after deployment.
