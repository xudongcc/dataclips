import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateClipInput {
  @Field()
  name: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  sql?: string;

  @Field(() => ID)
  sourceId: string;
}
