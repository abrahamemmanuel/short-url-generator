import "module-alias/register";
import "reflect-metadata";
import "./http/controllers";

import http from "http";

import { AgentConfig, HttpAgent, Logger, defaultSerializers } from "@risemaxi/octonet";
import { Container } from "inversify";

import { App } from "./app";
import env from "./config/env";
import LIB_TYPES from "./internal/inversify";
import TYPES from "@app/config/inversify.types";
import { LinksService, LinksRepository } from "@app/links";

const start = async () => {
  const logger = new Logger({ name: env.service_name, serializers: defaultSerializers("content") });

  try {
    const container = new Container();

    // point to logger for the sake of other dependencies
    container.bind<Logger>(LIB_TYPES.Logger).toConstantValue(logger);

    const HTTPAgentConfig: AgentConfig = {
      service: env.service_name,
      scheme: env.auth_scheme,
      secret: env.service_secret,
      logger: logger
    };
    const httpAgent = new HttpAgent(HTTPAgentConfig);
    container.bind<HttpAgent>(LIB_TYPES.HTTPAgent).toConstantValue(httpAgent);

    container.bind<LinksService>(TYPES.LinksService).to(LinksService);
    container.bind<LinksRepository>(TYPES.LinksRepository).to(LinksRepository);

    const app = new App(container, logger);
    const appServer = app.server.build();

    // start server
    const httpServer = http.createServer(appServer);
    httpServer.listen(env.port);
    httpServer.on("listening", () => logger.log(`${env.service_name} listening on ${env.port}`));

    process.on("SIGTERM", async () => {
      logger.log("exiting aplication...");

      httpServer.close(() => {
        process.exit(0);
      });
    });
  } catch (err) {
    logger.error(err);
  }
};

start();
