import { Field, InputType, Int } from "@nestjs/graphql";

import { SourceType } from "../../core/enums/source-type.enum";

@InputType()
export class CreateDatabaseSourceInput {
  @Field()
  name: string;

  @Field(() => SourceType)
  type: SourceType;

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
}
