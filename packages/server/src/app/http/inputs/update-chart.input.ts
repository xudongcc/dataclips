import { Field, ID, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { ChartType } from "../../core/enums/chart-type.enum";

@InputType()
export class UpdateChartInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => ChartType)
  type: ChartType;

  @Field(() => GraphQLJSONObject)
  config: Record<string, any>;

  @Field(() => ID)
  clipId: string;
}
