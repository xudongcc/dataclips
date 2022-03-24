import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class ChartResultInput {
  @Field()
  name: string;

  @Field(() => ID)
  chartId: string;
}
