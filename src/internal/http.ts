import { Logger } from "@risemaxi/octonet";
import { Request, RequestHandler, Response } from "express";
import Status from "http-status-codes";
import { inject, injectable } from "inversify";

import TYPES from "./inversify";

@injectable()
export class Controller<T> {
  @inject(TYPES.Logger) protected log: Logger;

  protected send(req: Request, res: Response, t: T, statusCode: number = Status.OK) {
    res.status(statusCode).json(t);
    this.log.response(req, res);
  }
}

/**
 * Get the IP address of the client making a request
 * @param req Express request
 * @returns IP address as a string
 */
export function getIPAddress(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    // Could be a comma-separated list of IPs, pick the first
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    return ip.trim();
  }

  const ip = req.socket.remoteAddress || req.connection.remoteAddress || "";
  
  // Remove IPv6 prefix if present (e.g., "::ffff:192.168.0.1")
  return ip.replace(/^.*:/, '') || "127.0.0.1";
}

/**
 * Compose middleware into one
 * @param middleware middleware to compose
 */
export function composeM(...middleware: RequestHandler[]) {
  return middleware.reduce(
    (a, b) => (req, res, next) =>
      a(req, res, (err: any) => {
        if (err) {
          return next(err);
        }

        return b(req, res, next);
      })
  );
}
