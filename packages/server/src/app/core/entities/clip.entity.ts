import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimarySnowflakeColumn,
  RelationId,
  UpdateDateColumn,
} from "@nest-boot/database";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { nanoid } from "nanoid";

import { Chart } from "./chart.entity";
import { Result } from "./result.entity";
import { Source } from "./source.entity";
import { VirtualSourceTable } from "./virtual-source-table.entity";

@ObjectType()
@Entity({ searchable: true })
export class Clip {
  @Field(() => ID)
  @PrimarySnowflakeColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => [String])
  @Column({ type: "json", default: [], generator: () => [] })
  tags: string[];

  @Field({ nullable: true })
  @Column({ nullable: true, generator: () => nanoid() })
  token: string;

  @Field()
  @Column()
  sql: string;

  @Field({ nullable: true })
  @Column({ type: "timestamp", precision: 3, nullable: true })
  lastViewedAt: Date;

  @Field({ nullable: true })
  @Column({ type: "timestamp", precision: 3, nullable: true })
  latestResultAt: Date;

  @Field()
  @Column({ type: "timestamp", precision: 3 })
  lastEditAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Source, (source) => source.clips, {
    cascade: true,
  })
  source: Source;

  @Field(() => ID)
  @RelationId((clip: Clip) => clip.source)
  sourceId: Source["id"];

  @OneToMany(() => Result, (result) => result.clip)
  results: Result[];

  @OneToMany(
    () => VirtualSourceTable,
    (virtualSourceTable) => virtualSourceTable.clip
  )
  virtualSourceTables: VirtualSourceTable[];

  @OneToMany(() => Chart, (chart) => chart.clip)
  charts: Chart[];
}
