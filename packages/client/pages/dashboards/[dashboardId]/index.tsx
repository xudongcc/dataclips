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
import { DashboardChartResultPreview } from "../../../components/DashboardChartResultPreview";

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

  const { dashboardId } = router.query as { dashboardId: string };

  const { data, loading } = useDashboardQuery({
    variables: { id: dashboardId },
    skip: !dashboardId,
  });

  const [getChart] = useChartLazyQuery();

  const [getQueryResult] = useLazyQueryResult();

  const [chartCards, setChartCards] = useState<ChartCard[]>([]);

  useEffect(() => {
    if (data?.dashboard?.config?.length) {
      setChartCards(data.dashboard.config);
    }
  }, [data?.dashboard?.config]);

  if (loading) {
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
                <DashboardChartResultPreview chartId={item?.chartId} />
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
