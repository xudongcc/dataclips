import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateDataClipInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  sql?: string;
}
