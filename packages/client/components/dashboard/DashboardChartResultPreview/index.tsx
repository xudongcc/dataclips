import { FC } from "react";
import { useChartQuery } from "../../../generated/graphql";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { ChartResultPreview } from "../../chart/ChartResultPreview";
import { Loading } from "../../common/Loading";

interface DashboardChartResultPreviewProps {
  chartId: string;
}

export const DashboardChartResultPreview: FC<
  DashboardChartResultPreviewProps
> = ({ chartId }) => {
  const { data, loading: chartLoading } = useChartQuery({
    variables: { id: chartId },
  });

  const { data: result, isLoading: resultLoading } = useQueryResult(
    data?.chart?.clipId
  );

  if (chartLoading || resultLoading) {
    return <Loading width="100%" />;
  }

  return (
    <ChartResultPreview
      result={result}
      type={data?.chart?.type}
      config={data?.chart?.config}
    />
  );
};
