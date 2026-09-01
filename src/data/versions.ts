export type Fork = "Leaf" | "Purpur" | "Paper";

export interface VersionEntry {
  version: string;
  fork: Fork;
  /** "released" = a real GitHub release exists for this version right now. "planned" = on the
   * roadmap, not built yet - never claim "released" without an actual shipped release. */
  status: "released" | "planned";
}

// Leaf: modern, actively-developed versions - AtlasSpigot's primary base. Purpur: 1.20-1.21.3,
// where Leaf's own branches stop but Purpur's still have live source. Kept in sync by hand with
// the project ROADMAP.md - this range is the current scope; earlier versions are out of scope
// for now, not silently dropped.
export const VERSIONS: VersionEntry[] = [
  { version: "26.2", fork: "Leaf", status: "released" },
  { version: "26.1.2", fork: "Leaf", status: "released" },
  { version: "1.21.11", fork: "Leaf", status: "released" },
  { version: "1.21.8", fork: "Leaf", status: "released" },
  { version: "1.21.7", fork: "Leaf", status: "released" },
  { version: "1.21.6", fork: "Leaf", status: "released" },
  { version: "1.21.5", fork: "Leaf", status: "released" },
  { version: "1.21.4", fork: "Leaf", status: "released" },

  { version: "1.21.3", fork: "Purpur", status: "released" },
  { version: "1.21.1", fork: "Purpur", status: "released" },
  { version: "1.21", fork: "Purpur", status: "released" },
  { version: "1.20.6", fork: "Purpur", status: "released" },
  { version: "1.20.4", fork: "Purpur", status: "released" },
  { version: "1.20.2", fork: "Purpur", status: "released" },
  { version: "1.20.1", fork: "Purpur", status: "released" },
  { version: "1.20", fork: "Purpur", status: "released" },
];

// logo: each project's own mark, used to credit/link them. Paper has no local asset yet, so
// that entry is intentionally logo-less and the UI falls back to text.
export const FORK_INFO: Record<Fork, { href: string; blurb: string; logo?: string }> = {
  Leaf: {
    href: "https://github.com/Winds-Studio/Leaf",
    logo: "/logos/leaf.webp",
    blurb: "A performance-focused Paper fork - AtlasSpigot's primary base for current Minecraft versions.",
  },
  Purpur: {
    href: "https://github.com/PurpurMC/Purpur",
    logo: "/logos/purpur.webp",
    blurb: "A Paper fork with a large gameplay-config surface - covers the version range Leaf doesn't reach back to.",
  },
  Paper: {
    href: "https://github.com/PaperMC/Paper",
    blurb: "The project Leaf and Purpur are both built on.",
  },
};
