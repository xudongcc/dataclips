import { PC } from "../../../interfaces/PageComponent";
import { AdminLayout } from "../../../layouts/AdminLayout/AdminLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Chart,
  useChartLazyQuery,
  useDashboardQuery,
} from "../../../generated/graphql";
import { useLazyQueryResult } from "../../../hooks/useLazyQueryResult";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { compact } from "lodash";
import { Card } from "../../../components/Card/Card";
import { ChartResultPreview } from "../../../components/ChartResultPreview";
import { Loading } from "../../../components/Loading";
import { Box } from "@chakra-ui/react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { DashboardItem } from "../../../components/DashboardItem";

const ResponsiveGridLayout = WidthProvider(GridLayout);

interface ChartCard {
  name: string;
  chartId: string;
  data: {
    chart: Chart;
    result: any;
  };
  layout: Layout;
}

const DashboardPreview: PC = () => {
  const router = useRouter();

  // 初始仪表盘中所有图表是否请求完成
  const [initialRequestIsDone, setInitialRequestIsDone] = useState(false);

  const { dashboardId } = router.query as { dashboardId: string };

  const { data } = useDashboardQuery({
    variables: { id: dashboardId },
    skip: !dashboardId,
    onCompleted: (data) => {
      if (!data?.dashboard?.config?.length) {
        setInitialRequestIsDone(true);
      }
    },
  });

  const [getChart] = useChartLazyQuery();

  const [getQueryResult] = useLazyQueryResult();

  const [chartCards, setChartCards] = useState<ChartCard[]>([]);

  // 初始化时，请求所有图表资源
  useEffect(() => {
    if (data?.dashboard?.config?.length) {
      if (!initialRequestIsDone) {
        Promise.allSettled(
          data.dashboard.config.map(async (item) => {
            if (item?.chartId) {
              const { data } = await getChart({
                variables: { id: item.chartId },
              });

              if (data?.chart.clipId) {
                const result: any = await getQueryResult(data.chart.clipId);

                if (result?.fields && result?.values && !result?.error) {
                  return {
                    name: item.name,
                    chartId: item.chartId,
                    data: {
                      result: result,
                      chart: data?.chart,
                    },
                    layout: item.layout,
                  };
                }
              }
            }
          })
        )
          .then((res) => {
            const successRes = res
              .filter((p) => p.status === "fulfilled")
              .map((item: any) => item.value);

            if (compact(successRes).length) {
              setChartCards(successRes);
            }
          })
          .catch((err) => {
            console.log("err", err);
          })
          .finally(() => {
            setInitialRequestIsDone(true);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!initialRequestIsDone) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        ".react-grid-item.react-grid-placeholder": {
          background: "rgba(1,1,1,0.2) !important",
        },
      }}
    >
      <ResponsiveGridLayout
        className="layout"
        cols={12}
        width={1200}
        layout={chartCards.map((item) => item?.layout)}
      >
        {chartCards.map((item) => {
          return (
            <DashboardItem key={item?.layout?.i}>
              <Card h="full" title={item?.name}>
                <ChartResultPreview
                  result={item?.data?.result}
                  type={item?.data?.chart?.type}
                  config={item?.data?.chart?.config}
                />
              </Card>
            </DashboardItem>
          );
        })}
      </ResponsiveGridLayout>
    </Box>
  );
};

DashboardPreview.layout = AdminLayout;

export default DashboardPreview;
