import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimarySnowflakeColumn,
  RelationId,
  UpdateDateColumn,
} from "@nest-boot/database";
import { mixinTenantId } from "@nest-boot/tenant";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { DataSource } from "./data-source.entity";
import { randomUUID } from "crypto";
import { GraphQLJSONObject } from "graphql-type-json";

@ObjectType()
@Entity({ searchable: true })
export class DataClip extends mixinTenantId(BaseEntity) {
  @Field(() => ID)
  @PrimarySnowflakeColumn()
  id: string;

  @Field()
  @Column({ generator: () => randomUUID() })
  uuid: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  sql: string;

  @Field(() => [GraphQLJSONObject])
  @Column({ type: "json", nullable: true })
  result: Record<string, string | number | boolean>[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => DataSource, (dataSource) => dataSource.dataClips, {
    cascade: true,
  })
  dataSource: DataSource;

  @RelationId((dataClip: DataClip) => dataClip.dataSource)
  dataSourceId: DataSource["id"];
}
