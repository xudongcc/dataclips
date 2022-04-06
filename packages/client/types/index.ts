import {
  FunnelChartConfig,
  MetricChartConfig,
  LineChartConfig,
  BarChartConfig,
  PieChartConfig,
  MarkdownConfig,
} from "../components/chart/ChartResultPreview/components";

export enum ChartType {
  FUNNEL = "FUNNEL",
  METRIC = "METRIC",
  LINE = "LINE",
  BAR = "BAR",
  PIE = "PIE",
  MD = "MD",
}

export type ChartConfig =
  | FunnelChartConfig
  | MetricChartConfig
  | LineChartConfig
  | BarChartConfig
  | PieChartConfig
  | BarChartConfig
  | MarkdownConfig;

export interface ChartServerConfig {
  config?: ChartConfig;
  type: ChartType;
}
