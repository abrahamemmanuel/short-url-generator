import { LinkRecord } from '../../src/links/links.model';

const LinkCache: Record<string, LinkRecord> = {};

/**
 * Save a short link to the in-memory store.
 * @param shortKey - The short key for the URL.
 * @param data - The LinkRecord data to save.
 */
export async function saveLink(shortKey: string, data: LinkRecord): Promise<void> {
  LinkCache[shortKey] = data;
}

/**
 * Get a link by its short key from the in-memory store.
 * @param shortKey - The short key of the link.
 * @returns The LinkRecord or null if not found.
 */
export async function getLink(shortKey: string): Promise<LinkRecord | null> {
  return LinkCache[shortKey] || null;
}

/**
 * Generate a short key for the long URL (simple base64 encoding).
 * @param longUrl - The long URL to generate a short key for.
 * @returns The short key for the URL.
 */
export function generateShortKey(longUrl: string): string {
  return Buffer.from(longUrl).toString('base64').slice(0, 8); // Example: using first 8 chars of base64 encoding
}
