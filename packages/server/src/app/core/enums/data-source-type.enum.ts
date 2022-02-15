import { registerEnumType } from "@nestjs/graphql";

export enum DataSourceType {
  MYSQL = "MYSQL",
  POSTGRESQL = "POSTGRESQL",
}

registerEnumType(DataSourceType, { name: "DataSourceType" });
