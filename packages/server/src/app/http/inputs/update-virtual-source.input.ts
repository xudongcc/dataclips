import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateVirtualSourceInput {
  @Field({ nullable: true })
  name?: string;
}
