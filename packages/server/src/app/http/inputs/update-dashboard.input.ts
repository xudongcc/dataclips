import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
export class UpdateDashboardInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  config?: Record<string, any>;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
