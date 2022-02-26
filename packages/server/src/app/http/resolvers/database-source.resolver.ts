import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";

import { Source } from "../../core/entities/source.entity";
import { SourceService } from "../../core/services/source.service";
import { CreateDatabaseSourceInput } from "../inputs/create-database-source.input";
import { UpdateDatabaseSourceInput } from "../inputs/update-database-source.input";
import { DatabaseSource } from "../objects/database-source.object";

@Resolver(() => DatabaseSource)
export class DatabaseSourceResolver {
  constructor(private readonly sourceService: SourceService) {}

  @Mutation(() => DatabaseSource)
  async createDatabaseSource(
    @Args("input") input: CreateDatabaseSourceInput
  ): Promise<Source> {
    return await this.sourceService.create(input);
  }

  @Mutation(() => DatabaseSource)
  async updateDatabaseSource(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateDatabaseSourceInput
  ): Promise<Source> {
    await this.sourceService.update({ id }, input);
    return await this.sourceService.findOne({ where: { id } });
  }
}
