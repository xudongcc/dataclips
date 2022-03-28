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
  Text,
  Popover,
  PopoverBody,
  useToken,
  PopoverContent,
  PopoverTrigger,
  Select,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { PC } from "../../../interfaces/PageComponent";
import ProjectLayout from "../../../layouts/ProjectLayout";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useDashboardQuery,
  useChartConnectionQuery,
  useUpdateDashboardMutation,
  useChartLazyQuery,
} from "../../../generated/graphql";
import { cloneDeep, isEmpty } from "lodash";
import { useCallback, useState, useRef, useEffect } from "react";
import { Loading } from "../../../components/Loading";
import { Page } from "../../../components/Page";
import { DashboardItem } from "../../../components/DashboardItem";
import { DashboardChartResultPreview } from "../../../components/DashboardChartResultPreview";
import { DashboardCard } from "../../../components/DashboardCard";

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
  layout: Layout;
}

const DashBoardEdit: PC = () => {
  const toast = useToast();
  const router = useRouter();
  const popoverRef = useRef();
  const [borderRadius] = useToken("radii", ["lg"]);

  const [operation, setOperation] = useState<Operation>({
    type: OperationType.ADD,
  });

  const { dashboardId } = router.query as { dashboardId: string };

  const { data, loading } = useDashboardQuery({
    variables: { id: dashboardId },
    skip: !dashboardId,
  });

  const { data: chartConnectionData } = useChartConnectionQuery({
    variables: { first: 100 },
  });

  const [getChart, { loading: getChartLoading }] = useChartLazyQuery();

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
    setOperation({ type: OperationType.ADD });
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
          const current = {
            name: form.values.name,
            chartId: data.chart.id,
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

        handleCloseAddChartModal();
      }
    } catch (err) {
      console.error(err);
    }
  }, [
    chartCards,
    form,
    getChart,
    handleCloseAddChartModal,
    operation?.key,
    operation.type,
  ]);

  // 布局发生变化时
  const handleSetChartItemLayout = useCallback(
    (newLayout: Layout[]) => {
      const newChartCards = cloneDeep(chartCards);

      newLayout.forEach((layout) => {
        const itemIndex = chartCards.findIndex(
          (item) => item?.layout?.i === layout.i
        );

        if (itemIndex !== -1) {
          newChartCards[itemIndex] = {
            ...newChartCards[itemIndex],
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

      setChartCards(newChartCards);
    },
    [chartCards]
  );

  useEffect(() => {
    if (data?.dashboard?.config?.length) {
      setChartCards(data.dashboard.config);
    }
  }, [data?.dashboard?.config]);

  if (loading) {
    return <Loading width="100%" />;
  }

  return (
    <>
      <Head>
        <title>{data?.dashboard?.name} - 编辑 - 仪表盘</title>
      </Head>

      <Page
        title={data?.dashboard?.name}
        primaryAction={{
          text: "保存",
          onClick: handleUpdateDashboard,
          isLoading: updateDashboardLoading,
        }}
        secondaryActions={[
          {
            text: "添加卡片",
            onClick: onOpen,
          },
        ]}
      >
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
            onLayoutChange={handleSetChartItemLayout}
            cols={12}
            containerPadding={[0, 0]}
            width={1200}
            layout={chartCards.map((item) => item?.layout)}
          >
            {chartCards.map((item) => {
              return (
                <DashboardItem key={item?.layout?.i}>
                  <DashboardCard
                    h="full"
                    title={item?.name}
                    extra={
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
                                  variant="ghost"
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
                                  编辑卡片
                                </Button>

                                <Divider my={1}></Divider>

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

                                <Divider my={1}></Divider>

                                <Button
                                  variant="ghost"
                                  color="red.500"
                                  ref={popoverRef}
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

        <Modal isOpen={isOpen} onClose={handleCloseAddChartModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {operation.type === OperationType.EDIT ? "编辑" : "添加"}卡片
            </ModalHeader>
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
                isLoading={getChartLoading}
                onClick={handleAddOrEditChartCard}
              >
                确定
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Page>
    </>
  );
};

DashBoardEdit.layout = ProjectLayout;

export default DashBoardEdit;
