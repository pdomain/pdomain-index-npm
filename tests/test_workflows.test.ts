import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const MANAGED_ACTIONS = new Set([
  "actions/checkout",
  "actions/configure-pages",
  "actions/deploy-pages",
  "actions/setup-node",
  "actions/upload-pages-artifact",
  "astral-sh/setup-uv",
]);

const USES_PATTERN = /^\s*-?\s*uses:\s*([^@\s#]+)(?:@[^\s#]+)?/gm;

function workflowActionNames(text: string): Set<string> {
  const names = new Set<string>();
  for (const match of text.matchAll(USES_PATTERN)) {
    const name = match[1];
    if (!name.startsWith("./")) {
      names.add(name);
    }
  }
  return names;
}

async function verifyManagedActions(workflowDir: string): Promise<void> {
  const unmanaged = new Map<string, string[]>();
  for (const file of (await readdir(workflowDir)).filter((name) =>
    name.endsWith(".yml"),
  )) {
    const text = await readFile(join(workflowDir, file), "utf8");
    for (const name of workflowActionNames(text)) {
      if (!MANAGED_ACTIONS.has(name)) {
        unmanaged.set(name, [...(unmanaged.get(name) ?? []), file]);
      }
    }
  }
  if (unmanaged.size > 0) {
    const details = [...unmanaged]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, files]) => `${name} in ${files.join(", ")}`)
      .join(", ");
    throw new Error(`unmanaged workflow actions: ${details}`);
  }
}

test("release workflow calls index regeneration after publishing the GitHub Release", async () => {
  const workflow = await readFile(".github/workflows/release.yml", "utf8");
  const releaseCreate = workflow.indexOf("gh release create");
  const refreshIndex = workflow.indexOf("refresh-index:");

  assert.notEqual(releaseCreate, -1);
  assert.ok(refreshIndex > releaseCreate);
  assert.match(workflow, /uses: \.\/\.github\/workflows\/regen\.yml/);
  assert.match(workflow, /pages: write/);
  assert.match(workflow, /id-token: write/);
});

test("regen workflow keeps external publisher dispatch event", async () => {
  const workflow = await readFile(".github/workflows/regen.yml", "utf8");

  assert.match(workflow, /^name: regen-and-deploy$/m);
  assert.match(workflow, /workflow_call:/);
  assert.match(workflow, /types: \[pdomain-npm-publish\]/);
});

test("workflow policy detects unmanaged actions", async () => {
  const dir = await mkdtemp(join(tmpdir(), "workflow-policy-"));
  try {
    await writeFile(
      join(dir, "ci.yml"),
      "name: ci\njobs:\n  ci:\n    steps:\n      - uses: example/not-managed@abc123\n",
    );

    await assert.rejects(
      () => verifyManagedActions(dir),
      /example\/not-managed/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("workflow policy accepts local workflow calls", async () => {
  const dir = await mkdtemp(join(tmpdir(), "workflow-policy-"));
  try {
    await writeFile(
      join(dir, "release.yml"),
      "jobs:\n  regen:\n    uses: ./.github/workflows/regen.yml\n",
    );

    await verifyManagedActions(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("current workflows use only managed actions", async () => {
  await verifyManagedActions(".github/workflows");
});
