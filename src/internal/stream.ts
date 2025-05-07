import { Readable } from "stream";

export function readableToBuffer(stream: Readable): Promise<Buffer> {
  const buffer = [];

  return new Promise((resolve, reject) => {
    stream.on("data", chunk => buffer.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(buffer)));
    stream.on("error", err => reject(err));
  });
}
