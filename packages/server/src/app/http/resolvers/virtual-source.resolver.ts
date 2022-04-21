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

import { Source } from "../../core/entities/source.entity";
import { VirtualSourceTable } from "../../core/entities/virtual-source-table.entity";
import { SourceType } from "../../core/enums/source-type.enum";
import { SourceService } from "../../core/services/source.service";
import { VirtualSourceTableService } from "../../core/services/virtual-source-table.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateVirtualSourceInput } from "../inputs/create-virtual-source.input";
import { UpdateVirtualSourceInput } from "../inputs/update-virtual-source.input";
import { VirtualSource } from "../objects/virtual-source.object";

@UseGuards(AuthGuard)
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
      throw new BadRequestException("存在重复的数据裁剪选项");
    }

    const source = this.sourceService.repository.create({
      ..._.omit(input, "tables"),
      type: SourceType.VIRTUAL,
    });

    source.tables.add(
      ...input.tables.map((item) =>
        this.virtualSourceTableService.repository.create(item)
      )
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

    const newTableIds = input.tables.map((item) => item.id);

    // 删除新表中不存在的项目
    source.tables.remove((item) => !newTableIds.includes(item.id));

    input.tables.forEach((newTable) => {
      if (newTable.id) {
        const table = source.tables
          .getItems()
          .find((oldTable) => oldTable.id === newTable.id);

        if (table) {
          Object.entries(newTable).forEach(([key, value]) => {
            table[key] = value;
          });
        }
      } else {
        source.tables.add(
          this.virtualSourceTableService.repository.create(newTable)
        );
      }
    });

    await this.virtualSourceTableService.repository.flush();

    return source;
  }

  @ResolveField(() => [VirtualSourceTable])
  async tables(@Parent() source: Source): Promise<VirtualSourceTable[]> {
    return this.virtualSourceTableService.repository.find({ source });
  }
}
