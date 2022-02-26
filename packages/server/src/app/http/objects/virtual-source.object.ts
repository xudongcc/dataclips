import { Field, ID, ObjectType } from "@nestjs/graphql";

import { VirtualSourceTable } from "../../core/entities/virtual-source-table.entity";

@ObjectType()
export class VirtualSource {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [VirtualSourceTable])
  tables: VirtualSourceTable[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
