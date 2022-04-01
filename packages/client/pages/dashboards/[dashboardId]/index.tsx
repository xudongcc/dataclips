import { PC } from "../../../interfaces/PageComponent";
import { AdminLayout } from "../../../layouts/AdminLayout/AdminLayout";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useDashboardQuery } from "../../../generated/graphql";
import { Layout } from "react-grid-layout";
import { Loading } from "../../../components/common/Loading";
import PreviewLayout from "../../../layouts/PreviewLayout";
import ProjectLayout from "../../../layouts/ProjectLayout";
import { useSession } from "next-auth/react";
import { Page } from "../../../components/common/Page";
import Head from "next/head";
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout";

interface ChartCard {
  name: string;
  chartId: string;
  hiddenName: boolean;
  layout: Layout;
}

const DashboardPreview: PC = () => {
  const router = useRouter();
  const session = useSession();

  const { dashboardId } = router.query as { dashboardId: string };

  const { data, loading } = useDashboardQuery({
    variables: { id: dashboardId },
    skip: !dashboardId,
  });

  const [chartCards, setChartCards] = useState<ChartCard[]>([]);

  const content = useMemo(() => {
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
            layout={chartCards.map((item) => ({
              ...item?.layout,
              static: true,
            }))}
            charts={chartCards}
            cardExtraConfig={{
              onEditChartClick: (item) => {
                router.push(`/charts/${item?.chartId}/edit`);
              },
              disabledDelete: true,
              disabledEditCard: true,
            }}
          />
        </Page>
      </>
    );
  }, [chartCards, dashboardId, data?.dashboard?.name, loading, router]);

  useEffect(() => {
    if (data?.dashboard?.config?.length) {
      setChartCards(data.dashboard.config);
    }
  }, [data?.dashboard?.config]);

  if (session.status === "authenticated") {
    return <ProjectLayout>{content}</ProjectLayout>;
  }

  return <PreviewLayout>{content}</PreviewLayout>;
};

DashboardPreview.layout = AdminLayout;

export default DashboardPreview;
