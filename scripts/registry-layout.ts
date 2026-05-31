export function packumentPathFor(name: string): string {
  return `${name}/index.html`;
}

/** Packument document shape (subset of the full npm registry packument). */
export interface PackumentVersion {
  name: string;
  version: string;
  description?: string;
  main?: string;
  dist: {
    tarball: string;
    shasum: string;
    integrity: string;
  };
  [key: string]: unknown;
}

export interface Packument {
  name: string;
  "dist-tags": Record<string, string>;
  versions: Record<string, PackumentVersion>;
  time: Record<string, string>;
}
