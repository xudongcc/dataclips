import { BadRequestException, UseGuards } from "@nestjs/common";
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
import { ClipService } from "../../core/services/clip.service";

import { Source } from "../../core/entities/source.entity";
import { VirtualSourceTable } from "../../core/entities/virtual-source-table.entity";
import { SourceType } from "../../core/enums/source-type.enum";
import { SourceService } from "../../core/services/source.service";
import { VirtualSourceTableService } from "../../core/services/virtual-source-table.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateVirtualSourceInput } from "../inputs/create-virtual-source.input";
import { UpdateVirtualSourceInput } from "../inputs/update-virtual-source.input";
import { VirtualSource } from "../objects/virtual-source.object";
import { instanceToPlain } from "class-transformer";

@UseGuards(AuthGuard)
@Resolver(() => VirtualSource)
export class VirtualSourceResolver {
  constructor(
    private readonly sourceService: SourceService,
    private readonly virtualSourceTableService: VirtualSourceTableService,
    private readonly clipService: ClipService
  ) {}

  @Mutation(() => VirtualSource)
  async createVirtualSource(
    @Args("input") input: CreateVirtualSourceInput
  ): Promise<Source> {
    if (
      _.uniq(input.tables.map((item) => item.clipId)).length !==
      input.tables.length
    ) {
      throw new BadRequestException("存在重复的数据裁剪选项");
    }

    const source = this.sourceService.repository.create({
      ..._.omit(input, "tables"),
      type: SourceType.VIRTUAL,
    });

    await Bluebird.map(
      input.tables,
      async (table) => {
        const clip = await this.clipService.repository.findOneOrFail(
          table.clipId
        );

        await this.virtualSourceTableService.repository.create({
          name: table.name,
          clip,
          source,
        });
      },
      { concurrency: 5 }
    );

    await this.sourceService.repository.persistAndFlush(source);

    return source;
  }

  @Mutation(() => VirtualSource)
  async updateVirtualSource(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateVirtualSourceInput
  ): Promise<Source> {
    if (
      _.uniq(input.tables.map((item) => item.clipId)).length !==
      input.tables.length
    ) {
      throw new BadRequestException("存在重复的数据裁剪选项");
    }

    const source = await this.sourceService.repository.findOneOrFail(
      { id },
      { populate: ["tables"] }
    );

    Object.entries(_.pick(input, ["name", "tags"])).forEach(([key, value]) => {
      source[key] = value;
    });

    const newTableIds = input.tables.map((item) => item.clipId);

    // 删除新表中不存在的项目
    source.tables.remove((item) => !newTableIds.includes(item.clip.id));

    input.tables.forEach(async (newTable) => {
      if (newTable.clipId) {
        const table = source.tables
          .getItems()
          .find((oldTable) => oldTable.clip.id === newTable.clipId);

        if (table) {
          Object.entries(newTable).forEach(([key, value]) => {
            table[key] = value;
          });
        } else {
          const clip = await this.clipService.repository.findOneOrFail({
            id: newTable.clipId,
          });

          source.tables.add(
            this.virtualSourceTableService.repository.create({
              ..._.pick(newTable, ["name"]),
              clip,
            })
          );
        }
      }
    });

    // 无效
    await this.virtualSourceTableService.repository.flush();

    return source;
  }

  @ResolveField(() => [VirtualSourceTable])
  async tables(@Parent() source: Source): Promise<VirtualSourceTable[]> {
    const res = await this.virtualSourceTableService.repository.find({
      source: {
        id: source.id,
      },
    });

    return res;
  }
}
