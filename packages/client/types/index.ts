import {
  FunnelChartConfig,
  MetricChartConfig,
  LineChartConfig,
  BarChartConfig,
} from "../components/ChartResultPreview/components";

export enum ChartType {
  FUNNEL = "FUNNEL",
  METRIC = "METRIC",
  LINE = "LINE",
  BAR = "BAR",
}

export type ChartConfig =
  | FunnelChartConfig
  | MetricChartConfig
  | LineChartConfig
  | BarChartConfig;

export interface ChartServerConfig {
  config?: ChartConfig;
  type: ChartType;
}
