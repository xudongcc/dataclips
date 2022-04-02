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

export interface ChartCard {
  name: string;
  chartId: string;
  hiddenName: boolean;
  layout: Layout;
  type?: "chart";
}

export interface DragDivider {
  name?: string;
  layout: Layout;
  type?: "divider";
  orientation?: "left" | "center" | "right";
}

export function isChartCard(arg: DragDivider | ChartCard): arg is ChartCard {
  return (arg as ChartCard).chartId !== undefined;
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
    onEditCardClick?: (chart: ChartCard, close: () => void) => void;
    onEditChartClick?: (chart: ChartCard, close: () => void) => void;
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
      }}
    >
      <ResponsiveGridLayout
        draggableHandle=".dashboard-card-body"
        className="layout"
        margin={[24, 24]}
        rowHeight={50}
        cols={24}
        verticalCompact={false}
        containerPadding={[0, 0]}
        width={1200}
        {...rest}
      >
        {dragItems.map((item) => {
          if (isChartCard(item)) {
            return (
              <DashboardDragWrapper key={item?.layout?.i}>
                <DashboardCard
                  h="full"
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
                                    !item?.chartId ||
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
                  <DashboardChartResultPreview chartId={item?.chartId} />
                </DashboardCard>
              </DashboardDragWrapper>
            );
          } else {
            return (
              <DashboardDragWrapper key={item.layout.i}>
                <Box pr="20px">
                  <DashboardDivider
                    orientation={item?.orientation}
                    hasDelete={type === "edit"}
                    onDelete={() => {
                      onDividerDelete?.(item.layout.i);
                    }}
                  >
                    {item?.name}
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
