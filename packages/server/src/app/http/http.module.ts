import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { ProjectResolver } from "./resolvers/project.resolver";
import { CoreModule } from "../core/core.module";
import { ApolloDriver } from "@nestjs/apollo";
import { ContextMiddleware } from "@nest-boot/common";
import { SourceResolver } from "./resolvers/source.resolver";
import { ClipResolver } from "./resolvers/clip.resolver";
import { ClipController } from "./controllers/clip.controller";
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
  providers: [ProjectResolver, ClipResolver, SourceResolver],
  controllers: [ClipController],
})
export class HttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ContextMiddleware).forRoutes("*");
  }
}
