import { registerEnumType } from "@nestjs/graphql";

export enum ChartType {
  FUNNEL = "FUNNEL",
  METRIC = "METRIC",
  LINE = "LINE",
  INTERVAL = "INTERVAL",
}

registerEnumType(ChartType, { name: "ChartType" });
