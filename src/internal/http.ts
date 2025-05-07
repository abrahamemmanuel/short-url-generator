import { Logger } from "@risemaxi/octonet";
import { Request, RequestHandler, Response } from "express";
import Status from "http-status-codes";
import { inject, injectable } from "inversify";

import TYPES from "./inversify";

@injectable()
export class Controller<T> {
  @inject(TYPES.Logger) protected log: Logger;

  protected send(req: Request, res: Response, t: T) {
    res.status(Status.OK).json(t);
    this.log.response(req, res);
  }
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
