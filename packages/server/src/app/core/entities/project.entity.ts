import { Entity, PrimaryKey, Property, t } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SnowflakeIdGenerator } from "snowflake-id-generator";

@ObjectType()
@Entity()
export class Project {
  @Field(() => ID)
  @PrimaryKey({
    type: t.bigint,
    onCreate: () => SnowflakeIdGenerator.next().toString(),
  })
  id: string;

  @Field()
  @Property()
  name: string;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
