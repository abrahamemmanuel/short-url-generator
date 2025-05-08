import TYPES from "@app/config/inversify.types";
import { Controller } from "@app/internal/http";
import { LinksService } from "@app/links";
import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  request,
  response
} from "inversify-express-utils";

type ControllerResponse = "";
@controller("/links")
export class LinksController extends Controller<ControllerResponse> {
  @inject(TYPES.LinksService) private service: LinksService;

  @httpPost("/")
  async encodeUrl(@request() req: Request, @response() res: Response) {
    this.send(req, res, "");
  }

}
