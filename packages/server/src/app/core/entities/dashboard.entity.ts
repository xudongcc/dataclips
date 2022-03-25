import {
  Column,
  CreateDateColumn,
  Entity,
  PrimarySnowflakeColumn,
  UpdateDateColumn,
} from "@nest-boot/database";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { nanoid } from "nanoid";

@ObjectType()
@Entity({ searchable: true })
export class Dashboard {
  @Field(() => ID)
  @PrimarySnowflakeColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true, generator: () => nanoid() })
  token: string;

  @Field(() => [GraphQLJSONObject])
  @Column({ type: "json", generator: () => [] })
  config: Record<string, any>[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
