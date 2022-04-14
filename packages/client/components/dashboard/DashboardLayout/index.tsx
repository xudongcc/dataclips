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

const ResponsiveGridLayout = WidthProvider(GridLayout);

export enum DashboardItemType {
  CHART = "chart",
  DIVIDER = "divider",
}

export interface DashboardCard {
  id: string;
  name: string;
  hiddenName?: boolean;
  position: Layout;
  type: DashboardItemType;
}

export interface DashboardChartItem extends DashboardCard {
  chart: {
    id: string;
  };
}

export interface DashboardDividerItem extends DashboardCard {
  divider: {
    orientation?: "left" | "center" | "right";
    name?: string;
  };
}

interface DashboardLayoutProps extends GridLayout.ReactGridLayoutProps {
  type: "preview" | "edit";
  dragItems: Array<DashboardChartItem | DashboardDividerItem>;
  cardExtraConfig?: {
    extra?: ReactNode;
    disabledExtra?: boolean;
    disabledEditCard?: boolean;
    disabledEditChart?: boolean;
    disabledDelete?: boolean;
    disabledPreviewClip?: boolean;
    onEditCardClick?: (chart: DashboardChartItem, close: () => void) => void;
    onEditChartClick?: (chart: DashboardChartItem, close: () => void) => void;
    onPreviewClipClick?: (chart: DashboardChartItem, close: () => void) => void;
    onDeleteClick?: (chart: DashboardChartItem, close: () => void) => void;
  };
  onDividerDelete?: (key: string) => void;
}

export const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  const {
    dragItems = [],
    cardExtraConfig = {
      disabledExtra: false,
      disabledDelete: false,
      disabledEditCard: false,
      disabledEditChart: false,
      disabledPreviewClip: false,
    },
    onDividerDelete,
    type,
    ...rest
  } = props;
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
        draggableHandle=".dashboard-card-body"
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
                  h="full"
                  sx={{
                    ".dashboard-card-body": {
                      overflowY: "auto",
                    },
                  }}
                  title={!item?.hiddenName && item?.name}
                  extra={
                    cardExtraConfig?.extra ? (
                      cardExtraConfig?.extra
                    ) : !cardExtraConfig.disabledExtra ? (
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
                                  disabled={cardExtraConfig.disabledEditCard}
                                  variant="ghost"
                                  ref={popoverRef}
                                  onClick={() => {
                                    cardExtraConfig?.onEditCardClick?.(
                                      item as DashboardChartItem,
                                      onClose
                                    );

                                    if (!cardExtraConfig?.onEditCardClick) {
                                      onClose();
                                    }
                                  }}
                                >
                                  编辑卡片
                                </Button>

                                <Divider my={1} />

                                <Button
                                  variant="ghost"
                                  isDisabled={
                                    !(item as DashboardChartItem)?.chart?.id ||
                                    cardExtraConfig.disabledEditChart
                                  }
                                  onClick={() => {
                                    cardExtraConfig?.onEditChartClick?.(
                                      item as DashboardChartItem,
                                      onClose
                                    );

                                    if (!cardExtraConfig?.onEditChartClick) {
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
                                    cardExtraConfig.disabledPreviewClip
                                  }
                                  onClick={() => {
                                    cardExtraConfig?.onPreviewClipClick?.(
                                      item as DashboardChartItem,
                                      onClose
                                    );

                                    if (!cardExtraConfig?.onPreviewClipClick) {
                                      onClose();
                                    }
                                  }}
                                >
                                  预览数据集
                                </Button>

                                <Divider my={1} />

                                <Button
                                  disabled={cardExtraConfig.disabledDelete}
                                  variant="ghost"
                                  color="red.500"
                                  ref={popoverRef}
                                  onClick={() => {
                                    cardExtraConfig?.onDeleteClick?.(
                                      item as DashboardChartItem,
                                      onClose
                                    );

                                    if (!cardExtraConfig?.onDeleteClick) {
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
                      onDividerDelete?.(item.id);
                    }}
                  >
                    {(item as DashboardDividerItem)?.divider?.name}
                  </DashboardDivider>
                </Box>
              </DashboardDragWrapper>
            );
          }
        })}
      </ResponsiveGridLayout>
    </Box>
  );
};
