import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
export class CreateDashboardInput {
  @Field()
  name: string;

  /**
   * [
   *    {
   *        name: '小图表的 name',
   *        chartId,
   *        layout: {
   *          x,y,w,h,i
   *        }
   *    }
   * ]
   */
  @Field(() => [GraphQLJSONObject], { nullable: true })
  config?: Record<string, any>[];
}
