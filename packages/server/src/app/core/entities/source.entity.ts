import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimarySnowflakeColumn,
  UpdateDateColumn,
} from "@nest-boot/database";
import { SourceType } from "../enums/source-type.enum";
import { Clip } from "./clip.entity";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity({ searchable: true })
export class Source {
  @Field(() => ID)
  @PrimarySnowflakeColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  type: SourceType;

  @Field()
  @Column()
  host: string;

  @Field()
  @Column({ type: "int" })
  port: number;

  @Field()
  @Column()
  database: string;

  @Field()
  @Column()
  username: string;

  @Column()
  password: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Clip, (clip) => clip.source)
  clips: Clip[];
}
