import { useChartQuery } from "../../../generated/graphql";
import { useRouter } from "next/router";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { Loading } from "../../../components/common/Loading";
import { Box } from "@chakra-ui/react";
import { ChartResultPreview } from "../../../components/chart/ChartResultPreview";
import { useCallback, useMemo } from "react";
import { ChartType } from "../../../types";
import {
  LineChartConfig,
  MetricChartConfig,
  FunnelChartConfig,
  BarChartConfig,
  PieChartConfig,
  MarkdownConfig,
} from "../../../components/chart/ChartResultPreview/components";
import { Page } from "../../../components/common/Page";
import PreviewLayout from "../../../layouts/PreviewLayout";
import ProjectLayout from "../../../layouts/ProjectLayout";
import { useSession } from "next-auth/react";
import { Card } from "../../../components/common/Card";
import Head from "next/head";

const ChartPreview = () => {
  const router = useRouter();
  const session = useSession();

  const { chartId } = router.query as { chartId: string };

  const { data, loading } = useChartQuery({
    variables: { id: chartId },
    skip: !chartId,
  });

  const { data: result, isLoading } = useQueryResult(data?.chart.clipId);

  const getChartTypePreviewConfig = useCallback(() => {
    if (data?.chart.type === ChartType.FUNNEL) {
      return {
        format: data.chart.config?.format || "",
        groupCol: data.chart.config?.groupCol || "",
        valueCol: data.chart.config?.valueCol || "",
      } as FunnelChartConfig;
    }

    if (data?.chart.type === ChartType.METRIC) {
      return {
        format: data.chart.config?.format || "",
        valueCol: data.chart.config?.valueCol || "",
        compareCol: data.chart.config?.compareCol || "",
      } as MetricChartConfig;
    }

    if (data?.chart.type === ChartType.LINE) {
      return {
        reverseOrder: !!data.chart.config?.reverseOrder,
        format: data.chart.config?.format || "",
        xCol: data.chart.config?.xCol || "",
        yCol: data.chart.config?.yCol || [],
      } as LineChartConfig;
    }

    if (data?.chart.type === ChartType.BAR) {
      return {
        reverseOrder: !!data.chart.config?.reverseOrder,
        format: data.chart.config?.format || "",
        isStack: !!data.chart.config?.isStack,
        variant: data.chart.config?.variant || "",
        xCol: data.chart.config?.xCol || "",
        yCol: data.chart.config?.yCol || [],
      } as BarChartConfig;
    }

    if (data?.chart.type === ChartType.PIE) {
      return {
        format: data.chart.config?.format || "",
        variant: data.chart.config?.variant || "",
        key: data.chart.config?.key || "",
        value: data.chart.config?.value || "",
      } as PieChartConfig;
    }

    if (data?.chart.type === ChartType.MD) {
      return {
        content: data.chart.config?.content || "",
      } as MarkdownConfig;
    }

    return undefined;
  }, [data]);

  const content = useMemo(() => {
    if (isLoading || loading) {
      return <Loading />;
    }

    return (
      <>
        <Head>
          <title>{result?.name} - 预览 - 图表</title>
        </Head>

        <Page
          title={result?.name}
          primaryAction={{
            text: "编辑",
            onClick: () => {
              router.push(`/charts/${chartId}/edit`);
            },
          }}
        >
          {data?.chart.type && data?.chart.config && result && (
            <Box h="800px">
              <Card overflow="hidden" h="full">
                <ChartResultPreview
                  type={data.chart.type}
                  config={getChartTypePreviewConfig()}
                  result={result}
                />
              </Card>
            </Box>
          )}
        </Page>
      </>
    );
  }, [
    chartId,
    data,
    getChartTypePreviewConfig,
    isLoading,
    loading,
    result,
    router,
  ]);

  if (session.status === "authenticated") {
    return <ProjectLayout>{content}</ProjectLayout>;
  }

  return <PreviewLayout>{content}</PreviewLayout>;
};

export default ChartPreview;
