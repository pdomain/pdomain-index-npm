import { test } from "node:test";
import assert from "node:assert/strict";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { createServer } from "node:http";
import type { Server } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { regenIndex } from "../scripts/regen-index.js";
import { buildMinimalTarball } from "./_tar.js";

async function makeRoot(): Promise<string> {
  const { mkdtemp } = await import("node:fs/promises");
  return mkdtemp(join(tmpdir(), "pdomain-index-npm-regen-"));
}

function startGithubFixture(
  releases: unknown[],
  files: Record<string, Buffer>,
): Promise<{
  server: Server;
  baseUrl: string;
  releasePageRequests: string[];
  seenAuthHeaders: string[];
}> {
  const releasePageRequests: string[] = [];
  const seenAuthHeaders: string[] = [];

  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = req.url ?? "";
      const auth = req.headers["authorization"];
      if (typeof auth === "string") seenAuthHeaders.push(auth);

      if (url.startsWith("/repos/pdomain/pdomain-ui/releases?")) {
        releasePageRequests.push(url);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(releases));
        return;
      }

      const file = files[url];
      if (file) {
        res.writeHead(200, {
          "Content-Type": "application/octet-stream",
          "Content-Length": String(file.byteLength),
        });
        res.end(file);
        return;
      }

      res.writeHead(404);
      res.end("Not found");
    });

    server.listen(0, "127.0.0.1", () => {
      const addr = server.address() as { port: number };
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${addr.port}`,
        releasePageRequests,
        seenAuthHeaders,
      });
    });
  });
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

test("regenIndex writes packuments that preserve GitHub release asset tarball URLs", async () => {
  const root = await makeRoot();
  const tarball = await buildMinimalTarball({
    name: "@pdomain/pdomain-ui",
    version: "0.3.0",
    dependencies: { "@pdomain/runtime": "^1.0.0" },
    peerDependencies: { react: "^19.0.0" },
    type: "module",
    exports: { ".": "./index.js" },
  });

  const releases: unknown[] = [];
  const { server, baseUrl, releasePageRequests, seenAuthHeaders } =
    await startGithubFixture(releases, {
      "/assets/pdomain-ui-0.3.0.tgz": tarball,
    });
  const assetUrl = `${baseUrl}/assets/pdomain-ui-0.3.0.tgz`;
  releases.push({
    tag_name: "v0.3.0",
    assets: [
      {
        name: "pdomain-ui-0.3.0.tgz",
        browser_download_url: assetUrl,
        updated_at: "2026-05-29T12:00:00.000Z",
      },
    ],
  });

  try {
    const result = await regenIndex({
      root,
      githubApiBaseUrl: baseUrl,
      repos: ["pdomain/pdomain-ui"],
      token: "test-token",
      allowNonGithubAssetHostsForTests: true,
    });

    assert.deepEqual(result.scannedRepos, ["pdomain/pdomain-ui"]);
    assert.deepEqual(result.generated, ["@pdomain/pdomain-ui"]);
    assert.deepEqual(result.published, ["@pdomain/pdomain-ui@0.3.0"]);
    assert.deepEqual(result.skipped, []);
    assert.deepEqual(releasePageRequests, [
      "/repos/pdomain/pdomain-ui/releases?per_page=100&page=1",
    ]);
    assert.deepEqual(seenAuthHeaders, ["Bearer test-token"]);

    const packumentPath = join(root, "@pdomain", "pdomain-ui", "index.html");
    assert.equal(await pathExists(packumentPath), true);
    const packument = JSON.parse(await readFile(packumentPath, "utf8")) as {
      versions: Record<
        string,
        {
          dependencies?: unknown;
          peerDependencies?: unknown;
          type?: unknown;
          exports?: unknown;
          dist: { tarball: string; shasum: string; integrity: string };
        }
      >;
      time: Record<string, string>;
    };
    const version = packument.versions["0.3.0"];
    assert.equal(version.dist.tarball, assetUrl);
    assert.match(version.dist.shasum, /^[0-9a-f]{40}$/);
    assert.match(version.dist.integrity, /^sha512-/);
    assert.deepEqual(version.dependencies, { "@pdomain/runtime": "^1.0.0" });
    assert.deepEqual(version.peerDependencies, { react: "^19.0.0" });
    assert.equal(version.type, "module");
    assert.deepEqual(version.exports, { ".": "./index.js" });
    assert.equal(packument.time["0.3.0"], "2026-05-29T12:00:00.000Z");
    assert.equal(
      await pathExists(join(root, "@pdomain", "pdomain-ui", "-")),
      false,
    );
  } finally {
    server.close();
  }
});

test("regenIndex clears stale output before writing fresh packuments", async () => {
  const root = await makeRoot();
  await mkdir(join(root, "@pdomain", "pdomain-ui", "-"), { recursive: true });
  await writeFile(join(root, "@pdomain", "pdomain-ui", "-", "stale.tgz"), "");
  await mkdir(join(root, "@pdomain", "legacy"), { recursive: true });
  const tarball = await buildMinimalTarball({
    name: "@pdomain/pdomain-ui",
    version: "0.3.1",
  });

  const releases: unknown[] = [];
  const { server, baseUrl } = await startGithubFixture(releases, {
    "/assets/pdomain-ui-0.3.1.tgz": tarball,
  });
  releases.push({
    tag_name: "v0.3.1",
    assets: [
      {
        name: "pdomain-ui-0.3.1.tgz",
        browser_download_url: `${baseUrl}/assets/pdomain-ui-0.3.1.tgz`,
        updated_at: "2026-05-29T12:00:00.000Z",
      },
    ],
  });

  try {
    const result = await regenIndex({
      root,
      githubApiBaseUrl: baseUrl,
      repos: ["pdomain/pdomain-ui"],
      allowNonGithubAssetHostsForTests: true,
    });

    assert.deepEqual(result.generated, ["@pdomain/pdomain-ui"]);
    assert.equal(
      await pathExists(join(root, "@pdomain", "pdomain-ui", "-")),
      false,
    );
    assert.deepEqual(await readdir(join(root, "@pdomain")), ["pdomain-ui"]);
  } finally {
    server.close();
  }
});
