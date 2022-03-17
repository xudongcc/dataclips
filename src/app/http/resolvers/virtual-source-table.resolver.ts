import { ID, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { Clip } from "../../core/entities/clip.entity";
import { VirtualSourceTable } from "../../core/entities/virtual-source-table.entity";
import { SourceType } from "../../core/enums/source-type.enum";
import { ClipService } from "../../core/services/clip.service";
import { SourceService } from "../../core/services/source.service";
import { VirtualSource } from "../objects/virtual-source.object";

@Resolver(() => VirtualSourceTable)
export class VirtualSourceTableResolver {
  constructor(
    private readonly clipService: ClipService,
    private readonly sourceService: SourceService
  ) {}

  @ResolveField(() => Clip)
  async clip(@Parent() virtualSourceTable: VirtualSourceTable): Promise<Clip> {
    return await this.clipService.findOne({
      where: { id: virtualSourceTable.clipId },
    });
  }

  @ResolveField(() => ID)
  async clipId(
    @Parent() virtualSourceTable: VirtualSourceTable
  ): Promise<Clip["id"]> {
    return virtualSourceTable.clipId;
  }

  @ResolveField(() => VirtualSource)
  async virtualSource(
    @Parent() virtualSourceTable: VirtualSourceTable
  ): Promise<VirtualSource> {
    return await this.sourceService.findOne({
      where: { id: virtualSourceTable.sourceId, type: SourceType.VIRTUAL },
    });
  }

  @ResolveField(() => ID)
  async virtualSourceId(
    @Parent() virtualSourceTable: VirtualSourceTable
  ): Promise<VirtualSource["id"]> {
    return virtualSourceTable.sourceId;
  }
}
