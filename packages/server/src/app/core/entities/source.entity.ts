import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimarySnowflakeColumn,
  UpdateDateColumn,
} from "@nest-boot/database";
import { Field, ID, ObjectType } from "@nestjs/graphql";

import { DatabaseType } from "../enums/database-type.enum";
import { SourceType } from "../enums/source-type.enum";
import { Clip } from "./clip.entity";
import { VirtualSourceTable } from "./virtual-source-table.entity";

@ObjectType()
@Entity({ searchable: true })
export class Source {
  @Field(() => ID)
  @PrimarySnowflakeColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: SourceType | DatabaseType;

  @Column({ nullable: true })
  host?: string;

  @Column({ type: "int", nullable: true })
  port?: number;

  @Column({ nullable: true })
  database?: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  sshEnabled: boolean;

  @Column({ nullable: true })
  sshHost?: string;

  @Column({ type: "int", nullable: true })
  sshPort?: number;

  @Column({ nullable: true })
  sshUsername?: string;

  @Column({ nullable: true })
  sshPassword?: string;

  @Column({ nullable: true })
  sshKey?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Clip, (clip) => clip.source)
  clips: Clip[];

  @OneToMany(() => VirtualSourceTable, (tables) => tables.source)
  tables: VirtualSourceTable[];
}
