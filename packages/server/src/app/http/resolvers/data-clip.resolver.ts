import { QueryConnectionArgs } from "@nest-boot/graphql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DataClip } from "../../core/entities";
import { DataClipService } from "../../core/services/data-clip.service";
import { CreateDataClipInput } from "../inputs/create-data-clip.input";
import { UpdateDataClipInput } from "../inputs/update-data-clip.input";
import { DataClipConnection } from "../objects/data-clip-connection.object";

@Resolver(() => DataClip)
export class DataClipResolver {
  constructor(private readonly dataClipService: DataClipService) {}

  @Query(() => DataClip)
  async dataClip(
    @Args("id", { type: () => ID }) id: string
  ): Promise<DataClip> {
    await this.dataClipService.query(id);
    return this.dataClipService.findOne({ where: { id } });
  }

  @Query(() => DataClipConnection)
  async dataClips(
    @Args() args: QueryConnectionArgs
  ): Promise<DataClipConnection> {
    return this.dataClipService.getConnection(args);
  }

  @Mutation(() => DataClip)
  async createDataClip(
    @Args("input") input: CreateDataClipInput
  ): Promise<DataClip> {
    return this.dataClipService.create(input);
  }

  @Mutation(() => DataClip)
  async updateDataClip(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateDataClipInput
  ): Promise<DataClip> {
    await this.dataClipService.update({ id }, input);
    return this.dataClipService.findOne({ where: { id } });
  }

  @Mutation(() => ID)
  async deleteDataClip(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.dataClipService.delete({ id });
    return id;
  }
}
