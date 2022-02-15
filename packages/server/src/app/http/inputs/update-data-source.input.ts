import { Field, InputType, Int } from "@nestjs/graphql";
import { DataSourceType } from "../../core/enums/data-source-type.enum";

@InputType()
export class UpdateDataSourceInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => DataSourceType, { nullable: true })
  type?: DataSourceType;

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
}
