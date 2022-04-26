import { ResultFragment, useChartQuery } from "../../../generated/graphql";
import { useRouter } from "next/router";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { Loading } from "../../../components/common/Loading";
import { Box } from "@chakra-ui/react";
import { ChartResultPreview } from "../../../components/chart/ChartResultPreview";
import { useCallback, useMemo, useState } from "react";
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
import ProjectLayout from "../../../layouts/ProjectLayout";
import Head from "next/head";
import { Card } from "../../../components/common/Card";
import { Switch } from "antd";
import { QueryObserverOptions } from "react-query";

const ChartPreview = () => {
  const router = useRouter();

  const { chartId } = router.query as { chartId: string };

  const { data, loading } = useChartQuery({
    variables: { id: chartId },
    skip: !chartId,
  });

  // 请求根据设定的间隔自动重新获取
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  const refreshConfig: QueryObserverOptions<ResultFragment> = useMemo(() => {
    if (!autoRefreshEnabled) {
      return {
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      };
    }

    return {};
  }, [autoRefreshEnabled]);

  const { data: result, isLoading } = useQueryResult(
    data?.chart?.clip?.id,
    refreshConfig
  );

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
        threshold: data.chart.config?.threshold || {},
      } as MetricChartConfig;
    }

    if (data?.chart.type === ChartType.LINE) {
      return {
        doubleAxesCol: data.chart.config?.doubleAxesCol || [],
        reverseOrder: !!data.chart.config?.reverseOrder,
        doubleAxes: !!data.chart.config?.doubleAxes,
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

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{data?.chart?.name} - 预览 - 图表</title>
      </Head>

      <Page
        title={data?.chart?.name}
        primaryAction={{
          text: "编辑",
          onClick: () => {
            router.push(`/charts/${chartId}/edit`);
          },
        }}
        extra={
          <Switch
            onChange={(checked) => {
              setAutoRefreshEnabled(checked);
            }}
            checked={autoRefreshEnabled}
            checkedChildren="自动刷新"
            unCheckedChildren="自动刷新"
          />
        }
      >
        {data?.chart.type && data?.chart.config && result && (
          <Box h="800px">
            <Card>
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
};

ChartPreview.layout = ProjectLayout;

export default ChartPreview;
