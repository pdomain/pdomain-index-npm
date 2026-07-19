---
Status: retired
Owner: repository maintainers
Created: 2026-05-22
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Validate tarball package names before writing registry paths

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Medium - tarball-controlled path write, fixed
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** changing how regeneration derives output paths or validates tarball metadata.
- **Search terms:** tarball validation, package name, path traversal, allowlist, trust model, GitHub issue 10
- **Relates to:** [Registry Format](../architecture/registry-format.md), [Decisions](../context/decisions.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

A security-review finding: the legacy path took the package name from the tarball's own `package.json` and used it to build registry output paths, so tarball-controlled metadata influenced where files were written.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABDJFR7Q`
- **Number and URL:** [#10](https://github.com/pdomain/pdomain-index-npm/issues/10)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-22T21:58:40Z
- **Updated:** 2026-05-22T21:58:40Z
- **Closed:** None
- **Labels:** `kind:bug`, `effort:M`, `model:sonnet`, `model-effort:medium`, `status:backlog`
- **Milestone:** None
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `d2e29cbf276ad542cc098434ee5ef628523f3298839f949daf5ba4d0b3058598`
- **Raw record:** `migration/github-issues/raw/issue-10.json`

## Original body (verbatim)

```text
## Finding

High security: tarball-controlled package names can escape registry paths.

## Evidence

- `scripts/publish.ts:151` reads `name` from the submitted tarball package.json.
- `scripts/publish.ts:165` joins that package name into the packument path.
- `scripts/publish.ts:205-209` joins that package name into the tarball write path.
- `scripts/registry-layout.ts:35-47` returns raw package names as path fragments.

## Impact

A malicious or malformed tarball can choose a package name containing path traversal or unexpected path syntax and cause the publish workflow to write outside the intended `@scope/name` layout. Because the workflow commits `git add -A` from the registry checkout, this can overwrite generated site files before publishing.

## Suggested fix

Validate package names and versions before any filesystem use. Restrict package names to the intended scope, for example `@concavetrillion/<valid npm package name>`, validate semver, and resolve all write targets with a registry-root prefix check. Add regression tests for traversal names and invalid versions.

## Source

Filed from deep review/security scan report: `reports/security-review-2026-05-22/pd-index-npm.md`.

```

## Comments (verbatim)

None.

## Impact

- A tarball could influence its own output path in the generated registry.
- The registry's directory structure was only as trustworthy as the tarballs it ingested.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Legacy implementation: scripts/rebuild-packuments.ts (removed in 15f75de)
Current implementation: scripts/regen-index.ts
Source: reports/security-review-2026-05-22/pd-index-npm.md (absent from this repo's history)
```

## Evidence

1. The finding as filed is preserved verbatim above.
2. Commits `5658708`, `3e828da`, `59ae42b`, and `83ca383` add and harden the validation.
3. `tests/test_regen_index.test.ts` covers unknown repositories, wrong package names, wrong release hosts, size limits, and conflicting duplicate versions.
4. [Registry Format](../architecture/registry-format.md) section "Trust model" records the shipped invariants.

## Root-cause hypotheses

**(Confirmed) The output path was derived from untrusted input.** The legacy script read the package name out of the downloaded tarball and used it directly to build the write path, so the decision of where to write was made from data the tarball controlled. The fix moves that decision earlier, to trusted repository configuration. This is confirmed by the shipped code and its tests, not merely hypothesised.

## Defects to fix

1. **Output path derived from tarball metadata** - the package name came from the tarball rather than from trusted configuration. (Primary)
2. **No expected-name mapping** - nothing asserted that a given repository may only publish a given package name.
3. **Unconstrained release asset origin** - asset URLs were not required to belong to the allowlisted repository.

## Next steps

None outstanding. All three defects are fixed and covered by tests. When adding a publisher, add its explicit repository-to-package-name mapping and a test, per the decision recorded in [Decisions](../context/decisions.md).

## Outcome

Completed. The replacement removes the path choice earlier: trusted repository configuration supplies the expected package name, unknown repositories fail, tarballs declaring another name are skipped, versions must parse, and release asset URLs must belong to the allowlisted repository. [Registry Format](../architecture/registry-format.md) section "Trust model" describes the shipped invariants. Evidence: commits `5658708`, `3e828da`, `59ae42b`, `83ca383`; `tests/test_regen_index.test.ts`.

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
