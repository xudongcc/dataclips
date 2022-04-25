import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  PrimaryKey,
  Property,
  t,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SnowflakeIdGenerator } from "snowflake-id-generator";

import { Clip } from "./clip.entity";
import { Source } from "./source.entity";

@ObjectType()
@Entity()
export class VirtualSourceTable {
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

  @ManyToOne({ onDelete: "cascade" })
  source: IdentifiedReference<Source>;

  @ManyToOne({ onDelete: "cascade" })
  clip: IdentifiedReference<Clip>;
}
