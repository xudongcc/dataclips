import { Logger } from "@nest-boot/common";
import { BaseQueue, Job, Queue } from "@nest-boot/queue";
import { forwardRef, Inject, OnModuleInit } from "@nestjs/common";
import Bluebird from "bluebird";
import ms from "ms";

import { ClipService } from "../services/clip.service";

type RefreshClipQueryJob = Job<{ clipId: string }, void, "query">;
type RefreshClipScheduleJob = Job<{}, void, "schedule">;

@Queue({
  concurrency: 10,
  defaultJobOptions: {
    timeout: ms("30m"),
    removeOnComplete: true,
    removeOnFail: true,
  },
})
export class RefreshClipQueue extends BaseQueue implements OnModuleInit {
  constructor(
    readonly logger: Logger,
    @Inject(forwardRef(() => ClipService))
    readonly clipService: ClipService
  ) {
    super();
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    const name = "schedule";
    const jobId = "1";
    const every = ms("15m");

    await this.add(name, {}, { jobId, repeat: { every } });

    await Bluebird.map(
      await this.getRepeatableJobs(),
      async (repeatableJob) => {
        if (
          repeatableJob.name === name &&
          repeatableJob.id === jobId &&
          repeatableJob.cron === `${every}`
        ) {
          await this.removeRepeatableByKey(repeatableJob.key);
        }
      },
      {
        concurrency: 5,
      }
    );
  }

  async processor(
    job: RefreshClipScheduleJob | RefreshClipQueryJob
  ): Promise<void> {
    switch (job.name) {
      case "schedule":
        await this.clipService.schedule();
        break;
      case "query":
        await this.clipService.query(job.data.clipId);
        break;
    }
  }
}
