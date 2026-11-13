---
Status: built
Owner: repository maintainers
Created: 2026-05-17
Last verified: 2026-11-13
Kind: architecture
---

# Registry Format

## Agent Index

- **Kind:** architecture
- **Status:** built
- **Read when:** changing registry generation, deployment, or package resolution.
- **Search terms:** packument, registry format, release assets, regeneration.

This document describes the generated GitHub Pages artifact for the
`pdomain-index-npm` static registry and the parts of the npm registry HTTP API
we serve.

## Shipped architecture

`scripts/regen-index.ts` rebuilds all packuments from allowlisted GitHub Release
assets. `scripts/publish-index.sh` wraps it: it regenerates the registry and
pushes the result to the `gh-pages` branch, which GitHub Pages serves directly.
It is run by hand, and it always performs a full allowlisted scan.
[Repository boundary](repository-boundary.md) says what this repo does not own.

The shipped path differs from the original migration design in several useful
ways. It uses `REGEN_ROOT`. Until 2026-09-13 it also had a `pdomain-npm-publish`
event and a reusable `regen.yml` workflow. Both are gone. There is no dispatch
path now. `scripts/publish-index.sh` only runs a full allowlisted scan. While
those triggers existed, they ignored dispatch payload content because every
trigger full-scanned. The legacy publish, rebuild, and sync scripts were
removed after the replacement shipped.

## Evidence

- **Code:** `scripts/regen-index.ts` and `scripts/publish-index.sh`.
- **Tests:** `tests/test_regen_index.test.ts` and `tests/smoke/run.sh`.
- **Artifacts:** `scripts/publish-index.sh` builds a temporary site and pushes
  it to the `gh-pages` branch. `scripts/regen-index.ts` writes `_site` when no
  output root is set.
- **Verified:** `make ci` and source review on 2026-07-19. On 2026-11-06 the
  trust model, dist-tags precedence, and smoke-boundary sections were
  re-checked against `scripts/regen-index.ts`, `scripts/publish-index.sh`,
  `package.json`, and `tests/test_regen_index.test.ts`. `make ci` was not
  re-run on that date. The 2026-07-19 check also named
  `.github/workflows/regen.yml` and `tests/test_workflows.test.ts`. Commit
  `290f458` removed the workflows, and `tests/test_workflows.test.ts` is not
  in the tree.

- **Rechecked:** source and duplicate-version tests on 2026-11-13 confirm
  that conflict detection applies within one rebuild, not across rebuilds.

## Live smoke test boundary

`just smoke` and `npm run smoke` both invoke `tests/smoke/run.sh`. The script
checks the deployed registry over the network. It fetches the live packument
and release-asset tarball, creates a fresh directory with only the registry
override, runs `npm install`, and checks the installed package name and version.

The smoke test is a manual external check. `just ci` checks its shell syntax but
does not run it. `scripts/publish-index.sh` does not run it either. A successful
smoke run proves the selected package version and deployment at that time. It
does not prove every later publish.

## Directory layout

```text
/                                          # GitHub Pages root
  index.html                               # Human-readable landing page
  @pdomain/                        # Scope directory
    pdomain-ui/                                 # Package directory
      index.html                           # Packument JSON
    test-package/
      index.html                           # Packument JSON
```

Tarball bytes are not stored in the Pages artifact for new versions. The
packument's `dist.tarball` field points at the publisher repository's GitHub
Release asset URL, and npm downloads the tarball from GitHub Releases.

### Why real slashes (not `%2f`)

The npm protocol uses URL-encoded scoped names: `GET /@pdomain%2fpdomain-ui`.
GitHub Pages decodes `%2f` to a real `/` when matching paths, so a request for
`/@pdomain%2fpdomain-ui/` is served from the generated directory
`@pdomain/pdomain-ui/`. This is the standard approach for GitHub Pages-hosted
static npm registries.

### Packument files

The packument (the JSON document npm GETs when resolving a package) is stored as
`index.html` inside each package directory. GitHub Pages redirects `GET
/@pdomain%2fpdomain-ui` to `/@pdomain/pdomain-ui/` and serves
`@pdomain/pdomain-ui/index.html`. npm follows the redirect and parses the body
as JSON (Content-Type is not checked against the body).

## Packument JSON shape

