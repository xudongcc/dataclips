import { CommandModule } from "@nest-boot/command";
import { Module } from "@nestjs/common";

import { CoreModule } from "../core/core.module";

@Module({
  imports: [CoreModule, CommandModule],
  providers: [],
})
export class ConsoleModule {}
