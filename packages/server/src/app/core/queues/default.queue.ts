import { ConfigService } from "@nestjs/config";

import { Queue } from "../../../queue/decorators/queue.decorator";
import { BullQueue } from "../../../queue/queues/bull.queue";

@Queue()
export class DefaultQueue extends BullQueue {
  constructor(private readonly configService: ConfigService) {
    super({
      name: "default",
      connection: {
        host: configService.get("REDIS_HOST", "localhost"),
        port: +configService.get("REDIS_PORT", 6379),
        password: configService.get("REDIS_PASSWORD", ""),
      },
    });
  }
}

// @Queue()
// export class DefaultQueue extends RabbitMQQueue {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       name: "default",
//       urls: [
//         `amqp://${configService.get(
//           "RABBITMQ_USERNAME",
//           "guest"
//         )}:${configService.get(
//           "RABBITMQ_PASSWORD",
//           "guest"
//         )}@${configService.get("RABBITMQ_HOST")}:${configService.get(
//           "RABBITMQ_PORT",
//           5672
//         )}${configService.get("RABBITMQ_VHOST", "/")}`,
//       ],
//     });
//   }
// }
