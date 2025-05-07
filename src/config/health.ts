import express from "express";
import http from "http";
import { Redis } from "ioredis";
import { Knex } from "knex";

export async function isHealthy(pg: Knex, redis: Redis) {
  if (redis.status !== "ready") {
    throw new Error("redis is not ready");
  }

  try {
    await pg.raw("select now()");
  } catch (err) {
    throw new Error("postgres is not ready");
  }
}

export function createHealthApp(port: number, check: () => Promise<void>) {
  const app = express();

  app.get("/", async (_req, res) => {
    try {
      await check();
    } catch (err) {
      return res.status(500).send(err.message);
    }

    return res.status(200).send("up and running");
  });

  return http.createServer(app).listen(port);
}


