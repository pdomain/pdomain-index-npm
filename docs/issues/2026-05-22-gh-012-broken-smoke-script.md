---
Status: retired
Owner: repository maintainers
Created: 2026-05-22
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Fix broken npm smoke script

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Low - false failure on the advertised command, fixed
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** running the smoke command or wiring smoke into automation.
- **Search terms:** npm run smoke, smoke script, dist/smoke.js, tests/smoke/run.sh, GitHub issue 12
- **Relates to:** [Registry Format](../architecture/registry-format.md), [Smoke Test](../../tests/smoke/README.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

A review finding: `package.json` defined `smoke` as `node dist/smoke.js`, but no `scripts/smoke.ts` existed to produce that file. The advertised command failed with a missing-module error unrelated to registry behavior.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABDJFSPQ`
- **Number and URL:** [#12](https://github.com/pdomain/pdomain-index-npm/issues/12)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-22T21:58:41Z
- **Updated:** 2026-05-22T21:58:41Z
- **Closed:** None
- **Labels:** `kind:chore`, `effort:S`, `model:sonnet`, `model-effort:low`, `status:backlog`
- **Milestone:** None
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `ee15de99a8f6f14a50a7ffa1f86ea427379d655edc14f2ad8d7d980266ad0fc9`
- **Raw record:** `migration/github-issues/raw/issue-12.json`

## Original body (verbatim)

```text
## Finding

Low tests/maintainability: `npm run smoke` points at a missing built file.

## Evidence

- `package.json:20` defines `"smoke": "node dist/smoke.js"`.
- There is no `scripts/smoke.ts`; the actual smoke test is `tests/smoke/run.sh`.
- `npm run smoke --silent` fails with a missing `dist/smoke.js` module.

## Impact

Maintainers running the advertised smoke command get a false failure unrelated to registry behavior.

## Suggested fix

Change the package script to `bash tests/smoke/run.sh`, or add a real TypeScript smoke entrypoint that compiles to `dist/smoke.js`.

## Source

Filed from deep review/security scan report: `reports/security-review-2026-05-22/pd-index-npm.md`.

```

## Comments (verbatim)

None.

## Impact

- Maintainers running the documented smoke command got a false failure.
- The real smoke test, `tests/smoke/run.sh`, was reachable only if you already knew it existed.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Broken definition: package.json:20, "smoke": "node dist/smoke.js"
Actual smoke test: tests/smoke/run.sh
Source: reports/security-review-2026-05-22/pd-index-npm.md (absent from this repo's history)
```

## Evidence

1. The finding as filed is preserved verbatim above, including the failing command.
2. `package.json` now defines `smoke` as `bash tests/smoke/run.sh`.
3. `Makefile` exposes the same script through `make smoke`.
4. [Registry Format](../architecture/registry-format.md) section "Live smoke test boundary" records that both entry points invoke `tests/smoke/run.sh`.

## Root-cause hypotheses

**(Confirmed) The package script referenced a build output that was never produced.** The entry point was written for a TypeScript smoke module that did not exist, while the working smoke test was a shell script at a different path. The issue offered two fixes - repoint the script, or add the missing TypeScript entrypoint - and the first was taken.

## Defects to fix

1. **`smoke` pointed at a non-existent `dist/smoke.js`** - fixed by repointing to `bash tests/smoke/run.sh`. (Primary)

## Next steps

None for this defect. Separately, whether deployments must run the smoke automatically is still open and tracked in the [automated live smoke issue](2026-05-17-gh-007-automated-live-smoke.md).

## Outcome

Completed. `package.json` now maps `smoke` to `bash tests/smoke/run.sh`, which is the first of the two fixes the issue proposed. Fixed in `2c49a7c`. Whether smoke runs automatically on deployment is a separate open question tracked in the [automated live smoke issue](2026-05-17-gh-007-automated-live-smoke.md).

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
