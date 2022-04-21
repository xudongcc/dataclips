import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  PrimaryKey,
  Property,
  t,
} from "@mikro-orm/core";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { SnowflakeIdGenerator } from "snowflake-id-generator";

import { Clip } from "./clip.entity";

@ObjectType()
@Entity()
export class Result {
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
  fields: string[];

  @Field(() => [[String]])
  @Property({ type: t.json, onCreate: () => [] })
  values: (string | number | boolean | Date)[][];

  @Field({ nullable: true })
  @Property({ type: t.text, nullable: true })
  error?: string;

  @Field(() => Int)
  @Property({ type: t.integer })
  duration: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  startedAt: Date;

  @Field({ nullable: true })
  @Property({ nullable: true })
  finishedAt: Date;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne()
  clip: IdentifiedReference<Clip>;
}
