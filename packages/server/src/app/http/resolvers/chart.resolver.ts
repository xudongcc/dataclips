import { QueryConnectionArgs } from "@nest-boot/graphql";
import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import _ from "lodash";

import { Chart } from "../../core/entities/chart.entity";
import { ChartService } from "../../core/services/chart.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateChartInput } from "../inputs/create-chart.input";
import { UpdateChartInput } from "../inputs/update-chart.input";
import { ChartConnection } from "../objects/chart-connection.object";

@UseGuards(AuthGuard)
@Resolver(() => Chart)
export class ChartResolver {
  constructor(private readonly chartService: ChartService) {}

  @Query(() => Chart)
  async chart(@Args("id", { type: () => ID }) id: string): Promise<Chart> {
    return await this.chartService.findOne({ where: { id } });
  }

  @Query(() => ChartConnection)
  async charts(@Args() args: QueryConnectionArgs): Promise<ChartConnection> {
    return await this.chartService.getConnection(args);
  }

  @Mutation(() => Chart)
  async createChart(@Args("input") input: CreateChartInput): Promise<Chart> {
    return await this.chartService.create({
      ...input,
      clip: { id: input.clipId },
    });
  }

  @Mutation(() => Chart)
  async updateChart(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateChartInput
  ): Promise<Chart> {
    await this.chartService.update(
      { id },
      {
        ..._.omit(input, "clipId"),
        ...(input.clipId ? { clip: { id: input.clipId } } : {}),
      }
    );

    return await this.chartService.findOne({ where: { id } });
  }

  @Mutation(() => ID)
  async deleteChart(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.chartService.delete({ id });
    return id;
  }
}
