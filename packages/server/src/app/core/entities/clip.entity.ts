import {
  Collection,
  Entity,
  IdentifiedReference,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  t,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { nanoid } from "nanoid";
import { SnowflakeIdGenerator } from "snowflake-id-generator";

import { Chart } from "./chart.entity";
import { Result } from "./result.entity";
import { Source } from "./source.entity";
import { VirtualSourceTable } from "./virtual-source-table.entity";

@ObjectType()
@Entity()
export class Clip {
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

  @Field()
  @Property()
  sql: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  lastViewedAt: Date;

  @Field({ nullable: true })
  @Property({ nullable: true })
  latestResultAt: Date;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne()
  source: IdentifiedReference<Source>;

  @OneToMany(() => Result, (result) => result.clip)
  results = new Collection<Result>(this);

  @OneToMany(
    () => VirtualSourceTable,
    (virtualSourceTable) => virtualSourceTable.clip
  )
  virtualSourceTables = new Collection<VirtualSourceTable>(this);

  @OneToMany(() => Chart, (chart) => chart.clip)
  charts = new Collection<Chart>(this);
}
