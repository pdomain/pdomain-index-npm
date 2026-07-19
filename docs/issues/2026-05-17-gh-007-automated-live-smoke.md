---
Status: active
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Decide whether deployments need an automated live smoke

## Agent Index

- **Kind:** issue
- **Status:** active
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Open
- **Severity:** Medium - deployment regressions lack an automated live check
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** changing deployment verification or deciding whether to restore a post-deploy smoke.
- **Search terms:** automated smoke, live registry, deployment gate, npm install, GitHub issue 7.
- **Relates to:** [Registry Format](../architecture/registry-format.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

The live smoke test exists, but the current deployment workflow does not run it. The historical `publish.yml` workflow ran the smoke after publishing. The replacement `regen.yml` workflow deploys without that external verification.

The original GitHub issue was closed after one successful historical run. This local record keeps the unresolved automation decision active without reopening the already implemented smoke script.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABCgcHMw`
- **Number and URL:** [#7](https://github.com/pdomain/pdomain-index-npm/issues/7)
- **Former state:** Closed with state reason `COMPLETED`
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-17T10:41:36Z
- **Updated and closed:** 2026-05-17T18:16:13Z
- **Labels:** `kind:feature`, `status:backlog`
- **Milestone:** `spec: pd-index-npm-new-repo (#1)`
- **Assignees, issue type, and project items:** None
- **Relationships:** Body text `Tracks: #1`; no formal parent or sub-issue link
- **Comments:** One public comment by `ConcaveTrillion` at 2026-05-17T18:16:12Z, [source](https://github.com/pdomain/pdomain-index-npm/issues/7#issuecomment-4472050503)
- **Raw SHA-256:** `3f4cfb9775cc3e0e0652f5308e163b2c3db91f3982b86d283af52916c58791f8`
- **Raw record:** `migration/github-issues/raw/issue-7.json`
- **Cutover commit:** `fd27739`, merged to `master` in `3ed18c0`.
- **Retention:** This issue is retained on GitHub. See the [migration ledger](../context/github-issues-migration-ledger.md) retention policy; the migration does not delete issues.

## Impact

- `make ci` checks the smoke script's shell syntax but does not test the deployed registry.
- A deployment can finish without an automated clean-directory `npm install` check.
- Maintainers can still run `make smoke` manually.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Historical workflow: .github/workflows/publish.yml at f5c388c
Current workflow: .github/workflows/regen.yml on master
Smoke script: tests/smoke/run.sh
```

## Evidence

1. Commit `f5c388c` added the clean-directory smoke script. The historical `publish.yml` ran it after publishing.
2. Author `ConcaveTrillion` reported on 2026-05-17T18:16:12Z that workflow run `25998785023` passed for `@concavetrillion/pd-ui@0.1.0-alpha`.
3. The current `.github/workflows/regen.yml` has no smoke job.
4. `package.json` maps `npm run smoke` to `bash tests/smoke/run.sh`, and `Makefile` exposes `make smoke`.

The historical success is an attributed report from the migrated comment. It proves one historical package and run, not current deployment health.

## Root-cause hypotheses

1. **The release-asset migration dropped the post-publish smoke with the legacy workflow.** Commit `02123ba` replaced `publish.yml` with Pages artifact deployment, and the current workflow has no equivalent job.
2. **Manual smoke execution may have been considered sufficient.** No durable decision records that acceptance, so this remains unproven.

## Defects to fix

1. Decide whether every deployment must run the live smoke after Pages becomes available.
2. If automation is required, define retry, timeout, and failure behavior for Pages propagation delay.
3. If manual verification is accepted, record the rationale and operational trigger in governed documentation.

## Next steps

1. The owner chooses automated or manual post-deploy verification.
2. Implement and test the chosen workflow or record the supported manual policy.
3. Resolve this record with the decision and evidence.

## What is NOT broken

- `tests/smoke/run.sh` performs the clean-directory installation check.
- `make smoke` and `npm run smoke` invoke the current script.
- The ordinary CI gate checks the script's shell syntax.

## Resolution

_Open._ The smoke implementation is complete. The unresolved question is whether deployment must run it automatically.
