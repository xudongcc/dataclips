import { PC } from "../../../interfaces/PageComponent";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useChartLazyQuery,
  useDashboardQuery,
} from "../../../generated/graphql";
import { Loading } from "../../../components/common/Loading";
import ProjectLayout from "../../../layouts/ProjectLayout";
import { Page } from "../../../components/common/Page";
import Head from "next/head";
import {
  DashboardLayout,
  DashboardChartItem,
  DashboardDividerItem,
  DashboardMarkdownItem,
} from "../../../components/dashboard/DashboardLayout";
import { Switch } from "antd";

const DashboardPreview: PC = () => {
  const router = useRouter();

  const { dashboardId } = router.query as { dashboardId: string };

  const [getChart] = useChartLazyQuery();

  const { data, loading } = useDashboardQuery({
    variables: { id: dashboardId },
    skip: !dashboardId,
  });

  // 请求根据设定的间隔自动重新获取
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  const [dragItems, setDragItems] = useState<
    Array<DashboardDividerItem | DashboardChartItem | DashboardMarkdownItem>
  >([]);

  useEffect(() => {
    if (data?.dashboard?.config?.blocks?.length) {
      // 添加 position 的 i，返回的数据没有
      const blocks = data.dashboard.config.blocks.map((item) => ({
        ...item,
        position: {
          ...item?.position,
          i: item.id,
        },
      }));
      setDragItems(blocks);
    }
  }, [data?.dashboard?.config?.blocks]);

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
        <DashboardLayout
          type="preview"
          autoRefresh={autoRefreshEnabled}
          layout={dragItems.map((item) => ({
            ...item?.position,
            static: true,
          }))}
          dragItems={dragItems}
          extraConfig={{
            chart: {
              onEditChartClick: (item) => {
                router.push(`/charts/${item?.chart?.id}/edit`);
              },
              onPreviewClipClick: async (item) => {
                try {
                  const { data } = await getChart({
                    variables: { id: item.chart?.id },
                  });

                  if (data?.chart?.clip?.id) {
                    router.push(`/clips/${data?.chart?.clip?.id}`);
                  }
                } catch (err) {
                  console.log("err", err);
                }
              },
              disabledDelete: true,
              disabledEditCard: true,
            },
            markdown: {
              disabledDelete: true,
              disabledEditBlock: true,
            },
            embed: {
              disabledDelete: true,
              disabledEditBlock: true,
            },
          }}
        />
      </Page>
    </>
  );
};

DashboardPreview.layout = ProjectLayout;

export default DashboardPreview;
