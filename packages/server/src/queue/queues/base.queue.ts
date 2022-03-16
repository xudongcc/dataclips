import { BaseJob } from "../base.job";
import { QueuePushOptions } from "../interfaces/queue-push-options.interface";

export abstract class BaseQueue {
  protected readonly jobs: Map<string, BaseJob> = new Map();

  registerJob(job: BaseJob) {
    this.jobs.set(job.constructor.name, job);
  }

  abstract push(
    job: string,
    data: unknown,
    options?: QueuePushOptions
  ): Promise<void>;
}
