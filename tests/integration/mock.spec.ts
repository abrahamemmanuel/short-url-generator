import "module-alias/register";
import "reflect-metadata";

import { Logger, defaultSerializers } from "@risemaxi/octonet";
import { expect } from "chai";
import { Application } from "express";
import { Container } from "inversify";
import Redis from "ioredis";
import { Knex } from "knex";
import sinon from "sinon";

import { App } from "../../src/app";
import env from "../../src/config/env";
import { createPostgres } from "../../src/config/postgres";
import { createRedis } from "../../src/config/redis";
import LIB_TYPES from "../../src/internal/inversify";
import { Channel, Connection, connect } from "amqplib";

const logger = new Logger({ name: env.service_name, serializers: defaultSerializers("content") });
let app: Application;
let pg: Knex;
let redis: Redis;
let container: Container;

beforeAll(async () => {
  pg = await createPostgres(logger);
  redis = await createRedis(logger);

  container = new Container();
  container.bind<Logger>(LIB_TYPES.Logger).toConstantValue(logger);
  container.bind<Knex>(LIB_TYPES.KnexDB).toConstantValue(pg);
  container.bind<Redis>(LIB_TYPES.Redis).toConstantValue(redis);

  app = new App(container, logger).server.build();
});

afterEach(async () => {
  await redis.flushdb();

  sinon.resetBehavior();
  sinon.resetHistory();
});

afterAll(async () => {
  await redis.quit();
  await pg.destroy();
});

describe("MockTest#create", () => {
  it("should mock test", async () => {

    const message = "Hello World!"
    expect(message).to.eq("Hello World!");
  });
})