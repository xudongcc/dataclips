import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ClipService } from "../services/clip.service";
import { TestBullQueueConsumer } from "./test-bull-queue-consumer.service";

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST", "localhost"),
          port: +configService.get("REDIS_PORT", "6379"),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: "testBullQueue" }),
  ],
  providers: [TestBullQueueConsumer],
  exports: [BullModule],
})
export class BullQueueModule {}
