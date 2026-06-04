import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { createLinter } from "actionlint";

const workflowDir = ".github/workflows";
const args = process.argv.slice(2);

async function defaultWorkflowFiles() {
  const entries = await readdir(workflowDir);
  return entries
    .filter((entry) => entry.endsWith(".yml") || entry.endsWith(".yaml"))
    .map((entry) => join(workflowDir, entry));
}

const files = args.length > 0 ? args : await defaultWorkflowFiles();
let failureCount = 0;

for (const file of files) {
  // Create a fresh linter per file. A single actionlint wasm linter instance
  // accumulates state across lint() calls and eventually panics with Go's
  // "RuntimeError: unreachable" (observed reliably by the 4th workflow on this
  // repo). A fresh instance per file isolates the wasm state. See
  // tests/test_actionlint_script.test.ts.
  const lint = await createLinter();
  const input = await readFile(file, "utf8");
  const results = lint(input, file);
  for (const result of results) {
    failureCount += 1;
    console.error(
      `${result.file}:${result.line}:${result.column}: ${result.message} [${result.kind}]`,
    );
  }
}

if (failureCount > 0) {
  process.exit(1);
}
