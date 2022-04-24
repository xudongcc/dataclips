import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { FC, ReactNode } from "react";
import { DashboardDragWrapper } from "../DashboardDragWrapper";

import { DashboardCard } from "../DashboardCard";
import { Box, useToken } from "@chakra-ui/react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { DashboardChartResultPreview } from "../DashboardChartResultPreview";
import { DashboardDivider } from "../DashboardDivider";
import { Markdown } from "../../chart/ChartResultPreview/components";
import { Dropdown, Menu } from "antd";

const ResponsiveGridLayout = WidthProvider(GridLayout);

export enum DashboardItemType {
  CHART = "chart",
  DIVIDER = "divider",
  MARKDOWN = "markdown",
}

export interface DashboardItem {
  id: string;
  name?: string;
  hiddenName?: boolean;
  position: Layout;
  type: DashboardItemType;
}

export interface DashboardChartItem extends DashboardItem {
  chart: {
    id: string;
  };
}

export interface DashboardDividerItem extends DashboardItem {
  divider: {
    orientation?: "left" | "center" | "right";
    name?: string;
  };
}

export interface DashboardMarkdownItem extends DashboardItem {
  markdown: {
    content?: string;
  };
}
interface DashboardLayoutProps extends GridLayout.ReactGridLayoutProps {
  type: "preview" | "edit";
  autoRefresh?: boolean;
  dragItems: Array<
    DashboardChartItem | DashboardDividerItem | DashboardMarkdownItem
  >;
  extraConfig?: {
    extra?: ReactNode;
    disabledExtra?: boolean;
    chart?: {
      disabledEditChart?: boolean;
      disabledEditCard?: boolean;
      disabledDelete?: boolean;
      disabledPreviewClip?: boolean;
      onEditCardClick?: (chart: DashboardChartItem) => void;
      onEditChartClick?: (chart: DashboardChartItem) => void;
      onPreviewClipClick?: (chart: DashboardChartItem) => void;
      onDeleteClick?: (chartId: string) => void;
    };
    divider?: {
      onDividerDelete?: (dividerId: string) => void;
    };
    markdown?: {
      disabledEditBlock?: boolean;
      disabledDelete?: boolean;
      onEditBlockClick?: (markdown: DashboardMarkdownItem) => void;
      onDeleteClick?: (markdownId: string) => void;
    };
  };
}

export const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  const { dragItems = [], type, extraConfig, autoRefresh, ...rest } = props;
  const [borderRadius] = useToken("radii", ["lg"]);

  return (
    <Box
      sx={{
        ".react-grid-item.react-grid-placeholder": {
          background: "rgba(0,0,0,0.2) !important",
          borderRadius,
        },
        ".react-grid-item:hover": {
          zIndex: 10,
        },
      }}
    >
      <ResponsiveGridLayout
        draggableHandle=".drag-item"
        className="layout"
        margin={[12, 12]}
        rowHeight={50}
        cols={24}
        containerPadding={[0, 0]}
        width={1200}
        {...rest}
      >
        {dragItems.map((item) => {
          if (item.type === DashboardItemType.CHART) {
            return (
              <DashboardDragWrapper key={item?.position?.i}>
                <DashboardCard
                  title={!item?.hiddenName && item?.name}
                  extra={
                    extraConfig?.extra ? (
                      extraConfig?.extra
                    ) : !extraConfig?.disabledExtra ? (
                      <Dropdown
                        trigger={["click"]}
                        placement="bottomRight"
                        overlay={
                          <Menu>
                            <Menu.Item
                              disabled={extraConfig?.chart?.disabledEditCard}
                              onClick={() => {
                                extraConfig?.chart?.onEditCardClick?.(
                                  item as DashboardChartItem
                                );
                              }}
                            >
                              编辑块
                            </Menu.Item>
                            <Menu.Item
                              disabled={
                                !(item as DashboardChartItem)?.chart?.id ||
                                extraConfig?.chart?.disabledEditChart
                              }
                              onClick={() => {
                                extraConfig?.chart?.onEditChartClick?.(
                                  item as DashboardChartItem
                                );
                              }}
                            >
                              编辑图表
                            </Menu.Item>
                            <Menu.Item
                              disabled={
                                !(item as DashboardChartItem)?.chart?.id ||
                                extraConfig?.chart?.disabledPreviewClip
                              }
                              onClick={() => {
                                extraConfig?.chart?.onPreviewClipClick?.(
                                  item as DashboardChartItem
                                );
                              }}
                            >
                              预览数据集
                            </Menu.Item>
                            <Menu.Item
                              disabled={extraConfig?.chart?.disabledDelete}
                              onClick={() => {
                                extraConfig?.chart?.onDeleteClick?.(
                                  (item as DashboardChartItem).id
                                );
                              }}
                              danger
                            >
                              删除
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        <div style={{ cursor: "pointer", fontWeight: "bold" }}>
                          ⋮
                        </div>
                      </Dropdown>
                    ) : undefined
                  }
                >
                  <DashboardChartResultPreview
                    autoRefresh={autoRefresh}
                    chartId={(item as DashboardChartItem)?.chart?.id}
                  />
                </DashboardCard>
              </DashboardDragWrapper>
            );
          }

          if (item.type === DashboardItemType.DIVIDER) {
            return (
              <DashboardDragWrapper key={item.position.i}>
                <Box pr={type === "edit" ? "20px" : undefined}>
                  <DashboardDivider
                    orientation={
                      (item as DashboardDividerItem).divider?.orientation
                    }
                    hasDelete={type === "edit"}
                    onDelete={() => {
                      extraConfig?.divider?.onDividerDelete?.(item.id);
                    }}
                  >
                    {(item as DashboardDividerItem)?.divider?.name}
                  </DashboardDivider>
                </Box>
              </DashboardDragWrapper>
            );
          }

          if (item.type === DashboardItemType.MARKDOWN) {
            return (
              <DashboardDragWrapper key={item?.position?.i}>
                <DashboardCard
                  title={!item?.hiddenName && item?.name}
                  extra={
                    extraConfig?.extra ? (
                      extraConfig?.extra
                    ) : !extraConfig?.disabledExtra ? (
                      <Dropdown
                        trigger={["click"]}
                        placement="bottomRight"
                        overlay={
                          <Menu>
                            <Menu.Item
                              disabled={
                                extraConfig?.markdown?.disabledEditBlock
                              }
                              onClick={() => {
                                extraConfig?.markdown?.onEditBlockClick?.(
                                  item as DashboardMarkdownItem
                                );
                              }}
                            >
                              编辑块
                            </Menu.Item>
                            <Menu.Item
                              disabled={extraConfig?.markdown?.disabledDelete}
                              onClick={() => {
                                extraConfig?.markdown?.onDeleteClick?.(item.id);
                              }}
                              danger
                            >
                              删除
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        <div style={{ cursor: "pointer", fontWeight: "bold" }}>
                          ⋮
                        </div>
                      </Dropdown>
                    ) : undefined
                  }
                >
                  <Markdown
                    content={(item as DashboardMarkdownItem).markdown?.content}
                  />
                </DashboardCard>
              </DashboardDragWrapper>
            );
          }
        })}
      </ResponsiveGridLayout>
    </Box>
  );
};
