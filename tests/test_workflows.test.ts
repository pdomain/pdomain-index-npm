// Two tests were removed on 2026-09-13 with the workflows they read:
// one asserted the release workflow regenerated the index after
// publishing, the other pinned the regen workflow's dispatch event.
// Both mechanisms are gone; `scripts/publish-index.sh` replaces them.
// The remaining tests build their own workflow fixtures in temp dirs
// and still exercise the policy checker.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

function verifyManagedActions(workflowDir: string): string {
  return execFileSync(
    "python3",
    [
      "-c",
      [
        "import importlib.util",
        "import sys",
        "from pathlib import Path",
        "root = Path.cwd()",
        'path = root / "scripts" / "update_github_actions.py"',
        'spec = importlib.util.spec_from_file_location("update_github_actions", path)',
        "mod = importlib.util.module_from_spec(spec)",
        "assert spec.loader is not None",
        "spec.loader.exec_module(mod)",
        "try:",
        "    mod.verify_managed_actions(Path(sys.argv[1]))",
        "except ValueError as exc:",
        "    raise SystemExit(str(exc))",
        'print("managed actions ok")',
      ].join("\n"),
      workflowDir,
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );
}

function updateQuotedWorkflowRefs(workflowPath: string): string {
  return execFileSync(
    "python3",
    [
      "-c",
      [
        "import importlib.util",
        "import sys",
        "from pathlib import Path",
        "root = Path.cwd()",
        'path = root / "scripts" / "update_github_actions.py"',
        'spec = importlib.util.spec_from_file_location("update_github_actions", path)',
        "mod = importlib.util.module_from_spec(spec)",
        "assert spec.loader is not None",
        "spec.loader.exec_module(mod)",
        "workflow = Path(sys.argv[1])",
        "releases = {",
        "    'actions/checkout': mod.ActionRelease(tag='v-test', sha='a' * 40),",
        "    'astral-sh/setup-uv': mod.ActionRelease(tag='v-test', sha='b' * 40),",
        "}",
        "assert mod.update_workflow_refs(workflow, releases=releases)",
        "assert mod.update_uv_version_refs(workflow, version='0.11.16')",
        "print(workflow.read_text(encoding='utf-8'))",
      ].join("\n"),
      workflowPath,
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );
}

test("workflow policy detects unmanaged actions", async () => {
  const dir = await mkdtemp(join(tmpdir(), "workflow-policy-"));
  try {
    await writeFile(
      join(dir, "ci.yml"),
      "name: ci\njobs:\n  ci:\n    steps:\n      - uses: example/not-managed@abc123\n",
    );

    assert.throws(() => verifyManagedActions(dir), /example\/not-managed/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("workflow policy accepts quoted managed actions and local workflow calls", async () => {
  const dir = await mkdtemp(join(tmpdir(), "workflow-policy-"));
  try {
    await writeFile(
      join(dir, "release.yml"),
      "jobs:\n  regen:\n    uses: './.github/workflows/regen.yml'\n  ci:\n    steps:\n      - uses: \"actions/checkout@abc123\"\n",
    );

    assert.match(verifyManagedActions(dir), /managed actions ok/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("workflow updater rewrites quoted action refs and setup-uv version", async () => {
  const dir = await mkdtemp(join(tmpdir(), "workflow-update-"));
  try {
    const workflowPath = join(dir, "ci.yml");
    await writeFile(
      workflowPath,
      'jobs:\n  ci:\n    steps:\n      - uses: "actions/checkout@oldoldoldoldoldoldoldoldoldoldoldoldoldoldoldoldold1"\n      - uses: \'astral-sh/setup-uv@oldoldoldoldoldoldoldoldoldoldoldoldoldoldoldoldold2\'  # v8.1.0\n        with:\n          version: "0.1.0"\n',
    );

    const updated = updateQuotedWorkflowRefs(workflowPath);

    assert.match(
      updated,
      /uses: "actions\/checkout@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"/,
    );
    assert.match(
      updated,
      /uses: 'astral-sh\/setup-uv@bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'/,
    );
    assert.match(updated, /version: "0.11.16"/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("current workflows use only managed actions", () => {
  assert.match(verifyManagedActions(".github/workflows"), /managed actions ok/);
});
