import { Field, InputType, Int } from "@nestjs/graphql";

import { DatabaseType } from "../../core/enums/database-type.enum";

@InputType()
export class CreateDatabaseSourceInput {
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

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  sshEnabled?: boolean;

  @Field({ nullable: true })
  sshHost?: string;

  @Field(() => Int, { nullable: true })
  sshPort?: number;

  @Field({ nullable: true })
  sshUsername?: string;

  @Field({ nullable: true })
  sshPassword?: string;

  @Field({ nullable: true })
  sshKey?: string;
}
