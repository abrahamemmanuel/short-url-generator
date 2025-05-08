import TYPES from "@app/config/inversify.types";
import { Controller } from "@app/internal/http";
import { decodedShortUrlResponse, decodeUrlDTO, encodeUrlDTO, LinkRecord, LinksService } from "@app/links";
import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  request,
  response,
  requestBody,
  requestParam,
  httpGet
} from "inversify-express-utils";
import { isDecodeUrl, isEncodeUrl, isUrlPath } from "./links.validator";
import { autoValidate } from "@app/http/middleware";
import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "@app/internal/errors";

type ControllerResponse = LinkRecord | LinkRecord[] | decodedShortUrlResponse | URL;

@controller("/")
export class LinksController extends Controller<ControllerResponse> {
  @inject(TYPES.LinksService) private service: LinksService;

  @httpPost("encode", autoValidate(isEncodeUrl))
  async encode(@request() req: Request, @response() res: Response, @requestBody() dto: encodeUrlDTO ) {
    const { longUrl } = dto;

    const result = await this.service.encode(longUrl);
    this.send(req, res, result, StatusCodes.CREATED);
  }

  @httpPost("decode", autoValidate(isDecodeUrl))
  async decode(@request() req: Request, @response() res: Response, @requestBody() dto: decodeUrlDTO ) {
    const { shortUrl } = dto;

    const result = await this.service.decode(shortUrl);
    this.send(req, res, result);
  }

  @httpGet(":url_path", autoValidate(isUrlPath, "params"))
  async redirect(@request() req: Request, @response() res: Response, @requestParam("url_path") url_path: string ) {
    try {
      const longUrl = await this.service.redirect(url_path, req);
      res.redirect(longUrl.toString());
    } catch (err) {
      throw new ApplicationError(StatusCodes.SERVICE_UNAVAILABLE, "We could not process the request. Please try again later")
    }
  }
}
