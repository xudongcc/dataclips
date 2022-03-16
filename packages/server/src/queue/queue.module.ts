import { Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";

import { QueueService } from "./queue.service";

@Module({
  imports: [DiscoveryModule],
  providers: [QueueService],
})
export class QueueModule {}
