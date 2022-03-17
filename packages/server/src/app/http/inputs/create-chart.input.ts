import { Field, ID, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { ChartType } from "src/app/core/enums/chart-type.enum";

@InputType()
export class CreateChartInput {
  @Field()
  name: string;

  @Field(() => ChartType)
  type: ChartType;

  @Field(() => GraphQLJSONObject)
  config: Record<string, any>;

  @Field(() => ID)
  clipId: string;
}
