import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  Divider,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PC } from "../../../interfaces/PageComponent";
import ProjectLayout from "../../../layouts/ProjectLayout";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Card } from "../../../components/Card/Card";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useDashboardQuery,
  useChartConnectionQuery,
  useUpdateDashboardMutation,
  useChartLazyQuery,
  Chart,
} from "../../../generated/graphql";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useState, useRef } from "react";
import { ChartResultPreview } from "../../../components/ChartResultPreview";
import { useLazyQueryResult } from "../../../hooks/useLazyQueryResult";
import { compact } from "lodash";
import { Loading } from "../../../components/Loading";
import { Page } from "../../../components/Page";
import { DashboardItem } from "../../../components/DashboardItem";

const ResponsiveGridLayout = WidthProvider(GridLayout);

enum OperationType {
  ADD = "ADD",
  EDIT = "EDIT",
}

interface Operation {
  type: OperationType;
  key?: string;
}

interface ChartCard {
  name: string;
  chartId: string;
  data: {
    chart: Chart;
    result: any;
  };
  layout: Layout;
}

const DashBoardEdit: PC = () => {
  const toast = useToast();
  const router = useRouter();
  const popoverRef = useRef();

  const [operation, setOperation] = useState<Operation>({
    type: OperationType.ADD,
  });

  // 初始仪表盘中所有图表是否请求完成
  const [initialRequestIsDone, setInitialRequestIsDone] = useState(false);

  const { dashboardId } = router.query as { dashboardId: string };

  const { data } = useDashboardQuery({
    variables: { id: dashboardId },
    skip: !dashboardId,
    onCompleted: (data) => {
      if (!data?.dashboard?.config?.length) {
        setInitialRequestIsDone(true);
      }
    },
  });

  const { data: chartConnectionData } = useChartConnectionQuery({
    variables: { first: 100 },
  });

  const [getChart, { loading: getChartLoading }] = useChartLazyQuery();

  const [getQueryResult, { isFetching }] = useLazyQueryResult();

  const [updateDashboard, { loading: updateDashboardLoading }] =
    useUpdateDashboardMutation();

  const [chartCards, setChartCards] = useState<ChartCard[]>([]);

  // 创建仪表盘的弹窗
  const { isOpen, onOpen, onClose } = useDisclosure();

  const form = useFormik({
    initialValues: {
      name: "",
      chartId: "",
    },
    isInitialValid: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: () => {},
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      chartId: Yup.string().required(),
    }),
  });

  const handleCloseAddChartModal = useCallback(() => {
    onClose();
    form.setValues(form.initialValues);
    form.setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const handleUpdateDashboard = useCallback(async () => {
    try {
      await updateDashboard({
        variables: {
          id: dashboardId,
          input: {
            config: chartCards.map((item) => ({
              name: item.name,
              chartId: item.chartId,
              layout: item.layout,
            })),
          },
        },
      });

      toast({ title: "更新成功" });
    } catch (err) {
      console.log(err);
    }
  }, [chartCards, dashboardId, toast, updateDashboard]);

  const handleAddOrEditChartCard = useCallback(async () => {
    try {
      const error = await form.validateForm();

      if (isEmpty(error)) {
        const { data } = await getChart({
          variables: {
            id: form.values.chartId,
          },
        });

        if (data?.chart) {
          const result = await getQueryResult(data.chart.clipId);

          if (result && !result?.error) {
            const current = {
              name: form.values.name,
              chartId: data.chart.id,
              data: {
                result: result,
                chart: data?.chart,
              },
              layout: {
                i: `${Date.now()}`,
                x: 0,
                y: chartCards.length * 3,
                w: 6,
                h: 3,
              },
            };

            if (operation.type === OperationType.ADD) {
              setChartCards([...chartCards, current]);
            } else {
              const updateIndex = chartCards.findIndex(
                (chartCard) => chartCard?.layout?.i === operation?.key
              );

              if (updateIndex !== -1) {
                chartCards[updateIndex] = {
                  ...current,
                  layout: chartCards[updateIndex].layout,
                };
              }

              setChartCards([...chartCards]);
              setOperation({ type: OperationType.EDIT });
            }
          }
        }

        handleCloseAddChartModal();
      }
    } catch (err) {
      console.error(err);
    }
  }, [
    chartCards,
    form,
    getChart,
    getQueryResult,
    handleCloseAddChartModal,
    operation?.key,
    operation.type,
  ]);

  // 布局发生变化时
  const handleSetChartItemLayout = useCallback(
    (newLayout: Layout[]) => {
      newLayout.forEach((layout) => {
        const itemIndex = chartCards.findIndex(
          (item) => item?.layout?.i === layout.i
        );

        if (itemIndex !== -1) {
          chartCards[itemIndex] = {
            ...chartCards[itemIndex],
            layout: {
              i: layout.i,
              x: layout.x,
              y: layout.y,
              w: layout.w,
              h: layout.h,
            },
          };
        }
      });

      setChartCards([...chartCards]);
    },
    [chartCards]
  );

  // 初始化时，请求所有图表资源
  useEffect(() => {
    if (data?.dashboard?.config?.length) {
      if (!initialRequestIsDone) {
        Promise.allSettled(
          data.dashboard.config.map(async (item) => {
            if (item?.chartId) {
              const { data } = await getChart({
                variables: { id: item.chartId },
              });

              if (data?.chart.clipId) {
                const result: any = await getQueryResult(data.chart.clipId);

                if (result?.fields && result?.values && !result?.error) {
                  return {
                    name: item.name,
                    chartId: item.chartId,
                    data: {
                      result: result,
                      chart: data?.chart,
                    },
                    layout: item.layout,
                  };
                }
              }
            }
          })
        )
          .then((res) => {
            const successRes = res
              .filter((p) => p.status === "fulfilled")
              .map((item: any) => item.value);

            if (compact(successRes).length) {
              setChartCards(successRes);
            }
          })
          .catch((err) => {
            console.log("err", err);
          })
          .finally(() => {
            setInitialRequestIsDone(true);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!initialRequestIsDone) {
    return <Loading width="100%" />;
  }

  return (
    <Page
      title={data?.dashboard?.name}
      primaryAction={{
        text: "保存",
        onClick: handleUpdateDashboard,
        isLoading: updateDashboardLoading,
      }}
      secondaryActions={[
        {
          text: "添加图表",
          onClick: onOpen,
        },
      ]}
    >
      <Box
        sx={{
          ".react-grid-item.react-grid-placeholder": {
            background: "rgba(0,0,0,0.2) !important",
          },
        }}
      >
        <ResponsiveGridLayout
          draggableHandle=".card-body"
          className="layout"
          onLayoutChange={handleSetChartItemLayout}
          cols={12}
          style={{}}
          width={1200}
          layout={chartCards.map((item) => item?.layout)}
        >
          {chartCards.map((item) => {
            return (
              <DashboardItem key={item?.layout?.i}>
                <Card
                  h="full"
                  title={item?.name}
                  extra={
                    <Popover initialFocusRef={popoverRef}>
                      {({ onClose }) => (
                        <>
                          <PopoverTrigger>
                            <Button variant="ghost" fontWeight="bold">
                              ⋮
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent w="100%">
                            <PopoverBody>
                              <Box
                                cursor="pointer"
                                _hover={{ bg: "var(--chakra-colors-gray-100)" }}
                                p={1}
                                borderRadius="4px"
                                ref={popoverRef}
                                onClick={() => {
                                  onClose();

                                  form.setValues({
                                    name: item?.name,
                                    chartId: item?.chartId,
                                  });

                                  setOperation({
                                    type: OperationType.EDIT,
                                    key: item?.layout?.i,
                                  });

                                  onOpen();
                                }}
                              >
                                修改
                              </Box>

                              <Divider my={1}></Divider>

                              <Box
                                cursor="pointer"
                                _hover={{ bg: "var(--chakra-colors-gray-100)" }}
                                p={1}
                                ref={popoverRef}
                                borderRadius="4px"
                                onClick={() => {
                                  onClose();

                                  const deleteIndex = chartCards.findIndex(
                                    (chartCard) =>
                                      chartCard?.layout?.i === item?.layout?.i
                                  );

                                  if (deleteIndex !== -1) {
                                    chartCards.splice(deleteIndex, 1);
                                    setChartCards([...chartCards]);
                                  }
                                }}
                              >
                                删除
                              </Box>
                            </PopoverBody>
                          </PopoverContent>
                        </>
                      )}
                    </Popover>
                  }
                >
                  <ChartResultPreview
                    result={item?.data?.result}
                    type={item?.data?.chart?.type}
                    config={item?.data?.chart?.config}
                  />
                </Card>
              </DashboardItem>
            );
          })}
        </ResponsiveGridLayout>
      </Box>

      <Modal isOpen={isOpen} onClose={handleCloseAddChartModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>添加图表</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!form.errors.name}>
                <Input
                  name="name"
                  value={form.values.name}
                  onChange={form.handleChange}
                  placeholder="请输入图表名称"
                />

                <FormErrorMessage>请输入图表名字</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.errors.chartId}>
                <Select
                  name="chartId"
                  value={form.values.chartId}
                  onChange={(e) => {
                    form.handleChange(e);

                    if (!form.values.name) {
                      const selectedIndex = e.target.selectedIndex;
                      const text = e.target.options[selectedIndex].text;

                      form.setFieldValue("name", text);
                    }
                  }}
                  placeholder="请选择图表"
                >
                  {chartConnectionData?.chartConnection.edges.map(
                    ({ node: { id, name } }) => (
                      <option value={id} key={id}>
                        {name}
                      </option>
                    )
                  )}
                </Select>

                <FormErrorMessage>请选择图表</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCloseAddChartModal}
            >
              取消
            </Button>
            <Button
              colorScheme="red"
              isLoading={isFetching || getChartLoading}
              onClick={handleAddOrEditChartCard}
            >
              确定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
};

DashBoardEdit.layout = ProjectLayout;

export default DashBoardEdit;
