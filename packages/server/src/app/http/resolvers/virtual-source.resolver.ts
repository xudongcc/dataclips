import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";
import { Source } from "../../core/entities/source.entity";
import { SourceService } from "../../core/services/source.service";
import { CreateVirtualSourceInput } from "../inputs/create-virtual-source.input";
import { UpdateVirtualSourceInput } from "../inputs/update-virtual-source.input";
import { VirtualSource } from "../objects/virtual-source.object";

@Resolver(() => VirtualSource)
export class VirtualSourceResolver {
  constructor(private readonly sourceService: SourceService) {}

  @Mutation(() => VirtualSource)
  async createVirtualSource(
    @Args("input") input: CreateVirtualSourceInput
  ): Promise<Source> {
    return this.sourceService.create(input);
  }

  @Mutation(() => VirtualSource)
  async updateVirtualSource(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateVirtualSourceInput
  ): Promise<Source> {
    await this.sourceService.update({ id }, input);
    return this.sourceService.findOne({ where: { id } });
  }
}