```json
{
  "name": "@pdomain/pdomain-ui",
  "dist-tags": {
    "latest": "0.1.1-alpha",
    "alpha": "0.1.1-alpha"
  },
  "versions": {
    "0.1.0-alpha": {
      "name": "@pdomain/pdomain-ui",
      "version": "0.1.0-alpha",
      "description": "...",
      "main": "dist/index.js",
      "dependencies": { "konva": "^9.0.0", "...": "..." },
      "peerDependencies": { "react": "^18.0.0", "react-dom": "^18.0.0" },
      "engines": { "node": ">=20" },
      "type": "module",
      "exports": { ".": { "...": "..." } },
      "dist": {
        "tarball": "https://github.com/pdomain/pdomain-ui/releases/download/v0.1.0-alpha/pdomain-ui-0.1.0-alpha.tgz",
        "shasum": "<sha1 hex, 40 chars>",
        "integrity": "sha512-<base64>"
      }
    },
    "0.1.1-alpha": { "...": "..." }
  },
  "time": {
    "created": "2026-05-17T00:00:00.000Z",
    "modified": "2026-05-18T00:00:00.000Z",
    "0.1.0-alpha": "2026-05-17T00:00:00.000Z",
    "0.1.1-alpha": "2026-05-18T00:00:00.000Z"
  }
}
```

The `dist.tarball` URL is the publisher repository's GitHub Release asset URL.
The registry stores hashes in the packument, but it does not copy the tarball
into the Pages artifact.

Each version object also carries metadata fields copied verbatim
from the tarball's `package.json` — `dependencies`, `peerDependencies`,
`devDependencies`, `peerDependenciesMeta`, `optionalDependencies`,
`bundleDependencies`, `bundledDependencies`,
`engines`, `exports`, `imports`, `type`, `bin`, `os`, `cpu`, `sideEffects`,
`funding`, `deprecated`, `hasInstallScript`. Dependency and package-entry fields
let package managers resolve and install the package. `devDependencies` is
copied as metadata; it does not declare consumer runtime dependencies.

## Upstream references

- [npm registry HTTP API spec](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md)
- [Verdaccio static-publish](https://verdaccio.org/docs/configuration/#static-publish)
  is the closest existing reference implementation.

## Intentional simplifications

- **No `_attachments`**: Tarballs are referenced by URL, not embedded as base64
  in the packument.
- **No `_rev`**: `scripts/regen-index.ts` regenerates packuments from
  allowlisted GitHub Release assets.
- **No PUT semantics**: The registry is read-only from the consumer's perspective.
- **No `npm login`**: The registry is unauthenticated. All packages are public.

## Trust model

Tarballs are discovered from allowlisted publisher GitHub Releases. The
`scripts/regen-index.ts` script downloads each tarball, validates package
metadata, computes SHA-1 (`shasum`) and SHA-512 (`integrity`) hashes, and writes
both into the packument. Publishers never compute hashes themselves; the
regeneration script is the single source of truth for integrity data.

Each allowlisted repository has one expected package name. Regeneration rejects
repositories without that mapping and skips a tarball whose `package.json`
declares another name. Output paths therefore come from trusted configuration,
not tarball-controlled metadata. Release asset URLs must also point to the
allowlisted repository's GitHub release-download path.

The generator clears its output before writing and enforces limits on compressed
tarballs, decompressed data, and `package.json`. Repeating the same package
version with identical content within one rebuild is idempotent. Conflicting
hashes for one version in that rebuild cause a hard failure. The generator
does not compare against prior output or retain an integrity ledger between
runs. Publishers must keep released versions immutable.

These invariants are covered in `tests/test_regen_index.test.ts`, including
unknown repositories, wrong package names, wrong release hosts, size limits,
and conflicting duplicate versions.

## dist-tags conventions

- `latest`: the highest semver non-prerelease version. Falls back to the highest
  prerelease if no stable versions exist yet.
- Per-prerelease-tag (e.g. `alpha`): the highest version whose prerelease identifier
  starts with that tag (e.g. `0.1.0-alpha.2` for tag `alpha`).

Prerelease identifiers follow semver precedence. Numeric identifiers compare as
numbers, so `alpha.10` sorts after `alpha.2`; numeric identifiers sort before
non-numeric identifiers. The regression test
`regenIndex sorts numeric prerelease identifiers by semver precedence` protects
this behavior.
