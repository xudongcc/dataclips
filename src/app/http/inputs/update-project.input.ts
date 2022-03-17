import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateProjectInput {
  @Field()
  name: string;
}
