import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimarySnowflakeColumn,
  RelationId,
  UpdateDateColumn,
} from "@nest-boot/database";
import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Clip } from "./clip.entity";
import { Source } from "./source.entity";

@ObjectType()
@Entity({ searchable: true })
export class VirtualSourceTable {
  @Field(() => ID)
  @PrimarySnowflakeColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  // @Field(() => [String])
  // @Column({ type: "json", default: [], generator: () => [] })
  // tags: string[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Source, (source) => source.tables, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  source: Source;

  @RelationId((table: VirtualSourceTable) => table.source)
  sourceId: Source["id"];

  @ManyToOne(() => Clip, (clip) => clip.virtualSourceTables)
  clip: Clip;

  @RelationId((table: VirtualSourceTable) => table.clip)
  clipId: Clip["id"];
}
