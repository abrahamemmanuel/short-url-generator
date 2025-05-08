import { injectable } from "inversify";
import { AccessLogs, LinkRecord } from "./links.model";

const LinkCache: Record<string, LinkRecord> = {};

@injectable()
export class LinksRepository {
  /**
   * Save a short link
   * @param shortKey - the short link key
   * @param data - the link record data
   */
  async save(shortKey: string, data: LinkRecord): Promise<void> {
     LinkCache[shortKey] = data;
  }

  /**
   * Get a long URL using short link
   * @param shortKey - the short link key
   * @returns LinkRecord | null
   */
  find(shortKey: string): LinkRecord | null {
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
          link.longUrl.toString().toLowerCase().includes(query) ||
          link.shortUrl.toString().toLowerCase().includes(query) ||
          link.urlPath.toString().toLowerCase().includes(query)
      );
    }

    return values;
  }

  updateStats(shortKey: string, accessLogs: Partial<AccessLogs>): void {
    const link = LinkCache[shortKey];
    if (!link) return;
  
    const now = new Date().toISOString();
  
    link.statistic.clickCount += 1;
    link.statistic.lastAccessed = now;
    link.statistic.dateTimeAccessed.push(now);
    link.statistic.accessLogs.push({
      timestamp: now,
      ipAddress: accessLogs.ipAddress,
      browser: accessLogs.browser,
      metro: accessLogs.metro,
      area: accessLogs.area,
      timezone: accessLogs.timezone,
      city: accessLogs.city,
      ll: accessLogs.ll,
      country: accessLogs.country,
      region: accessLogs.region
    });
  
    link.updatedAt = now;
  }
  
}
