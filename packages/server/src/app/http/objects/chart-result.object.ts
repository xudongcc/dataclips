import { Field, ObjectType } from "@nestjs/graphql";
import { Chart } from "src/app/core/entities/chart.entity";
import { Result } from "src/app/core/entities/result.entity";

@ObjectType()
export class ChartResult {
  @Field()
  name: string;

  @Field()
  result: Result;

  @Field()
  chart: Chart;
}
