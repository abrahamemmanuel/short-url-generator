import "module-alias/register";
import "reflect-metadata";

import "../../src/http/controllers/links/links.controller";

import { Logger, defaultSerializers } from "@risemaxi/octonet";
import { Application } from "express";
import { Container } from "inversify";
import sinon from "sinon";
import { LinksRepository, LinksService } from "../../src/links";
import { App } from "../../src/app";
import env from "../../src/config/env";
import LIB_TYPES from "../../src/internal/inversify";
import TYPES from "../../src/config/inversify.types";
import { decodedShortUrlResponse, LinkRecord } from '../../src/links/links.model';
import { getSuccess } from "../helpers";
import request from "supertest";
import { StatusCodes } from "http-status-codes";

const basePath = "/api/v1";
const logger = new Logger({ name: env.service_name, serializers: defaultSerializers("content") });
let app: Application;
let container: Container;

beforeAll(async () => {
  container = new Container();
  container.bind<Logger>(LIB_TYPES.Logger).toConstantValue(logger);
  container.bind<LinksRepository>(TYPES.LinksRepository).to(LinksRepository);
  container.bind<LinksService>(TYPES.LinksService).to(LinksService);

  app = new App(container, logger).server.build();
});

afterEach(async () => {
  sinon.resetBehavior();
  sinon.resetHistory();
});

describe('POST /encode', () => {
  it('should encode a URL and return the short URL', async () => {
    const longUrl = "https://indicina.co";
    const dto = { longUrl };

    // Make the POST request to encode the URL
    const response =  await getSuccess<LinkRecord>(request(app)
            .post(`${basePath}/encode`)
            .send(dto),
            StatusCodes.CREATED
          );

    expect(response.longUrl).toBe(longUrl);
    expect(response.statistic).toBeInstanceOf(Object);
    expect(response.statistic.clickCount).toBe(0);
    expect(response.statistic.lastAccessed).toBeNull();
    expect(response.statistic.dateTimeAccessed).toEqual([]);
    expect(response.statistic.accessLogs).toEqual([]);
    expect(response.shortUrl).toMatch(/localhost:3008/); // Ensure it includes 'localhost:3008'
    expect(response.urlPath).toBeTruthy(); // Check that urlPath exists and is not an empty string
    expect(response.shortUrl).toBeTruthy();
  });
});

describe('POST /decode', () => {
  it('should decode a short URL and return the long URL', async () => {
    const longUrl = "https://indicina.co";
    const dto = { longUrl };

    // Make the POST request to encode the URL
    const encodeUrlResponse =  await getSuccess<LinkRecord>(request(app)
            .post(`${basePath}/encode`)
            .send(dto),
            StatusCodes.CREATED
          );

    expect(encodeUrlResponse.longUrl).toBe(longUrl);
    expect(encodeUrlResponse.statistic).toBeInstanceOf(Object);
    expect(encodeUrlResponse.statistic.clickCount).toBe(0);
    expect(encodeUrlResponse.statistic.lastAccessed).toBeNull();
    expect(encodeUrlResponse.statistic.dateTimeAccessed).toEqual([]);
    expect(encodeUrlResponse.statistic.accessLogs).toEqual([]);
    expect(encodeUrlResponse.shortUrl).toMatch(/localhost:3008/);
    expect(encodeUrlResponse.urlPath).toBeTruthy();
    expect(encodeUrlResponse.shortUrl).toBeTruthy();

    const shortUrl = encodeUrlResponse.shortUrl;
    const encodedUrl = encodeUrlResponse.longUrl;

    // Make the POST request to decode the URL
    const decodeUrlResponse = await getSuccess<decodedShortUrlResponse>(
      request(app)
        .post(`${basePath}/decode`)
        .send({ shortUrl }),
      StatusCodes.OK
    );

    expect(decodeUrlResponse.encodedUrl).toBe(encodedUrl);
    expect(decodeUrlResponse.shortUrl).toBe(shortUrl);
  });
});