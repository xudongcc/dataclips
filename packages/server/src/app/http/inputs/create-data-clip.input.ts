import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateDataClipInput {
  @Field()
  name: string;

  @Field()
  sql: string;
}
