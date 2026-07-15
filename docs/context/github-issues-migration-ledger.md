---
Status: active
Owner: repository maintainers
Created: 2026-07-15
Last verified: 2026-07-15
Kind: context
---

# GitHub Issues Migration Ledger

## Agent Index

- **Kind:** context
- **Status:** active
- **Read when:** tracing migrated GitHub issue provenance, outcomes, or deletion evidence.
- **Search terms:** GitHub issues migration, issue provenance, raw digest, cutover, deletion journal.

This ledger preserves the repository's GitHub issue history after the issue tracker cutover. Each raw digest covers the exported GraphQL record, comments, REST timeline, and REST events for one issue.

The exact public API records are stored under `migration/github-issues/raw/` outside the governed docs tree. `migration/github-issues/issue.graphql` records the GraphQL selection. Each raw file is canonicalized with `jq -S` over an object with `graphql`, `timeline`, and `events` keys before hashing. The records contain no credentials or temporary tokens.

## Inventory and reconciliation

| Issue                                                         | Former state      | Title                                                                        | Comments | Raw SHA-256                                                        | Classification | Durable destination                                                                                                                                                                                                       | Evidence                                                                                    | Deletion status |
| ------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------- | -------: | ------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------- |
| [#1](https://github.com/pdomain/pdomain-index-npm/issues/1)   | Open              | Spec: Static npm registry on GitHub Pages                                    |        0 | `3b7d286d799580bc7329c788f8a9de9e26902fcdd1488317adb813ce606612ab` | Completed      | [Registry Format](../REGISTRY_FORMAT.md), [README](../../README.md)                                                                                                                                                       | `5fd3d1d`, `bc011b5`, `02123ba`; `scripts/regen-index.ts`; `tests/test_regen_index.test.ts` | Pending         |
| [#2](https://github.com/pdomain/pdomain-index-npm/issues/2)   | Open              | Create the GitHub repo + initial scaffold                                    |        0 | `8c7a4d1bf10989f4bb9cd5d90d90f8b2cd904c2ce7b3bb78ef16d9a3ce2422a8` | Completed      | [Current State](current-state.md), [README](../../README.md)                                                                                                                                                              | `5fd3d1d`; `package.json`; `Makefile`; `tsconfig.json`                                      | Pending         |
| [#3](https://github.com/pdomain/pdomain-index-npm/issues/3)   | Open              | Wire GitHub Pages + the `gh-pages` content branch                            |        0 | `177df17e13b2c3f098527d3753335c0dc225f74a2c1a39c31af033a85beeeee3` | Superseded     | [Registry Format](../REGISTRY_FORMAT.md)                                                                                                                                                                                  | `a1bef62`, `dee91bf`, `02123ba`; `.github/workflows/regen.yml`                              | Pending         |
| [#4](https://github.com/pdomain/pdomain-index-npm/issues/4)   | Open              | Define the on-disk registry layout + write the `rebuild-packuments` script   |        0 | `dd5bb1e74da7b83593c628d67ada29f1b95b0dfc74a0fd17273b8f8590a8e964` | Superseded     | [Registry Format](../REGISTRY_FORMAT.md)                                                                                                                                                                                  | `d3ceee2`, `4dd5264`, `bc011b5`, `15f75de`; `tests/test_regen_index.test.ts`                | Pending         |
| [#5](https://github.com/pdomain/pdomain-index-npm/issues/5)   | Open              | Write the `publish.ts` script that adds one tarball to the index             |        0 | `ca30e27bf604912ff00c3bd59cfcaf87c36cbf29e51f87825eae9dac86bf0a60` | Superseded     | [Registry Format](../REGISTRY_FORMAT.md), [Intent Map](intent-map.md)                                                                                                                                                     | `c4acf69`, `5658708`, `bc011b5`, `15f75de`                                                  | Pending         |
| [#6](https://github.com/pdomain/pdomain-index-npm/issues/6)   | Open              | GitHub Action - `publish.yml` (`workflow_dispatch` + `repository_dispatch`)  |        0 | `8dcfb40226d1c7b1fc1bb3834e13e9adbb8c7958ced4a310cf569c22c02b7a72` | Superseded     | [Registry Format](../REGISTRY_FORMAT.md), [Decisions](decisions.md)                                                                                                                                                       | `dee91bf`, `02123ba`, `c83b5b3`, `87e7e04`; `tests/test_workflows.test.ts`                  | Pending         |
| [#7](https://github.com/pdomain/pdomain-index-npm/issues/7)   | Closed: completed | End-to-end smoke test - install the published package from a clean directory |        1 | `3f4cfb9775cc3e0e0652f5308e163b2c3db91f3982b86d283af52916c58791f8` | Owner decision | [Automated live smoke issue](../issues/2026-05-17-gh-007-automated-live-smoke.md), [Registry Format](../REGISTRY_FORMAT.md), [Smoke Test](https://github.com/pdomain/pdomain-index-npm/blob/master/tests/smoke/README.md) | `f5c388c`, `02123ba`, `2c49a7c`; `tests/smoke/run.sh`                                       | Pending         |
| [#8](https://github.com/pdomain/pdomain-index-npm/issues/8)   | Open              | Consumer documentation in README + `.npmrc` example                          |        0 | `f070aa83464e295262837e57d2eb94407d41cf43d2708eb576bb8b4efa59e204` | Completed      | [README](../../README.md)                                                                                                                                                                                                 | `8739278`, `f439db8`, `e45e654`; `examples/consumer-.npmrc`                                 | Pending         |
| [#9](https://github.com/pdomain/pdomain-index-npm/issues/9)   | Open              | Workspace integration - `.gitignore` anchor + CLAUDE.md notes                |        0 | `193f4b6896099c8e40c7ab7af5fce66d4a956515a7d2fd9126fa8d77fb432529` | Completed      | [Agent guidance](../../AGENTS.md)                                                                                                                                                                                         | `bb3f6b5`, `afc4ab0`; `.gitignore`; `CLAUDE.md`; `DOCGRAPH.md`                              | Pending         |
| [#10](https://github.com/pdomain/pdomain-index-npm/issues/10) | Open              | Validate tarball package names before writing registry paths                 |        0 | `d2e29cbf276ad542cc098434ee5ef628523f3298839f949daf5ba4d0b3058598` | Completed      | [Registry Format](../REGISTRY_FORMAT.md), [Decisions](decisions.md)                                                                                                                                                       | `5658708`, `3e828da`, `59ae42b`, `83ca383`; `tests/test_regen_index.test.ts`                | Pending         |

## Preserved provenance

Issues #1-#9 were authored by `ConcaveTrillion` on 2026-05-17. Issues #2-#9 carried milestone `spec: pd-index-npm-new-repo (#1)` and body relationship `Tracks: #1`. Issue #1 had labels `kind:spec` and `status:backlog`. Issues #2-#9 had labels `kind:feature` and `status:backlog`. They had no assignees, issue type, project items, formal parent or sub-issue links, reactions, attachments, or comments except issue #7.

Issue #10 was authored by `ConcaveTrillion` on 2026-05-22T21:58:40Z. It had labels `kind:bug`, `effort:M`, `model:sonnet`, `model-effort:medium`, and `status:backlog`. It had no milestone, assignees, issue type, project items, parent or sub-issue links, reactions, attachments, or comments.

The original plan and spec pointers under `docs/superpowers/` do not exist in this repository's current Git history. The implementation commits and current governed architecture provide the completion evidence instead.

## Outcomes and deviations

- **#1-#2:** The static registry and repository scaffold shipped. Later rename commits `f439db8` and `e45e654` changed the original `@concavetrillion/*` and `ConcaveTrillion/pd-index-npm` names to `@pdomain/*` and `pdomain/pdomain-index-npm`.
- **#3-#6:** The original mutable `gh-pages`, `rebuild-packuments.ts`, `publish.ts`, and `publish.yml` path shipped first, then the current release-asset architecture superseded it. The current workflow deploys an ephemeral `_site/` artifact. Every trigger performs a full allowlisted rebuild, and dispatch payload content is not trusted.
- **#7:** The clean-directory smoke test shipped in `f5c388c`. Author `ConcaveTrillion` [reported](https://github.com/pdomain/pdomain-index-npm/issues/7#issuecomment-4472050503) on 2026-05-17T18:16:12Z that workflow run `25998785023` passed for `@concavetrillion/pd-ui@0.1.0-alpha`. This is a historical author report, not a fresh verification. The current smoke targets `@pdomain/pdomain-ui` and is not run by `make ci` or `.github/workflows/regen.yml`. The [local issue](../issues/2026-05-17-gh-007-automated-live-smoke.md) keeps the missing automation decision active.
- **#8-#9:** Consumer instructions, the `.npmrc` example, ignored workspace-local agent memory, and repository agent guidance all shipped. Current `AGENTS.md` and `DOCGRAPH.md` supersede the original CLAUDE-only process.
- **#10:** The legacy path accepted a tarball-controlled name. The replacement removes that path choice earlier: trusted repository configuration supplies the expected package name, unknown repositories fail, mismatched names are skipped, versions must parse, and release URLs must belong to the allowlisted repository.

## Cutover record

The migration was prepared in batches of at most ten issues. Git history records each batch commit. The deletion journal below records the immutable merged commit before any issue deletion.

## Deletion journal

No issue has been deleted yet.
