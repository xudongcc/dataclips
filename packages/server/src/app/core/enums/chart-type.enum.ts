import { registerEnumType } from "@nestjs/graphql";

export enum ChartType {
  FUNNEL = "FUNNEL",
}

registerEnumType(ChartType, { name: "ChartType" });
