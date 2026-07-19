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
- **Read when:** tracing migrated GitHub issue provenance or outcomes, or folding a newly filed issue into the ledger.
- **Search terms:** GitHub issues migration, issue provenance, raw digest, cutover, reconciliation, retention policy.

This ledger preserves the repository's GitHub issue history after the issue tracker cutover. Each raw digest covers the exported GraphQL record, comments, REST timeline, and REST events for one issue.

The exact public API records are stored under `migration/github-issues/raw/` outside the governed docs tree. `migration/github-issues/issue.graphql` records the GraphQL selection. Each raw file is canonicalized with `jq -S` over an object with `graphql`, `timeline`, and `events` keys before hashing. The records contain no credentials or temporary tokens.

## Inventory and reconciliation

| Issue                                                         | Former state      | Title                                                                        | Comments | Raw SHA-256                                                        | Classification | Durable destination                                                                                                                                                                                                                    | Evidence                                                                                             | Retention |
| ------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------- | -------: | ------------------------------------------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------- |
| [#1](https://github.com/pdomain/pdomain-index-npm/issues/1)   | Open              | Spec: Static npm registry on GitHub Pages                                    |        0 | `3b7d286d799580bc7329c788f8a9de9e26902fcdd1488317adb813ce606612ab` | Completed      | [Registry Format](../architecture/registry-format.md), [README](../../README.md)                                                                                                                                                       | `5fd3d1d`, `bc011b5`, `02123ba`; `scripts/regen-index.ts`; `tests/test_regen_index.test.ts`          | Deleted   |
| [#2](https://github.com/pdomain/pdomain-index-npm/issues/2)   | Open              | Create the GitHub repo + initial scaffold                                    |        0 | `8c7a4d1bf10989f4bb9cd5d90d90f8b2cd904c2ce7b3bb78ef16d9a3ce2422a8` | Completed      | [Current State](current-state.md), [README](../../README.md)                                                                                                                                                                           | `5fd3d1d`; `package.json`; `Makefile`; `tsconfig.json`                                               | Deleted   |
| [#3](https://github.com/pdomain/pdomain-index-npm/issues/3)   | Open              | Wire GitHub Pages + the `gh-pages` content branch                            |        0 | `177df17e13b2c3f098527d3753335c0dc225f74a2c1a39c31af033a85beeeee3` | Superseded     | [Registry Format](../architecture/registry-format.md)                                                                                                                                                                                  | `a1bef62`, `dee91bf`, `02123ba`; `.github/workflows/regen.yml`                                       | Deleted   |
| [#4](https://github.com/pdomain/pdomain-index-npm/issues/4)   | Open              | Define the on-disk registry layout + write the `rebuild-packuments` script   |        0 | `dd5bb1e74da7b83593c628d67ada29f1b95b0dfc74a0fd17273b8f8590a8e964` | Superseded     | [Registry Format](../architecture/registry-format.md)                                                                                                                                                                                  | `d3ceee2`, `4dd5264`, `bc011b5`, `15f75de`; `tests/test_regen_index.test.ts`                         | Deleted   |
| [#5](https://github.com/pdomain/pdomain-index-npm/issues/5)   | Open              | Write the `publish.ts` script that adds one tarball to the index             |        0 | `ca30e27bf604912ff00c3bd59cfcaf87c36cbf29e51f87825eae9dac86bf0a60` | Superseded     | [Registry Format](../architecture/registry-format.md), [Intent Map](intent-map.md)                                                                                                                                                     | `c4acf69`, `5658708`, `bc011b5`, `15f75de`                                                           | Deleted   |
| [#6](https://github.com/pdomain/pdomain-index-npm/issues/6)   | Open              | GitHub Action - `publish.yml` (`workflow_dispatch` + `repository_dispatch`)  |        0 | `8dcfb40226d1c7b1fc1bb3834e13e9adbb8c7958ced4a310cf569c22c02b7a72` | Superseded     | [Registry Format](../architecture/registry-format.md), [Decisions](decisions.md)                                                                                                                                                       | `dee91bf`, `02123ba`, `c83b5b3`, `87e7e04`; `tests/test_workflows.test.ts`                           | Deleted   |
| [#7](https://github.com/pdomain/pdomain-index-npm/issues/7)   | Closed: completed | End-to-end smoke test - install the published package from a clean directory |        1 | `3f4cfb9775cc3e0e0652f5308e163b2c3db91f3982b86d283af52916c58791f8` | Owner decision | [Automated live smoke issue](../issues/2026-05-17-gh-007-automated-live-smoke.md), [Registry Format](../architecture/registry-format.md), [Smoke Test](https://github.com/pdomain/pdomain-index-npm/blob/master/tests/smoke/README.md) | `f5c388c`, `02123ba`, `2c49a7c`; `tests/smoke/run.sh`                                                | Deleted   |
| [#8](https://github.com/pdomain/pdomain-index-npm/issues/8)   | Open              | Consumer documentation in README + `.npmrc` example                          |        0 | `f070aa83464e295262837e57d2eb94407d41cf43d2708eb576bb8b4efa59e204` | Completed      | [README](../../README.md)                                                                                                                                                                                                              | `8739278`, `f439db8`, `e45e654`; `examples/consumer-.npmrc`                                          | Deleted   |
| [#9](https://github.com/pdomain/pdomain-index-npm/issues/9)   | Open              | Workspace integration - `.gitignore` anchor + CLAUDE.md notes                |        0 | `193f4b6896099c8e40c7ab7af5fce66d4a956515a7d2fd9126fa8d77fb432529` | Completed      | [Agent guidance](../../AGENTS.md)                                                                                                                                                                                                      | `bb3f6b5`, `afc4ab0`; `.gitignore`; `CLAUDE.md`; `DOCGRAPH.md`                                       | Deleted   |
| [#10](https://github.com/pdomain/pdomain-index-npm/issues/10) | Open              | Validate tarball package names before writing registry paths                 |        0 | `d2e29cbf276ad542cc098434ee5ef628523f3298839f949daf5ba4d0b3058598` | Completed      | [Registry Format](../architecture/registry-format.md), [Decisions](decisions.md)                                                                                                                                                       | `5658708`, `3e828da`, `59ae42b`, `83ca383`; `tests/test_regen_index.test.ts`                         | Deleted   |
| [#11](https://github.com/pdomain/pdomain-index-npm/issues/11) | Open              | Fix prerelease semver ordering for dist-tags                                 |        0 | `1ebe95f531236d6ffc9545005f9c1d4e28c1ff626a8614995225941a4ab24f59` | Completed      | [Registry Format](../architecture/registry-format.md)                                                                                                                                                                                  | `123c36b`, `15f75de`; `scripts/regen-index.ts` `prereleaseCompare`; `tests/test_regen_index.test.ts` | Deleted   |
| [#12](https://github.com/pdomain/pdomain-index-npm/issues/12) | Open              | Fix broken npm smoke script                                                  |        0 | `ee15de99a8f6f14a50a7ffa1f86ea427379d655edc14f2ad8d7d980266ad0fc9` | Completed      | [Registry Format](../architecture/registry-format.md), [Smoke Test](../../tests/smoke/README.md)                                                                                                                                       | `2c49a7c`; `package.json` `scripts.smoke`; `tests/smoke/run.sh`                                      | Deleted   |

## Preserved provenance

Issues #1-#9 were authored by `ConcaveTrillion` on 2026-05-17. Issues #2-#9 carried milestone `spec: pd-index-npm-new-repo (#1)` and body relationship `Tracks: #1`. Issue #1 had labels `kind:spec` and `status:backlog`. Issues #2-#9 had labels `kind:feature` and `status:backlog`. They had no assignees, issue type, project items, formal parent or sub-issue links, reactions, attachments, or comments except issue #7.

Issue #10 was authored by `ConcaveTrillion` on 2026-05-22T21:58:40Z. It had labels `kind:bug`, `effort:M`, `model:sonnet`, `model-effort:medium`, and `status:backlog`. It had no milestone, assignees, issue type, project items, parent or sub-issue links, reactions, attachments, or comments.

Issue #11 was authored by `ConcaveTrillion` on 2026-05-22T21:58:40Z with labels `kind:bug`, `effort:M`, `model:sonnet`, `model-effort:medium`, and `status:backlog`. Issue #12 was authored by `ConcaveTrillion` on 2026-05-22T21:58:41Z with labels `kind:chore`, `effort:S`, `model:sonnet`, `model-effort:low`, and `status:backlog`. Neither had a milestone, assignees, issue type, project items, parent or sub-issue links, reactions, attachments, or comments.

Issues #10, #11, and #12 each cite the same origin: a deep review and security scan report at `reports/security-review-2026-05-22/pd-index-npm.md`. That report path does not exist in this repository's Git history, so the issue bodies are the surviving record of those findings.

The original plan and spec pointers under `docs/superpowers/` do not exist in this repository's current Git history. The implementation commits and current governed architecture provide the completion evidence instead.

## Outcomes and deviations

- **#1-#2:** The static registry and repository scaffold shipped. Later rename commits `f439db8` and `e45e654` changed the original `@concavetrillion/*` and `ConcaveTrillion/pd-index-npm` names to `@pdomain/*` and `pdomain/pdomain-index-npm`.
- **#3-#6:** The original mutable `gh-pages`, `rebuild-packuments.ts`, `publish.ts`, and `publish.yml` path shipped first, then the current release-asset architecture superseded it. The current workflow deploys an ephemeral `_site/` artifact. Every trigger performs a full allowlisted rebuild, and dispatch payload content is not trusted.
- **#7:** The clean-directory smoke test shipped in `f5c388c`. Author `ConcaveTrillion` [reported](https://github.com/pdomain/pdomain-index-npm/issues/7#issuecomment-4472050503) on 2026-05-17T18:16:12Z that workflow run `25998785023` passed for `@concavetrillion/pd-ui@0.1.0-alpha`. This is a historical author report, not a fresh verification. The current smoke targets `@pdomain/pdomain-ui` and is not run by `make ci` or `.github/workflows/regen.yml`. The [local issue](../issues/2026-05-17-gh-007-automated-live-smoke.md) keeps the missing automation decision active.
- **#8-#9:** Consumer instructions, the `.npmrc` example, ignored workspace-local agent memory, and repository agent guidance all shipped. Current `AGENTS.md` and `DOCGRAPH.md` supersede the original CLAUDE-only process.
- **#11:** The finding was real against the legacy `scripts/rebuild-packuments.ts`, which compared prerelease strings lexicographically and could leave the `alpha` dist-tag on an older build after publishing `alpha.10`. The replacement `scripts/regen-index.ts` implements semver prerelease precedence in `prereleaseCompare`: numeric identifiers compare as numbers and sort before non-numeric identifiers. The regression test `regenIndex sorts numeric prerelease identifiers by semver precedence` publishes `1.0.0-alpha.2` and `1.0.0-alpha.10` and asserts `latest` resolves to `alpha.10`. Fixed in `123c36b`; the legacy script was removed in `15f75de`.
- **#12:** The finding was real: `package.json` defined `smoke` as `node dist/smoke.js`, and no `scripts/smoke.ts` existed to produce that file, so the advertised command failed for reasons unrelated to registry behavior. The script now runs `bash tests/smoke/run.sh`, which is the first of the two fixes the issue proposed. Fixed in `2c49a7c`. The separate question of whether smoke runs automatically remains open and is tracked in the [automated live smoke issue](../issues/2026-05-17-gh-007-automated-live-smoke.md).
- **#10:** The legacy path accepted a tarball-controlled name. The replacement removes that path choice earlier: trusted repository configuration supplies the expected package name, unknown repositories fail, mismatched names are skipped, versions must parse, and release URLs must belong to the allowlisted repository.

## Cutover record

The migration was prepared in batches of at most ten issues. Git history records each batch commit. Issues #1-#10 landed in one batch; issues #11-#12 followed once the inventory gap was found.

Every raw digest in the table below was recomputed from `migration/github-issues/raw/` at cutover. The export method itself was validated by re-exporting issue #10 from GitHub and confirming it reproduced the recorded digest `d2e29cbf276ad542cc098434ee5ef628523f3298839f949daf5ba4d0b3058598` byte for byte, so the digests for #11 and #12 are comparable to the original ten.

### Reconciliation

Every GitHub issue appears exactly once. The inventory table above carries provenance; this table carries cutover coverage and disposition.

| Issue | Classification | Architecture coverage                                                | Local status      | Cutover action |
| ----- | -------------- | -------------------------------------------------------------------- | ----------------- | -------------- |
| #1    | Completed      | `registry-format.md` in full; README consumer instructions           | Committed, master | Retain         |
| #2    | Completed      | `current-state.md`; README; repo scaffold in tree                    | Committed, master | Retain         |
| #3    | Superseded     | `registry-format.md` § Shipped architecture                          | Committed, master | Retain         |
| #4    | Superseded     | `registry-format.md` §§ Directory layout, Packument JSON shape       | Committed, master | Retain         |
| #5    | Superseded     | `registry-format.md` § Shipped architecture; `intent-map.md`         | Committed, master | Retain         |
| #6    | Superseded     | `registry-format.md` § Shipped architecture; `decisions.md`          | Committed, master | Retain         |
| #7    | Owner decision | `registry-format.md` § Live smoke test boundary; active issue record | Committed, master | Retain         |
| #8    | Completed      | README consumer instructions; `examples/consumer-.npmrc`             | Committed, master | Retain         |
| #9    | Completed      | `AGENTS.md`; `DOCGRAPH.md`; `.gitignore`                             | Committed, master | Retain         |
| #10   | Completed      | `registry-format.md` § Trust model; `decisions.md`                   | Committed, master | Retain         |
| #11   | Completed      | `registry-format.md` § dist-tags conventions                         | Committed, master | Retain         |
| #12   | Completed      | `registry-format.md` § Live smoke test boundary; smoke README        | Committed, master | Retain         |

Counts reconcile at twelve: twelve GitHub issues, twelve raw exports, twelve inventory rows, twelve reconciliation rows.

### Archived issue records

Eleven of the twelve issues received a full governed record — GitHub provenance, original body and comments verbatim, evidence, root-cause analysis, and resolution. Those records were committed in `c64df8e` and removed from the working tree in the commit that follows it. Git history is the archive; retrieve a record with `git show c64df8e:docs/issues/<filename>`, or list them all with `git show c64df8e --stat`. The [issues README](../issues/README.md) carries the filename table.

Issue #7 is the exception. Its record stays live at [`docs/issues/2026-05-17-gh-007-automated-live-smoke.md`](../issues/2026-05-17-gh-007-automated-live-smoke.md) because it tracks an unresolved decision: whether deployment must run the live smoke automatically.

The raw API exports under `migration/github-issues/raw/` are not archived this way. They stay in the working tree as the checkable provenance source behind every digest in this ledger.

## Deletion policy

This repository permanently deletes its migrated GitHub issues. GitHub Issues stays enabled.

The shared runbook ends in permanent deletion and `hasIssuesEnabled: false`. This repository follows the deletion step and declines the disable step. Issues remains an open intake channel so anyone can still report a problem, and a newly filed issue is folded into this ledger with an inventory row, a raw export and digest, and a reconciliation row.

Deletion is safe here because the durable content already lives in the governed docs. The reconciliation table above proves every issue's content has an architecture, decision, intent, or active-record destination, the full issue records are archived in Git history at `c64df8e`, and the raw API exports stay in the working tree under `migration/github-issues/raw/`.

Deletion has one unavoidable cost, accepted by owner decision: every `github.com/pdomain/pdomain-index-npm/issues/N` URL in this ledger and in the issue 7 record stops resolving. Those links are retained as historical identifiers, not as working references. The raw exports and the archived records carry the content those URLs used to serve.

This policy supersedes the retention decision recorded on 2026-07-19 in [decisions](decisions.md), which held that issues would be retained. That entry is marked superseded there.

## Digest integrity

Two digests are recorded per issue, and they answer different questions.

The **content digest** covers the GraphQL payload only: body, comments, labels, milestone, author, timestamps, and relationships. It is the meaningful integrity check, because it changes only when the issue's content changes. All twelve content digests were verified identical between the stored export and a fresh GitHub export immediately before deletion.

The **full-record digest** in the inventory table covers the GraphQL payload plus the REST timeline and events arrays. It is a point-in-time snapshot taken at export, and it is no longer reproducible. Pushing the migration commits caused GitHub to append `referenced` cross-reference events to the timeline of every issue whose number appeared in a commit message, which changed nine of the twelve full-record digests without changing any issue's content. Issues 3, 4, and 5 kept matching digests only because their numbers never appeared literally in a commit message; they were written inside the range `#2-#6`, which GitHub does not linkify.

Treat the full-record digests as provenance for the stored export files, not as a check that can be re-run against GitHub.

| Issue | Content SHA-256                                                    |
| ----- | ------------------------------------------------------------------ |
| 1     | `32cb6bbda23e5224439a6984971672ac92ff2ac2e1fc5b21587dd3f3fb450784` |
| 2     | `39e211d10ec4451357693665d90906570468fb8f6259804308ca1f857c06cfb5` |
| 3     | `cd4d48c15ab7f86e1e0e4c7bec5b3f5d30a1676bfd6a9ba739ada36c2990c084` |
| 4     | `0a5ac064e2e7f460fcfe02a023184f83c43338ff81d69a08eedf86bbbe6b5716` |
| 5     | `c5c41572ac7b8b082a542ec10107b00081e4053e197f87d7332f2df1a1bb6d50` |
| 6     | `d9741882c9385e9b51d66fe58c174e91b152f18df7093c31735b31804d1acb69` |
| 7     | `5eb97ff966c05eccc0019dd64af35a1a379ada5ff67ec2ef8cc640214ba6f7d9` |
| 8     | `ceb0832a16e25e015f0aa79fcbf33dee7bf22547bd3b7276e4c9f3e52d491d20` |
| 9     | `14f241d2a847af94e696d44618ecf5c4e2f469ede74ba3a55be2bc5a1477d1a7` |
| 10    | `937bcf6e085f71c9d58a2b8cf180c5438efe482898de356deb4cb6ade0a155d3` |
| 11    | `4eaef78d1234acd66b40aa6fb206f706593d0b797495ce5db4fafc48b95e5c9d` |
| 12    | `3121ca1fcb25502655e520e45927afc92ac3c330a720af2bb4a3139a0030ceb8` |

Reproduce a content digest with:

```bash
jq -S '.graphql' migration/github-issues/raw/issue-N.json | sha256sum
```

## Deletion journal

Append-only. Every entry records the issue number, GraphQL node ID, former URL, content digest, durable destination, and the merged commit that carries the replacement, followed by the post-deletion verification result.

Preconditions verified before any deletion, on 2026-07-19:

- The replacement is pushed. Archive commit `c64df8e` and removal commit `832d39c` are both ancestors of `origin/master`.
- Every governed destination is present on the remote default branch: `docs/architecture/registry-format.md`, `docs/context/github-issues-migration-ledger.md`, `docs/issues/2026-05-17-gh-007-automated-live-smoke.md`, `docs/issues/README.md`.
- All twelve raw exports are present on the remote under `migration/github-issues/raw/`.
- All twelve content digests match a fresh GitHub export. See "Digest integrity" above for why the full-record digests do not, and why that is expected.
- The authenticated actor holds `ADMIN` on the repository.

| Issue | Node ID                    | Former URL                                             | Content SHA-256                                                    | Merged commit | Deleted at | Verified absent |
| ----- | -------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------ | ------------- | ---------- | --------------- |
| 7     | `I_kwDOSfngyM8AAAABCgcHMw` | https://github.com/pdomain/pdomain-index-npm/issues/7  | `b1fc55269aa1fdcaf930ef0f7efbc50627315aff757fa115721c3c498cd45003` | `832d39c`     | 2026-07-19 | Yes             |
| 1     | `I_kwDOSfngyM8AAAABCgbYnA` | https://github.com/pdomain/pdomain-index-npm/issues/1  | `32cb6bbda23e5224439a6984971672ac92ff2ac2e1fc5b21587dd3f3fb450784` | `832d39c`     | 2026-07-19 | Yes             |
| 2     | `I_kwDOSfngyM8AAAABCgcGeg` | https://github.com/pdomain/pdomain-index-npm/issues/2  | `39e211d10ec4451357693665d90906570468fb8f6259804308ca1f857c06cfb5` | `832d39c`     | 2026-07-19 | Yes             |
| 3     | `I_kwDOSfngyM8AAAABCgcGmA` | https://github.com/pdomain/pdomain-index-npm/issues/3  | `cd4d48c15ab7f86e1e0e4c7bec5b3f5d30a1676bfd6a9ba739ada36c2990c084` | `832d39c`     | 2026-07-19 | Yes             |
| 4     | `I_kwDOSfngyM8AAAABCgcGrA` | https://github.com/pdomain/pdomain-index-npm/issues/4  | `0a5ac064e2e7f460fcfe02a023184f83c43338ff81d69a08eedf86bbbe6b5716` | `832d39c`     | 2026-07-19 | Yes             |
| 5     | `I_kwDOSfngyM8AAAABCgcGww` | https://github.com/pdomain/pdomain-index-npm/issues/5  | `c5c41572ac7b8b082a542ec10107b00081e4053e197f87d7332f2df1a1bb6d50` | `832d39c`     | 2026-07-19 | Yes             |
| 6     | `I_kwDOSfngyM8AAAABCgcG4Q` | https://github.com/pdomain/pdomain-index-npm/issues/6  | `355387a3ca488f065432398559d369fef4f04164974cecf7a873edaa28bbe34b` | `832d39c`     | 2026-07-19 | Yes             |
| 8     | `I_kwDOSfngyM8AAAABCgcHqA` | https://github.com/pdomain/pdomain-index-npm/issues/8  | `ceb0832a16e25e015f0aa79fcbf33dee7bf22547bd3b7276e4c9f3e52d491d20` | `832d39c`     | 2026-07-19 | Yes             |
| 9     | `I_kwDOSfngyM8AAAABCgcHxw` | https://github.com/pdomain/pdomain-index-npm/issues/9  | `ada0c3715b518edda1f020a119dbd8e92330b295063adbe4362e7906cfd807c0` | `832d39c`     | 2026-07-19 | Yes             |
| 10    | `I_kwDOSfngyM8AAAABDJFR7Q` | https://github.com/pdomain/pdomain-index-npm/issues/10 | `937bcf6e085f71c9d58a2b8cf180c5438efe482898de356deb4cb6ade0a155d3` | `832d39c`     | 2026-07-19 | Yes             |
| 11    | `I_kwDOSfngyM8AAAABDJFSFA` | https://github.com/pdomain/pdomain-index-npm/issues/11 | `4eaef78d1234acd66b40aa6fb206f706593d0b797495ce5db4fafc48b95e5c9d` | `832d39c`     | 2026-07-19 | Yes             |
| 12    | `I_kwDOSfngyM8AAAABDJFSPQ` | https://github.com/pdomain/pdomain-index-npm/issues/12 | `3121ca1fcb25502655e520e45927afc92ac3c330a720af2bb4a3139a0030ceb8` | `832d39c`     | 2026-07-19 | Yes             |

All twelve issues were deleted on 2026-07-19 with the GraphQL `deleteIssue` mutation. Each node ID was re-resolved from GitHub and compared against the archived export immediately before its deletion; every one matched. The closed issue was deleted first, then the eleven open issues in a batch of ten followed by a batch of one.

### Post-deletion verification

Confirmed absent by three independent checks on 2026-07-19:

- `gh issue list --state all` returns zero issues.
- The REST endpoint `repos/pdomain/pdomain-index-npm/issues/N` returns `HTTP 410 Gone` for every number from 1 to 12.
- The GraphQL API resolves each issue to `null` with a `NOT_FOUND` error: "Could not resolve to an Issue with the number of N."

One nuance worth recording, because it can mislead a later check. The former web URLs still return `HTTP 200`, not `404`. GitHub serves its generic application shell at those addresses, with the page title "GitHub · Where software is built" rather than any issue content. A browser check therefore looks as though the issue still exists. The API responses above are authoritative; a web request is not a valid absence check.

GitHub Issues remains enabled: `hasIssuesEnabled: true`. The tracker is empty and open for new reports, which are folded into this ledger.
