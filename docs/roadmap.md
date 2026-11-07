---
Status: active
Owner: repository maintainers
Created: 2026-11-06
Last verified: 2026-11-06
Kind: process
Level: I1
---

# Remaining work

## Agent Index

- **Kind:** process
- **Status:** active
- **Level:** I1
- **Last verified:** 2026-11-06
- **Read when:** choosing what is still unfinished in this registry.
- **Search terms:** remaining work, roadmap, open plan, open issue.

Two items are still open.

## Open items

- Publish does not run the clean-directory install check.

  The [automated live smoke plan](plans/2026-07-21-automated-live-smoke.md) is unfinished. Its post-deploy job was never added. Commit `290f458` removed `.github/workflows/`.

  The open decision is [automated live smoke](issues/2026-05-17-gh-007-automated-live-smoke.md).

- Thirteen `dep-refresh/*` branches were still on origin on 2026-11-06. `delete_branch_on_merge` is still false.

  See [dep-refresh branches](issues/2026-08-08-dep-refresh-cannot-auto-land.md).

Shipped registry behavior is [Registry Format](architecture/registry-format.md).

Ideas with no plan file stay in the [intent map](context/intent-map.md).
