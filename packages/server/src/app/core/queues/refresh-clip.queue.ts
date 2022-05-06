import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Process, Processor } from "@nestjs/bull";
import { forwardRef, Inject } from "@nestjs/common";
import { Job } from "bull";

import { ClipService } from "../services/clip.service";

@Processor("RefreshClipQueue")
export class RefreshClipQueue {
  constructor(
    @Inject(forwardRef(() => ClipService))
    private readonly clipService: ClipService,
    private readonly orm: MikroORM
  ) {}

  @Process("query")
  async query(job: Job<any>) {
    await this.clipServiceQuery(job.data.clipId);
  }

  @Process("schedule")
  async schedule() {
    await this.clipServiceSchedule();
  }

  @UseRequestContext()
  async clipServiceQuery(clipId: string) {
    await this.clipService.query(clipId);
  }

  @UseRequestContext()
  async clipServiceSchedule() {
    await this.clipService.schedule();
  }
}
