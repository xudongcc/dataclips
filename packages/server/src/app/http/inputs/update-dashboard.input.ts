import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
export class UpdateDashboardInput {
  @Field({ nullable: true })
  name?: string;

  // 预计创建时配置只传递 name 和 chartId，返回的数据由后端先从 chartResult 生成好后再返回
  /**
   * [
   *    {
   *        name: '小图表的 name',
   *        chartId,
   *    }
   * ]
   */
  @Field(() => [GraphQLJSONObject], { nullable: true })
  config?: Record<string, any>[];
}
