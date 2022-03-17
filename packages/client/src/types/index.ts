import { FunnelChartConfig } from "../components/ChartResultPreview/components/FunnelChart";

export enum ChartType {
  FUNNEL = "FUNNEL",
}

export interface ChartConfig {
  type: ChartType;
}

export interface ChartServerConfig {
  config: FunnelChartConfig;
  type: ChartType;
}
