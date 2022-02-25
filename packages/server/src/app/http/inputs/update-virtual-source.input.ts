import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateVirtualSourceInput {
  @Field({ nullable: true })
  name?: string;
}
