import { QueryConnectionArgs } from "@nest-boot/graphql";
import { ForbiddenException, UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { plainToInstance } from "class-transformer";

import { SourceType } from "../../core/enums/source-type.enum";
import { SourceService } from "../../core/services/source.service";
import { AuthGuard } from "../guards/auth.guard";
import { DatabaseSource } from "../objects/database-source.object";
import { SourceObject } from "../objects/source.object";
import { SourceConnection } from "../objects/source-connection.object";
import { VirtualSource } from "../objects/virtual-source.object";
import { ClipService } from "src/app/core/services/clip.service";

@UseGuards(AuthGuard)
@Resolver(() => SourceObject)
export class SourceResolver {
  constructor(
    private readonly sourceService: SourceService,
    private readonly clipService: ClipService
  ) {}

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
  }

  @Mutation(() => ID)
  async deleteSource(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    try {
      const source = await this.sourceService.repository.findOneOrFail({ id });
      await this.sourceService.repository.removeAndFlush(source);
      return id;
    } catch (err) {
      const relationClips = await this.clipService.repository.find({
        source: { id },
      });

      throw new ForbiddenException(
        `需要修改或删除名称为 ${relationClips
          .map((chart) => chart.name)
          .join("、")} 的数据集后才能删除此数据源`
      );
    }
  }
}
