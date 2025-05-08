import { BasicConfig, basicConfig, loadEnv, optionalForDev } from "@app/internal/env";
import joi from "joi";

export interface ApplicationEnv extends BasicConfig {
  postgres_host: string;
  postgres_port: number;
  postgres_db: string;
  postgres_user: string;
  postgres_password: string;
  postgres_schema: string;
  redis_url: string;
  redis_password?: string;
  amqp_url: string;
  base_url: string;
}

const env = loadEnv<ApplicationEnv>({
  ...basicConfig,
  postgres_host: joi.string().required(),
  postgres_port: joi.number().required(),
  postgres_db: joi.string().required(),
  postgres_user: joi.string().required(),
  postgres_password: joi.string().required(),
  postgres_schema: joi.string().required(),
  redis_url: joi.string().uri({ scheme: "redis" }).trim().required(),
  redis_password: optionalForDev(),
  amqp_url: joi
    .string()
    .uri({ scheme: ["amqp", "amqps"] })
    .trim()
    .required(),
  base_url: joi.string().required()
});

export default env;
