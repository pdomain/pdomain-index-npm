---
Status: active
Owner: repository maintainers
Created: 2026-07-21
Last verified: 2026-11-07
Kind: plan
---

# Automated Live Smoke Implementation Plan

## Agent Index

- **Kind:** plan
- **Status:** active
- **Owner:** repository maintainers
- **Created:** 2026-07-21
- **Last verified:** 2026-11-07
- **Read when:** implementing automated post-publish smoke verification.
- **Search terms:** live smoke, local publish, retry, implementation plan.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is a proposal for review; updating this document does not authorize a live publish.

**Goal:** Check the selected package with the existing clean-directory npm smoke after a successful local registry push.

**Architecture:** Extend `scripts/publish-index.sh` to call a bounded retry helper after pushing. Reuse `just smoke`, passing the version selected from the generated packument. Keep the normal CI gate offline.

**Tech Stack:** Bash, GNU timeout, Node.js, npm, TypeScript, Node test runner.

**Spec:** [Verify every Pages deployment with the live npm smoke](../specs/2026-07-21-automated-live-smoke-design.md)

## Goal

A successful publish command must report whether the selected package can be installed from the configured registry. A failed check must distinguish an already pushed index from a failed push.

## Architecture

The current publisher generates into a temporary `SITE` directory, changes into a detached worktree, and pushes to `gh-pages`. It never runs the smoke. Preserve its generation and push behavior, then invoke the helper from the repository root after a successful push.

Read the expected version from `SITE/@pdomain/pdomain-ui/index.html` before pushing. The smoke must use that version, rather than whichever `latest` the live registry happens to serve.

This replaces the old workflow proposal. Commit `290f458` removed the workflows; `6071e3a` deleted their remaining tests. Do not restore either as part of this work.

## Tech Stack

Use Bash for the helper and the existing TypeScript Node tests for subprocess verification. GNU `timeout` bounds live checks. Add no package dependency.

## Global Constraints

- Reuse `just smoke`; keep packument, tarball, and installation validation in `tests/smoke/run.sh`.
- Allow at most six attempts, with 30-second waits between failed attempts and no wait after attempt six.
- Bound each attempt at 75 seconds and the entire verification phase at 600 seconds. Use GNU timeout with a five-second kill grace period; forced termination can add up to five seconds.
- Dry runs, unchanged output, generation failures, and push failures must not run smoke.
- Normal `just ci` remains offline. Tests use local repositories and fake commands.
- Smoke failure returns non-zero and says the push succeeded. Do not roll back the published branch.
- Keep manual `just smoke` behavior unchanged.
- Updating this plan does not choose the automation policy on the owner's behalf or authorize publishing. Review the proposal before implementation; obtain authorization before live deployment.

## Review Focus

- A successful check of an old live `latest` must not hide failure to install the generated version. Task 2 pins the expected version.
- Dry runs and unchanged output must not trigger external checks. Task 2 tests both paths.
- A failed push must not be reported as a verification failure after deployment. Task 2 tests sequencing.
- A hanging smoke or exhausted retries must terminate and return non-zero. Task 1 tests both bounds.
- A custom branch must not silently check the production registry. Task 2 requires an explicit registry URL before pushing.

## Files and interfaces

- Create `scripts/verify-published-index.sh`: retry wrapper around `just smoke`.
- Modify `scripts/publish-index.sh`: validate verification inputs and invoke the wrapper after push.
- Create `tests/test_publish_index.test.ts`: offline subprocess tests for both scripts.
- Modify `package.json`: include both publish scripts in `shell:check`.
- Update `README.md`, `tests/smoke/README.md`, and `docs/architecture/registry-format.md` only when implementation ships.

Helper interface: `bash scripts/verify-published-index.sh REGISTRY VERSION`. Require two non-empty arguments. Run from the repository root. Each attempt runs `REGISTRY=<registry> PACKAGE=@pdomain/pdomain-ui VERSION=<version> just smoke`. Return 0 on success, 1 after exhausted attempts, and a non-zero timeout status when terminated.

Publisher input: optional `REGISTRY`. Default to `https://pdomain.github.io/pdomain-index-npm/` only when `PAGES_BRANCH=gh-pages`. For any other branch require an explicit non-empty `REGISTRY`. Accept HTTP or HTTPS URLs, normalize a trailing slash, and reject other schemes before pushing. A custom branch alone does not establish a deployment; the caller must arrange serving at that URL.

### Task 1: Add bounded smoke retries with offline tests

**Files:** Create `scripts/verify-published-index.sh` and `tests/test_publish_index.test.ts`; modify `package.json`.

**Interfaces:** Consume the helper interface above. Produce the helper exit statuses and logged attempt numbers for Task 2.

- [ ] **Step 1: Write failing subprocess tests.**

Use `node:test`, temporary directories, and an executable fake `just` prepended to `PATH`. Capture argv, environment, attempt counts, and exit status. Fake `sleep` records the requested delay without waiting. Test immediate success, success on attempt three, and six failures. Assert counts of one, three, and six; delays of zero, two, and five; each delay exactly 30 seconds; and unchanged registry/package/version arguments.

Add invalid-argument tests that make no attempt. Use a recording fake `timeout` to assert the 600-second outer limit, 75-second per-attempt limit, and five-second kill grace. Exercise GNU timeout separately with a short-lived test deadline and a hanging fake child and grandchild, proving both terminate without a ten-minute test. Cover outer cancellation while an inner attempt is running. Keep production limits fixed.

- [ ] **Step 2: Confirm the tests fail before implementation.**

