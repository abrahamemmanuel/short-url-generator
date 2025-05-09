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
  httpGet,
  queryParam
} from "inversify-express-utils";
import { isDecodeUrl, isEncodeUrl, isSearchQuery, isUrlPath } from "./links.validator";
import { autoValidate } from "@app/http/middleware";
import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "@app/internal/errors";

type ControllerResponse = LinkRecord | LinkRecord[] | decodedShortUrlResponse | URL;

@controller("/")
export class LinksController extends Controller<ControllerResponse> {
  @inject(TYPES.LinksService) private service: LinksService;

  @httpPost("encode", autoValidate(isEncodeUrl))
  async encode(@request() req: Request, @response() res: Response, @requestBody() dto: encodeUrlDTO ) {
    const result = await this.service.encode(dto.longUrl);
    this.send(req, res, result, StatusCodes.CREATED);
  }

  @httpPost("decode", autoValidate(isDecodeUrl))
  async decode(@request() req: Request, @response() res: Response, @requestBody() dto: decodeUrlDTO ) {
    const result = await this.service.decode(dto.shortUrl);
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

  @httpGet("statistic/:url_path", autoValidate(isUrlPath, "params"))
  async statistic(@request() req: Request, @response() res: Response, @requestParam("url_path") url_path: string ) {
    const result = await this.service.statistic(url_path);
    this.send(req, res, result);
  }

  @httpGet("", autoValidate(isSearchQuery, "query"))
  async list(@request() req: Request, @response() res: Response, @queryParam("search") search: string ) {
    const result = await this.service.list(search);
    this.send(req, res, result);
  }
}
