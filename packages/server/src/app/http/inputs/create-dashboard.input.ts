import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
export class CreateDashboardInput {
  @Field()
  name: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  config?: Record<string, any>;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
