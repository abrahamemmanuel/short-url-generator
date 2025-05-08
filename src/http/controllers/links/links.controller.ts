import TYPES from "@app/config/inversify.types";
import { Controller } from "@app/internal/http";
import { encodeUrlDTO, LinkRecord, LinksService } from "@app/links";
import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  request,
  response,
  requestBody
} from "inversify-express-utils";
import { isEncodeUrl } from "./links.validator";
import { autoValidate } from "@app/http/middleware";
import { ApplicationError } from "@app/internal/errors";
import { StatusCodes } from "http-status-codes";

type ControllerResponse = LinkRecord | LinkRecord[];

@controller("/")
export class LinksController extends Controller<ControllerResponse> {
  @inject(TYPES.LinksService) private service: LinksService;

  @httpPost("encode", autoValidate(isEncodeUrl))
  async encodeUrl(@request() req: Request, @response() res: Response, @requestBody() dto: encodeUrlDTO ) {
    try {
      const { longUrl } = dto;

      const result = await this.service.encode(longUrl);
      this.send(req, res, result);
    } catch (err) {
      throw new ApplicationError(StatusCodes.SERVICE_UNAVAILABLE, 'We are unable to process this request. Please try again.')
    }
  }
}
