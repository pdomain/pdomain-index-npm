---
Status: active
Owner: repository maintainers
Created: 2026-05-30
Last verified: 2026-11-07
Kind: convention
---

# Lint Deviations

## Agent Index

- **Kind:** convention
- **Status:** active
- **Read when:** adding, removing, or auditing a lint suppression.
- **Search terms:** lint suppression, ESLint deviation, ignore rule.

This file records persistent lint rule deviations that remain in repository
configuration.

## ESLint

| Rule                                                                                           | Location           | Justification                                                                                                                                                                |
| ---------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@typescript-eslint/no-floating-promises` `allowForKnownSafeCalls` for `test` from `node:test` | `eslint.config.js` | Node's test runner owns test registration promises and reports callback failures. The rule remains enabled for all other promise-returning test code.                        |
| `@typescript-eslint/no-unnecessary-type-assertion` disabled for `tests/**/*.ts`                | `eslint.config.js` | Test fixtures intentionally parse untyped JSON and assert only the fields under test. The disable is scoped to tests so production scripts still catch redundant assertions. |

## Ruff

`pyproject.toml` ignores `E501` for line length and `COM812` to avoid a
conflict with the formatter. The former `S603` entry no longer applies:
commit `6071e3a` deleted `scripts/update_github_actions.py`.
