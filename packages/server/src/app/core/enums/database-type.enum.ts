import { registerEnumType } from "@nestjs/graphql";

export enum DatabaseType {
  MYSQL = "MYSQL",
  POSTGRESQL = "POSTGRESQL",
}

registerEnumType(DatabaseType, { name: "DatabaseType" });
