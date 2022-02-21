import { Field, InputType, Int } from "@nestjs/graphql";
import { SourceType } from "../../core/enums/source-type.enum";

@InputType()
export class CreateSourceInput {
  @Field()
  name: string;

  @Field(() => SourceType)
  type: SourceType;

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
