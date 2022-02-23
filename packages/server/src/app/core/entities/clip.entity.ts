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
import { Source } from "./source.entity";
import { Result } from "./result.entity";

@ObjectType()
@Entity({ searchable: true })
export class Clip {
  @Field(() => ID)
  @PrimarySnowflakeColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ generator: () => nanoid() })
  slug: string;

  @Field()
  @Column()
  sql: string;

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
}
