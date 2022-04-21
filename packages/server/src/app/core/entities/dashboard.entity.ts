import { Entity, PrimaryKey, Property, t } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { nanoid } from "nanoid";
import { SnowflakeIdGenerator } from "snowflake-id-generator";

@ObjectType()
@Entity()
export class Dashboard {
  @Field(() => ID)
  @PrimaryKey({
    type: t.bigint,
    onCreate: () => SnowflakeIdGenerator.next().toString(),
  })
  id: string;

  @Field()
  @Property()
  name: string;

  @Field(() => [String])
  @Property({ type: t.json, onCreate: () => [] })
  tags: string[];

  @Field({ nullable: true })
  @Property({ nullable: true, onCreate: () => nanoid() })
  token: string;

  @Field(() => GraphQLJSONObject)
  @Property({
    type: t.json,
    onCreate: () => ({ version: "1.0", blocks: [] }),
  })
  config: Record<string, unknown>;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
