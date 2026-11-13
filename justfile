set shell := ["bash", "-eu", "-o", "pipefail", "-c"]
set positional-arguments

# Copy this wrapper and install-hooks with the shell setting to sibling justfiles.
[private]
_ai +args:
    #!/usr/bin/env bash
    set -euo pipefail
    if env AI= just --quiet "$@" > .ci-ai.log 2>&1; then
        printf 'PASS: %s\n' "$*"
    else
        result=$?
        printf 'FAIL: %s (exit %s)\n' "$*" "$result"
        if [[ -f scripts/ai_filter_log.py ]]; then
            uv run python scripts/ai_filter_log.py .ci-ai.log
        else
            tail -50 .ci-ai.log
        fi
        exit "$result"
    fi

install-hooks:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai install-hooks; fi
    if [[ -f .git ]]; then
        echo "hooks: worktree checkout - the canonical repo owns them, skipping"
    elif [[ -n "$(git config --get core.hooksPath || true)" ]]; then
        echo "hooks: core.hooksPath is set - leaving it alone, skipping"
    else
        uv run pre-commit install --hook-type pre-commit --hook-type commit-msg
    fi


setup:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai setup; fi
    npm ci
    just --quiet install-hooks

install:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai install; fi
    just --quiet setup

help:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai help; fi
    just --list

update-hooks:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai update-hooks; fi
    uv run pre-commit autoupdate --freeze

typecheck:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai typecheck; fi
    npm run typecheck

lint:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai lint; fi
    npm run lint

lint-check:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai lint-check; fi
    npm run lint:check

format:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai format; fi
    npm run format

format-check:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai format-check; fi
    npm run format:check

actionlint:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai actionlint; fi
    npm run actionlint

shell-check:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai shell-check; fi
    npm run shell:check

static-check:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai static-check; fi
    just --quiet typecheck lint-check format-check actionlint shell-check

pre-commit-check:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai pre-commit-check; fi
    uv run pre-commit run --all-files

test:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai test; fi
    npm test

build:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai build; fi
    npm run build

[default]
ci:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai ci; fi
    just --quiet typecheck lint-check format-check actionlint shell-check test
    docgraph check --strict

ci-slow:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai ci-slow; fi
    just --quiet ci

regen-index:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai regen-index; fi
    npm run regen-index -- --root "${REGEN_ROOT:-_site}"

smoke:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai smoke; fi
    npm run smoke

upgrade-deps:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai upgrade-deps; fi
    for marker in "${UV_PROJECT_ENVIRONMENT:-.venv}/.pdomain-local-mode" "${UV_PROJECT_ENVIRONMENT:-.venv}/.pdomain-dev-local"; do
        if [[ -f "$marker" ]]; then
            echo "Refusing dependency upgrades while $marker exists" >&2
            exit 1
        fi
    done
    npm update

release-patch:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai release-patch; fi
    BUMP=patch ./scripts/do-release.sh

release-minor:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai release-minor; fi
    BUMP=minor ./scripts/do-release.sh

release-major:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai release-major; fi
    BUMP=major ./scripts/do-release.sh

_do-release:
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ -n "${AI:-}" ]]; then exec just --quiet _ai _do-release; fi
    BUMP="${BUMP:-minor}" ./scripts/do-release.sh
