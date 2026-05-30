/**
 * publish.ts
 *
 * Publishes a single .tgz tarball into the pdomain-index-npm static registry.
 *
 * Algorithm:
 *   1. If tarballUrl given, download via Node 20 native fetch().
 *   2. Parse package/package.json out of the tarball to get { name, version }.
 *   3. Compute integrity (SHA-512) + shasum (SHA-1).
 *   4. Check existing packument — if same version exists with DIFFERENT shasum,
 *      throw PublishConflictError. Same-bytes re-publish is idempotent (no-op).
 *   5. Write tarball into <root>/@scope/name/-/<name>-<version>.tgz.
 *   6. Call rebuildPackuments({ root, baseUrl, packageName }) to refresh the packument.
 *
 * CLI usage:
 *   node dist/scripts/publish.js --tarball <path> --root <gh-pages-checkout> --base-url <url>
 *   node dist/scripts/publish.js --tarball-url <url> --root <gh-pages-checkout> --base-url <url>
 */

import { createReadStream } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { createGunzip } from "node:zlib";
import { Readable } from "node:stream";
import { tarballDirFor, packumentPathFor } from "./registry-layout.js";
import {
  rebuildPackuments,
  type RebuildOptions,
} from "./rebuild-packuments.js";

export type { RebuildOptions };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PublishOptions {
  /** Absolute path to the registry root (gh-pages checkout or local fixture). */
  root: string;
  /** Local path to the .tgz to publish. Mutually exclusive with tarballUrl. */
  tarballPath?: string;
  /** URL to download the .tgz from. Mutually exclusive with tarballPath. */
  tarballUrl?: string;
  /** Optional guard used by release-sync jobs to avoid indexing legacy packages. */
  expectedPackageName?: string;
  /** Maximum compressed tarball bytes accepted from local paths or URLs. */
  maxTarballBytes?: number;
  /** Maximum decompressed tar bytes scanned while looking for package.json. */
  maxDecompressedBytes?: number;
  /** Maximum bytes accepted for the package.json entry inside the tarball. */
  maxPackageJsonBytes?: number;
  /** Registry base URL, e.g. "https://pdomain.github.io/pdomain-index-npm/" */
  baseUrl: string;
}

export interface PublishResult {
  packageName: string;
  version: string;
  packumentPath: string;
  tarballRestingPath: string;
}

export class PublishConflictError extends Error {
  constructor(packageName: string, version: string) {
    super(
      `Version ${version} of ${packageName} is already published with different content. ` +
        `npm versions are immutable. To fix a release, publish a new version.`,
    );
    this.name = "PublishConflictError";
  }
}

export class UnexpectedPackageNameError extends Error {
  actualPackageName: string;
  expectedPackageName: string;

  constructor(actualPackageName: string, expectedPackageName: string) {
    super(
      `Tarball package name ${actualPackageName} does not match expected package ${expectedPackageName}.`,
    );
    this.name = "UnexpectedPackageNameError";
    this.actualPackageName = actualPackageName;
    this.expectedPackageName = expectedPackageName;
  }
}

// ---------------------------------------------------------------------------
// Minimal tar parser (no deps)
// ---------------------------------------------------------------------------

interface TarEntry {
  name: string;
  size: number;
  data: Buffer;
}

const DEFAULT_MAX_TARBALL_BYTES = 64 * 1024 * 1024;
const DEFAULT_MAX_DECOMPRESSED_BYTES = 128 * 1024 * 1024;
const DEFAULT_MAX_PACKAGE_JSON_BYTES = 1024 * 1024;

function maxBytesError(label: string, maxBytes: number): Error {
  return new Error(`${label} exceeds maximum size of ${maxBytes} bytes`);
}

async function bufferReadableWithLimit(
  stream: AsyncIterable<Buffer | Uint8Array | string>,
  maxBytes: number,
  label: string,
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of stream) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buf.byteLength;
    if (total > maxBytes) {
      throw maxBytesError(label, maxBytes);
    }
    chunks.push(buf);
  }
  return Buffer.concat(chunks, total);
}

