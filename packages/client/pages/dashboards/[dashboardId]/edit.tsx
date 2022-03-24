import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PC } from "../../../interfaces/PageComponent";
import ProjectLayout from "../../../layouts/ProjectLayout";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { Card } from "../../../components/Card/Card";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useDashboardQuery,
  useChartConnectionQuery,
  useChartResultLazyQuery,
  useUpdateDashboardMutation,
} from "../../../generated/graphql";
import { isEmpty } from "lodash";
import { useCallback, useState } from "react";
import { ChartResultPreview } from "../../../components/ChartResultPreview";

const ResponsiveGridLayout = WidthProvider(GridLayout);

const DashBoardEdit: PC = () => {
  const toast = useToast();
  const router = useRouter();

  const { dashboardId } = router.query as { dashboardId: string };

  const { data } = useDashboardQuery({
    variables: { id: dashboardId },
    skip: !dashboardId,
  });

  const { data: chartConnectionData } = useChartConnectionQuery({
    variables: { first: 100 },
  });

  const [getChartResult, { loading: getChartResultLoading }] =
    useChartResultLazyQuery();

  const [updateDashboard, { loading: updateDashboardLoading }] =
    useUpdateDashboardMutation();

  const [charts, setCharts] = useState([]);
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

  console.log("data", data);

  console.log("仪表盘的 chart", charts);

  const handleCloseAddChartModal = useCallback(() => {
    onClose();
    form.setValues(form.initialValues);
    form.setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const handleUpdateDashboard = useCallback(async () => {
    await updateDashboard({
      variables: {
        id: dashboardId,
        input: {
          config: charts.map((item) => ({
            name: item.name,
            chartId: item.chartId,
            layout: item.layout,
          })),
        },
      },
    });

    toast({ title: "更新成功" });
  }, [charts, dashboardId, toast, updateDashboard]);

  const handleSetChartItemLayout = useCallback(
    (newLayout: Layout[]) => {
      newLayout.forEach((layout) => {
        charts[+layout.i] = {
          ...charts[+layout.i],
          layout: {
            i: layout.i,
            x: layout.x,
            y: layout.y,
            w: layout.w,
            h: layout.h,
          },
        };
      });

      setCharts([...charts]);
    },
    [charts]
  );

  return (
    <Box>
      <Flex justifyContent="flex-end">
        <HStack spacing={4}>
          <Button
            onClick={() => {
              console.log("charts", charts);
            }}
          >
            获取
          </Button>
          <Button onClick={onOpen}>添加图表</Button>
          <Button
            colorScheme="blue"
            onClick={handleUpdateDashboard}
            isLoading={updateDashboardLoading}
          >
            保存
          </Button>
        </HStack>
      </Flex>

      <Box border="1px solid" mt={4}>
        <ResponsiveGridLayout
          className="layout"
          onLayoutChange={handleSetChartItemLayout}
          cols={12}
          width={1200}
          layout={charts.map((item) => item?.layout)}
        >
          {charts.map((item, index) => {
            return (
              <Card
                title={item?.name}
                key={`${index}`}
                extra={<Button>123</Button>}
              >
                <ChartResultPreview
                  result={item?.data?.result}
                  type={item?.data?.chart?.type}
                  config={item?.data?.chart?.config}
                />
              </Card>
            );
          })}
        </ResponsiveGridLayout>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
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
                  onChange={form.handleChange}
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
              isLoading={getChartResultLoading}
              onClick={async () => {
                try {
                  const error = await form.validateForm();

                  if (isEmpty(error)) {
                    // 发请求，查询当前 chart 相关结果
                    const { data } = await getChartResult({
                      variables: {
                        input: {
                          ...form.values,
                        },
                      },
                    });

                    if (
                      data &&
                      data?.chartResult?.chart &&
                      data.chartResult?.result &&
                      data.chartResult?.name
                    ) {
                      setCharts([
                        ...charts,
                        {
                          name: data.chartResult.name,
                          chartId: data.chartResult.chart.id,
                          data: {
                            result: data.chartResult.result,
                            chart: data?.chartResult.chart,
                          },
                          layout: {
                            i: `${charts.length}`,
                            x: 0,
                            y: charts.length * 3,
                            w: 6,
                            h: 3,
                          },
                        },
                      ]);
                    }

                    handleCloseAddChartModal();
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              确定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

DashBoardEdit.layout = ProjectLayout;

export default DashBoardEdit;
