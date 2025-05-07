import { DataValidationError, validate } from "./joi";
import joi, { CustomHelpers, SchemaLike } from "joi";

import dotenv from "dotenv";
import mapKeys from "lodash/mapKeys";

const trimmedString = joi.string().trim();
const trimmedRequiredString = trimmedString.required();

export class IncompleteEnvError extends Error {
  constructor(error: DataValidationError) {
    super(`Unable to load environment:\n${JSON.stringify(error.messages, null, 2)}`);
  }
}

/**
 * Load process environment and validate the keys needed. Do make sure you
 * specify every key you plan to use in the schema as it removes unknown
 * keys.
 * @param schema schema to use for validation
 */
export function loadEnv<T extends BasicConfig>(schema: SchemaLike): T {
  dotenv.config();
  const processedEnv = mapKeys(process.env, (_, key) => {
    return key.toLowerCase();
  });

  try {
    return validate(processedEnv, schema);
  } catch (err) {
    if (err instanceof DataValidationError) {
      throw new IncompleteEnvError(err);
    }

    throw err;
  }
}

/**
 * Basic configuration used by all services
 */
export const basicConfig = {
  api_version: trimmedString.default("/api/v1"),
  auth_scheme: trimmedRequiredString,
  node_env: trimmedString.valid("dev", "test", "production", "staging").default("dev"),
  is_production: joi.when("node_env", {
    is: joi.valid("production"),
    then: joi.boolean().default(true),
    otherwise: joi.boolean().default(false)
  }),
  port: joi.number().required(),
  session_ttl: joi.number().required(),
  service_name: trimmedRequiredString,
  service_secret: trimmedRequiredString.min(32),
  service_secret_bytes: joi.any().default((parent: BasicConfig, _helpers: CustomHelpers) => {
    return parent.service_secret && Buffer.from(parent.service_secret);
  })
};

/**
 * Creates a field that becomes required when the environment is either
 * staging or production
 */
export function optionalForDev() {
  return joi.when("node_env", {
    is: joi.valid("production", "staging"),
    then: trimmedRequiredString,
    otherwise: trimmedString.optional()
  });
}

/**
 * Type definitiion of basic application config. Default interface to extend when
 * creating your own config.
 */
export interface BasicConfig {
  /**
   * Help API clients choose
   */
  api_version: string;
  /**
   * Eqivalent to `NODE_ENV`
   */
  node_env: string;
  /**
   * True if `node_env` is `production` or `staging`
   */
  is_production: boolean;
  /**
   * Scheme for intersevice communication
   */
  auth_scheme: string;
  /**
   * What port number to serve the app
   */
  port: number;
  /**
   * How long sessions should last in seconds. For the sake of distributed sessions.
   */
  session_ttl: number;
  /**
   * 32 char string to be used for sessions and seals
   */
  service_secret: string;
  /**
   * `service_secret` as bytes
   */
  service_secret_bytes: Uint8Array;
  /**
   * Name of the service. This will appear in the logs
   */
  service_name: string;
}
