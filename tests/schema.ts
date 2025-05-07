import "module-alias/register";

import knex from "knex";

import env from "../src/config/env";

async function migrate() {
  const pg = knex({
    client: "pg",
    connection: {
      host: env.postgres_host,
      port: env.postgres_port,
      user: env.postgres_user,
      password: env.postgres_password,
      database: env.postgres_db,
      ssl: env.is_production,
      application_name: env.service_name
    }
  });

  return await pg.raw(`create schema if not exists ${env.postgres_schema} authorization ${env.postgres_user};`);
}

migrate().then(
  () => {
    console.log("created test schema");
    process.exit(0);
  },
  err => {
    console.error(err);
    process.exit(1);
  }
);
