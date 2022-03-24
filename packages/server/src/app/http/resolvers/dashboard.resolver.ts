import { QueryConnectionArgs } from "@nest-boot/graphql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import { Dashboard } from "../../core/entities/dashboard.entity";
import { DashboardService } from "../../core/services/dashboard.service";
import { CreateDashboardInput } from "../inputs/create-dashboard.input";
import { UpdateDashboardInput } from "../inputs/update-dashboard.input";
import { DashboardConnection } from "../objects/dashboard.connection.object";

@Resolver(() => Dashboard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

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
