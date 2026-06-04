import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

// Regression guard for the actionlint wasm panic.
//
// scripts/actionlint.mjs originally created ONE actionlint wasm linter via
// createLinter() and reused it across every workflow file. The actionlint
// wasm instance accumulates state across lint() calls and eventually triggers
// Go's "RuntimeError: unreachable" panic — observed reliably (20/20) on this
// repo's four workflows, which is what broke regen-and-deploy. The script now
// creates a fresh linter per file (measured 25/25 clean), so each lint() runs
// against an isolated wasm instance.
//
// This test runs the real script over the repo's actual workflows and asserts
// it exits cleanly. It loops a few times because the old failure, while
// reliable on this repo, is wasm-state dependent rather than input dependent.
test("actionlint script lints all workflows without a wasm panic", () => {
  for (let i = 0; i < 3; i += 1) {
    assert.doesNotThrow(
      () => {
        execFileSync("node", ["scripts/actionlint.mjs"], { stdio: "pipe" });
      },
      `actionlint.mjs crashed or reported findings on run ${i + 1}`,
    );
  }
});
