import { PC } from "../../../interfaces/PageComponent";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useChartLazyQuery,
  useDashboardQuery,
} from "../../../generated/graphql";
import { Layout } from "react-grid-layout";
import { Loading } from "../../../components/common/Loading";
import ProjectLayout from "../../../layouts/ProjectLayout";
import { Page } from "../../../components/common/Page";
import Head from "next/head";
import {
  DashboardLayout,
  DragDivider,
} from "../../../components/dashboard/DashboardLayout";

interface ChartCard {
  name: string;
  chartId: string;
  hiddenName: boolean;
  layout: Layout;
}

const DashboardPreview: PC = () => {
  const router = useRouter();

  const { dashboardId } = router.query as { dashboardId: string };

  const [getChart] = useChartLazyQuery();

  const { data, loading } = useDashboardQuery({
    variables: { id: dashboardId },
    skip: !dashboardId,
  });

  const [dragItems, setDragItems] = useState<Array<DragDivider | ChartCard>>(
    []
  );

  useEffect(() => {
    if (data?.dashboard?.config?.length) {
      setDragItems(data.dashboard.config);
    }
  }, [data?.dashboard?.config]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{data?.dashboard?.name} - 预览 - 仪表盘</title>
      </Head>

      <Page
        title={data?.dashboard?.name}
        primaryAction={{
          text: "编辑",
          onClick: () => {
            router.push(`/dashboards/${dashboardId}/edit`);
          },
        }}
      >
        <DashboardLayout
          type="preview"
          layout={dragItems.map((item) => ({
            ...item?.layout,
            static: true,
          }))}
          dragItems={dragItems}
          cardExtraConfig={{
            onEditChartClick: (item) => {
              router.push(`/charts/${item?.chartId}/edit`);
            },
            onPreviewClipClick: async (item) => {
              try {
                const { data } = await getChart({
                  variables: { id: item.chartId },
                });

                if (data?.chart?.clipId) {
                  router.push(`/clips/${data?.chart?.clipId}`);
                }
              } catch (err) {
                console.log("err", err);
              }
            },
            disabledDelete: true,
            disabledEditCard: true,
          }}
        />
      </Page>
    </>
  );
};

DashboardPreview.layout = ProjectLayout;

export default DashboardPreview;
