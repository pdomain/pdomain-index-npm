---
Status: active
Owner: repository maintainers
Created: 2026-05-30
Last verified: 2026-07-14
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

| Rule   | Location                           | Justification                                                                                           |
| ------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `S603` | `scripts/update_github_actions.py` | The executable is resolved from `PATH`, arguments use a list, and `shell=False` prevents shell parsing. |
