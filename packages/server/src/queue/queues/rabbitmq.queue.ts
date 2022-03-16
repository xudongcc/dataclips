import { OnModuleInit } from "@nestjs/common";
import amqp, { ChannelWrapper } from "amqp-connection-manager";
import {
  AmqpConnectionManagerOptions,
  IAmqpConnectionManager,
} from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { Channel } from "amqplib";
import { randomUUID } from "crypto";

import { QueueOptions } from "../interfaces/queue-options.interface";
import { QueuePushOptions } from "../interfaces/queue-push-options.interface";
import { BaseQueue } from "./base.queue";

interface MessagePayload {
  job: string;
  data: unknown;
}

export interface RabbitMQQueueOptions
  extends QueueOptions,
    AmqpConnectionManagerOptions {
  urls: string[];
}

export class RabbitMQQueue extends BaseQueue implements OnModuleInit {
  private readonly queue: string;

  private readonly exchange: string;

  private readonly routingKey: string;

  private readonly connectionManager: IAmqpConnectionManager;

  private readonly channel: ChannelWrapper;

  constructor(private readonly options: RabbitMQQueueOptions) {
    super();

    this.queue = `${this.options.name}.queue`;
    this.exchange = `${this.options.name}.exchange`;
    this.routingKey = `${this.options.name}.routing_key`;

    this.connectionManager = amqp.connect(options.urls, options);

    this.channel = this.connectionManager.createChannel({
      json: true,
      setup: async (channel: Channel) => {
        // 声明交换机
        await channel.assertExchange(this.exchange, "x-delayed-message", {
          durable: false,
          arguments: {
            "x-delayed-type": "direct",
          },
        });

        // 声明队列
        await channel.assertQueue(this.queue, { exclusive: false });

        // 绑定队列
        await channel.bindQueue(this.queue, this.exchange, this.routingKey);
      },
    });
  }

  async push(job: string, data: unknown, options?: QueuePushOptions) {
    await this.channel.publish(
      this.exchange,
      this.routingKey,
      { job, data } as MessagePayload,
      {
        messageId: options?.id || randomUUID(),
        priority: options?.priority,
        headers: {
          "x-delay": options?.delay,
        },
      }
    );
  }

  async onModuleInit() {
    await this.channel.consume(
      this.queue,
      async (msg) => {
        const payload: MessagePayload = JSON.parse(msg.content.toString());
        if (payload) {
          const { job, data } = payload;
          const jobInstance = this.jobs.get(job);
          if (jobInstance) {
            await jobInstance.processor(data);
          }
        }
      },
      { noAck: true }
    );
  }
}
