import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import type { Server } from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { publish, PublishConflictError } from "../scripts/publish.js";
import { buildMinimalTarball } from "./_tar.js";

const execFileAsync = promisify(execFile);

async function makeRoot(): Promise<string> {
  return mkdtemp(join(tmpdir(), "pdomain-index-npm-pub-"));
}

function startFileServer(
  files: Record<string, Buffer>,
): Promise<{ server: Server; baseUrl: string }> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const buf = files[req.url ?? ""];
      if (buf) {
        res.writeHead(200, { "Content-Type": "application/octet-stream" });
        res.end(buf);
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address() as { port: number };
      resolve({ server, baseUrl: `http://127.0.0.1:${addr.port}` });
    });
  });
}

test("publish drops the tarball into the right encoded path", async () => {
  const root = await makeRoot();
  const tarballBytes = await buildMinimalTarball({
    name: "@pdomain/pdomain-ui",
    version: "0.1.0-alpha",
  });
  const localTarball = join(root, "_input", "pdomain-ui-0.1.0-alpha.tgz");
  await mkdir(join(root, "_input"), { recursive: true });
  await writeFile(localTarball, tarballBytes);

  const result = await publish({
    root,
    tarballPath: localTarball,
    baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
  });

  assert.equal(result.packageName, "@pdomain/pdomain-ui");
  assert.equal(result.version, "0.1.0-alpha");

  // Tarball at rest: uses real slash path
  const tgzAtRest = await readFile(
    join(root, "@pdomain", "pdomain-ui", "-", "pdomain-ui-0.1.0-alpha.tgz"),
  );
  assert.equal(tgzAtRest.byteLength, tarballBytes.byteLength);

  // Packument at index.html
  const packument = JSON.parse(
    await readFile(join(root, "@pdomain", "pdomain-ui", "index.html"), "utf8"),
  ) as {
    "dist-tags": Record<string, string>;
    versions: Record<string, unknown>;
  };
  assert.equal(packument["dist-tags"].latest, "0.1.0-alpha");
  assert.equal(packument["dist-tags"].alpha, "0.1.0-alpha");
});

test("publish CLI accepts a tarball matching the expected package name", async () => {
  const root = await makeRoot();
  const tarballBytes = await buildMinimalTarball({
    name: "@pdomain/cli-bound",
    version: "0.0.1",
  });
  const localTarball = join(root, "_input", "cli-bound-0.0.1.tgz");
  await mkdir(join(root, "_input"), { recursive: true });
  await writeFile(localTarball, tarballBytes);

  const { stdout } = await execFileAsync(process.execPath, [
    "dist/scripts/publish.js",
    "--tarball",
    localTarball,
    "--root",
    root,
    "--base-url",
    "https://pdomain.github.io/pdomain-index-npm/",
    "--expected-package-name",
    "@pdomain/cli-bound",
  ]);

  assert.match(stdout, /Published @pdomain\/cli-bound@0\.0\.1/);
});

test("publish CLI rejects a tarball with an unexpected package name", async () => {
  const root = await makeRoot();
  const tarballBytes = await buildMinimalTarball({
    name: "@pdomain/wrong-package",
    version: "0.0.1",
  });
  const localTarball = join(root, "_input", "wrong-package-0.0.1.tgz");
  await mkdir(join(root, "_input"), { recursive: true });
  await writeFile(localTarball, tarballBytes);

  await assert.rejects(
    () =>
      execFileAsync(process.execPath, [
        "dist/scripts/publish.js",
        "--tarball",
        localTarball,
        "--root",
        root,
        "--base-url",
        "https://pdomain.github.io/pdomain-index-npm/",
        "--expected-package-name",
        "@pdomain/expected-package",
      ]),
    (err: unknown) => {
      const failure = err as { stderr?: string };
      assert.match(
        failure.stderr ?? "",
        /does not match expected package @pdomain\/expected-package/,
      );
      return true;
    },
  );
});

test("publish CLI accepts expected package names through the environment", async () => {
  const root = await makeRoot();
  const tarballBytes = await buildMinimalTarball({
    name: "@pdomain/env-bound",
    version: "0.0.1",
  });
  const localTarball = join(root, "_input", "env-bound-0.0.1.tgz");
  await mkdir(join(root, "_input"), { recursive: true });
  await writeFile(localTarball, tarballBytes);

  const { stdout } = await execFileAsync(
    process.execPath,
    [
      "dist/scripts/publish.js",
      "--tarball",
      localTarball,
      "--root",
      root,
      "--base-url",
      "https://pdomain.github.io/pdomain-index-npm/",
    ],
    {
      env: {
        ...process.env,
        EXPECTED_PACKAGE_NAME: "@pdomain/env-bound",
      },
    },
  );

  assert.match(stdout, /Published @pdomain\/env-bound@0\.0\.1/);
});

