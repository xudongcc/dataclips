import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimarySnowflakeColumn,
  UpdateDateColumn,
} from "@nest-boot/database";
import { DataSourceType } from "../enums/data-source-type.enum";
import { mixinTenantId } from "@nest-boot/tenant";
import { DataClip } from "./data-clip.entity";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity({ searchable: true })
export class DataSource extends mixinTenantId(BaseEntity) {
  @Field(() => ID)
  @PrimarySnowflakeColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  type: DataSourceType;

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

  @OneToMany(() => DataClip, (dataClip) => dataClip.dataSource)
  dataClips: DataClip[];
}
