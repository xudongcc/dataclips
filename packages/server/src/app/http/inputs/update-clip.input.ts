import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateClipInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  sql?: string;

  @Field(() => ID, { nullable: true })
  sourceId?: string;
}
