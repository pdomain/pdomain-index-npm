---
Status: active
Owner: repository maintainers
Created: 2026-07-14
Last verified: 2026-07-14
Kind: context
---

# Decisions

## Agent Index

- **Kind:** context
- **Status:** active
- **Read when:** researching durable architecture and lifecycle decisions.
- **Search terms:** decisions, rationale, tombstone, registry migration.

### 2026-07-14 — Keep full regeneration as the trusted deployment path

- **Context:** The historical release-asset design proposed a simple full scan
  and left incremental work outside its first scope.
- **Decision:** Every cron, manual, publisher-dispatch, and tooling-release
  trigger uses the reusable full-regeneration workflow.
- **Rationale:** A complete scan keeps payload input untrusted, preserves one
  deterministic path, and catches missed publisher dispatches.
- **Evidence:** `.github/workflows/regen.yml`, `scripts/regen-index.ts`,
  `tests/test_workflows.test.ts`, commits `7a71477`, `c83b5b3`, and `87e7e04`.
- **Remaining work:** Incremental regeneration remains deferred.

### 2026-07-14 — Expand validation beyond the migration design

- **Context:** Package bytes come from external GitHub Release assets.
- **Decision:** Require an allowlisted repository-to-package mapping, exact
  release-download repository URLs, canonical `package/package.json`, bounded
  compressed and extracted data, and immutable duplicate versions.
- **Rationale:** These checks keep package identity and resource use under the
  registry's control.
- **Evidence:** `scripts/regen-index.ts`, `tests/test_regen_index.test.ts`,
  `docs/REGISTRY_FORMAT.md`, commits `59ae42b`, `123c36b`, and `83ca383`.
- **Remaining work:** Add new publishers only with explicit mappings and tests.

### 2026-07-14 — Retired: npm Release Asset Registry Implementation Plan

- **Old path:** `docs/archive/plans/2026-05-30-npm-release-asset-registry.md`
- **Outcome:** Implemented and deleted after promotion.
- **Superseded by:** [`docs/REGISTRY_FORMAT.md`](../REGISTRY_FORMAT.md)
- **Removal commit:** Pending this retirement wave.
- **Rationale kept:** [`docs/REGISTRY_FORMAT.md`](../REGISTRY_FORMAT.md) records
  the shipped workflow and deviations. The decision “Keep full regeneration as
  the trusted deployment path” records why. The
  [`intent map`](intent-map.md) retains incremental regeneration and allowlist
  expansion.
- **Remaining work:** The two deferred intent items remain optional.

### 2026-07-14 — Retired: npm Release Asset Registry Design

- **Old path:** `docs/archive/specs/2026-05-30-npm-release-asset-registry-design.md`
- **Outcome:** Implemented and deleted after promotion.
- **Superseded by:** [`docs/REGISTRY_FORMAT.md`](../REGISTRY_FORMAT.md)
- **Removal commit:** Pending this retirement wave.
- **Rationale kept:** [`docs/REGISTRY_FORMAT.md`](../REGISTRY_FORMAT.md) and the
  decision “Expand validation beyond the migration design” preserve the
  shipped design and material deviations.
- **Remaining work:** The two deferred intent items remain optional.
