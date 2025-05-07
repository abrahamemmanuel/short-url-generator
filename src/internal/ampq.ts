import { Logger } from "@risemaxi/octonet";
import { Channel as AMQPChannel, Connection as AMQPConnection } from "amqplib";
import { inject, injectable } from "inversify";
import amqp from "amqplib";

import TYPES from "./inversify";

export interface Connection {
  internal: AMQPConnection;
  is_connected: boolean;
}

export async function createAMQP(url: string, logger: Logger): Promise<Connection> {
  const rawConn = await amqp.connect(url);
  const conn = { internal: rawConn, is_connected: true };

  rawConn.on("error", err => {
    conn.is_connected = false;
    logger.error(err);
  });

  rawConn.on("close", () => {
    conn.is_connected = false;
  });

  return conn;
}

@injectable()
export class Channel {
  private internalBuffer: BufferEntry[] = [];

  constructor(@inject(TYPES.AMQPChannel) private chan: AMQPChannel) {
    this.chan.on("drain", async () => {
      while (this.internalBuffer.length !== 0) {
        const top = this.internalBuffer[0];
        const succeeded = await this.internalQueue(top.queue, top.data);

        // break out if we need to wait again
        if (!succeeded) {
          return;
        }

        this.internalBuffer.shift();
      }
    });
  }

  /**
   * Push data to a particular queue, handling serilization and buffering
   * @param queue queue to push to
   * @param data data to write on queue
   */
  async push(queue: string, data: any) {
    const succeded = await this.internalQueue(queue, data);
    // queue for later
    if (!succeded) {
      this.internalBuffer.push({ queue, data });
    }
  }

  private async internalQueue(queue: string, data: any) {
    await this.chan.assertQueue(queue, { durable: true });
    return this.chan.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  }
}

interface BufferEntry {
  queue: string;
  data: any;
}
