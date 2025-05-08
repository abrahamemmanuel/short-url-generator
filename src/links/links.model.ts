/**
 * Link Model
 */
export type LinkRecord = {
  /**
   * The long URL that is shortened
   */
  longUrl: URL;

  /**
   * The short URL that is generated 
   */
  shortUrl: URL;

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

export type AccessLogs = {
  timestamp: string;
  ipAddress: string;
  browser: string;
  metro: number;
  area: number;
  timezone: string;
  city: string;
  ll: [number, number];
  country: string;
  region: string;
};

export type Statistic = {
  clickCount: number;
  lastAccessed: string | null;
  dateTimeAccessed: string[]; // ISO strings
  accessLogs: AccessLogs[];
};

export type decodedShortUrlResponse = {
  encodedUrl: URL;
  shortUrl: URL;
}

export type encodeUrlDTO = {
  longUrl: URL;
}

export type decodeUrlDTO = {
  shortUrl: URL;
}

export type redirectLinkResponse = {
  longUrl: URL;
}