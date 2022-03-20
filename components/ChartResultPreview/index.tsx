import { FC, useMemo } from "react";

import { ResultFragment } from "../../generated/graphql";
import { ChartServerConfig, ChartType } from "../../types";
import {
  FunnelChartConfig,
  FunnelChartPreview,
} from "./components/FunnelChart";
import {
  MetricChartConfig,
  MetricChartPreview,
} from "./components/MetricChart";

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
      ].find((item) => item.type === type)?.component || <></>
    );
  }, [type, result, config]);
};
