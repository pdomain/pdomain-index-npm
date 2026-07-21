---
Status: active
Owner: repository maintainers
Created: 2026-07-21
Last verified: 2026-07-21
Kind: spec
---

# Verify every Pages deployment with the live npm smoke

## Agent Index

- **Kind:** spec
- **Status:** active
- **Owner:** repository maintainers
- **Created:** 2026-07-21
- **Last verified:** 2026-07-21
- **Read when:** implementing or reviewing post-deployment registry verification.
- **Search terms:** live smoke, Pages deployment, retry, npm install, workflow.
- **Relates to:** [active issue](../issues/2026-05-17-gh-007-automated-live-smoke.md)
- **Implementation plan:** [Automated live smoke](../plans/2026-07-21-automated-live-smoke.md)

## Every successful deployment will start one smoke job

The reusable `regen.yml` workflow will add a `smoke` job that depends on `deploy`. This covers scheduled, manual, repository-dispatch, and release-driven deployments. Pull-request CI will remain offline.

The job will check out the repository, set up Node 24, install locked tooling, and call existing `make smoke`. The smoke script remains the owner of packument, tarball, and clean-install validation.

## Retries absorb bounded Pages propagation delay

The job will attempt the smoke six times. A failed attempt waits 30 seconds before retrying, except after attempt six. This gives Pages up to 150 seconds of retry delay.

The job will use `timeout-minutes: 10`. All failed attempts fail the workflow. There is no `continue-on-error` or rollback because deployment is already complete.

## Static tests protect sequencing and limits

Workflow tests will assert the dependency, timeout, six-attempt loop, 30-second wait, and fail-closed behavior. A live run is deployment evidence, not local CI. One successful deployment run must be linked when closing the issue.

## Acceptance criteria

1. Every `regen.yml` deployment smokes after `deploy`.
2. Failures retry at most six times with 30-second waits.
3. The job times out after ten minutes and fails closed.
4. Pull-request CI does not contact the registry.
5. `make ci` and one deployment run pass.

## Adversarial Review

The design keeps external traffic out of pull-request CI and caps both retry
count and job duration. It fails closed after the final attempt and does not
hide a persistent deployment defect with `continue-on-error`.
