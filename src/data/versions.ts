export type Fork = "Leaf" | "Purpur" | "Paper";

export interface VersionEntry {
  version: string;
  fork: Fork;
  /** "released" = a real GitHub release exists for this version right now. "planned" = on the
   * roadmap, not built yet - never claim "released" without an actual shipped release. */
  status: "released" | "planned";
}

// Leaf: modern, actively-developed versions. Purpur: 1.15-1.21.3, where Leaf doesn't reach but
// Purpur's own branches genuinely do. Paper: pre-1.15 legacy versions, where even Purpur's source
// branches don't go - Paper itself no longer keeps live source branches this old either (verified
// against PaperMC/Paper's actual branch list), so this tier is a heavier lift and ships last.
export const VERSIONS: VersionEntry[] = [
  { version: "26.2", fork: "Leaf", status: "released" },
  { version: "26.1.2", fork: "Leaf", status: "planned" },
  { version: "1.21.11", fork: "Leaf", status: "released" },
  { version: "1.21.8", fork: "Leaf", status: "planned" },
  { version: "1.21.7", fork: "Leaf", status: "planned" },
  { version: "1.21.6", fork: "Leaf", status: "planned" },
  { version: "1.21.5", fork: "Leaf", status: "planned" },
  { version: "1.21.4", fork: "Leaf", status: "planned" },

  { version: "1.21.3", fork: "Purpur", status: "planned" },
  { version: "1.21.1", fork: "Purpur", status: "planned" },
  { version: "1.21", fork: "Purpur", status: "planned" },
  { version: "1.20.6", fork: "Purpur", status: "planned" },
  { version: "1.20.4", fork: "Purpur", status: "planned" },
  { version: "1.20.2", fork: "Purpur", status: "planned" },
  { version: "1.20.1", fork: "Purpur", status: "planned" },
  { version: "1.20", fork: "Purpur", status: "planned" },
  { version: "1.19.4", fork: "Purpur", status: "planned" },
  { version: "1.19.3", fork: "Purpur", status: "planned" },
  { version: "1.19.2", fork: "Purpur", status: "planned" },
  { version: "1.19.1", fork: "Purpur", status: "planned" },
  { version: "1.19", fork: "Purpur", status: "planned" },
  { version: "1.18.2", fork: "Purpur", status: "planned" },
  { version: "1.18.1", fork: "Purpur", status: "planned" },
  { version: "1.18", fork: "Purpur", status: "planned" },
  { version: "1.17.1", fork: "Purpur", status: "planned" },
  { version: "1.16.5", fork: "Purpur", status: "planned" },
  { version: "1.16.4", fork: "Purpur", status: "planned" },
  { version: "1.16.3", fork: "Purpur", status: "planned" },
  { version: "1.16.2", fork: "Purpur", status: "planned" },
  { version: "1.15", fork: "Purpur", status: "planned" },

  { version: "1.14.4", fork: "Paper", status: "planned" },
  { version: "1.13.2", fork: "Paper", status: "planned" },
  { version: "1.12.2", fork: "Paper", status: "planned" },
  { version: "1.11.2", fork: "Paper", status: "planned" },
  { version: "1.10.2", fork: "Paper", status: "planned" },
  { version: "1.9.4", fork: "Paper", status: "planned" },
  { version: "1.8.8", fork: "Paper", status: "planned" },
];

export const FORK_INFO: Record<Fork, { href: string; blurb: string }> = {
  Leaf: {
    href: "https://github.com/Winds-Studio/Leaf",
    blurb: "A performance-focused Paper fork - AtlasSpigot's primary base for current Minecraft versions.",
  },
  Purpur: {
    href: "https://github.com/PurpurMC/Purpur",
    blurb: "A Paper fork with a large gameplay-config surface - covers the version range Leaf doesn't reach back to.",
  },
  Paper: {
    href: "https://github.com/PaperMC/Paper",
    blurb: "The project Leaf and Purpur are both built on - used directly for the oldest, long-EOL Minecraft versions.",
  },
};
