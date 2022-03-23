import { QueryConnectionArgs } from "@nest-boot/graphql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import _ from "lodash";

import { Dashboard } from "../../core/entities/dashboard.entity";
import { DashboardService } from "../../core/services/dashboard.service";
import { DashboardConnection } from "../objects/dashboard.connection.object";

@Resolver(() => Dashboard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => Dashboard)
  async dashboard(
    @Args("id", { type: () => ID }) id: string
  ): Promise<Dashboard> {
    return await this.dashboardService.findOne({ where: { id } });
  }

  @Query(() => DashboardConnection)
  async dashboards(
    @Args() args: QueryConnectionArgs
  ): Promise<DashboardConnection> {
    return await this.dashboardService.getConnection(args);
  }

  //   @Mutation(() => Dashboard)
  //   async createDashboard(
  //     @Args("input") input: CreateDashboardInput
  //   ): Promise<Dashboard> {
  //     return await this.dashboardService.create({
  //       ...input,
  //       clip: { id: input.clipId },
  //     });
  //   }

  //   @Mutation(() => Dashboard)
  //   async updateDashboard(
  //     @Args("id", { type: () => ID }) id: string,
  //     @Args("input") input: UpdateDashboardInput
  //   ): Promise<Dashboard> {
  //     await this.dashboardService.update(
  //       { id },
  //       {
  //         ..._.omit(input, "clipId"),
  //         ...(input.clipId ? { clip: { id: input.clipId } } : {}),
  //       }
  //     );

  //     return await this.dashboardService.findOne({ where: { id } });
  //   }

  @Mutation(() => ID)
  async deleteDashboard(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.dashboardService.delete({ id });
    return id;
  }
}
