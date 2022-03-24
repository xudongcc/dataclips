import { QueryConnectionArgs } from "@nest-boot/graphql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import _ from "lodash";

import { Dashboard } from "../../core/entities/dashboard.entity";
import { ChartService } from "../../core/services/chart.service";
import { ClipService } from "../../core/services/clip.service";
import { DashboardService } from "../../core/services/dashboard.service";
import { ChartResultInput } from "../inputs/chart-result.input";
import { CreateDashboardInput } from "../inputs/create-dashboard.input";
import { UpdateDashboardInput } from "../inputs/update-dashboard.input";
import { ChartResult } from "../objects/chart-result.object";
import { DashboardConnection } from "../objects/dashboard.connection.object";

@Resolver(() => Dashboard)
export class DashboardResolver {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly chartService: ChartService,
    private readonly clipService: ClipService
  ) {}

  @Query(() => Dashboard)
  async dashboard(
    @Args("id", { type: () => ID }) id: string
  ): Promise<Dashboard> {
    // 预计创建时配置只传递 name 和 chartId，查询返回的数据由后端先从 chartResult 进行遍历，生成好后再返回
    return await this.dashboardService.findOne({ where: { id } });
  }

  @Query(() => DashboardConnection)
  async dashboards(
    @Args() args: QueryConnectionArgs
  ): Promise<DashboardConnection> {
    return await this.dashboardService.getConnection(args);
  }

  // 查询 chart 所对应的配置信息及 clip 的结果结合进行返回，在创建最终仪表盘前需要
  @Query(() => ChartResult)
  async chartResult(
    @Args("input") input: ChartResultInput
  ): Promise<ChartResult> {
    const chart = await this.chartService.findOne({
      where: { id: input.chartId },
    });

    const result = await this.clipService.fetchResult(chart.clipId);

    return {
      name: input.name,
      chart,
      result,
    };
  }

  // 创建最终的 dashboard 的数据
  @Mutation(() => Dashboard)
  async createDashboard(
    @Args("input") input: CreateDashboardInput
  ): Promise<Dashboard> {
    return await this.dashboardService.create({
      ...input,
    });
  }

  @Mutation(() => Dashboard)
  async updateDashboard(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateDashboardInput
  ): Promise<Dashboard> {
    await this.dashboardService.update({ id }, input);

    return await this.dashboardService.findOne({ where: { id } });
  }

  @Mutation(() => ID)
  async deleteDashboard(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.dashboardService.delete({ id });
    return id;
  }
}
