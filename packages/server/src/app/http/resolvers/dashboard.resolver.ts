import { QueryConnectionArgs } from "@nest-boot/graphql";
import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import { Dashboard } from "../../core/entities/dashboard.entity";
import { DashboardService } from "../../core/services/dashboard.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateDashboardInput } from "../inputs/create-dashboard.input";
import { UpdateDashboardInput } from "../inputs/update-dashboard.input";
import { DashboardConnection } from "../objects/dashboard.connection.object";

@UseGuards(AuthGuard)
@Resolver(() => Dashboard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => Dashboard)
  async dashboard(
    @Args("id", { type: () => ID }) id: string
  ): Promise<Dashboard> {
    return this.dashboardService.repository.findOne({ id });
  }

  @Query(() => DashboardConnection)
  async dashboards(
    @Args() args: QueryConnectionArgs
  ): Promise<DashboardConnection> {
    return await this.dashboardService.getConnection(args);
  }

  @Mutation(() => Dashboard)
  async createDashboard(
    @Args("input") input: CreateDashboardInput
  ): Promise<Dashboard> {
    const dashboard = this.dashboardService.repository.create(input);

    await this.dashboardService.repository.persistAndFlush(dashboard);

    return dashboard;
  }

  @Mutation(() => Dashboard)
  async updateDashboard(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateDashboardInput
  ): Promise<Dashboard> {
    const dashboard = await this.dashboardService.repository.findOneOrFail({
      id,
    });

    Object.entries(input).forEach(([key, value]) => {
      dashboard[key] = value;
    });

    await this.dashboardService.repository.persistAndFlush(dashboard);

    return dashboard;
  }

  @Mutation(() => ID)
  async deleteDashboard(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    const dashboard = await this.dashboardService.repository.findOneOrFail({
      id,
    });

    await this.dashboardService.repository.removeAndFlush(dashboard);

    return id;
  }
}
