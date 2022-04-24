import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import { QueryObserverOptions } from "react-query";
import {
  ResultFragment,
  useChartQuery,
  useClipQuery,
} from "../../../generated/graphql";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { ChartResultPreview } from "../../chart/ChartResultPreview";
import { Loading } from "../../common/Loading";

interface DashboardChartResultPreviewProps {
  chartId: string;
  // 下面两个属性只是因为要在 card title 上显示 clip 最后更新时间暂时加的
  setClipLastEditAtCollection?: Dispatch<SetStateAction<{}>>;
  clipLastEditAtCollection?: Record<string, string>;
  autoRefresh?: boolean;
}

export const DashboardChartResultPreview: FC<
  DashboardChartResultPreviewProps
> = ({
  chartId,
  setClipLastEditAtCollection,
  clipLastEditAtCollection,
  autoRefresh = true,
}) => {
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

  useClipQuery({
    variables: { id: data?.chart?.clipId },
    skip: !data?.chart?.clipId,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.clip?.lastEditAt) {
        setClipLastEditAtCollection({
          ...clipLastEditAtCollection,
          [chartId]: data?.clip?.lastEditAt,
        });
      }
    },
  });

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
