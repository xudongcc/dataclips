import { QueryConnectionArgs } from "@nest-boot/graphql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DataSource } from "../../core/entities";
import { DataSourceService } from "../../core/services/data-source.service";
import { CreateDataSourceInput } from "../inputs/create-data-source.input";
import { UpdateDataSourceInput } from "../inputs/update-data-source.input";
import { DataSourceConnection } from "../objects/data-source-connection.object";

@Resolver(() => DataSource)
export class DataSourceResolver {
  constructor(private readonly dataSourceService: DataSourceService) {}

  @Query(() => DataSource)
  async dataSource(
    @Args("id", { type: () => ID }) id: string
  ): Promise<DataSource> {
    return await this.dataSourceService.findOne({ where: { id } });
  }

  @Query(() => DataSourceConnection)
  async dataSources(
    @Args() args: QueryConnectionArgs
  ): Promise<DataSourceConnection> {
    return this.dataSourceService.getConnection(args);
  }

  @Mutation(() => DataSource)
  async createDataSource(
    @Args("input") input: CreateDataSourceInput
  ): Promise<DataSource> {
    return this.dataSourceService.create(input);
  }

  @Mutation(() => DataSource)
  async updateDataSource(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateDataSourceInput
  ): Promise<DataSource> {
    await this.dataSourceService.update({ id }, input);
    return this.dataSourceService.findOne({ where: { id } });
  }

  @Mutation(() => ID)
  async deleteDataSource(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.dataSourceService.delete({ id });
    return id;
  }
}
