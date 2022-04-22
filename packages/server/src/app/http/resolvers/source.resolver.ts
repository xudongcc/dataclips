import { QueryConnectionArgs } from "@nest-boot/graphql";
import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { plainToInstance } from "class-transformer";

import { SourceType } from "../../core/enums/source-type.enum";
import { SourceService } from "../../core/services/source.service";
import { AuthGuard } from "../guards/auth.guard";
import { DatabaseSource } from "../objects/database-source.object";
import { SourceObject } from "../objects/source.object";
import { SourceConnection } from "../objects/source-connection.object";
import { VirtualSource } from "../objects/virtual-source.object";
import { omit } from "lodash";

@UseGuards(AuthGuard)
@Resolver(() => SourceObject)
export class SourceResolver {
  constructor(private readonly sourceService: SourceService) {}

  @Query(() => SourceObject)
  async source(
    @Args("id", { type: () => ID }) id: string
  ): Promise<DatabaseSource | VirtualSource> {
    const source = await this.sourceService.repository.findOne({ id });

    return source.type === SourceType.VIRTUAL
      ? plainToInstance(VirtualSource, source, {
          enableCircularCheck: true,
        })
      : plainToInstance(DatabaseSource, source, {
          enableCircularCheck: true,
        });
  }

  @Query(() => SourceConnection)
  async sources(@Args() args: QueryConnectionArgs): Promise<SourceConnection> {
    const connection = await this.sourceService.getConnection(args);

    connection.edges = connection.edges.map((edge) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const node: any =
        edge.node.type === SourceType.VIRTUAL
          ? plainToInstance(VirtualSource, edge.node, {
              enableCircularCheck: true,
            })
          : plainToInstance(DatabaseSource, edge.node, {
              enableCircularCheck: true,
            });

      return { ...edge, node };
    });

    return connection as SourceConnection;

    // console.log(
    //   "vvvvv",
    //   plainToInstance(
    //     VirtualSource,
    //     omit(connection.edges?.[2]?.node, [
    //       "clips",
    //       "host",
    //       "port",
    //       "database",
    //       "username",
    //       "password",
    //       "sshEnabled",
    //       "sshHost",
    //       "sshPort",
    //       "sshUsername",
    //       "sshPassword",
    //       "sshKey",
    //     ]),
    //     {
    //       enableCircularCheck: true,
    //     }
    //   )
    // );

    // console.log("connection", connection.edges?.[2]?.node);
    return {
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        endCursor: "s",
        startCursor: "s",
      },
      edges: [],
    };
  }

  @Mutation(() => ID)
  async deleteSource(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    const source = await this.sourceService.repository.findOneOrFail({ id });
    await this.sourceService.repository.removeAndFlush(source);
    return id;
  }
}
