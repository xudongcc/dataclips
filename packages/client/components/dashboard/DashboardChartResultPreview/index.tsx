import { FC, useMemo } from "react";
import { QueryObserverOptions } from "react-query";
import { ResultFragment, useChartQuery } from "../../../generated/graphql";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { ChartResultPreview } from "../../chart/ChartResultPreview";
import { Loading } from "../../common/Loading";

interface DashboardChartResultPreviewProps {
  chartId: string;
  autoRefresh?: boolean;
}

export const DashboardChartResultPreview: FC<
  DashboardChartResultPreviewProps
> = ({ chartId, autoRefresh = true }) => {
  const { data, loading: chartLoading } = useChartQuery({
    variables: { id: chartId },
  });

  const refreshConfig: QueryObserverOptions<ResultFragment> = useMemo(() => {
    if (!autoRefresh) {
      return {
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      };
    }

    return {};
  }, [autoRefresh]);

  const { data: result, isLoading: resultLoading } = useQueryResult(
    data?.chart?.clipId,
    refreshConfig
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
