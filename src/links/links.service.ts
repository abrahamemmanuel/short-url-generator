import { inject, injectable } from "inversify";
import TYPES from "@app/config/inversify.types";
import { LinkRecord, decodedShortUrlResponse } from "./links.model";
import { LinksInterface } from "./links.interface";
import { LinksRepository } from "./links.repo";
import { nanoid } from 'nanoid'
import env from "@app/config/env";

@injectable()
export class LinksService implements LinksInterface {
  @inject(TYPES.LinksRepository) repo: LinksRepository;

  async encode(long_url: string): Promise<LinkRecord> {
    const shortKey = await nanoid(6); // generate 6-character short ID

    // Ensure baseUrl does NOT have a trailing slash to prevent malformed URLs
    const baseUrl = env.base_url.endsWith("/") ? env.base_url.slice(0, -1) : env.base_url;

    // Add port if it's not a default (80/443)
    const isDefaultPort = (env.port && env.port !== 80 && env.port !== 443)
    const shortUrl = isDefaultPort ? `${baseUrl}:${env.port}/${shortKey}` : `${baseUrl}/${shortKey}`;
    
    const now = new Date().toISOString();

    const linkData: LinkRecord = {
      longUrl: long_url,
      shortUrl: shortUrl,
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

  async decode(short_url: string): Promise<decodedShortUrlResponse> {
    // Implement logic using this.repo
    throw new Error("Method not implemented.");
  }

  async redirect(url_path: string): Promise<Response> {
    // Implement logic using this.repo
    throw new Error("Method not implemented.");
  }

  async statistic(url_path: string): Promise<Partial<LinkRecord>> {
    // Implement logic using this.repo
    throw new Error("Method not implemented.");
  }

  async list(query: string): Promise<LinkRecord[]> {
    // Implement logic using this.repo
    throw new Error("Method not implemented.");
  }
}
