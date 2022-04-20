import { Field, InputType } from "@nestjs/graphql";

import { CreateVirtualSourceTableInput } from "./create-virtual-source-table.input";

@InputType()
export class CreateVirtualSourceInput {
  @Field()
  name: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => [CreateVirtualSourceTableInput])
  tables: CreateVirtualSourceTableInput[];
}
