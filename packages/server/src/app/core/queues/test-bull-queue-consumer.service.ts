import { Process, Processor } from "@nestjs/bull";
import { forwardRef, Inject, Scope } from "@nestjs/common";
import { Job } from "bull";

import { ClipService } from "../services/clip.service";

@Processor("testBullQueue")
export class TestBullQueueConsumer {
  constructor() {} //   private readonly clipService: ClipService

  @Process("query")
  async query(job: Job<any>) {
    console.log(333);
    console.log("job", job);
    // await this.clipService.query(job.data.clipId);
  }

  @Process("schedule")
  async schedule(job: Job<any>) {
    // await this.clipService.schedule();
  }
}
