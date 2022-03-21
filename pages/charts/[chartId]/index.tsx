import { useChartQuery } from "../../../generated/graphql";
import { useRouter } from "next/router";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { Loading } from "../../../components/Loading";
import { Box } from "@chakra-ui/react";
import { ChartResultPreview } from "../../../components/ChartResultPreview";
import { useCallback } from "react";
import { ChartType } from "../../../types";
import { FunnelChartConfig } from "../../../components/ChartResultPreview/components/FunnelChart";
import { MetricChartConfig } from "../../../components/ChartResultPreview/components/MetricChart";

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