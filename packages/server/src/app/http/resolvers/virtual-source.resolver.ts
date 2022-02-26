import { Args, ID, Mutation, Resolver } from "@nestjs/graphql";
import Bluebird from "bluebird";
import _ from "lodash";

import { Source } from "../../core/entities/source.entity";
import { SourceType } from "../../core/enums/source-type.enum";
import { SourceService } from "../../core/services/source.service";
import { VirtualSourceTableService } from "../../core/services/virtual-source-table.service";
import { CreateVirtualSourceInput } from "../inputs/create-virtual-source.input";
import { UpdateVirtualSourceInput } from "../inputs/update-virtual-source.input";
import { VirtualSource } from "../objects/virtual-source.object";

@Resolver(() => VirtualSource)
export class VirtualSourceResolver {
  constructor(
    private readonly sourceService: SourceService,
    private readonly virtualSourceTableService: VirtualSourceTableService
  ) {}

  @Mutation(() => VirtualSource)
  async createVirtualSource(
    @Args("input") input: CreateVirtualSourceInput
  ): Promise<Source> {
    const source = await this.sourceService.create({
      ..._.omit(input, "tables"),
      type: SourceType.VIRTUAL,
    });

    await Bluebird.map(
      input.tables,
      async (table) => {
        await this.virtualSourceTableService.create({
          name: table.name,
          clip: { id: table.clipId },
          source,
        });
      },
      { concurrency: 5 }
    );

    return source;
  }

  @Mutation(() => VirtualSource)
  async updateVirtualSource(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateVirtualSourceInput
  ): Promise<Source> {
    await this.sourceService.update({ id }, input);
    return await this.sourceService.findOne({ where: { id } });
  }
}
