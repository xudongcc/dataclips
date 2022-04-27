import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { FC, ReactNode, useState, useRef } from "react";
import { DashboardDragWrapper } from "../DashboardDragWrapper";
import TimeAgo from "javascript-time-ago";
import zh from "javascript-time-ago/locale/zh.json";
import { DashboardCard } from "../DashboardCard";
import { Box, useToken } from "@chakra-ui/react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { DashboardChartResultPreview } from "../DashboardChartResultPreview";
import { DashboardDivider } from "../DashboardDivider";
import { Markdown } from "../../chart/ChartResultPreview/components";
import { Dropdown, Menu, Drawer } from "antd";
import Embed from "react-embed";

import Editor, { loader } from "@monaco-editor/react";

loader.config({
  paths: { vs: "/editor" },
});

const ResponsiveGridLayout = WidthProvider(GridLayout);

TimeAgo.addLocale(zh);
const timeAgo = new TimeAgo("zh-cn");

export enum DashboardItemType {
  CHART = "chart",
  DIVIDER = "divider",
  MARKDOWN = "markdown",
  EMBED = "embed",
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

export interface DashboardEmbedItem extends DashboardItem {
  embed: {
    url?: string;
  };
}
interface DashboardLayoutProps extends GridLayout.ReactGridLayoutProps {
  type: "preview" | "edit";
  autoRefresh?: boolean;
  dragItems: Array<
    | DashboardChartItem
    | DashboardDividerItem
    | DashboardMarkdownItem
    | DashboardEmbedItem
  >;
  extraConfig?: {
    extra?: ReactNode;
    disabledExtra?: boolean;
    chart?: {
      disabledEditChart?: boolean;
      disabledEditCard?: boolean;
      disabledDelete?: boolean;
      disabledPreviewClip?: boolean;
      disabledPreviewClipSql?: boolean;
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
    embed?: {
      disabledEditBlock?: boolean;
      disabledDelete?: boolean;
      onEditBlockClick?: (embed: DashboardEmbedItem) => void;
      onDeleteClick?: (embedId: string) => void;
    };
  };
}

export const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  const { dragItems = [], type, extraConfig, autoRefresh, ...rest } = props;
  const [borderRadius] = useToken("radii", ["lg"]);

  const [resultFinishedAtCollection, setResultFinishedAtCollection] = useState(
    {}
  );
  // 获取 result 最后编辑时间的引用
  const resultFinishedAtCollectionRef = useRef({});

  const [clipSqlCollection, setClipSqlCollection] = useState({});
  // 获取 clip sql 语句的引用
  const clipSqlCollectionRef = useRef({});

  // 抽屉显隐
  const [drawerVisible, setDrawerVisible] = useState(false);
  // 抽屉中需要记录是谁点击的预览查询语句
  const [previewChartId, setPreviewChartId] = useState("");

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
      {/* 视频 */}
      {/* <Embed url="https://www.youtube.com/watch?v=JX75a1MXkKA&ab_channel=EASMusicChannel"></Embed> */}
      {/* <Embed url="https://www.youtube.com/watch?v=soICQ3B2kEk" />
      <Embed url="https://twitter.com/hercuppacoffee/status/911958476678561792"></Embed> */}
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
            const resultFinishedAt =
              resultFinishedAtCollection?.[
                (item as DashboardChartItem)?.chart?.id
              ];

            return (
              <DashboardDragWrapper key={item?.position?.i}>
                <DashboardCard
                  title={
                    <>
                      {!item?.hiddenName && item?.name}{" "}
                      <span style={{ color: "#ababab" }}>
                        {resultFinishedAt &&
                          timeAgo.format(new Date(resultFinishedAt).valueOf())}
                      </span>
                    </>
                  }
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
                              disabled={
                                !(item as DashboardChartItem)?.chart?.id ||
                                extraConfig?.chart?.disabledPreviewClipSql
                              }
                              onClick={() => {
                                setPreviewChartId(
                                  (item as DashboardChartItem)?.chart?.id
                                );
                                setDrawerVisible(true);
                              }}
                            >
                              预览查询语句
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
                    dashboardType={type}
                    setResultFinishedAtCollection={
                      setResultFinishedAtCollection
                    }
                    resultFinishedAtCollectionRef={
                      resultFinishedAtCollectionRef
                    }
                    setClipSqlCollection={setClipSqlCollection}
                    clipSqlCollectionRef={clipSqlCollectionRef}
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

          if (item.type === DashboardItemType.EMBED) {
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
                              disabled={extraConfig?.embed?.disabledEditBlock}
                              onClick={() => {
                                extraConfig?.embed?.onEditBlockClick?.(
                                  item as DashboardEmbedItem
                                );
                              }}
                            >
                              编辑块
                            </Menu.Item>
                            <Menu.Item
                              disabled={extraConfig?.embed?.disabledDelete}
                              onClick={() => {
                                extraConfig?.embed?.onDeleteClick?.(item.id);
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
                  <Embed url={(item as DashboardEmbedItem).embed?.url} />
                </DashboardCard>
              </DashboardDragWrapper>
            );
          }
        })}
      </ResponsiveGridLayout>

      {/* 预览查询语句的抽屉 */}
      <Drawer
        title="预览查询语句"
        placement="right"
        width={600}
        onClose={() => {
          setDrawerVisible(false);
          setPreviewChartId("");
        }}
        visible={drawerVisible}
      >
        <Editor
          height="400px"
          defaultLanguage="sql"
          options={{
            contextmenu: false,
            readOnly: true,
            minimap: {
              enabled: false,
            },
            scrollbar: {
              verticalScrollbarSize: 16,
            },
          }}
          value={clipSqlCollection[previewChartId] || ""}
        />
      </Drawer>
    </Box>
  );
};
