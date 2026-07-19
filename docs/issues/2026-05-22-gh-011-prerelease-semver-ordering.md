---
Status: retired
Owner: repository maintainers
Created: 2026-05-22
Last verified: 2026-07-19
Kind: issue
Level: I1
---

# Fix prerelease semver ordering for dist-tags

## Agent Index

- **Kind:** issue
- **Status:** retired
- **Level:** I1
- **Last verified:** 2026-07-19
- **Resolution:** Resolved
- **Severity:** Medium - stale dist-tag served to consumers, fixed
- **Affected version:** `master` at the GitHub Issues cutover
- **Read when:** changing dist-tag selection or prerelease version comparison.
- **Search terms:** prerelease, semver ordering, dist-tags, latest, alpha.10, GitHub issue 11
- **Relates to:** [Registry Format](../architecture/registry-format.md), [migration ledger](../context/github-issues-migration-ledger.md)

## Summary

A security-review finding: the legacy `scripts/rebuild-packuments.ts` compared prerelease identifiers as strings, so `alpha.10` sorted before `alpha.2`. Publishing `alpha.10` after `alpha.2` could leave the `alpha` dist-tag pointing at the older prerelease and serve consumers a stale build.

## GitHub provenance

- **Node ID:** `I_kwDOSfngyM8AAAABDJFSFA`
- **Number and URL:** [#11](https://github.com/pdomain/pdomain-index-npm/issues/11)
- **Former state:** OPEN (state reason `none`)
- **Author:** `ConcaveTrillion`
- **Created:** 2026-05-22T21:58:40Z
- **Updated:** 2026-05-22T21:58:40Z
- **Closed:** None
- **Labels:** `kind:bug`, `effort:M`, `model:sonnet`, `model-effort:medium`, `status:backlog`
- **Milestone:** None
- **Assignees, issue type, project items, parent and sub-issues, reactions, attachments:** None
- **Comments:** 0
- **Raw SHA-256:** `1ebe95f531236d6ffc9545005f9c1d4e28c1ff626a8614995225941a4ab24f59`
- **Raw record:** `migration/github-issues/raw/issue-11.json`

## Original body (verbatim)

```text
## Finding

Medium correctness: prerelease semver ordering is lexicographic.

## Evidence

- `scripts/rebuild-packuments.ts:116-126` compares prerelease strings directly.
- `scripts/rebuild-packuments.ts:305-326` uses that ordering to select `latest` and prerelease dist-tags.
- `tests/test_rebuild_packuments.test.ts:80-95` covers `alpha.1` versus `alpha.2`, but not numeric width cases such as `alpha.10` versus `alpha.2`.

## Impact

Publishing `alpha.10` after `alpha.2` can leave the `alpha` dist-tag pointing at the older prerelease, so consumers install stale builds.

## Suggested fix

Use a real semver comparator or implement SemVer prerelease identifier comparison: numeric identifiers compare numerically, numeric identifiers have lower precedence than non-numeric identifiers, and dot-separated identifiers compare one segment at a time. Add tests for `alpha.2` versus `alpha.10` and mixed prerelease identifiers.

## Source

Filed from deep review/security scan report: `reports/security-review-2026-05-22/pd-index-npm.md`.

```

## Comments (verbatim)

None.

## Impact

- Consumers installing by dist-tag could receive an older prerelease than the one just published.
- The failure is silent: the install succeeds and returns a plausible version.

## Environment / versions

```text
Repository: pdomain/pdomain-index-npm
Legacy implementation: scripts/rebuild-packuments.ts:116-126 and :305-326 (removed in 15f75de)
Current implementation: scripts/regen-index.ts, function prereleaseCompare
Source: reports/security-review-2026-05-22/pd-index-npm.md (absent from this repo's history)
```

## Evidence

1. The finding as filed is preserved verbatim above, including the legacy line references and the gap in the old test.
2. `scripts/regen-index.ts` implements `prereleaseCompare`, comparing dot-separated identifiers one segment at a time.
3. `tests/test_regen_index.test.ts` contains `regenIndex sorts numeric prerelease identifiers by semver precedence`, which publishes `1.0.0-alpha.2` and `1.0.0-alpha.10` and asserts `latest` resolves to `1.0.0-alpha.10`.
4. That test passes in the current CI gate.

## Root-cause hypotheses

**(Confirmed) String comparison was used where semver precedence was required.** Lexicographic ordering puts `alpha.10` before `alpha.2` because `1` sorts before `2` character-wise, which is correct for strings and wrong for versions. The original test only covered `alpha.1` versus `alpha.2`, where string and numeric ordering happen to agree, so the bug was invisible to it. Confirmed by the shipped comparator and its regression test.

## Defects to fix

1. **Lexicographic prerelease comparison** - identifiers were compared as strings rather than by semver precedence. (Primary)
2. **Test blind spot** - the existing coverage used single-digit identifiers only, where the wrong algorithm gives the right answer.

## Next steps

None outstanding. Both defects are fixed; the regression test covers the numeric-width case that the original test missed.

## Outcome

Completed. `scripts/regen-index.ts` implements semver prerelease precedence in `prereleaseCompare`: numeric identifiers compare as numbers and sort before non-numeric identifiers, comparing one dot-separated segment at a time. The regression test `regenIndex sorts numeric prerelease identifiers by semver precedence` publishes `1.0.0-alpha.2` and `1.0.0-alpha.10` and asserts `latest` resolves to `1.0.0-alpha.10`. [Registry Format](../architecture/registry-format.md) section "dist-tags conventions" records the behavior. Fixed in `123c36b`; the legacy script was removed in `15f75de`.

## Resolution

_Retired._ Durable content lives in the governed docs named above. This record is archived in Git history; see the [migration ledger](../context/github-issues-migration-ledger.md) for the removal commit.