async function bufferWebStreamWithLimit(
  stream: ReadableStream<Uint8Array>,
  maxBytes: number,
  label: string,
): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Buffer[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const buf = Buffer.from(value);
      total += buf.byteLength;
      if (total > maxBytes) {
        throw maxBytesError(label, maxBytes);
      }
      chunks.push(buf);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, total);
}

async function readFileWithLimit(
  path: string,
  maxBytes: number,
): Promise<Buffer> {
  return bufferReadableWithLimit(createReadStream(path), maxBytes, "Tarball");
}

function parseTarEntries(buf: Buffer, maxPackageJsonBytes: number): TarEntry[] {
  const entries: TarEntry[] = [];
  let offset = 0;
  while (offset + 512 <= buf.length) {
    const header = buf.subarray(offset, offset + 512);
    if (header.every((b) => b === 0)) break;
    const name = header.subarray(0, 100).toString("utf8").replace(/\0+$/, "");
    const sizeOctal = header
      .subarray(124, 136)
      .toString("ascii")
      .replace(/\0+$/, "")
      .trim();
    const size = parseInt(sizeOctal, 8) || 0;
    const typeFlag = header[156];
    offset += 512;
    if (typeFlag === 0 || typeFlag === 48) {
      if (
        (name === "package/package.json" || name.endsWith("/package.json")) &&
        size > maxPackageJsonBytes
      ) {
        throw maxBytesError("Tarball package.json", maxPackageJsonBytes);
      }
      entries.push({ name, size, data: buf.subarray(offset, offset + size) });
    }
    offset += Math.ceil(size / 512) * 512;
  }
  return entries;
}

async function extractPackageJson(
  tgzBuffer: Buffer,
  maxDecompressedBytes: number,
  maxPackageJsonBytes: number,
): Promise<Record<string, unknown>> {
  const gunzipped = await bufferReadableWithLimit(
    Readable.from(tgzBuffer).pipe(createGunzip()),
    maxDecompressedBytes,
    "Tarball decompressed data",
  );
  const entries = parseTarEntries(gunzipped, maxPackageJsonBytes);
  const entry = entries.find(
    (e) =>
      e.name === "package/package.json" || e.name.endsWith("/package.json"),
  );
  if (!entry) throw new Error("No package/package.json found in tarball");
  return JSON.parse(entry.data.toString("utf8")) as Record<string, unknown>;
}

