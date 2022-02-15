import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { ProjectResolver } from "./resolvers/project.resolver";
import { CoreModule } from "../core/core.module";
import { ApolloDriver } from "@nestjs/apollo";
import { ContextMiddleware } from "@nest-boot/common";
import { DataSourceResolver } from "./resolvers/data-source.resolver";
import { DataClipResolver } from "./resolvers/data-clip.resolver";
import { DataClipController } from "./controllers/data-clip.controller";
import { ProjectDataClipController } from "./controllers/project-data-clip.controller";
import { ProjectMiddleware } from "./middlewares/project.middleware";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    CoreModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      path: "/graphql",
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "client"),
    }),
  ],
  providers: [ProjectResolver, DataClipResolver, DataSourceResolver],
  controllers: [DataClipController, ProjectDataClipController],
})
export class HttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ContextMiddleware, ProjectMiddleware).forRoutes("*");
  }
}
