import { LoggerModule } from "@nest-boot/logger";
import { QueueModule } from "@nest-boot/queue";
import { RedisModule } from "@nest-boot/redis";
import { SearchModule } from "@nest-boot/search";
import { MeiliSearchEngine } from "@nest-boot/search-engine-meilisearch";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "@nest-boot/database";
import { TypeOrmModule } from "@nestjs/typeorm";

import * as entities from "./entities";
import * as services from "./services";
import { CryptoModule } from "../../crypto";

const DatabaseDynamicModule = DatabaseModule.register({
  entities: Object.values(entities),
});

const RedisDynamicModule = RedisModule.registerAsync({
  imports: [],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    host: configService.get("REDIS_HOST", "localhost"),
    port: +configService.get("REDIS_PORT", "6379"),
    username: configService.get("REDIS_USERNAME"),
    password: configService.get("REDIS_PASSWORD"),
    db: +configService.get("REDIS_DB", "0"),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  }),
});

const SearchDynamicModule = SearchModule.registerAsync({
  imports: [],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    engine: new MeiliSearchEngine({
      host: configService.get("MEILISEARCH_HOST"),
      apiKey: configService.get("MEILISEARCH_KEY"),
    }),
  }),
});

const QueueDynamicModule = QueueModule.registerAsync({
  imports: [RedisDynamicModule],
});

const providers = [...Object.values(services)];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    CryptoModule,
    LoggerModule.register(),
    TypeOrmModule.forFeature(Object.values(entities)),
    RedisDynamicModule,
    SearchDynamicModule,
    QueueDynamicModule,
    DatabaseDynamicModule,
  ],
  providers,
  exports: [...providers],
})
export class CoreModule {}
