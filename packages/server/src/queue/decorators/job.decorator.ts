import { SetMetadata } from "@nestjs/common";
import { kebabCase } from "lodash";

import { QUEUE_METADATA_KEY } from "../constants";
import { JobOptions } from "../interfaces/job-options.interface";

export function Job(options?: JobOptions): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any) => {
    return SetMetadata(QUEUE_METADATA_KEY, {
      name: options?.name || kebabCase(target.name),
      queue: options?.queue || "default",
    })(target);
  };
}
