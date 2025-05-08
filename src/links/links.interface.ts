import { decodedShortUrlResponse, LinkRecord } from "./links.model";
import { Request } from "express";

export interface LinksInterface {
  /**
   * Create a short url
   * @param long_url - the url input
   * @returns Link - the link record
   */
  encode(long_url: URL): Promise<LinkRecord>;

  /**
   * Get a long url
   * @param short_url - the url input
   * @returns short url and long url
   */
  decode(short_url: URL): Promise<decodedShortUrlResponse>;

  /**
   * Redirect to a long url or original url
   * @param url_path - the url input
   * @returns - redirects the short url path to the original
   */
  redirect(url_path: string, req: Request): Promise<URL>;

  /**
   * Get the stats of a short url
   * @param url_path - the stat request
   * @returns Stats - stats of the short url path
   */
  statistic(url_path: string): Promise<Partial<LinkRecord>>;

  /**
   * List all available url
   * @param query - search params at least characters
   * @returns Link[] - returns a list of link-records
   */
  list(query: string): Promise<LinkRecord[]>;
}
