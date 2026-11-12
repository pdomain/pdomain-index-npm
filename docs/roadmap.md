---
Status: active
Owner: repository maintainers
Created: 2026-11-06
Last verified: 2026-11-12
Kind: process
Level: I1
---

# Remaining work

## Agent Index

- **Kind:** process
- **Status:** active
- **Level:** I1
- **Last verified:** 2026-11-12
- **Read when:** choosing what is still unfinished in this registry.
- **Search terms:** remaining work, roadmap, open plan, open issue.

This is the only open-work list for this repository.

Shipped behavior is in [Registry Format](architecture/registry-format.md) and
[Repository boundary](architecture/repository-boundary.md).

## Decide before building

Decide whether every publish must run the clean-directory install check.

`tests/smoke/run.sh` exists. `scripts/publish-index.sh` does not run it.

The [design](specs/2026-07-21-automated-live-smoke-design.md) and
[plan](plans/2026-07-21-automated-live-smoke.md) propose a local retry helper
after a successful push. Neither records owner acceptance.

The plan says not to update [Registry Format](architecture/registry-format.md)
until implementation ships.

The open record is
[automated live smoke](issues/2026-05-17-gh-007-automated-live-smoke.md).

## Housekeeping

Origin still had thirteen `dep-refresh/*` branches on 2026-11-06. The branches
are dated 2026-06-21 through 2026-09-13.

`delete_branch_on_merge` was false.

Commit `290f458` removed `.github/workflows/dep-refresh.yml`. The job that
opened those branches no longer runs.

Delete the merged branches. See
[dep-refresh branches](issues/2026-08-08-dep-refresh-cannot-auto-land.md).

The repository setting matters again only if pull requests return.

`pyproject.toml` still describes Python tooling for `scripts/`. Its Ruff
comment still names `scripts/update_github_actions.py`. Commit `6071e3a`
deleted that script.

`scripts/__init__.py` is empty.

The project file stays so `uv run` and pre-commit match other pdomain repos.
Shrink it only if that parity stops mattering.

## Later, still in this repository

**Incremental regeneration.** A single-repository fast path may reduce work.
The current full rebuild is simpler and already idempotent. Evidence is
`scripts/regen-index.ts` and `scripts/publish-index.sh`.

Commit `290f458` removed `.github/workflows/regen.yml`.

**Allowlist expansion.** Add a publisher only with an explicit
repository-to-package mapping and matching tests.

The mapping today is `pdomain/pdomain-ui` to `@pdomain/pdomain-ui` in
`scripts/regen-index.ts`.

## Consider a different repository

These are proposals. None is approved. Do not build them inside this repo
while that is true.

**One shared release driver.** `scripts/release-common.sh` is a copied file.
The header calls it the shared driver for pdomain Python repos.

The copy in `pdomain-index-pip` already differs: 182 lines here, 175 lines
there, compared on 2026-11-12.

One upstream would replace the copies. This registry would keep a thin
`scripts/do-release.sh` that sets the repo name and the empty build command.

**Org-wide dependency refresh, if it comes back.** If the org wants the job
again, one shared workflow or action should own it. This repo should not grow
`.github/workflows/dep-refresh.yml` back.

The weekly workflow in this repo was deleted. The same leftover-branch failure
showed up in other pdomain repos.

A design for it was written in `pdomain-ui`, at
`docs/specs/2026-07-16-dep-refresh-auto-land-design.md` in that repo.

**Do not merge this repo with `pdomain-index-pip`.** Both indexes scan
allowlisted GitHub Releases, hash the assets, and push `gh-pages` by hand.
The wire formats differ: npm packument JSON here, PEP 503 HTML there. The
generators do not share code.

A shared scanner is worth discussing only after both scanners must change for
the same bug. Until then, two repos is the smaller design.

**Keep post-publish smoke retries here.** `tests/smoke/run.sh` already runs
`npm install` against this registry.

The unwritten piece is the plan's retry wrapper,
`scripts/verify-published-index.sh`. It would call `tests/smoke/run.sh` after
a successful push.

The pip index would need a different check. There is no second consumer.

Rejected directions stay in the [intent map](context/intent-map.md).
