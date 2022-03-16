import { ContextMiddleware } from "@nest-boot/common";
import { ApolloDriver } from "@nestjs/apollo";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

import { CoreModule } from "../core/core.module";
import { ClipController } from "./controllers/clip.controller";
import { ChartResolver } from "./resolvers/chart.resolver";
import { ClipResolver } from "./resolvers/clip.resolver";
import { DatabaseSourceResolver } from "./resolvers/database-source.resolver";
import { ProjectResolver } from "./resolvers/project.resolver";
import { SourceResolver } from "./resolvers/source.resolver";
import { VirtualSourceResolver } from "./resolvers/virtual-source.resolver";
import { VirtualSourceTableResolver } from "./resolvers/virtual-source-table.resolver";

@Module({
  imports: [
    CoreModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      path: "/graphql",
      playground: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "client"),
    }),
  ],
  providers: [
    ProjectResolver,
    ClipResolver,
    SourceResolver,
    DatabaseSourceResolver,
    VirtualSourceResolver,
    VirtualSourceTableResolver,
    ChartResolver,
  ],
  controllers: [ClipController],
})
export class HttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ContextMiddleware).forRoutes("*");
  }
}
