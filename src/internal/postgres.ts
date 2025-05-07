import "reflect-metadata";

import { inject, injectable } from "inversify";

import { Knex } from "knex";
import TYPES from "./inversify";
import each from "lodash/each";
import unset from "lodash/unset";

/**
 * Base row type for postgresql tables
 */
export interface Model {
  /**
   * ID of the row
   */
  id: string;
  /**
   * date the row was created
   */
  created_at: Date;
}

/**
 * Properties for models that need to track updates
 */
export interface Trackable {
  /**
   * timestamp of last update
   */
  updated_at: Date;
}

/**
 * Enable soft delete on a model
 */
export interface Archivable {
  /**
   * timestamp when row was soft deleted, if it has been
   * soft deleted in the first place
   */
  deleted_at?: Date;
}

export interface QueryMap<T> {
  [key: string]: (b: Knex.QueryBuilder<T>) => Knex.QueryBuilder<T>;
}

export interface PaginatedQuery {
  limit: number;
  offset: number;
}

type RawPaginatedResults<T> = T & { item_count: string };

export interface PaginatedResult<T> {
  items: T[];
  item_count: number;
  offset?: number;
}

@injectable()
export class Repository<T> {
  @inject(TYPES.KnexDB) protected knex: Knex;

  /**
   * Creates a knex query object for a specified table
   * @param table table name
   * @param excluded fields which should be excluded from the query result to be returned
   * @returns
   */
  protected setup<U = T>(table: string, ...excluded: string[]) {
    return () => this.knex<U>(table).queryContext({ excluded });
  }

  /**
   * Creates a knex query object for a specified table, automatically excluding
   * archived rows.
   * @param table table name
   * @param excluded fields which should be excluded from the query result to be returned
   * @returns
   */
  protected setupSafe(table: string, ...excluded: string[]) {
    return () => this.knex<T>(table).queryContext({ excluded }).whereNull("deleted_at");
  }

  /**
   * Map query triggers to their corresponding queries
   * @param db query builder from knex
   * @param query actual query
   * @param map mapping of triggers to query functions
   * @returns query builder for further queries
   */
  protected useQueryMap(db: Knex.QueryBuilder<T>, query: any, map: QueryMap<T>) {
    let currentQuery = db;

    each(map, (val, key) => {
      if (query[key] != null) {
        currentQuery = val(currentQuery);
      }
    });

    return currentQuery;
  }

  protected async paginated(db: Knex.QueryBuilder<T>, limit: number, offset: number): Promise<PaginatedResult<T>> {
    const raw: RawPaginatedResults<T>[] = await db
      .select(this.knex.raw("count(*) OVER() AS item_count"))
      .limit(limit)
      .offset(offset);

    if (raw.length === 0) {
      return { item_count: 0, items: [] };
    }

    const total = parseInt(raw[0].item_count);
    raw.forEach(r => {
      delete r["item_count"];
    });

    return { item_count: total, items: raw };
  }
}

const defaultToJSON = function () {
  return { ...this };
};

/**
 * Knex postProcessResponse hook for protecting properties from being exposed over
 * the web.
 * @param result result of query
 * @param context context provided when building the query
 * @returns the modified result
 */
export function excludeProperties(result?: Model | Model[], context?: any) {
  if (result && context?.excluded && context.excluded.length > 0) {
    const rows = Array.isArray(result) ? result : [result];

    rows.forEach(result => {
      if (typeof result !== "object") {
        return;
      }

      const superToJSON = result["toJSON"] || defaultToJSON.bind(result);
      result["toJSON"] = function () {
        const data = superToJSON();

        context.excluded.forEach((path: string) => {
          unset(data, path);
        });

        return data;
      };
    });
  }

  return result;
}
