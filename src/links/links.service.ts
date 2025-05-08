import { inject, injectable } from "inversify";
import TYPES from "@app/config/inversify.types";
import { LinkRecord, decodedShortUrlResponse } from "./links.model";
import { LinksInterface } from "./links.interface";
import { LinksRepository } from "./links.repo";
import { nanoid } from 'nanoid'
import env from "@app/config/env";
import { ApplicationError } from "@app/internal/errors";
import { StatusCodes } from "http-status-codes";
import { lookup } from "fast-geoip";
import { getIPAddress } from "@app/internal/http";
import { Request } from "express";

@injectable()
export class LinksService implements LinksInterface {
  @inject(TYPES.LinksRepository) repo: LinksRepository;

  async encode(long_url: URL): Promise<LinkRecord> {
    const shortKey = await nanoid(6); // generate 6-character short ID

    // Ensure baseUrl does NOT have a trailing slash to prevent malformed URLs
    const baseUrl = env.base_url.endsWith("/") ? env.base_url.slice(0, -1) : env.base_url;

    // Add port if it's not a default (80/443)
    const isDefaultPort = (env.port && env.port !== 80 && env.port !== 443)
    const shortUrl = isDefaultPort ? `${baseUrl}:${env.port}/${shortKey}` : `${baseUrl}/${shortKey}`;
    
    const now = new Date().toISOString();

    const linkData: LinkRecord = {
      longUrl: long_url,
      shortUrl: new URL(shortUrl),
      urlPath: shortKey,
      createdAt: now,
      updatedAt: now,
      statistic: {
        clickCount: 0,
        lastAccessed: null,
        dateTimeAccessed: [],
        accessLogs: [],
      }
    };

    await this.repo.save(shortKey, linkData);
    return linkData;
  }

  async decode(short_url: URL): Promise<decodedShortUrlResponse> {
    const url = new URL(short_url);
    const shortKey = url.pathname.replace(/^\/+/, ""); // remove leading slashes

    const link = await this.getLinkOrThrowError(shortKey);

    return {
      shortUrl: link.shortUrl,
      encodedUrl: link.longUrl,
    };
  }

  async redirect(url_path: string, req: Request): Promise<URL> {
    const link = await this.getLinkOrThrowError(url_path);
  
    const ip = getIPAddress(req);
    const ipInfo = await lookup(ip);
    const browser = req.headers["user-agent"] || "Unknown";
  
    await this.repo.updateStats(url_path, { ...ipInfo, browser });

    return link.longUrl;
  }

  async statistic(url_path: string): Promise<LinkRecord> {
    return await this.getLinkOrThrowError(url_path);
  }

  async list(query: string): Promise<LinkRecord[]> {
    // Implement logic using this.repo
    throw new Error("Method not implemented.");
  }

  /**
  * Private helper to fetch a link record or throw error if link record is not found
  */
  private async getLinkOrThrowError(url_path: string): Promise<LinkRecord> {
    const link = await this.repo.find(url_path);
    if (!link) {
      throw new ApplicationError(StatusCodes.NOT_FOUND, `No link record found for ${url_path}`);
    }
    return link;
  }
}

