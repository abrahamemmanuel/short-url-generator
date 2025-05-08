/**
 * Link Model
 */
export type LinkRecord = {
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

export type AccessLogs = {
  timestamp: string;
  ipAddress: string;
  browser: string;
};

export type Statistic = {
  clickCount: number;
  lastAccessed: string | null;
  dateTimeAccessed: string[]; // ISO strings
  accessLogs: AccessLogs[];
};

export type decodedShortUrlResponse = {
  encodedUrl: string;
  shortUrl: string;
}

export type encodeUrlDTO = {
  longUrl: string;
}