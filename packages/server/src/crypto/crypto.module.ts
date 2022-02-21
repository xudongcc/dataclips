import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CryptoService } from "./crypto.service";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
