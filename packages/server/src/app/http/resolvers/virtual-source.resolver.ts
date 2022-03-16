import { In } from "@nest-boot/database";
import { BadRequestException } from "@nestjs/common";
import {
  Args,
  ID,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import Bluebird from "bluebird";
import _ from "lodash";

import { Source } from "../../core/entities/source.entity";
import { VirtualSourceTable } from "../../core/entities/virtual-source-table.entity";
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
    if (
      _.uniq(input.tables.map((item) => item.clipId)).length !==
      input.tables.length
    ) {
      throw new BadRequestException("44444");
    }

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
    let hasDuplicateClipId = false;

    await this.sourceService.update({ id }, _.pick(input, ["name"]));

    const tables = await this.virtualSourceTableService.findAll({
      where: { source: { id } },
    });

    const inputTableIds = input.tables.map((item) => item.id);

    // 将要删除的项
    const willDeleteTableIds = tables
      .filter((item) => !inputTableIds.includes(item.id))
      .map((item) => item.id);

    if (willDeleteTableIds.length) {
      await this.virtualSourceTableService.delete({
        id: In(willDeleteTableIds),
      });
    }

    // 将要增加的项
    const willAddTables = input.tables.filter((item) => !item?.id);

    if (willAddTables.length) {
      if (
        _.uniq(input.tables.map((item) => item.clipId)).length ===
        input.tables.length
      ) {
        await Bluebird.map(
          willAddTables,
          async (table) => {
            await this.virtualSourceTableService.create({
              name: table.name,
              clip: { id: table.clipId },
              source: { id },
            });
          },
          { concurrency: 5 }
        );
      } else {
        hasDuplicateClipId = true;
      }
    }

    // 将要更新的项
    const willUpdateTableIds = tables
      .filter((item) => !willDeleteTableIds.includes(item.id))
      .map((item) => item.id);

    if (willUpdateTableIds.length) {
      const willUpdateInputTables = input.tables.filter((item) =>
        willUpdateTableIds.includes(item.id)
      );

      if (
        _.uniq(willUpdateInputTables.map((item) => item.clipId)).length ===
        willUpdateInputTables.length
      ) {
        await Bluebird.map(
          willUpdateInputTables,
          async (table) => {
            await this.virtualSourceTableService.update(
              { id: table.id },
              { name: table.name }
            );
          },
          { concurrency: 5 }
        );
      } else {
        hasDuplicateClipId = true;
      }
    }

    return hasDuplicateClipId
      ? null
      : await this.sourceService.findOne({ where: { id } });
  }

  @ResolveField(() => [VirtualSourceTable])
  async tables(@Parent() source: Source): Promise<VirtualSourceTable[]> {
    return await this.virtualSourceTableService.findAll({ where: { source } });
  }
}
