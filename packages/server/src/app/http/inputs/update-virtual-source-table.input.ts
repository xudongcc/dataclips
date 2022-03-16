import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateVirtualSourceTableInput {
  @Field()
  name: string;

  @Field(() => ID)
  clipId: string;

  @Field(() => ID, { nullable: true })
  id?: string;
}
