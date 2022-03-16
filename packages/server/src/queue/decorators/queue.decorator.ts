import { SetMetadata } from "@nestjs/common";
import { kebabCase } from "lodash";

import { QUEUE_METADATA_KEY } from "../constants";
import { QueueOptions } from "../interfaces/queue-options.interface";

export function Queue(options?: QueueOptions): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any) => {
    return SetMetadata(QUEUE_METADATA_KEY, {
      name: options?.name || kebabCase(target.name) || "default",
    })(target);
  };
}
