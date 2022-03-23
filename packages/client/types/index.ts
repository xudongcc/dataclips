import {
  FunnelChartConfig,
  MetricChartConfig,
  LineChartConfig,
  BarChartConfig,
  PieChartConfig,
} from "../components/ChartResultPreview/components";

export enum ChartType {
  FUNNEL = "FUNNEL",
  METRIC = "METRIC",
  LINE = "LINE",
  BAR = "BAR",
  PIE = "PIE",
}

export type ChartConfig =
  | FunnelChartConfig
  | MetricChartConfig
  | LineChartConfig
  | BarChartConfig
  | PieChartConfig
  | BarChartConfig;

export interface ChartServerConfig {
  config?: ChartConfig;
  type: ChartType;
}
