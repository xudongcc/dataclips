import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimarySnowflakeColumn,
  UpdateDateColumn,
} from "@nest-boot/database";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
@Entity({ searchable: true })
export class Project extends BaseEntity {
  @Field(() => ID)
  @PrimarySnowflakeColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
