import { injectable } from "inversify";
import { AccessLogs, LinkRecord } from "./links.model";
import { looseIncludes } from "@app/internal/loops";

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
  async find(shortKey: string): Promise<LinkRecord | null> {
    return LinkCache[shortKey] || null;
  }

  /**
   * Get all links, with optional search
   * @param search - optional search query (min 3 characters)
   * @returns LinkRecord[]
   */
  async getAll(search?: string): Promise<LinkRecord[]> {
    const values = Object.values(LinkCache);

    if (typeof search === 'string' && search.trim().length >= 3) {
      const query = search.trim().toLowerCase();

      return values.filter((link) => {
        const longUrl = link.longUrl?.toString().toLowerCase() || '';
        const shortUrl = link.shortUrl?.toString().toLowerCase() || '';
        const urlPath = link.urlPath?.toString().toLowerCase() || '';

        return (
          longUrl.includes(query) ||
          shortUrl.includes(query) ||
          urlPath.includes(query) ||
          looseIncludes(shortUrl, query)
        );
      });
    }

    return values;
  }

  /**
   * Update the statistics for a link record by logging an access event.
   *
   * @param shortKey - The unique short key (url path) for the short URL.
   * @param accessLogs - Partial access log information including IP, browser, and optionally geo-location data.
   * @returns void
   */
  async updateStats(shortKey: string, accessLogs: Partial<AccessLogs>): Promise<void> {
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
