import { PinoLogger } from "@nest-boot/logger";
import { BaseQueue, Queue, Job } from "@nest-boot/queue";
import { forwardRef, Inject } from "@nestjs/common";
import ms from "ms";
import { ClipService } from "../services/clip.service";

@Queue({
  concurrency: 5,
  defaultJobOptions: {
    timeout: ms("20m"),
    removeOnComplete: true,
    removeOnFail: true,
  },
})
export class RefreshClipQueue extends BaseQueue<{ clipId: string }> {
  constructor(
    readonly logger: PinoLogger,
    @Inject(forwardRef(() => ClipService))
    readonly clipService: ClipService
  ) {
    super();
    this.logger.setContext(this.constructor.name);
  }

  async processor(job: Job<{ clipId: string }>): Promise<void> {
    await this.clipService.query(job.data.clipId);
  }
}
