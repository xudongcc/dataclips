import { ContextMiddleware } from "@nest-boot/common";
import { DatabaseMiddleware } from "@nest-boot/database";
import { ApolloDriver } from "@nestjs/apollo";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { CoreModule } from "../core/core.module";
import { ClipController } from "./controllers/clip.controller";
import { ShareClipController } from "./controllers/share-clip.controller";
import { ChartResolver } from "./resolvers/chart.resolver";
import { ClipResolver } from "./resolvers/clip.resolver";
import { DashboardResolver } from "./resolvers/dashboard.resolver";
import { DatabaseSourceResolver } from "./resolvers/database-source.resolver";
import { SourceResolver } from "./resolvers/source.resolver";
import { VirtualSourceResolver } from "./resolvers/virtual-source.resolver";
import { VirtualSourceTableResolver } from "./resolvers/virtual-source-table.resolver";
import { JwtPassportStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    CoreModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      path: "/api/graphql",
      playground: true,
    }),
  ],
  providers: [
    ClipResolver,
    SourceResolver,
    DatabaseSourceResolver,
    VirtualSourceResolver,
    VirtualSourceTableResolver,
    ChartResolver,
    DashboardResolver,
    JwtPassportStrategy,
  ],
  controllers: [ClipController, ShareClipController],
})
export class HttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ContextMiddleware, DatabaseMiddleware).forRoutes("*");
  }
}
