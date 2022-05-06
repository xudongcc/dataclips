import { MikroOrmModule } from "@mikro-orm/nestjs";
import { EntityManager } from "@mikro-orm/postgresql";
import { LoggerModule } from "@nest-boot/common";
import { QueueModule } from "@nest-boot/queue";
import { RedisModule } from "@nest-boot/redis";
import { SearchModule } from "@nest-boot/search";
import { PostgresqlSearchEngine } from "@nest-boot/search-engine-postgresql";
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DiscoveryService } from "@nestjs/core";
import ms from "ms";

import { CryptoModule } from "../../crypto";
import { Chart } from "./entities/chart.entity";
import { Clip } from "./entities/clip.entity";
import { Dashboard } from "./entities/dashboard.entity";
import { Project } from "./entities/project.entity";
import { Result } from "./entities/result.entity";
import { Source } from "./entities/source.entity";
import { User } from "./entities/user.entity";
import { VirtualSourceTable } from "./entities/virtual-source-table.entity";
import { RefreshClipQueue } from "./queues/refresh-clip.queue";
import { ChartService } from "./services/chart.service";
import { ClipService } from "./services/clip.service";
import { DashboardService } from "./services/dashboard.service";
import { ProjectService } from "./services/project.service";
import { ResultService } from "./services/result.service";
import { SourceService } from "./services/source.service";
import { UserService } from "./services/user.service";
import { VirtualSourceTableService } from "./services/virtual-source-table.service";

const entities = [
  Clip,
  Project,
  Source,
  Result,
  VirtualSourceTable,
  Chart,
  Dashboard,
  User,
];

const services = [
  ClipService,
  ProjectService,
  ResultService,
  SourceService,
  VirtualSourceTableService,
  ChartService,
  DashboardService,
  UserService,
];

const queues = [RefreshClipQueue];

const DatabaseDynamicModule = MikroOrmModule.forRoot();

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
  imports: [DatabaseDynamicModule],
  inject: [DiscoveryService, EntityManager],
  useFactory: (
    discoveryService: DiscoveryService,
    entityManager: EntityManager
  ) => ({
    engine: new PostgresqlSearchEngine(discoveryService, entityManager),
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
    MikroOrmModule.forFeature(Object.values(entities)),
    RedisDynamicModule,
    SearchDynamicModule,
    QueueDynamicModule,
    DatabaseDynamicModule,
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST", "localhost"),
          port: +configService.get("REDIS_PORT", "6379"),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: "RefreshClipQueue",
      defaultJobOptions: {
        timeout: ms("30m"),
        removeOnComplete: true,
        removeOnFail: true,
        repeat: { every: ms("15m") },
      },
    }),
  ],
  providers,
  exports: [...providers],
})
export class CoreModule {}
