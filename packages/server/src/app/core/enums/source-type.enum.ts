import { registerEnumType } from "@nestjs/graphql";

export enum SourceType {
  MYSQL = "MYSQL",
  POSTGRESQL = "POSTGRESQL",
}

registerEnumType(SourceType, { name: "SourceType" });
