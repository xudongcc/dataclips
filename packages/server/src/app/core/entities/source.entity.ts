import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  t,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SnowflakeIdGenerator } from "snowflake-id-generator";

import { DatabaseType } from "../enums/database-type.enum";
import { SourceType } from "../enums/source-type.enum";
import { Clip } from "./clip.entity";
import { VirtualSourceTable } from "./virtual-source-table.entity";

@ObjectType()
@Entity()
export class Source {
  @Field(() => ID)
  @PrimaryKey({
    type: t.bigint,
    onCreate: () => SnowflakeIdGenerator.next().toString(),
  })
  id: string;

  @Property()
  name: string;

  @Property()
  type: SourceType | DatabaseType;

  @Field(() => [String])
  @Property({ type: t.json, onCreate: () => [] })
  tags: string[];

  @Property({ nullable: true })
  host?: string;

  @Property({ type: t.integer, nullable: true })
  port?: number;

  @Property({ nullable: true })
  database?: string;

  @Property({ nullable: true })
  username: string;

  @Property({ nullable: true, type: t.text })
  password?: string;

  @Property({ default: false })
  sshEnabled: boolean;

  @Property({ nullable: true })
  sshHost?: string;

  @Property({ type: t.integer, nullable: true })
  sshPort?: number;

  @Property({ nullable: true })
  sshUsername?: string;

  @Property({ nullable: true, type: t.text })
  sshPassword?: string;

  @Property({ nullable: true })
  sshKey?: string;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => Clip, (clip) => clip.source)
  clips = new Collection<Clip>(this);

  @OneToMany(() => VirtualSourceTable, (tables) => tables.source, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  tables = new Collection<VirtualSourceTable>(this);
}