function stringField(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

// ---------------------------------------------------------------------------
// Download helper
// ---------------------------------------------------------------------------

async function downloadUrl(url: string, maxBytes: number): Promise<Buffer> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${resp.status}`);
  }
  const contentLength = resp.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    throw maxBytesError("Tarball", maxBytes);
  }
  if (!resp.body) {
    throw new Error(`Failed to download ${url}: response body is empty`);
  }
  return bufferWebStreamWithLimit(resp.body, maxBytes, "Tarball");
}

// ---------------------------------------------------------------------------
// Core publish logic
// ---------------------------------------------------------------------------

export async function publish(opts: PublishOptions): Promise<PublishResult> {
  const { root, baseUrl } = opts;
  const maxTarballBytes = opts.maxTarballBytes ?? DEFAULT_MAX_TARBALL_BYTES;
  const maxDecompressedBytes =
    opts.maxDecompressedBytes ?? DEFAULT_MAX_DECOMPRESSED_BYTES;
  const maxPackageJsonBytes =
    opts.maxPackageJsonBytes ?? DEFAULT_MAX_PACKAGE_JSON_BYTES;

  if (!opts.tarballPath && !opts.tarballUrl) {
    throw new Error("Either tarballPath or tarballUrl must be provided");
  }

  // Step 1: Get tarball bytes
  let tgzBuffer: Buffer;
  if (opts.tarballPath) {
    tgzBuffer = await readFileWithLimit(opts.tarballPath, maxTarballBytes);
  } else {
    tgzBuffer = await downloadUrl(opts.tarballUrl!, maxTarballBytes);
  }

  // Step 2: Parse package.json from tarball
  const pkgJson = await extractPackageJson(
    tgzBuffer,
    maxDecompressedBytes,
    maxPackageJsonBytes,
  );
  const packageName = stringField(pkgJson["name"]);
  const version = stringField(pkgJson["version"]);
  if (!packageName || !version) {
    throw new Error(
      "Tarball's package.json is missing 'name' or 'version' fields",
    );
  }
  if (opts.expectedPackageName && packageName !== opts.expectedPackageName) {
    throw new UnexpectedPackageNameError(packageName, opts.expectedPackageName);
  }

  // Step 3: Compute hashes
  const shasum = createHash("sha1").update(tgzBuffer).digest("hex");
  const shortName = packageName.includes("/")
    ? packageName.split("/")[1]
    : packageName;
  const tarballDir = join(root, tarballDirFor(packageName));
  const tarballFileName = `${shortName}-${version}.tgz`;
  const tarballRestingPath = join(tarballDir, tarballFileName);
  const packumentAbsPath = join(root, packumentPathFor(packageName));

  try {
    const existingTarball = await readFile(tarballRestingPath);
    const existingShasum = createHash("sha1")
      .update(existingTarball)
      .digest("hex");
    if (existingShasum !== shasum) {
      throw new PublishConflictError(packageName, version);
    }
    await rebuildPackuments({ root, baseUrl, packageName });
    return {
      packageName,
      version,
      packumentPath: packumentAbsPath,
      tarballRestingPath,
    };
  } catch (err) {
    if (err instanceof PublishConflictError) throw err;
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }

  // Step 4: Check existing packument for version conflict
  // Packument is at <root>/@scope/name/index.html
  try {
    const existing = JSON.parse(await readFile(packumentAbsPath, "utf8")) as {
      versions?: Record<string, { dist?: { shasum?: string } }>;
    };
    const existingVersion = existing.versions?.[version];
    if (existingVersion) {
      const existingShasum = existingVersion.dist?.shasum;
      if (existingShasum && existingShasum !== shasum) {
        throw new PublishConflictError(packageName, version);
      }
    }
  } catch (err) {
    if (err instanceof PublishConflictError) throw err;
    // No existing packument — proceed
  }

  // Step 5: Write the tarball to its resting place
  await mkdir(tarballDir, { recursive: true });
  await writeFile(tarballRestingPath, tgzBuffer);

  // Step 6: Refresh the packument for this package
  await rebuildPackuments({ root, baseUrl, packageName });

  return {
    packageName,
    version,
    packumentPath: packumentAbsPath,
    tarballRestingPath,
  };
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const idx = (flag: string) => args.indexOf(flag);

  const root = idx("--root") >= 0 ? args[idx("--root") + 1] : process.cwd();
  const baseUrl =
    idx("--base-url") >= 0
      ? args[idx("--base-url") + 1]
      : "https://pdomain.github.io/pdomain-index-npm/";
  const tarballPath =
    idx("--tarball") >= 0 ? args[idx("--tarball") + 1] : undefined;
  const tarballUrl =
    idx("--tarball-url") >= 0 ? args[idx("--tarball-url") + 1] : undefined;
  const expectedPackageName =
    idx("--expected-package-name") >= 0
      ? args[idx("--expected-package-name") + 1]
      : process.env.EXPECTED_PACKAGE_NAME;

  if (!tarballPath && !tarballUrl) {
    console.error(
      "Usage: publish.js --tarball <path> | --tarball-url <url> [--root <dir>] [--base-url <url>] [--expected-package-name <name>]",
    );
    process.exit(1);
  }

  publish({ root, tarballPath, tarballUrl, baseUrl, expectedPackageName })
    .then((result) => {
      console.log(
        `Published ${result.packageName}@${result.version}\n` +
          `  Tarball: ${result.tarballRestingPath}\n` +
          `  Packument: ${result.packumentPath}`,
      );
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    });
}
