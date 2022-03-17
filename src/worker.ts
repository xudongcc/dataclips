import "source-map-support/register";

import { startWorker } from "@nest-boot/common";

import { CoreModule } from "./app/core/core.module";

startWorker(CoreModule);
