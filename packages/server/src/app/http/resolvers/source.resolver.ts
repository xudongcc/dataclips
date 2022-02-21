import { QueryConnectionArgs } from "@nest-boot/graphql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Source } from "../../core/entities";
import { SourceService } from "../../core/services/source.service";
import { CreateSourceInput } from "../inputs/create-source.input";
import { UpdateSourceInput } from "../inputs/update-source.input";
import { SourceConnection } from "../objects/source-connection.object";

@Resolver(() => Source)
export class SourceResolver {
  constructor(private readonly sourceService: SourceService) {}

  @Query(() => Source)
  async source(@Args("id", { type: () => ID }) id: string): Promise<Source> {
    return await this.sourceService.findOne({ where: { id } });
  }

  @Query(() => SourceConnection)
  async sources(@Args() args: QueryConnectionArgs): Promise<SourceConnection> {
    return this.sourceService.getConnection(args);
  }

  @Mutation(() => Source)
  async createSource(@Args("input") input: CreateSourceInput): Promise<Source> {
    return this.sourceService.create(input);
  }

  @Mutation(() => Source)
  async updateSource(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateSourceInput
  ): Promise<Source> {
    await this.sourceService.update({ id }, input);
    return this.sourceService.findOne({ where: { id } });
  }

  @Mutation(() => ID)
  async deleteSource(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.sourceService.delete({ id });
    return id;
  }
}
