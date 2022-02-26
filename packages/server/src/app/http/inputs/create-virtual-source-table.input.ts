import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class CreateVirtualSourceTableInput {
  @Field()
  name: string;

  @Field(() => ID)
  clipId: string;
}
