---
Status: active
Owner: repository maintainers
Created: 2026-07-21
Last verified: 2026-11-07
Kind: spec
---

# Verify every Pages deployment with the live npm smoke

## Agent Index

- **Kind:** spec
- **Status:** active
- **Owner:** repository maintainers
- **Created:** 2026-07-21
- **Last verified:** 2026-11-07
- **Read when:** implementing or reviewing post-publish registry verification.
- **Search terms:** live smoke, Pages deployment, retry, npm install, local publish.
- **Relates to:** [active issue](../issues/2026-05-17-gh-007-automated-live-smoke.md)
- **Implementation plan:** [Automated live smoke](../plans/2026-07-21-automated-live-smoke.md)

## Every successful deployment will start one smoke job

Proposal updated on 2026-11-07 for review. The code still publishes without smoke verification. This revision replaces the unimplemented GitHub Actions design with verification after a successful push by `scripts/publish-index.sh`. It does not record owner acceptance of the automation policy or authorize implementation or deployment.

The publisher will run a local verification helper after a changed index is pushed. Dry runs, unchanged output, generation failures, and push failures will not invoke smoke. The helper will call existing `make smoke`; `tests/smoke/run.sh` retains packument, release-asset, and clean-install validation.

The publisher will pass the generated `@pdomain/pdomain-ui` packument's `dist-tags.latest` as VERSION, including a prerelease fallback. It will require a matching generated version entry and package name before pushing. This prevents an older live latest from selecting an unrelated version for the check.

## Approaches

The proposed approach extends the current local publish path. A manual-only policy leaves verification easy to miss. Restoring a GitHub workflow adds a deployment path that the repository removed in `290f458`. The local helper reuses the current publisher and smoke without restoring those workflows. These are planning choices for owner review.

## Retries absorb bounded Pages propagation delay

Verification will attempt smoke at most six times, waiting 30 seconds after each failed attempt except the last. The maximum scheduled retry delay is 150 seconds.

Use GNU timeout with a 75-second limit per attempt and a 600-second limit over the whole verification phase. Each timeout has a five-second kill grace period, so final forced termination can take up to five seconds longer. A timed-out attempt can retry if the outer deadline allows it. The outer deadline may prevent all six attempts from completing. Cancellation must also terminate and reap the active attempt's process group, including smoke descendants.

All failed attempts or an expired deadline return non-zero. The command must say that the push succeeded but verification failed. It does not roll back the branch. Maintainers can rerun a pinned manual smoke after investigating or waiting for Pages propagation; an unchanged publish does not run the check again.

## Deployment target and scope

Default REGISTRY to `https://pdomain.github.io/pdomain-index-npm/` for `PAGES_BRANCH=gh-pages`. A custom branch requires an explicit non-empty REGISTRY before pushing. Accept HTTP or HTTPS and normalize a trailing slash. The caller must arrange serving of a custom branch at that URL.

Keep manual `make smoke` behavior unchanged and add no npm dependency. GNU timeout becomes a local publishing prerequisite. Check its availability before pushing.

The selected package/version check does not prove that every package changed by the push is live. If the selected version was already served, success also does not prove that Pages has switched to the newest branch commit. This proposal adds an installation check, not complete deployment freshness verification.

## Static tests protect sequencing and limits

Use behavioral subprocess tests with temporary repositories, a bare local origin, and fake external commands. Cover retry counts, delays, deadline arguments and real short-timeout termination, target/version selection, skip paths, rejected pushes, and cleanup. No ordinary CI test may publish or contact the live registry.

After local checks pass and deployment is authorized, capture one changed publish and its successful verification. Record the pushed commit, URL, package/version, status, and timestamp in the issue before closeout.

## Acceptance criteria

1. A successful changed push invokes smoke from the source repo root with the generated package version and configured registry.
2. Dry runs, unchanged output, generation failures, and rejected pushes do not run smoke.
3. At most six attempts use 30-second waits, a 75-second per-attempt limit, a 600-second overall deadline, and five-second kill grace periods.
4. Verification failure returns non-zero, reports the already completed push, and does not roll it back.
5. A custom branch requires an explicit HTTP or HTTPS registry URL before pushing.
6. `make ci` passes offline, and an authorized changed publish provides successful live evidence.

## Adversarial Review

The main risks are checking an old version, checking the wrong deployment, hanging during network installation, and obscuring a successful push when verification fails. The plan covers these with generated-version selection, explicit custom targets, bounded subprocesses, and separate push/verification reporting. Full deployment freshness remains outside this proposal.
