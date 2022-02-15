import { createConnection } from "@nest-boot/graphql";
import { ObjectType } from "@nestjs/graphql";

import { DataSource } from "../../core/entities/data-source.entity";

@ObjectType()
export class DataSourceConnection extends createConnection(DataSource) {}
