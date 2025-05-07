import { NextFunction, Request, Response } from "express";

/*
 * Captures and stores the body of the response in `Request.locals.body` whenever
 * `Response.send` is called
 * @param _req express request
 * @param res express response
 * @param next next middleware function
 */
export function captureBody(_req: Request, res: Response, next: NextFunction) {
  const send = res.send;

  res.send = function (body?: any) {
    res.locals.body = body instanceof Buffer ? body.toString() : body;
    return send.call(this, body);
  };

  next();
}