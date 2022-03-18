import { registerEnumType } from "@nestjs/graphql";

export enum ChartType {
  FUNNEL = "FUNNEL",
  METRIC = "METRIC",
}

registerEnumType(ChartType, { name: "ChartType" });
