import { Field, InputType, Int } from "@nestjs/graphql";
import { DataSourceType } from "../../core/enums/data-source-type.enum";

@InputType()
export class CreateDataSourceInput {
  @Field()
  name: string;

  @Field(() => DataSourceType)
  type: DataSourceType;

  @Field()
  host: string;

  @Field(() => Int)
  port: number;

  @Field()
  database: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
