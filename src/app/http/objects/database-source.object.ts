import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

import { DatabaseType } from "../../core/enums/database-type.enum";

@ObjectType()
export class DatabaseSource {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => DatabaseType)
  type: DatabaseType;

  @Field()
  host: string;

  @Field(() => Int, { nullable: true })
  port?: number;

  @Field({ nullable: true })
  database?: string;

  @Field()
  username: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
