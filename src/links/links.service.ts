import { inject, injectable } from "inversify";
import TYPES from "@app/config/inversify.types";
import { LinkRecord, decodedShortUrlResponse } from "./links.model";
import { LinksInterface } from "./links.interface";
import { LinksRepository } from "./links.repo";

@injectable()
export class LinksService implements LinksInterface {
  @inject(TYPES.LinksRepository) repo: LinksRepository;

  async encode(long_url: string): Promise<LinkRecord> {
    // Implement logic using this.repo
    throw new Error("Method not implemented.");
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

  async list(url_path: string): Promise<LinkRecord[]> {
    // Implement logic using this.repo
    throw new Error("Method not implemented.");
  }
}
