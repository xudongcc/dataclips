import { FunnelChartConfig } from "../components/ChartResultPreview/components/FunnelChart";
import { MetricChartConfig } from "../components/ChartResultPreview/components/MetricChart";

export enum ChartType {
  FUNNEL = "FUNNEL",
  METRIC = "METRIC",
}

export type ChartConfig = FunnelChartConfig | MetricChartConfig;

export interface ChartServerConfig {
  config?: ChartConfig;
  type: ChartType;
}
