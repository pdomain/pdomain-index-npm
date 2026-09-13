---
Status: active
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-07-14
Kind: usage
---

# pdomain-index-npm

## Agent Index

- **Kind:** usage
- **Status:** active
- **Read when:** using, publishing to, or releasing the registry.
- **Search terms:** npm registry, install, publish, release, GitHub Pages.

Self-hosted [npm registry](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md)
for the `@pdomain/*` scope, served as a static site from GitHub
Pages. The npm sibling of the existing [`pdomain-index-pip`](https://github.com/pdomain/pdomain-index-pip)
Python package index.

## URL

```text
https://pdomain.github.io/pdomain-index-npm/
```

## How consumers use it

Add to your project's `.npmrc`:

```text
@pdomain:registry=https://pdomain.github.io/pdomain-index-npm/
```

Then:

```sh
npm install @pdomain/pdomain-ui
```

Resolves through the static registry. Every other package continues to
resolve from npmjs.org. The registry is **read-only and unauthenticated**
— no token, no `npm login` required.

## How publishers push to it

Publisher repos create `.tgz` files as GitHub Release assets. The
`pdomain-index-npm` deploy workflow scans allowlisted publisher releases,
validates each package tarball, computes integrity metadata, and regenerates
the static packuments served by GitHub Pages.

GitHub Pages hosts packuments only. New package tarballs are fetched directly
from the publisher repository's GitHub Release assets. Historical Pages-hosted
tarball URLs are not a compatibility promise.

Run `./scripts/publish-index.sh` after a publisher cuts a release. It scans
the allowlisted GitHub Releases for `.tgz` assets, regenerates every packument,
and pushes the result to the `gh-pages` branch, which Pages serves directly.
`DRY_RUN=1` builds the registry and shows the diff without pushing.

There is no dispatch and no daily sync. The workflows were removed on
2026-09-13, so nothing regenerates the registry on its own and there is no
fallback if the command is skipped.

That gap is not hypothetical. The registry sat on `@pdomain/pdomain-ui` 0.9.0
from mid-June until 2026-09-13 while 0.10.1 and 0.11.0 were released and
unindexed, and every consuming app pins `^0.11.0`. Installs kept working only
because existing lockfiles already resolved it.

## Tooling Releases

This repo's own releases are tag-only tooling releases. Package versions indexed by
this repo come from publisher GitHub Release assets, not this repo's metadata version.
GitHub-generated release notes are canonical for tooling releases.

## Versioning conventions

- Semver throughout.
- Pre-1.0 incubation: `0.X.Y-alpha[.N]`. The `alpha` dist-tag tracks the
  latest prerelease; `latest` only advances when a non-prerelease is
  published.
- Versions are immutable. `scripts/regen-index.ts` rejects duplicate
  `name@version` release assets with different tarball bytes.

## Layout

See [docs/architecture/registry-format.md](docs/architecture/registry-format.md) for the on-disk
shape and the parts of the npm registry HTTP API we serve.

## Contributing

Start with [AGENTS.md](AGENTS.md) for repository workflow and verification
requirements.

## Why not just publish to npmjs.org?

Same answer as the pip side. The index speaks the same wire protocol
npmjs does, so migration later is `npm publish` + dropping the `.npmrc`
line. No package-shape changes required.

The `@pdomain/*` packages already follow habits to keep that door
open:

- Plain semver version strings (no npm-specific metadata in the version).
- Release versions are immutable (same `name@version` with different bytes
  is rejected).
- Tarball names follow the `<name>-<version>.tgz` convention npm itself uses.
