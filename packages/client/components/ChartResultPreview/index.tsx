import { FC, useMemo } from "react";

import { ResultFragment } from "../../generated/graphql";
import { ChartServerConfig, ChartType } from "../../types";
import {
  FunnelChartConfig,
  FunnelChartPreview,
  MetricChartConfig,
  MetricChartPreview,
  IntervalChartConfig,
  IntervalChartPreview,
  LineChartConfig,
  LineChartPreview,
} from "./components";

interface ChartResultPreviewProps extends ChartServerConfig {
  result: ResultFragment;
}

export const ChartResultPreview: FC<ChartResultPreviewProps> = ({
  result,
  config,
  type,
}) => {
  return useMemo(() => {
    return (
      [
        {
          type: ChartType.FUNNEL,
          component: (
            <FunnelChartPreview
              config={config as FunnelChartConfig}
              result={result}
            />
          ),
        },
        {
          type: ChartType.METRIC,
          component: (
            <MetricChartPreview
              config={config as MetricChartConfig}
              result={result}
            />
          ),
        },
        {
          type: ChartType.LINE,
          component: (
            <LineChartPreview
              result={result}
              config={config as LineChartConfig}
            />
          ),
        },
        {
          type: ChartType.INTERVAL,
          component: (
            <IntervalChartPreview
              result={result}
              config={config as IntervalChartConfig}
            />
          ),
        },
      ].find((item) => item.type === type)?.component || <></>
    );
  }, [type, result, config]);
};
