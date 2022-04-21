import { UseGuards } from "@nestjs/common";
import { ID, Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { Clip } from "../../core/entities/clip.entity";
import { Source } from "../../core/entities/source.entity";
import { VirtualSourceTable } from "../../core/entities/virtual-source-table.entity";
import { SourceType } from "../../core/enums/source-type.enum";
import { ClipService } from "../../core/services/clip.service";
import { SourceService } from "../../core/services/source.service";
import { AuthGuard } from "../guards/auth.guard";
import { VirtualSource } from "../objects/virtual-source.object";

@UseGuards(AuthGuard)
@Resolver(() => VirtualSourceTable)
export class VirtualSourceTableResolver {
  constructor(
    private readonly clipService: ClipService,
    private readonly sourceService: SourceService
  ) {}

  @ResolveField(() => Clip)
  async clip(@Parent() virtualSourceTable: VirtualSourceTable): Promise<Clip> {
    return await this.clipService.repository.findOne({
      id: virtualSourceTable.clip.id,
    });
  }

  @ResolveField(() => VirtualSource)
  async virtualSource(
    @Parent() virtualSourceTable: VirtualSourceTable
  ): Promise<Source> {
    return await this.sourceService.repository.findOne({
      id: virtualSourceTable.source.id,
      type: SourceType.VIRTUAL,
    });
  }

  @ResolveField(() => ID)
  async virtualSourceId(
    @Parent() virtualSourceTable: VirtualSourceTable
  ): Promise<VirtualSource["id"]> {
    return virtualSourceTable.source.id;
  }
}
