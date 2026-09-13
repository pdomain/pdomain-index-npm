#!/usr/bin/env bash
set -eu

RELEASE_REPO="pdomain/pdomain-index-npm"
# This repo publishes tooling, not a distributable: `make build` here
# regenerates the static index rather than producing a wheel. Release the
# tag alone.
RELEASE_BUILD=":"

. "$(dirname "$0")/release-common.sh"
pd_release_main "$@"
