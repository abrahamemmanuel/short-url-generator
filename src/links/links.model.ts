/**
 * Link Model
 */
export type Link = {
  /**
   * The long URL that is shortened
   */
  longUrl: string;

  /**
   * The short URL that is generated 
   */
  shortUrl: string;

  /**
   * The path segment of the short URL
   */
  urlPath: string;

  /**
   * Tracking statistics for the short URL
   */
  statistic: Statistic;

  /**
   * Timestamp for when the link was created
   */
  createdAt: string;

  /**
   * Timestamp for when the link was last updated
   */
  updatedAt: string;
};

export type DeviceInfo = {
  ipAddress: string[];
  browser: string[];
};

export type Statistic = {
  clickCount: number;
  lastAccessed: string | null;
  dateTimeAccessed: string[]; // ISO strings
  deviceInfo: DeviceInfo;
};

export type decodedShortUrlResponse = {
  encodedUrl: string;
  shortUrl: string;
}


export const LinkCache: Record<string, any> = {};