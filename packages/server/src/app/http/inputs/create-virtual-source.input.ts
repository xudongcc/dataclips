import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateVirtualSourceInput {
  @Field()
  name: string;
}
