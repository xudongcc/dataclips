import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class CreateClipInput {
  @Field()
  name: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field()
  sql: string;

  @Field(() => ID, { nullable: true })
  sourceId: string;
}
