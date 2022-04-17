import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { FC, ReactNode, useRef } from "react";
import { DashboardDragWrapper } from "../DashboardDragWrapper";

import { DashboardCard } from "../DashboardCard";
import {
  Box,
  Button,
  Divider,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useToken,
} from "@chakra-ui/react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { DashboardChartResultPreview } from "../DashboardChartResultPreview";
import { DashboardDivider } from "../DashboardDivider";
import { Markdown } from "../../chart/ChartResultPreview/components";

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
      onEditCardClick?: (chart: DashboardChartItem, close: () => void) => void;
      onEditChartClick?: (chart: DashboardChartItem, close: () => void) => void;
      onPreviewClipClick?: (
        chart: DashboardChartItem,
        close: () => void
      ) => void;
      onDeleteClick?: (chartId: string, close: () => void) => void;
    };
    divider?: {
      onDividerDelete?: (dividerId: string) => void;
    };
    markdown?: {
      disabledEditBlock?: boolean;
      disabledDelete?: boolean;
      onEditBlockClick?: (
        markdown: DashboardMarkdownItem,
        close: () => void
      ) => void;
      onDeleteClick?: (markdownId: string) => void;
    };
  };
}

export const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  const { dragItems = [], type, extraConfig, ...rest } = props;
  const [borderRadius] = useToken("radii", ["lg"]);
  const popoverRef = useRef();

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
        margin={[24, 24]}
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
                      <Popover
                        initialFocusRef={popoverRef}
                        placement="bottom-end"
                      >
                        {({ onClose }) => (
                          <>
                            <PopoverTrigger>
                              <Text cursor="pointer" fontWeight="bold">
                                ⋮
                              </Text>
                            </PopoverTrigger>

                            <PopoverContent w="100%">
                              <PopoverBody d="flex" flexDir="column">
                                <Button
                                  disabled={
                                    extraConfig?.chart?.disabledEditCard
                                  }
                                  variant="ghost"
                                  ref={popoverRef}
                                  onClick={() => {
                                    extraConfig?.chart?.onEditCardClick?.(
                                      item as DashboardChartItem,
                                      onClose
                                    );

                                    if (!extraConfig?.chart?.onEditCardClick) {
                                      onClose();
                                    }
                                  }}
                                >
                                  编辑块
                                </Button>

                                <Divider my={1} />

                                <Button
                                  variant="ghost"
                                  isDisabled={
                                    !(item as DashboardChartItem)?.chart?.id ||
                                    extraConfig?.chart?.disabledEditChart
                                  }
                                  onClick={() => {
                                    extraConfig?.chart?.onEditChartClick?.(
                                      item as DashboardChartItem,
                                      onClose
                                    );

                                    if (!extraConfig?.chart?.onEditChartClick) {
                                      onClose();
                                    }
                                  }}
                                >
                                  编辑图表
                                </Button>

                                <Divider my={1} />

                                <Button
                                  variant="ghost"
                                  isDisabled={
                                    !(item as DashboardChartItem)?.chart?.id ||
                                    extraConfig?.chart?.disabledPreviewClip
                                  }
                                  onClick={() => {
                                    extraConfig?.chart?.onPreviewClipClick?.(
                                      item as DashboardChartItem,
                                      onClose
                                    );

                                    if (
                                      !extraConfig?.chart?.onPreviewClipClick
                                    ) {
                                      onClose();
                                    }
                                  }}
                                >
                                  预览数据集
                                </Button>

                                <Divider my={1} />

                                <Button
                                  disabled={extraConfig?.chart?.disabledDelete}
                                  variant="ghost"
                                  color="red.500"
                                  ref={popoverRef}
                                  onClick={() => {
                                    extraConfig?.chart?.onDeleteClick?.(
                                      (item as DashboardChartItem).id,
                                      onClose
                                    );

                                    if (!extraConfig?.chart?.onDeleteClick) {
                                      onClose();
                                    }
                                  }}
                                >
                                  删除
                                </Button>
                              </PopoverBody>
                            </PopoverContent>
                          </>
                        )}
                      </Popover>
                    ) : undefined
                  }
                >
                  <DashboardChartResultPreview
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
                      <Popover
                        initialFocusRef={popoverRef}
                        placement="bottom-end"
                      >
                        {({ onClose }) => (
                          <>
                            <PopoverTrigger>
                              <Text cursor="pointer" fontWeight="bold">
                                ⋮
                              </Text>
                            </PopoverTrigger>

                            <PopoverContent w="100%">
                              <PopoverBody d="flex" flexDir="column">
                                <Button
                                  disabled={
                                    extraConfig?.markdown?.disabledEditBlock
                                  }
                                  variant="ghost"
                                  ref={popoverRef}
                                  onClick={() => {
                                    extraConfig?.markdown?.onEditBlockClick?.(
                                      item as DashboardMarkdownItem,
                                      onClose
                                    );

                                    if (
                                      !extraConfig?.markdown?.onEditBlockClick
                                    ) {
                                      onClose();
                                    }
                                  }}
                                >
                                  编辑块
                                </Button>

                                <Divider my={1} />

                                <Button
                                  disabled={
                                    extraConfig?.markdown?.disabledDelete
                                  }
                                  variant="ghost"
                                  color="red.500"
                                  ref={popoverRef}
                                  onClick={() => {
                                    extraConfig?.markdown?.onDeleteClick?.(
                                      item.id
                                    );

                                    if (!extraConfig?.markdown?.onDeleteClick) {
                                      onClose();
                                    }
                                  }}
                                >
                                  删除
                                </Button>
                              </PopoverBody>
                            </PopoverContent>
                          </>
                        )}
                      </Popover>
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