Run `npm run build --silent` and `node --test dist/tests/test_publish_index.test.js`. Expected: missing helper failures.

- [ ] **Step 3: Implement the helper.**

Use strict Bash handling. Have the helper start its retry loop in a private internal mode under the outer timeout. Bound each `just smoke` attempt with the inner timeout. Use GNU timeout's default process-group behavior, without `--foreground`. Track the active inner timeout process group; on outer cancellation, terminate that group and wait for it, escalating to KILL within the five-second grace. Nested timeout groups must not leave smoke descendants running. Treat a timed-out attempt as a failure eligible for retry. Log each attempt and preserve a non-zero result when all fail or the outer deadline expires. Check for GNU timeout before entering the loop.

Add both `scripts/publish-index.sh` and `scripts/verify-published-index.sh` to the existing `shell:check` command in `package.json`.

- [ ] **Step 4: Run the focused tests and syntax check.**

Run `npm run build --silent`, `node --test dist/tests/test_publish_index.test.js`, and `npm run shell:check`. Expected: all pass without live HTTP or real sleeps.

- [ ] **Step 5: Commit only Task 1 files.**

Use `feat: add bounded post-publish smoke helper` after required language and repository gates pass. Preserve the existing uncommitted documentation work.

### Task 2: Connect successful pushes to verification

**Files:** Modify `scripts/publish-index.sh` and `tests/test_publish_index.test.ts`.

**Interfaces:** Consume Task 1's helper. Derive VERSION from the generated packument's `dist-tags.latest` and require a matching `versions[VERSION]` entry with name `@pdomain/pdomain-ui`. The generator may select a prerelease when no stable version exists; accept that selection.

- [ ] **Step 1: Write failing publisher integration tests.**

Run a copy of the real publisher in a temporary local Git repo with a bare local origin. A fake invocation, `REGEN_ROOT=<path> just regen-index`, writes fixture packuments to that path; fake smoke and sleep commands record their use. Set a dummy `GH_TOKEN` so no authentication lookup occurs. Never use the real origin or credentials.

Assert successful push precedes smoke, the helper runs from the repo root rather than the generated worktree, and VERSION is the generated selection even when the fake live latest differs. Test prerelease fallback, malformed or missing generated metadata rejected before push, generation failure, push rejection, dry run, unchanged output, and smoke exhaustion after a successful push. The last case must return non-zero while the pushed commit remains on the local origin.

Test the default production URL, explicit URL override, trailing slash normalization, invalid scheme rejection, and custom branch without REGISTRY rejected before push. Include a custom branch plus explicit URL success case. Verify worktree and temporary output cleanup on both verification success and failure.

- [ ] **Step 2: Confirm the new assertions fail.**

Run `npm run build --silent` and `node --test dist/tests/test_publish_index.test.js`. Expected: publisher sequencing and input-validation assertions fail.

- [ ] **Step 3: Extend the publisher.**

Validate registry configuration and GNU timeout availability before a real push. After the dry-run and unchanged-output exits, parse the generated JSON with Node and validate the expected package/version before committing or pushing. Capture the version before changing directories or pass the absolute SITE path explicitly.

After push succeeds, return to `REPO_ROOT` and invoke the helper under explicit status handling. On failure print that the index was pushed but verification failed, retain the helper's non-zero status, and let the existing EXIT trap clean up. On success report both push and verification success. An unchanged run still reports no publish and no live verification.

- [ ] **Step 4: Run focused and full gates.**

Run `npm run build --silent`, `node --test dist/tests/test_publish_index.test.js`, and `just ci`. Expected: all pass offline. Confirm tests never call the real GitHub origin, curl, or npm install for the live smoke.

- [ ] **Step 5: Commit only Task 2 files.**

Use `feat: verify the registry after local publish` after required language and repository gates pass.

### Task 3: Document behavior and collect authorized live evidence

**Files:** Modify `README.md`, `tests/smoke/README.md`, `docs/architecture/registry-format.md`, the [active issue](../issues/2026-05-17-gh-007-automated-live-smoke.md), `docs/roadmap.md`, and the context docs affected by actual shipped behavior.

- [ ] **Step 1: Update operational documentation after implementation.**

Describe defaults, custom deployment configuration, bounds, skip cases, and recovery. Fix the smoke README's obsolete workflow troubleshooting. If smoke fails after push, inspect the failure and rerun `REGISTRY=<url> VERSION=<generated-version> just smoke` after Pages is available. An unchanged rerun of publish does not repeat verification.

- [ ] **Step 2: Request authorization immediately before a live publish.**

Present passing local checks and the target branch/registry. Do not run the publisher, even in dry-run mode, as part of this plan update. A dry run still fetches releases and is not live deployment evidence.

- [ ] **Step 3: Capture a real changed publish and its verification result.**

After authorization, record the pushed commit, target URL, generated package/version, verification exit status, and timestamp. A no-change invocation is insufficient evidence. A failed check leaves the issue open; it does not undo the push.

- [ ] **Step 4: Reconcile the issue and context only after success.**

Record the accepted policy and successful evidence. Invoke `docgraph:doc-retirer` for issue closeout rather than deleting it by hand. Remove the resolved item from the roadmap and update current-state and intent only to match shipped behavior. Preserve historical decisions and GitHub provenance.

- [ ] **Step 5: Verify and commit closeout documentation.**

Run `just ci`, reindex, `docgraph check --strict`, and `git diff --check`. Expected: all pass. Commit only the reviewed closeout docs. Do not push source changes without authorization.
