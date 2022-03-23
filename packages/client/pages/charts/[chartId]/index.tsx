import { useChartQuery } from "../../../generated/graphql";
import { useRouter } from "next/router";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { Loading } from "../../../components/Loading";
import { Box } from "@chakra-ui/react";
import { ChartResultPreview } from "../../../components/ChartResultPreview";
import { useCallback } from "react";
import { ChartType } from "../../../types";
import {
  LineChartConfig,
  MetricChartConfig,
  FunnelChartConfig,
  BarChartConfig,
  PieChartConfig,
} from "../../../components/ChartResultPreview/components/";

const ChartPreview = () => {
  const router = useRouter();

  const { chartId } = router.query as { chartId: string };

  const { data, loading } = useChartQuery({
    variables: { id: chartId },
    skip: !chartId,
  });

  const { data: result, isLoading } = useQueryResult(data?.chart.clipId);

  const getChartTypePreviewConfig = useCallback(() => {
    if (data?.chart.type === ChartType.FUNNEL) {
      return {
        groupCol: data.chart.config.groupCol,
        valueCol: data.chart.config.valueCol,
      } as FunnelChartConfig;
    }

    if (data?.chart.type === ChartType.METRIC) {
      return {
        valueCol: data.chart.config.valueCol || "",
        compareCol: data.chart.config.compareCol || "",
      } as MetricChartConfig;
    }

    if (data?.chart.type === ChartType.LINE) {
      return {
        xCol: data.chart.config?.xCol || "",
        yCol: data.chart.config?.yCol || [],
      } as LineChartConfig;
    }

    if (data?.chart.type === ChartType.BAR) {
      return {
        variant: data.chart.config?.variant || "",
        xCol: data.chart.config?.xCol || "",
        yCol: data.chart.config?.yCol || [],
      } as BarChartConfig;
    }

    if (data?.chart.type === ChartType.PIE) {
      return {
        variant: data.chart.config?.variant || "",
        key: data.chart.config?.key || "",
        value: data.chart.config?.value || "",
      } as PieChartConfig;
    }

    return undefined;
  }, [data]);

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <>
      {data?.chart.type && data?.chart.config && result && (
        <Box h="100vh">
          <ChartResultPreview
            type={data.chart.type}
            config={getChartTypePreviewConfig()}
            result={result}
          />
        </Box>
      )}
    </>
  );
};

export default ChartPreview;
