import { Field, InputType, Int } from "@nestjs/graphql";

import { SourceType } from "../../core/enums/source-type.enum";

@InputType()
export class UpdateDatabaseSourceInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => SourceType, { nullable: true })
  type?: SourceType;

  @Field({ nullable: true })
  host?: string;

  @Field(() => Int, { nullable: true })
  port?: number;

  @Field({ nullable: true })
  database?: string;

  @Field({ nullable: true })
  username?: string;

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
