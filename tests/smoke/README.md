# Smoke Test

The `run.sh` script is the end-to-end integration test for `pdomain-index-npm`. It
proves that a clean npm client can install `@pdomain/pdomain-ui` through the
configured `@pdomain` registry override.

## What the smoke proves

1. The packument JSON is live at the expected URL and has the correct shape
   (`name`, `dist-tags`, `versions[].dist.tarball`).
2. The tarball the packument points at is a valid gzipped tar containing
   `package/package.json` — i.e., the npm wire format.
3. A fresh directory with only the `.npmrc` registry override can `npm install`
   the package, and the installed `package.json` has the expected name/version.

This is the only test that exercises the full round-trip (GitHub Pages HTTP
→ npm CLI → installed package metadata).

## Preconditions

The package under test must have at least one version published to the index.
By default, the smoke checks `@pdomain/pdomain-ui@latest`.

## How to run locally

```sh
make smoke
```

`npm run smoke` and `bash tests/smoke/run.sh` run the same check. This is a live
network test. The normal `make ci` gate checks the script's shell syntax but
does not execute the smoke against the deployed registry.

Expected output ends with `SMOKE PASSED`. Exit code is 0 on success, non-zero
on any step failure.

You can override the registry URL for local testing against a different
deployment:

```sh
REGISTRY=http://localhost:8000/ bash tests/smoke/run.sh
```

You can also pin the version to check a specific `@pdomain/pdomain-ui` release
asset:

```sh
VERSION=0.2.2 bash tests/smoke/run.sh
```

## Troubleshooting

| Symptom                            | Likely cause                                                                | Fix                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `curl` 404 on packument URL        | Pages artifact deployment has not served the regenerated index yet          | Check the index regeneration workflow and Pages deployment status    |
| `curl` 404 on tarball URL          | GitHub Release asset is missing or private                                  | Check the publisher repository release assets                        |
| `npm install` fails with 404       | Packument's `dist.tarball` URL is not the expected GitHub Release asset URL | Regenerate the index from the publisher repository releases          |
| Installed package metadata differs | Packument points at the wrong release asset or stale content                | Regenerate the index and verify the publisher release asset contents |
| Smoke fails soon after deployment  | Pages lag exceeded the polling window                                       | Wait for Pages deployment, then rerun the smoke                      |
