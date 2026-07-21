---
Status: active
Owner: repository maintainers
Created: 2026-07-21
Last verified: 2026-07-21
Kind: plan
---

# Automated Live Smoke Implementation Plan

## Agent Index

- **Kind:** plan
- **Status:** active
- **Owner:** repository maintainers
- **Created:** 2026-07-21
- **Last verified:** 2026-07-21
- **Read when:** implementing automated post-deployment smoke verification.
- **Search terms:** live smoke, deployment, retry, implementation plan.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify every successful Pages deployment with the existing clean-directory npm install smoke.

**Architecture:** Add a post-deploy job to the reusable regeneration workflow. Keep live checks out of pull-request CI, retry within a bounded propagation window, and fail when verification never succeeds.

**Tech Stack:** GitHub Actions, Node.js 24, Bash, npm, Node test runner

**Spec:** [Verify every Pages deployment with the live npm smoke](../specs/2026-07-21-automated-live-smoke-design.md)

---

## Goal

Run the existing live smoke after every successful Pages deployment.

## Architecture

Add one bounded, fail-closed job after `deploy` in the reusable workflow.

## Tech Stack

GitHub Actions, Node.js 24, Bash, npm, and the Node test runner.

## Global Constraints

- Keep live network checks out of pull-request CI.
- Reuse `make smoke`; do not duplicate smoke behavior in workflow YAML.
- Cap retries at six and the job at ten minutes.

### Task 1: Specify post-deployment sequencing and retry limits

**Files:**

- Modify: `tests/test_workflows.test.ts`
- Modify: `.github/workflows/regen.yml`

- [ ] **Step 1: Write the failing workflow test**

Add after the external publisher dispatch test:

```typescript
test("regen workflow runs a bounded live smoke after deployment", async () => {
  const workflow = await readFile(".github/workflows/regen.yml", "utf8");
  const deployJob = workflow.indexOf("  deploy:");
  const smokeJob = workflow.indexOf("  smoke:");

  assert.ok(deployJob >= 0);
  assert.ok(smokeJob > deployJob);
  assert.match(
    workflow.slice(smokeJob),
    /smoke:\n    needs: deploy\n    runs-on: ubuntu-latest\n    timeout-minutes: 10/,
  );
  assert.match(workflow.slice(smokeJob), /for attempt in \$\(seq 1 6\)/);
  assert.match(workflow.slice(smokeJob), /make smoke && exit 0/);
  assert.match(workflow.slice(smokeJob), /test "\$attempt" -eq 6 && exit 1/);
  assert.match(workflow.slice(smokeJob), /sleep 30/);
});
```

- [ ] **Step 2: Run the focused test**

Run:

```bash
npm run build --silent
node --test --test-name-pattern='bounded live smoke' dist/tests/test_workflows.test.js
```

Expected: FAIL because the smoke job is absent.

- [ ] **Step 3: Add the post-deployment job**

Append after `deploy`:

```yaml
smoke:
  needs: deploy
  runs-on: ubuntu-latest
  timeout-minutes: 10
  steps:
    - name: Checkout tooling
      uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v6.0.2
      with:
        persist-credentials: false

    - name: Setup Node
      uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v6.4.0
      with:
        node-version: "24"
        cache: "npm"

    - name: Install dependencies
      run: make setup

    - name: Verify the live registry
      run: |
        for attempt in $(seq 1 6); do
          echo "Live smoke attempt $attempt of 6"
          make smoke && exit 0
          test "$attempt" -eq 6 && exit 1
          sleep 30
        done
```

- [ ] **Step 4: Run focused and complete workflow tests**

Run:

```bash
npm run build --silent
node --test --test-name-pattern='bounded live smoke' dist/tests/test_workflows.test.js
node --test dist/tests/test_workflows.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/regen.yml tests/test_workflows.test.ts
git commit -m "ci: smoke test every Pages deployment"
```

### Task 2: Verify local gates stay offline

**Files:**

- Verify: `.github/workflows/regen.yml`
- Verify: `tests/test_workflows.test.ts`
- Verify: `tests/smoke/run.sh`

- [ ] **Step 1: Run static and full checks**

Run:

```bash
make static-check
make ci
```

Expected: PASS without contacting the live registry.

- [ ] **Step 2: Confirm pull-request CI has no live smoke**

Run: `rg -n 'make smoke|npm run smoke|tests/smoke/run.sh' .github/workflows/ci.yml`

Expected: no output.

### Task 3: Capture deployment evidence and close the issue

**Files:**

- Modify: `docs/issues/2026-05-17-gh-007-automated-live-smoke.md`
- Modify: `docs/context/current-state.md`
- Modify: `docs/context/intent-map.md`

- [ ] **Step 1: Trigger a deployment after merge**

Run:

```bash
gh workflow run regen.yml --repo pdomain/pdomain-index-npm
gh run list --repo pdomain/pdomain-index-npm --workflow regen.yml --limit 1
```

Expected: the newest run uses `workflow_dispatch`.

- [ ] **Step 2: Watch and inspect the run**

Capture the newest run ID and use it directly:

```bash
RUN_ID="$(gh run list --repo pdomain/pdomain-index-npm --workflow regen.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$RUN_ID" --repo pdomain/pdomain-index-npm --exit-status
gh run view "$RUN_ID" --repo pdomain/pdomain-index-npm --json url,conclusion,jobs
```

Expected: conclusion `success`; `deploy` and `smoke` jobs succeeded.

- [ ] **Step 3: Apply implemented-issue retirement**

Invoke `docgraph:doc-retirer` for the issue. Record the run URL, remove the issue from open-work context, and preserve GitHub provenance.

- [ ] **Step 4: Run closeout gates**

Run:

```bash
docgraph reindex
docgraph check --strict
make static-check
```

Expected: PASS.

- [ ] **Step 5: Commit closeout**

```bash
git add docs/issues/2026-05-17-gh-007-automated-live-smoke.md docs/context/current-state.md docs/context/intent-map.md
git commit -m "docs: close automated live smoke issue"
```
