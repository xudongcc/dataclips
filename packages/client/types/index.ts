import {
  FunnelChartConfig,
  MetricChartConfig,
  LineChartConfig,
  IntervalChartConfig,
} from "../components/ChartResultPreview/components";

export enum ChartType {
  FUNNEL = "FUNNEL",
  METRIC = "METRIC",
  LINE = "LINE",
  INTERVAL = "INTERVAL",
}

export type ChartConfig =
  | FunnelChartConfig
  | MetricChartConfig
  | LineChartConfig
  | IntervalChartConfig;

export interface ChartServerConfig {
  config?: ChartConfig;
  type: ChartType;
}
