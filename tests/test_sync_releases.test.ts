import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import type { Server } from "node:http";
import { syncPublishedReleases } from "../scripts/sync-releases.js";
import { buildMinimalTarball } from "./_tar.js";

async function makeRoot(): Promise<string> {
  return mkdtemp(join(tmpdir(), "pdomain-index-npm-sync-"));
}

function startGithubFixture(
  releases: unknown[] | Record<number, unknown[]>,
  files: Record<string, Buffer>,
): Promise<{
  server: Server;
  baseUrl: string;
  releasePageRequests: string[];
  seenAuthHeaders: string[];
}> {
  const releasePages = Array.isArray(releases) ? { 1: releases } : releases;
  const releasePageRequests: string[] = [];
  const seenAuthHeaders: string[] = [];
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = req.url ?? "";
      const auth = req.headers["authorization"];
      if (typeof auth === "string") seenAuthHeaders.push(auth);

      if (url.startsWith("/repos/pdomain/pdomain-ui/releases?")) {
        releasePageRequests.push(url);
        const requestUrl = new URL(url, "http://fixture.test");
        const page = Number(requestUrl.searchParams.get("page") ?? "1");
        const pageReleases = releasePages[page];
        if (pageReleases === undefined) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(pageReleases));
        return;
      }

      const file = files[url];
      if (file) {
        res.writeHead(200, { "Content-Type": "application/octet-stream" });
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

test("syncPublishedReleases publishes .tgz assets from GitHub releases", async () => {
  const root = await makeRoot();
  const tarball = await buildMinimalTarball({
    name: "@pdomain/pdomain-ui",
    version: "0.2.2",
  });
  const legacyTarball = await buildMinimalTarball({
    name: "@concavetrillion/pd-ui",
    version: "0.2.1",
  });

  const releases: unknown[] = [];
  const { server, baseUrl, releasePageRequests, seenAuthHeaders } =
    await startGithubFixture(releases, {
      "/assets/pdomain-ui-0.2.2.tgz": tarball,
      "/assets/pd-ui-0.2.1.tgz": legacyTarball,
    });
  releases.push({
    tag_name: "v0.2.2",
    assets: [
      {
        name: "pdomain-ui-0.2.2.tgz",
        browser_download_url: `${baseUrl}/assets/pdomain-ui-0.2.2.tgz`,
      },
      {
        name: "pd-ui-0.2.1.tgz",
        browser_download_url: `${baseUrl}/assets/pd-ui-0.2.1.tgz`,
      },
      {
        name: "checksums.txt",
        browser_download_url: `${baseUrl}/assets/checksums.txt`,
      },
    ],
  });

  try {
    const originalWarn = console.warn;
    console.warn = () => undefined;
    let result: Awaited<ReturnType<typeof syncPublishedReleases>>;
    try {
      result = await syncPublishedReleases({
        root,
        baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
        githubApiBaseUrl: baseUrl,
        repos: ["pdomain/pdomain-ui"],
        token: "test-token",
      });
    } finally {
      console.warn = originalWarn;
    }

    assert.deepEqual(result.scannedRepos, ["pdomain/pdomain-ui"]);
    assert.deepEqual(result.published, ["@pdomain/pdomain-ui@0.2.2"]);
    assert.equal(result.skipped.length, 1);
    assert.match(result.skipped[0], /@concavetrillion\/pd-ui/);
    assert.deepEqual(releasePageRequests, [
      "/repos/pdomain/pdomain-ui/releases?per_page=100&page=1",
    ]);
    assert.deepEqual(seenAuthHeaders, ["Bearer test-token"]);

    const packument = JSON.parse(
      await readFile(
        join(root, "@pdomain", "pdomain-ui", "index.html"),
        "utf8",
      ),
    ) as { versions: Record<string, unknown> };
    assert.ok(packument.versions["0.2.2"]);
  } finally {
    server.close();
  }
});

test("syncPublishedReleases fetches release pages until a short page", async () => {
  const root = await makeRoot();
  const tarball = await buildMinimalTarball({
    name: "@pdomain/pdomain-ui",
    version: "0.3.0",
  });

  const fullPage = Array.from({ length: 100 }, (_, index) => ({
    tag_name: `v0.2.${index}`,
    assets: [],
  }));
  const finalPage: unknown[] = [];
  const { server, baseUrl, releasePageRequests } = await startGithubFixture(
    {
      1: fullPage,
      2: finalPage,
    },
    {
      "/assets/pdomain-ui-0.3.0.tgz": tarball,
    },
  );
  finalPage.push({
    tag_name: "v0.3.0",
    assets: [
      {
        name: "pdomain-ui-0.3.0.tgz",
        browser_download_url: `${baseUrl}/assets/pdomain-ui-0.3.0.tgz`,
      },
    ],
  });

  try {
    const result = await syncPublishedReleases({
      root,
      baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
      githubApiBaseUrl: baseUrl,
      repos: ["pdomain/pdomain-ui"],
    });

    assert.deepEqual(result.published, ["@pdomain/pdomain-ui@0.3.0"]);
    assert.deepEqual(releasePageRequests, [
      "/repos/pdomain/pdomain-ui/releases?per_page=100&page=1",
      "/repos/pdomain/pdomain-ui/releases?per_page=100&page=2",
    ]);
  } finally {
    server.close();
  }
});

test("syncPublishedReleases stops after the release page cap", async () => {
  const root = await makeRoot();
  const fullPage = Array.from({ length: 100 }, (_, index) => ({
    tag_name: `v0.${index}.0`,
    assets: [],
  }));
  const releasesByPage: Record<number, unknown[]> = {};
  for (let page = 1; page <= 10; page++) {
    releasesByPage[page] = fullPage;
  }
  const { server, baseUrl, releasePageRequests } = await startGithubFixture(
    releasesByPage,
    {},
  );

  try {
    const result = await syncPublishedReleases({
      root,
      baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
      githubApiBaseUrl: baseUrl,
      repos: ["pdomain/pdomain-ui"],
    });

    assert.deepEqual(result.published, []);
    assert.equal(releasePageRequests.length, 10);
    assert.equal(
      releasePageRequests[9],
      "/repos/pdomain/pdomain-ui/releases?per_page=100&page=10",
    );
  } finally {
    server.close();
  }
});
