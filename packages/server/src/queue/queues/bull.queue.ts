import { OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import {
  Queue,
  QueueOptions as BullQueueOptions,
  QueueScheduler,
  Worker,
} from "bullmq";
import { randomUUID } from "crypto";

import { QueueOptions } from "../interfaces/queue-options.interface";
import { QueuePushOptions } from "../interfaces/queue-push-options.interface";
import { BaseQueue } from "./base.queue";

export interface BullMQQueueOptions extends QueueOptions, BullQueueOptions {}

export class BullQueue
  extends BaseQueue
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly queue: Queue;

  private readonly queueScheduler: QueueScheduler;

  private worker: Worker;

  constructor(private readonly options: BullMQQueueOptions) {
    super();

    this.queue = new Queue(this.options.name, this.options);
    this.queueScheduler = new QueueScheduler(this.options.name, this.options);
  }

  async push(job: string, data: unknown, options?: QueuePushOptions) {
    await this.queue.add(job, data, {
      jobId: options?.id || randomUUID(),
      delay: options?.delay,
      priority: options?.priority,
    });
  }

  async onModuleInit() {
    this.worker = new Worker(this.options.name, async (job) => {
      const jobInstance = this.jobs.get(job.name);
      if (jobInstance) {
        await jobInstance.processor(job.data);
      }
    });
  }

  async onApplicationShutdown() {
    await this.worker.close();
  }
}
