import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  PrimaryKey,
  Property,
  t,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { nanoid } from "nanoid";
import { SnowflakeIdGenerator } from "snowflake-id-generator";

import { ChartType } from "../enums/chart-type.enum";
import { Clip } from "./clip.entity";

@ObjectType()
@Entity()
export class Chart {
  @Field(() => ID)
  @PrimaryKey({
    type: t.bigint,
    onCreate: () => SnowflakeIdGenerator.next().toString(),
  })
  id: string;

  @Field()
  @Property()
  name: string;

  @Field({ nullable: true })
  @Property({ nullable: true, onCreate: () => nanoid() })
  token: string;

  @Field(() => ChartType)
  @Property()
  type: ChartType;

  @Field(() => [String])
  @Property({ type: t.json, onCreate: () => [] })
  tags: string[];

  @Field(() => GraphQLJSONObject)
  @Property({ type: t.json })
  config: Record<string, unknown>;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne({ onDelete: "cascade" })
  clip: IdentifiedReference<Clip>;

  @Field(() => ID)
  clipId: string;
}
