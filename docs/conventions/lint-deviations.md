# Lint Deviations

This file records persistent lint rule deviations that remain in repository
configuration.

## ESLint

| Rule                                                                                           | Location           | Justification                                                                                                                                                                |
| ---------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@typescript-eslint/no-floating-promises` `allowForKnownSafeCalls` for `test` from `node:test` | `eslint.config.js` | Node's test runner owns test registration promises and reports callback failures. The rule remains enabled for all other promise-returning test code.                        |
| `@typescript-eslint/no-unnecessary-type-assertion` disabled for `tests/**/*.ts`                | `eslint.config.js` | Test fixtures intentionally parse untyped JSON and assert only the fields under test. The disable is scoped to tests so production scripts still catch redundant assertions. |
