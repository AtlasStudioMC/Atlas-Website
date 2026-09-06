/** A server publicly running AtlasSpigot.
 *
 * Only add an entry with the operator's permission, and only if they actually run it. The logo
 * belongs to them, not to us — a logo row that implies an endorsement nobody gave is worse than
 * an empty one. bStats reports the live server count either way, so the section stands up
 * without any entries here.
 */
export interface ServerEntry {
  /** Display name, as the server writes it. */
  name: string;
  /** Path under public/, e.g. "/servers/example.webp". Omit to render the name as text. */
  logo?: string;
  /** Their site or store page. Omit for no link. */
  href?: string;
}

export const SERVERS: ServerEntry[] = [
  // Two SMPs are running AtlasSpigot as of this writing (bStats service 33733). Neither is
  // listed yet because we don't publish someone's name or mark without asking first.
];
