import { QueryConnectionArgs } from "@nest-boot/graphql";
import { NotFoundException, UseGuards } from "@nestjs/common";
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import _ from "lodash";

import { Chart } from "../../core/entities/chart.entity";
import { ChartService } from "../../core/services/chart.service";
import { ClipService } from "../../core/services/clip.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateChartInput } from "../inputs/create-chart.input";
import { UpdateChartInput } from "../inputs/update-chart.input";
import { ChartConnection } from "../objects/chart-connection.object";

@UseGuards(AuthGuard)
@Resolver(() => Chart)
export class ChartResolver {
  constructor(
    private readonly chartService: ChartService,
    private readonly clipService: ClipService
  ) {}

  @Query(() => Chart)
  async chart(@Args("id", { type: () => ID }) id: string): Promise<Chart> {
    try {
      return await this.chartService.repository.findOneOrFail({ id });
    } catch (err) {
      throw new NotFoundException("图表未创建或已被删除");
    }
  }

  @Query(() => ChartConnection)
  async charts(@Args() args: QueryConnectionArgs): Promise<ChartConnection> {
    return await this.chartService.getConnection(args);
  }

  @Mutation(() => Chart)
  async createChart(@Args("input") input: CreateChartInput): Promise<Chart> {
    const clip = await this.clipService.repository.findOneOrFail(input.clipId);

    const chart = this.chartService.repository.create({
      ...input,
      clip,
    });

    await this.chartService.repository.persistAndFlush(chart);

    return chart;
  }

  @Mutation(() => Chart)
  async updateChart(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateChartInput
  ): Promise<Chart> {
    const chart = await this.chartService.repository.findOneOrFail({ id });

    Object.entries(_.omit(input, ["clipId"])).forEach(([key, value]) => {
      chart[key] = value;
    });

    if (input.clipId) {
      const clip = await this.clipService.repository.findOneOrFail({
        id: input.clipId,
      });

      chart.clip.set(clip);
    }

    await this.chartService.repository.flush();

    return chart;
  }

  @Mutation(() => ID)
  async deleteChart(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    const chart = await this.chartService.repository.findOne({ id });
    await this.chartService.repository.removeAndFlush(chart);
    return chart.id;
  }
}
