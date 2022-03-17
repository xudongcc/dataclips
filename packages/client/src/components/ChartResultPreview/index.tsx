import { FC } from "react";

import { ResultFragment } from "../../generated/graphql";
import { ChartServerConfig, ChartType } from "../../types";
import { FunnelChartPreview } from "./components/FunnelChart";

interface ChartResultPreviewProps extends ChartServerConfig {
  result: ResultFragment;
}

export const ChartResultPreview: FC<ChartResultPreviewProps> = ({
  result,
  config,
  type,
}) => {
  return (
    [
      {
        type: ChartType.FUNNEL,
        component: <FunnelChartPreview config={config} result={result} />,
      },
    ].find((item) => item.type === type)?.component || <></>
  );
};
