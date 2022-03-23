import { registerEnumType } from "@nestjs/graphql";

export enum ChartType {
  FUNNEL = "FUNNEL",
  METRIC = "METRIC",
  LINE = "LINE",
  BAR = "BAR",
}

registerEnumType(ChartType, { name: "ChartType" });
