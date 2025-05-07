import plimit from "p-limit";

/**
 * Combines a `map` and a `sequence`. Assuming you know what a map
 * is, a `sequence` is simply the sequential conversion of a list
 * of promises to a promise of a list. Note that like `map` it ignores
 * null results.
 * @param ts array to transform
 * @param fn async function to make transformation
 */
export async function traverse<T, U>(ts: T[], fn: (t: T) => Promise<U>): Promise<U[]> {
  const results: U[] = [];
  for (const t of ts) {
    const result = await fn(t);
    if (result) {
      results.push(result);
    }
  }
  return results;
}

/**
 * traverseBatched is like `traverse` but run in dynamic batches. i.e.
 * there'll never be more than `batchSize` runnning concurrently
 * @param ts the data to work on
 * @param batchSize the upper bound on concurrent promises
 * @param fn the worker function itself.
 */
export function traverseBatched<T>(ts: T[], batchSize: number, fn: (t: T) => Promise<any>) {
  const limit = plimit(batchSize);
  return Promise.all(ts.map(t => limit(fn, t)));
}

/**
 * Unlike `traverse`, mapConcurrently runs the process in parallel
 * (actually concurrently), and combines their results into one promise.
 * i.e `traverse` for sequential asynchronous actions, `mapConcurrently`
 * for parallel actions.
 * @param ts array to transform
 * @param fn async function to make transformation
 */
export async function mapConcurrently<T, U>(ts: T[], fn: (t: T) => Promise<U>): Promise<U[]> {
  return Promise.all(ts.map(fn));
}

/**
 * Like `mapConcurrently` but with no need to return an array. Basically a parallel
 * `forEach`
 * @param ts array to transform
 * @param fn async function to make transformation
 */
export async function loopConcurrently<T, U>(ts: T[], fn: (t: T) => Promise<void>): Promise<void> {
  const promises = [];
  ts.forEach(x => promises.push(fn(x)));
  await Promise.all(promises);
}
