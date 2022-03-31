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
import { GraphQLJSONObject } from "graphql-type-json";
import { nanoid } from "nanoid";

import { ChartType } from "../enums/chart-type.enum";
import { Clip } from "./clip.entity";

@ObjectType()
@Entity({ searchable: true })
export class Chart {
  @Field(() => ID)
  @PrimarySnowflakeColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true, generator: () => nanoid() })
  token: string;

  @Field(() => ChartType)
  @Column()
  type: ChartType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  format: string;

  @Field(() => GraphQLJSONObject)
  @Column({ type: "json" })
  config: Record<string, any>;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Clip, (clip) => clip.charts, {
    cascade: true,
  })
  clip: Clip;

  @Field(() => ID)
  @RelationId((chart: Chart) => chart.clip)
  clipId: Clip["id"];
}
