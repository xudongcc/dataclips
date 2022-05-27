import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";

import { Source } from "../../core/entities/source.entity";
import { SourceService } from "../../core/services/source.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateDatabaseSourceInput } from "../inputs/create-database-source.input";
import { UpdateDatabaseSourceInput } from "../inputs/update-database-source.input";
import { DatabaseSource } from "../objects/database-source.object";

@UseGuards(AuthGuard)
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
    return await this.sourceService.update(id, input);
  }

  @Mutation(() => Boolean)
  async checkConnectDatabaseSource(
    @Args("input") input: CreateDatabaseSourceInput
  ): Promise<boolean> {
    return await this.sourceService.checkConnect(input);
  }
}
