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

export interface ChartCard {
  card: {
    name: string;
    hiddenName?: boolean;
  };
  chart: {
    id: string;
  };
  layout: Layout;
  type: DashboardItemType.CHART;
  id: string;
}

export interface DragDivider {
  layout: Layout;
  divider: {
    orientation?: "left" | "center" | "right";
    name?: string;
  };
  type: DashboardItemType.DIVIDER;
  id: string;
}

interface DashboardLayoutProps extends GridLayout.ReactGridLayoutProps {
  type: "preview" | "edit";
  dragItems: Array<DragDivider | ChartCard>;
  cardExtraConfig?: {
    extra?: ReactNode;
    disabledExtra?: boolean;
    disabledEditCard?: boolean;
    disabledEditChart?: boolean;
    disabledDelete?: boolean;
    disabledPreviewClip?: boolean;
    onEditCardClick?: (chart: ChartCard, close: () => void) => void;
    onEditChartClick?: (chart: ChartCard, close: () => void) => void;
    onPreviewClipClick?: (chart: ChartCard, close: () => void) => void;
    onDeleteClick?: (chart: ChartCard, close: () => void) => void;
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
              <DashboardDragWrapper key={item?.layout?.i}>
                <DashboardCard
                  h="full"
                  sx={{
                    ".dashboard-card-body": {
                      overflowY: "auto",
                    },
                  }}
                  title={!item?.card?.hiddenName && item?.card?.name}
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
                                      item,
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
                                    !item?.chart?.id ||
                                    cardExtraConfig.disabledEditChart
                                  }
                                  onClick={() => {
                                    cardExtraConfig?.onEditChartClick?.(
                                      item,
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
                                    !item?.chart?.id ||
                                    cardExtraConfig.disabledPreviewClip
                                  }
                                  onClick={() => {
                                    cardExtraConfig?.onPreviewClipClick?.(
                                      item,
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
                                      item,
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
                  <DashboardChartResultPreview chartId={item?.chart?.id} />
                </DashboardCard>
              </DashboardDragWrapper>
            );
          }

          if (item.type === DashboardItemType.DIVIDER) {
            return (
              <DashboardDragWrapper key={item.layout.i}>
                <Box pr={type === "edit" ? "20px" : undefined}>
                  <DashboardDivider
                    orientation={item?.divider?.orientation}
                    hasDelete={type === "edit"}
                    onDelete={() => {
                      onDividerDelete?.(item.layout.i);
                    }}
                  >
                    {item?.divider?.name}
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
