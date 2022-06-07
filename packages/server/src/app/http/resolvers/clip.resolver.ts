import { QueryOrder } from "@mikro-orm/core";
import { QueryConnectionArgs } from "@nest-boot/graphql";
import { BadRequestException, UseGuards } from "@nestjs/common";
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import _, { omit } from "lodash";

import { Clip } from "../../core/entities/clip.entity";
import { Result } from "../../core/entities/result.entity";
import { SourceType } from "../../core/enums/source-type.enum";
import { ChartService } from "../../core/services/chart.service";
import { ClipService } from "../../core/services/clip.service";
import { ResultService } from "../../core/services/result.service";
import { SourceService } from "../../core/services/source.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateClipInput } from "../inputs/create-clip.input";
import { UpdateClipInput } from "../inputs/update-clip.input";
import { ClipConnection } from "../objects/clip-connection.object";

@UseGuards(AuthGuard)
@Resolver(() => Clip)
export class ClipResolver {
  constructor(
    private readonly clipService: ClipService,
    private readonly sourceService: SourceService,
    private readonly resultService: ResultService,
    private readonly chartService: ChartService
  ) {}

  @Query(() => Clip)
  async clip(@Args("id", { type: () => ID }) id: string): Promise<Clip> {
    return await this.clipService.repository.findOneOrFail({ id });
  }

  @Query(() => ClipConnection)
  async clips(@Args() args: QueryConnectionArgs): Promise<ClipConnection> {
    return await this.clipService.getConnection(args);
  }

  @Mutation(() => Clip)
  async createClip(@Args("input") input: CreateClipInput): Promise<Clip> {
    const source = await this.sourceService.repository.findOneOrFail({
      id: input.sourceId,
    });

    const clip = this.clipService.repository.create({
      ...omit(input, ["sourceId"]),
      lastEditAt: new Date(),
      source,
    });

    await this.clipService.repository.persistAndFlush(clip);

    return clip;
  }

  @Mutation(() => Clip)
  async updateClip(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateClipInput
  ): Promise<Clip> {
    const clip = await this.clipService.repository.findOneOrFail({ id });

    const source = await this.sourceService.repository.findOneOrFail({
      id: input.sourceId,
    });

    this.clipService.repository.assign(clip, {
      ...omit(input, ["sourceId"]),
      lastEditAt: new Date(),
      source,
    });

    await this.clipService.repository.persistAndFlush(clip);

    return clip;
  }

  @Mutation(() => ID)
  async deleteClip(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    try {
      const clip = await this.clipService.repository.findOneOrFail({ id });

      await this.clipService.repository.removeAndFlush(clip);
      return id;
    } catch (err) {
      // 查找关联到此数据集的所有图表
      const relationCharts = await this.chartService.repository.find({
        clip: { id },
      });

      throw new BadRequestException(
        `需要修改或删除名称为 ${relationCharts
          .slice(0, 10)
          .map((chart) => chart.name)
          .join("、")}${
          relationCharts.length > 10 ? " ..." : ""
        } 的图表后才能删除此数据集`
      );
    }
  }

  @ResolveField(() => [Result])
  async results(@Parent() clip: Clip): Promise<Result[]> {
    return await this.resultService.repository.find(
      { clip },
      {
        limit: 10,
        orderBy: { createdAt: QueryOrder.DESC },
      }
    );
  }
}
