import { PC } from "../../../interfaces/PageComponent";
import { AdminLayout } from "../../../layouts/AdminLayout/AdminLayout";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDashboardQuery } from "../../../generated/graphql";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import {
  Box,
  Button,
  Text,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useToken,
} from "@chakra-ui/react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { DashboardItem } from "../../../components/DashboardItem";
import { DashboardChartResultPreview } from "../../../components/DashboardChartResultPreview";
import { Loading } from "../../../components/Loading";
import PreviewLayout from "../../../layouts/PreviewLayout";
import ProjectLayout from "../../../layouts/ProjectLayout";
import { useSession } from "next-auth/react";
import { Page } from "../../../components/Page";
import { DashboardCard } from "../../../components/DashboardCard";
import Head from "next/head";

const ResponsiveGridLayout = WidthProvider(GridLayout);

interface ChartCard {
  name: string;
  chartId: string;
  hiddenName: boolean;
  layout: Layout;
}

const DashboardPreview: PC = () => {
  const router = useRouter();
  const session = useSession();
  const popoverRef = useRef();
  const [borderRadius] = useToken("radii", ["lg"]);

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
          <Box
            sx={{
              ".react-grid-item.react-grid-placeholder": {
                background: "rgba(1,1,1,0.2) !important",
                borderRadius,
              },
            }}
          >
            <ResponsiveGridLayout
              className="layout"
              cols={12}
              width={1200}
              layout={chartCards.map((item) => ({
                ...item?.layout,
                static: true,
              }))}
            >
              {chartCards.map((item) => {
                return (
                  <DashboardItem key={item?.layout?.i}>
                    <DashboardCard
                      h="full"
                      title={!item?.hiddenName && item?.name}
                      extra={
                        <Popover
                          initialFocusRef={popoverRef}
                          placement="bottom-end"
                        >
                          {() => (
                            <>
                              <PopoverTrigger>
                                <Text cursor="pointer" fontWeight="bold">
                                  ⋮
                                </Text>
                              </PopoverTrigger>

                              <PopoverContent w="100%">
                                <PopoverBody d="flex" flexDir="column">
                                  <Button
                                    variant="ghost"
                                    isDisabled={!item?.chartId}
                                    onClick={() => {
                                      router.push(
                                        `/charts/${item?.chartId}/edit`
                                      );
                                    }}
                                  >
                                    编辑图表
                                  </Button>
                                </PopoverBody>
                              </PopoverContent>
                            </>
                          )}
                        </Popover>
                      }
                    >
                      <DashboardChartResultPreview chartId={item?.chartId} />
                    </DashboardCard>
                  </DashboardItem>
                );
              })}
            </ResponsiveGridLayout>
          </Box>
        </Page>
      </>
    );
  }, [
    borderRadius,
    chartCards,
    dashboardId,
    data?.dashboard?.name,
    loading,
    router,
  ]);

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
