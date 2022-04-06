import { registerEnumType } from "@nestjs/graphql";

export enum ChartType {
  FUNNEL = "FUNNEL",
  METRIC = "METRIC",
  LINE = "LINE",
  BAR = "BAR",
  PIE = "PIE",
  MD = "MD",
}

registerEnumType(ChartType, { name: "ChartType" });
