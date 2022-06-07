import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";
import { QueryObserverOptions } from "react-query";
import {
  ResultFragment,
  useChartQuery,
  useClipQuery,
} from "../../../generated/graphql";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { ChartResultPreview } from "../../chart/ChartResultPreview";
import { Loading } from "../../common/Loading";
import { ChartType } from "../../../types";
import { Typography } from "antd";
import { useUpdateEffect } from "react-use";
import moment from "moment";
import momentTz from "moment-timezone";

const { Text } = Typography;

interface DashboardChartResultPreviewProps {
  chartId: string;
  autoRefresh?: boolean;
  dashboardType?: "preview" | "edit";
  // 下面两个属性只是因为要在 card title 上显示 result 最后查询时间暂时加的
  setResultFinishedAtCollection?: Dispatch<SetStateAction<{}>>;
  resultFinishedAtCollectionRef?: MutableRefObject<any>;
  // 下面两个属性只是因为要在 card 操作菜单 上显示 clip 里 sql 语句暂时加的
  setClipSqlCollection?: Dispatch<SetStateAction<{}>>;
  clipSqlCollectionRef?: MutableRefObject<any>;
  snapshotTime?: moment.Moment;
}

export const DashboardChartResultPreview: FC<
  DashboardChartResultPreviewProps
> = ({
  chartId,
  setResultFinishedAtCollection,
  resultFinishedAtCollectionRef,
  setClipSqlCollection,
  clipSqlCollectionRef,
  dashboardType = "edit",
  autoRefresh = true,
  snapshotTime,
}) => {
  const {
    data,
    loading: chartLoading,
    error,
  } = useChartQuery({
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

  const {
    data: result,
    isLoading: resultLoading,
    refetch,
  } = useQueryResult(data?.chart?.clip?.id, {
    queryParams: { time: momentTz.tz(snapshotTime, "Asia/Shanghai").format() },
    ...refreshConfig,
  });

  const { data: clipData } = useClipQuery({
    variables: { id: data?.chart?.clip?.id },
    skip: !data?.chart?.clip?.id,
  });

  useUpdateEffect(() => {
    if (snapshotTime) {
      refetch();
    }
  }, [refetch, snapshotTime]);

  useEffect(() => {
    if (clipData?.clip?.sql) {
      clipSqlCollectionRef.current = {
        ...clipSqlCollectionRef.current,
        [chartId]: clipData?.clip?.sql,
      };

      setClipSqlCollection({
        ...clipSqlCollectionRef.current,
      });
    }
  }, [
    chartId,
    clipData?.clip?.sql,
    clipSqlCollectionRef,
    setClipSqlCollection,
  ]);

  useEffect(() => {
    if (result?.finishedAt) {
      resultFinishedAtCollectionRef.current = {
        ...resultFinishedAtCollectionRef.current,
        [chartId]: result?.finishedAt,
      };

      setResultFinishedAtCollection({
        ...resultFinishedAtCollectionRef.current,
      });
    }
  }, [
    chartId,
    result?.finishedAt,
    resultFinishedAtCollectionRef,
    setResultFinishedAtCollection,
  ]);

  if (chartLoading || resultLoading) {
    return <Loading width="100%" />;
  }

  return (
    <div
      onClick={() => {
        if (data?.chart?.type === ChartType.METRIC) {
          if (data?.chart?.config?.link && dashboardType === "preview") {
            window.open(data?.chart?.config?.link);
          }
        }
      }}
      style={{
        height: "inherit",
        cursor:
          data?.chart?.config?.link && dashboardType === "preview"
            ? "pointer"
            : undefined,
      }}
    >
      {error?.message ? (
        <Text type="danger" strong>
          {error?.message}
        </Text>
      ) : (
        <ChartResultPreview
          result={result}
          type={data?.chart?.type}
          config={data?.chart?.config}
        />
      )}
    </div>
  );
};
