import { PinoLogger } from "@nest-boot/logger";
import { forwardRef, Inject } from "@nestjs/common";

import { BaseJob } from "../../../queue/base.job";
import { Job } from "../../../queue/decorators/job.decorator";
import { ClipService } from "../services/clip.service";

export interface RefreshClipJobData {
  clipId: string;
}

@Job({ queue: "default" })
export class RefreshClipJob extends BaseJob<RefreshClipJobData> {
  constructor(
    readonly logger: PinoLogger,
    @Inject(forwardRef(() => ClipService))
    readonly clipService: ClipService
  ) {
    super();
    this.logger.setContext(this.constructor.name);
  }

  async processor({ clipId }: RefreshClipJobData): Promise<void> {
    console.log("@@@@ processor");
    await this.clipService.query(clipId);
  }
}
