---
Status: built
Owner: repository maintainers
Created: 2026-11-12
Last verified: 2026-11-13
Kind: architecture
---

# Repository boundary

## Agent Index

- **Kind:** architecture
- **Status:** built
- **Read when:** deciding whether new work belongs in this repository.
- **Search terms:** repository boundary, separate repo, scope, release driver, pip index.

This repository builds one read-only npm registry for the `@pdomain` scope.

Package source and the Python package index live in other repositories.

Org-wide maintenance jobs are out of scope here. None is approved.

## What this repository ships

`scripts/regen-index.ts` rebuilds every packument from allowlisted GitHub
Release assets. `scripts/publish-index.sh` runs that rebuild and pushes the
`gh-pages` branch.

A person runs the publish script. Nothing in this repo runs it on a schedule.

The allowlist is one mapping today: repository `pdomain/pdomain-ui` to package
`@pdomain/pdomain-ui`.

[Registry Format](registry-format.md) describes the packument shape, the trust
checks, and the manual smoke boundary.

Releases of this repository are tags of the tooling. They do not add a package
to the registry.

`scripts/do-release.sh` sets `RELEASE_BUILD` to `:` and then sources
`scripts/release-common.sh`.

## Local gate and tooling releases

The local gate is `just ci`. It runs typecheck, lint-check, format-check,
actionlint, shell-check, tests, and strict docgraph in that order. Tests build
TypeScript before running both the top-level and nested Node test files.
The gate does not run the network smoke or the publish script.

Setup uses `npm ci` and reinstalls hooks when this checkout owns them.

AI mode writes the full log to `.ci-ai.log` and prints one result line.

Each justfile owns its recipes; there are no sibling taskfile imports.

Registry generation reads `REGEN_ROOT` from the environment and defaults to
`_site`. The publish script passes its temporary directory through that
variable before calling `just regen-index`.

Tooling releases use Git tags, not the private npm metadata version. The
release driver runs `just ci-slow`, creates an annotated version tag, pushes
master and that tag, and creates a GitHub Release with generated notes.
The wrapper disables the release build. On a normal clean gate run no package
archives are produced, so the release has no assets. The driver would attach
any matching archives already present in `dist/`; verify that directory
before release.

A tooling release does not rebuild Pages, update consumers, or restart services.
Registry publication is the separate `scripts/publish-index.sh` command.

## What stays outside

Publisher packages stay in their own repositories. This repo stores no package
source and no new tarball bytes.

The Python index is
[`pdomain-index-pip`](https://github.com/pdomain/pdomain-index-pip). It serves
PEP 503 HTML. This repo serves npm packument JSON.

Both publish scripts push a `gh-pages` branch.

The two generators do not share code.

Commit `290f458` removed the GitHub Actions workflows on 2026-09-13. There is
no CI workflow, no regeneration workflow, and no dependency-refresh workflow.

`pyproject.toml` remains so `uv run` and pre-commit match other pdomain repos.

`scripts/__init__.py` is empty. Commit `6071e3a` deleted
`scripts/update_github_actions.py`, the last production Python script.

## Copied release driver

`scripts/release-common.sh` opens with the comment "Shared release driver for
pdomain Python repos."

The same filename is copied into other pdomain repositories. The copies are
not identical.

This repository vendors one copy. It is not the upstream of that driver.

## Evidence

- **Code:** `scripts/regen-index.ts` (`DEFAULT_REPOS`,
  `DEFAULT_EXPECTED_PACKAGES`), `scripts/publish-index.sh`,
  `scripts/do-release.sh`, `scripts/release-common.sh`, `pyproject.toml`,
  `scripts/__init__.py`.
- **Tests:** `tests/test_regen_index.test.ts`, `tests/smoke/run.sh`.
- **Neighbors:** `pdomain-index-pip` has its own `scripts/regen_index.py` and
  `scripts/publish-index.sh`. Its `scripts/release-common.sh` differs from the
  copy here: 175 lines there and 182 lines here, compared on 2026-11-12.
- **Task process:** `justfile`, `package.json`, `scripts/publish-index.sh`,
  and `scripts/release-common.sh`; migration commits `e1de6f2` and `9593417`.
- **Rechecked:** source review and all 15 Node tests on 2026-11-13.
- **Verified:** source review on 2026-11-12. `make ci` was not re-run for this
  document.

## Open questions

Work that might belong in another repository is listed on
[Remaining work](../roadmap.md). None of those splits is approved.
