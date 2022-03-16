import { OnModuleInit } from "@nestjs/common";
import { DiscoveryService, Reflector } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";

import { QueuePushOptions } from "./interfaces/queue-push-options.interface";
import { BaseQueue } from "./queues/base.queue";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseJob<T = any> implements OnModuleInit {
  name: string;

  private queue: BaseQueue;

  private readonly discoveryService: DiscoveryService;

  private readonly reflector: Reflector;

  async dispatch(data: T, options?: QueuePushOptions) {
    await this.queue.push(this.constructor.name, data, options);
  }

  onModuleInit() {
    const queueInstanceWrapper: InstanceWrapper<BaseQueue> =
      this.discoveryService
        .getProviders()
        .find(
          (wrapper: InstanceWrapper<BaseQueue>) =>
            wrapper.instance instanceof BaseQueue
        );

    queueInstanceWrapper.instance.registerJob(this);
  }

  abstract processor(data: T): Promise<void> | void;
}
