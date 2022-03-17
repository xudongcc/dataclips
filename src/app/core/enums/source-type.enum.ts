import { registerEnumType } from "@nestjs/graphql";

export enum SourceType {
  VIRTUAL = "VIRTUAL",
  MYSQL = "MYSQL",
  POSTGRESQL = "POSTGRESQL",
}

registerEnumType(SourceType, { name: "SourceType" });
