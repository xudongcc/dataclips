import { Box } from "@chakra-ui/react";
import { FC, useMemo } from "react";

import { ResultFragment } from "../../generated/graphql";
import { ChartServerConfig, ChartType } from "../../types";
import {
  FunnelChartConfig,
  FunnelChartPreview,
  MetricChartConfig,
  MetricChartPreview,
  BarChartConfig,
  BarChartPreview,
  LineChartConfig,
  LineChartPreview,
  PieChartPreview,
  PieChartConfig,
} from "./components";

interface ChartResultPreviewProps extends ChartServerConfig {
  result: ResultFragment;
}

export const ChartResultPreview: FC<ChartResultPreviewProps> = ({
  result,
  config,
  type,
}) => {
  return (
    <Box h="full">
      {useMemo(() => {
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
              type: ChartType.BAR,
              component: (
                <BarChartPreview
                  result={result}
                  config={config as BarChartConfig}
                />
              ),
            },
            {
              type: ChartType.PIE,
              component: (
                <PieChartPreview
                  result={result}
                  config={config as PieChartConfig}
                />
              ),
            },
          ].find((item) => item.type === type)?.component || <></>
        );
      }, [type, result, config])}
    </Box>
  );
};
