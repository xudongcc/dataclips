import { QueryConnectionArgs } from "@nest-boot/graphql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Source } from "../../core/entities";
import { SourceService } from "../../core/services/source.service";
import { SourceConnection } from "../objects/source-connection.object";
import { SourceObject } from "../objects/source.object";

@Resolver(() => SourceObject)
export class SourceResolver {
  constructor(private readonly sourceService: SourceService) {}

  @Query(() => SourceObject)
  async source(@Args("id", { type: () => ID }) id: string): Promise<Source> {
    return await this.sourceService.findOne({ where: { id } });
  }

  @Query(() => SourceConnection)
  async sources(@Args() args: QueryConnectionArgs): Promise<SourceConnection> {
    return this.sourceService.getConnection(args);
  }

  @Mutation(() => ID)
  async deleteSource(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.sourceService.delete({ id });
    return id;
  }
}
