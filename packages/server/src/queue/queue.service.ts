import { Context, getRuntime } from "@nest-boot/common";
import { Injectable } from "@nestjs/common";
import { DiscoveryService, Reflector } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";

import { BaseJob } from "./base.job";
import { JOB_METADATA_KEY, QUEUE_METADATA_KEY } from "./constants";
import { JobOptions } from "./interfaces/job-options.interface";
import { QueueOptions } from "./interfaces/queue-options.interface";
import { BaseQueue } from "./queues/base.queue";

@Injectable()
export class QueueService {
  private readonly jobs: Map<string, BaseJob> = new Map();

  private readonly queues: Map<string, BaseQueue> = new Map();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector
  ) {}

  getQueueInstanceWrappers(): InstanceWrapper<BaseQueue>[] {
    return this.discoveryService
      .getProviders()
      .filter((wrapper: InstanceWrapper<BaseQueue>) => {
        return wrapper.metatype && wrapper.instance instanceof BaseQueue;
      });
  }

  getJobInstanceWrappers(): InstanceWrapper<BaseJob>[] {
    return this.discoveryService
      .getProviders()
      .filter((wrapper: InstanceWrapper<BaseJob>) => {
        return wrapper.metatype && wrapper.instance instanceof BaseJob;
      });
  }

  async init(): Promise<void> {
    // const queueInstanceWrappers = this.getQueueInstanceWrappers();
    // const jobInstanceWrappers = this.getJobInstanceWrappers();
    // await Promise.all(
    //   queueInstanceWrappers.map((wrapper) =>
    //     (async () => {
    //       const queueOptions = this.reflector.get<QueueOptions>(
    //         QUEUE_METADATA_KEY,
    //         wrapper.metatype
    //       );
    //       this.queues.set(queueOptions.name, wrapper.instance);
    //     })()
    //   )
    // );
    // await Promise.all(
    //   jobInstanceWrappers.map((wrapper) =>
    //     (async () => {
    //       const jobOptions = this.reflector.get<JobOptions>(
    //         JOB_METADATA_KEY,
    //         wrapper.metatype
    //       );
    //       this.jobs.set(jobOptions.name, wrapper.instance);
    //     })()
    //   )
    // );
  }
}
