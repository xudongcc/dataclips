import { DatabaseModule } from "@nest-boot/database";
import { LoggerModule } from "@nest-boot/logger";
import { QueueModule } from "@nest-boot/queue";
import { RedisModule } from "@nest-boot/redis";
import { SearchModule } from "@nest-boot/search";
import { MeiliSearchEngine } from "@nest-boot/search-engine-meilisearch";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CryptoModule } from "../../crypto";
import { Chart } from "./entities/chart.entity";
import { Clip } from "./entities/clip.entity";
import { Project } from "./entities/project.entity";
import { Result } from "./entities/result.entity";
import { Source } from "./entities/source.entity";
import { VirtualSourceTable } from "./entities/virtual-source-table.entity";
import { RefreshClipQueue } from "./queues/refresh-clip.queue";
import { ChartService } from "./services/chart.service";
import { ClipService } from "./services/clip.service";
import { ProjectService } from "./services/project.service";
import { ResultService } from "./services/result.service";
import { SourceService } from "./services/source.service";
import { VirtualSourceTableService } from "./services/virtual-source-table.service";

const entities = [Clip, Project, Source, Result, VirtualSourceTable, Chart];

const services = [
  ClipService,
  ProjectService,
  ResultService,
  SourceService,
  VirtualSourceTableService,
  ChartService,
];

const queues = [RefreshClipQueue];

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

const providers = [...services, ...queues];

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
