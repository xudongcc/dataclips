import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Checkbox,
  Select,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { PC } from "../../../interfaces/PageComponent";
import ProjectLayout from "../../../layouts/ProjectLayout";
import { Layout } from "react-grid-layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useDashboardQuery,
  useChartConnectionQuery,
  useUpdateDashboardMutation,
  useChartLazyQuery,
} from "../../../generated/graphql";
import { cloneDeep, isEmpty } from "lodash";
import { useCallback, useState, useEffect } from "react";
import { Loading } from "../../../components/common/Loading";
import { Page } from "../../../components/common/Page";
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout";

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
  hiddenName: boolean;
  layout: Layout;
}

const DashBoardEdit: PC = () => {
  const toast = useToast();
  const router = useRouter();

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

  // 创建或编辑卡片的弹窗
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 编辑仪表盘名称
  const {
    isOpen: isDashboardNameModalOpen,
    onOpen: onDashboardNameModalOpen,
    onClose: onDashboardNameModalClose,
  } = useDisclosure();

  const form = useFormik({
    initialValues: {
      name: "",
      chartId: "",
      hiddenName: false,
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

  const editDashboardNameForm = useFormik({
    initialValues: {
      dashboardName: "",
    },
    isInitialValid: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: () => {},
    validationSchema: Yup.object().shape({
      dashboardName: Yup.string().required(),
    }),
  });

  const handleCloseAddChartModal = useCallback(() => {
    onClose();
    form.setValues(form.initialValues);
    form.setErrors({});
    setOperation({ type: OperationType.ADD });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const handleCloseEditDashboardNameModal = useCallback(() => {
    onDashboardNameModalClose();
    editDashboardNameForm.setErrors({});
    editDashboardNameForm.setValues(editDashboardNameForm.initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDashboardNameModalClose]);

  const handleUpdateDashboard = useCallback(
    async (goPreview?: boolean) => {
      try {
        await updateDashboard({
          variables: {
            id: dashboardId,
            input: {
              name: editDashboardNameForm.values.dashboardName,
              config: chartCards.map((item) => ({
                name: item.name,
                chartId: item.chartId,
                hiddenName: !!item?.hiddenName,
                layout: item.layout,
              })),
            },
          },
        });

        toast({ title: "保存成功" });

        if (goPreview) {
          router.push(`/dashboards/${dashboardId}`);
        }

        return;
      } catch (err) {
        console.log(err);
      }
    },
    [
      chartCards,
      dashboardId,
      editDashboardNameForm.values.dashboardName,
      router,
      toast,
      updateDashboard,
    ]
  );

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
            hiddenName: form.values.hiddenName,
            layout: {
              i: uuidv4(),
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

  useEffect(() => {
    if (data?.dashboard?.name) {
      editDashboardNameForm.setFieldValue(
        "dashboardName",
        data?.dashboard?.name
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.dashboard?.name]);

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
          onClick: () => {
            handleUpdateDashboard(true);
          },
          isLoading: updateDashboardLoading,
        }}
        secondaryActions={[
          {
            text: "编辑名称",
            onClick: () => {
              onDashboardNameModalOpen();
              editDashboardNameForm.setFieldValue(
                "dashboardName",
                data?.dashboard?.name
              );
            },
          },
          {
            text: "添加卡片",
            onClick: onOpen,
          },
        ]}
      >
        <DashboardLayout
          onLayoutChange={handleSetChartItemLayout}
          layout={chartCards.map((item) => item?.layout)}
          charts={chartCards}
          cardExtraConfig={{
            onEditCardClick: (item, onClose) => {
              onClose();

              form.setValues({
                name: item?.name,
                chartId: item?.chartId,
                hiddenName: !!item?.hiddenName,
              });

              setOperation({
                type: OperationType.EDIT,
                key: item?.layout?.i,
              });

              onOpen();
            },
            onDeleteClick: (item, onClose) => {
              onClose();

              const deleteIndex = chartCards.findIndex(
                (chartCard) => chartCard?.layout?.i === item?.layout?.i
              );

              if (deleteIndex !== -1) {
                chartCards.splice(deleteIndex, 1);
                setChartCards([...chartCards]);
              }
            },
            onEditChartClick: (item) => {
              router.push(`/charts/${item?.chartId}/edit`);
            },
          }}
        />

        {/* 添加或编辑卡片的弹窗 */}
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

                <Checkbox
                  name="hiddenName"
                  isChecked={form.values.hiddenName}
                  onChange={form.handleChange}
                >
                  是否隐藏标题
                </Checkbox>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={handleCloseAddChartModal}>
                取消
              </Button>
              <Button
                colorScheme="blue"
                isLoading={getChartLoading}
                onClick={handleAddOrEditChartCard}
              >
                确定
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* 编辑仪表盘名称弹窗 */}
        <Modal
          isOpen={isDashboardNameModalOpen}
          onClose={handleCloseEditDashboardNameModal}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>编辑仪表盘名称</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl
                isInvalid={!!editDashboardNameForm.errors?.dashboardName}
              >
                <Input
                  name="dashboardName"
                  onChange={editDashboardNameForm.handleChange}
                  value={editDashboardNameForm.values.dashboardName}
                  placeholder="请输入仪表盘名称"
                />

                <FormErrorMessage>请输入仪表盘名称</FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={handleCloseEditDashboardNameModal}>
                取消
              </Button>
              <Button
                colorScheme="blue"
                isLoading={getChartLoading || updateDashboardLoading}
                onClick={async () => {
                  try {
                    const error = await editDashboardNameForm.validateForm();

                    if (isEmpty(error)) {
                      handleUpdateDashboard();
                      handleCloseEditDashboardNameModal();
                    }
                  } catch (err) {
                    console.log("err", err);
                  }
                }}
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
