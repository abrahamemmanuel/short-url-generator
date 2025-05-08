import { injectable } from "inversify";
import { LinkRecord } from "./links.model";

const LinkCache: Record<string, LinkRecord> = {};

@injectable()
export class LinksRepository {
  /**
   * Save a short link
   * @param shortKey - the short link key
   * @param data - the link record data
   */
  save(shortKey: string, data: LinkRecord): void {
    LinkCache[shortKey] = data;
  }

  /**
   * Get a long URL using short link
   * @param shortKey - the short link key
   * @returns LinkRecord | null
   */
  get(shortKey: string): LinkRecord | null {
    return LinkCache[shortKey] || null;
  }

  /**
   * Get all links, with optional search
   * @param search - optional search query (min 3 characters)
   * @returns LinkRecord[]
   */
  getAll(search?: string): LinkRecord[] {
    const values = Object.values(LinkCache);

    if (search && search.length >= 3) {
      const query = search.toLowerCase();
      return values.filter(
        (link) =>
          link.longUrl.toLowerCase().includes(query) ||
          link.shortUrl.toLowerCase().includes(query) ||
          link.urlPath.toLowerCase().includes(query)
      );
    }

    return values;
  }

  updateStats(shortKey: string, ip: string, browser: string): void {
    const link = LinkCache[shortKey];
    if (!link) return;
  
    const now = new Date().toISOString();
  
    link.statistic.clickCount += 1;
    link.statistic.lastAccessed = now;
    link.statistic.dateTimeAccessed.push(now);
    link.statistic.accessLogs.push({
      timestamp: now,
      ipAddress: ip,
      browser: browser,
    });
  
    link.updatedAt = now;
  }
  
}