test("publish refuses to overwrite an existing version with different bytes", async () => {
  const root = await makeRoot();

  const tarball1 = await buildMinimalTarball({
    name: "@pdomain/pdomain-ui",
    version: "0.1.0",
    description: "original",
  });
  const f1 = join(root, "_input1", "pdomain-ui-0.1.0.tgz");
  await mkdir(join(root, "_input1"), { recursive: true });
  await writeFile(f1, tarball1);
  await publish({
    root,
    tarballPath: f1,
    baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
  });

  const tarball2 = await buildMinimalTarball({
    name: "@pdomain/pdomain-ui",
    version: "0.1.0",
    description: "different content",
  });
  const f2 = join(root, "_input2", "pdomain-ui-0.1.0.tgz");
  await mkdir(join(root, "_input2"), { recursive: true });
  await writeFile(f2, tarball2);

  await assert.rejects(
    () =>
      publish({
        root,
        tarballPath: f2,
        baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
      }),
    (err: unknown) => {
      assert.ok(err instanceof PublishConflictError);
      assert.match((err as Error).message, /0\.1\.0/);
      return true;
    },
  );
});

test("publish refuses to overwrite an existing tarball when the packument is missing", async () => {
  const root = await makeRoot();
  const tarball1 = await buildMinimalTarball({
    name: "@pdomain/pdomain-ui",
    version: "0.1.0",
    description: "original",
  });
  const tarballAtRest = join(
    root,
    "@pdomain",
    "pdomain-ui",
    "-",
    "pdomain-ui-0.1.0.tgz",
  );
  await mkdir(join(root, "@pdomain", "pdomain-ui", "-"), { recursive: true });
  await writeFile(tarballAtRest, tarball1);

  const tarball2 = await buildMinimalTarball({
    name: "@pdomain/pdomain-ui",
    version: "0.1.0",
    description: "different content",
  });
  const f2 = join(root, "_input2", "pdomain-ui-0.1.0.tgz");
  await mkdir(join(root, "_input2"), { recursive: true });
  await writeFile(f2, tarball2);

  await assert.rejects(
    () =>
      publish({
        root,
        tarballPath: f2,
        baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
      }),
    PublishConflictError,
  );
});

test("publish treats an existing same-byte tarball as idempotent when the packument is malformed", async () => {
  const root = await makeRoot();
  const tarballBytes = await buildMinimalTarball({
    name: "@pdomain/pdomain-ui",
    version: "0.1.0",
  });
  const tarballAtRest = join(
    root,
    "@pdomain",
    "pdomain-ui",
    "-",
    "pdomain-ui-0.1.0.tgz",
  );
  await mkdir(join(root, "@pdomain", "pdomain-ui", "-"), { recursive: true });
  await writeFile(tarballAtRest, tarballBytes);
  await writeFile(join(root, "@pdomain", "pdomain-ui", "index.html"), "{");
  const localTarball = join(root, "_input", "pdomain-ui-0.1.0.tgz");
  await mkdir(join(root, "_input"), { recursive: true });
  await writeFile(localTarball, tarballBytes);

  const result = await publish({
    root,
    tarballPath: localTarball,
    baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
  });

  assert.equal(result.tarballRestingPath, tarballAtRest);
  assert.deepEqual(await readFile(tarballAtRest), tarballBytes);
  const rebuiltPackument = JSON.parse(
    await readFile(join(root, "@pdomain", "pdomain-ui", "index.html"), "utf8"),
  ) as {
    versions: Record<string, unknown>;
  };
  assert.ok(rebuiltPackument.versions["0.1.0"]);
});

test("publish accepts a URL for the tarball, downloads it, then publishes", async () => {
  const root = await makeRoot();
  const tarballBytes = await buildMinimalTarball({
    name: "@pdomain/test-package",
    version: "0.0.1",
  });

  const { server, baseUrl } = await startFileServer({
    "/test-package-0.0.1.tgz": tarballBytes,
  });

  try {
    const result = await publish({
      root,
      tarballUrl: `${baseUrl}/test-package-0.0.1.tgz`,
      baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
    });

    assert.equal(result.packageName, "@pdomain/test-package");
    assert.equal(result.version, "0.0.1");

    const tgzAtRest = await readFile(
      join(root, "@pdomain", "test-package", "-", "test-package-0.0.1.tgz"),
    );
    assert.equal(tgzAtRest.byteLength, tarballBytes.byteLength);
  } finally {
    server.close();
  }
});

test("publish rejects local tarballs larger than the configured tarball cap", async () => {
  const root = await makeRoot();
  const tarballBytes = await buildMinimalTarball({
    name: "@pdomain/test-package",
    version: "0.0.1",
  });
  const localTarball = join(root, "_input", "test-package-0.0.1.tgz");
  await mkdir(join(root, "_input"), { recursive: true });
  await writeFile(localTarball, tarballBytes);

  await assert.rejects(
    () =>
      publish({
        root,
        tarballPath: localTarball,
        baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
        maxTarballBytes: tarballBytes.byteLength - 1,
      }),
    /Tarball exceeds maximum size/,
  );
});

test("publish rejects tarballs whose decompressed package metadata exceeds the configured cap", async () => {
  const root = await makeRoot();
  const tarballBytes = await buildMinimalTarball({
    name: "@pdomain/test-package",
    version: "0.0.1",
  });
  const localTarball = join(root, "_input", "test-package-0.0.1.tgz");
  await mkdir(join(root, "_input"), { recursive: true });
  await writeFile(localTarball, tarballBytes);

  await assert.rejects(
    () =>
      publish({
        root,
        tarballPath: localTarball,
        baseUrl: "https://pdomain.github.io/pdomain-index-npm/",
        maxDecompressedBytes: 512,
      }),
    /Tarball decompressed data exceeds maximum size/,
  );
});
