import ProjectLayout from "../../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Input,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import {
  useClipConnectionQuery,
  useChartQuery,
  useUpdateChartMutation,
  UpdateChartInput,
} from "../../../generated/graphql";
import * as Yup from "yup";
import { useCallback, useEffect } from "react";
import { useFormik } from "formik";
import { ChartType } from "../../../types";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { omit } from "lodash";
import { Loading } from "../../../components/Loading";
import { ChartEditTab } from "../../../components/ChartEditTab";
import { ChartResultPreview } from "../../../components/ChartResultPreview";
import {
  LineChartConfig,
  BarChartConfig,
  FunnelChartConfig,
  MetricChartConfig,
  PieChartConfig,
} from "../../../components/ChartResultPreview/components/";
import { Page } from "../../../components/Page";
import { Card } from "../../../components/Card";
import Head from "next/head";

const ChartEdit = () => {
  const toast = useToast();
  const router = useRouter();

  const { chartId } = router.query as { chartId: string };

  const { data: clipsData } = useClipConnectionQuery({
    variables: { first: 100 },
  });

  const { data, loading } = useChartQuery({
    variables: { id: chartId },
    skip: !chartId,
  });

  const [updateChart, { loading: updateChartLoading }] =
    useUpdateChartMutation();

  const form = useFormik({
    initialValues: {
      name: "",
      type: "" as ChartType,
      clipId: "",
      format: "",
      funnelConfig: { groupCol: "", valueCol: "" },
      metricConfig: { valueCol: "", compareCol: "" },
      lineConfig: { xCol: "", yCol: [] },
      barConfig: {
        isStack: false,
        variant: "",
        xCol: "",
        yCol: [],
      },
      pieConfig: { variant: "", key: "", value: "" },
    },
    isInitialValid: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async () => {
      const input = {
        name: form.values.name,
        type: form.values.type,
        format: form.values.format || "",
        config: [
          { type: ChartType.FUNNEL, config: form.values.funnelConfig },
          { type: ChartType.METRIC, config: form.values.metricConfig },
          { type: ChartType.LINE, config: form.values.lineConfig },
          { type: ChartType.BAR, config: form.values.barConfig },
          { type: ChartType.PIE, config: form.values.pieConfig },
        ].find((item) => item.type === form.values.type).config,
        clipId: form.values.clipId,
      } as UpdateChartInput;

      try {
        if (chartId) {
          await updateChart({
            variables: {
              id: chartId,
              input,
            },
          });
          toast({
            description: "保存成功",
            status: "success",
            isClosable: true,
          });

          router.push(`/charts/${chartId}`);
        }
      } catch (err) {
        console.log("err", err);
      }
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      clipId: Yup.string().required(),
      type: Yup.string().required(),
    }),
  });

  const { data: result, isLoading } = useQueryResult(form.values.clipId);

  const getChartTypePreviewConfig = useCallback(() => {
    if (form.values.type === ChartType.FUNNEL) {
      return {
        format: form.values.format || "",
        groupCol: form.values.funnelConfig?.groupCol || "",
        valueCol: form.values.funnelConfig?.valueCol || "",
      } as FunnelChartConfig;
    }

    if (form.values.type === ChartType.METRIC) {
      return {
        format: form.values.format || "",
        valueCol: form.values.metricConfig?.valueCol || "",
        compareCol: form.values.metricConfig?.compareCol || "",
      } as MetricChartConfig;
    }

    if (form.values.type === ChartType.LINE) {
      return {
        format: form.values.format || "",
        xCol: form.values.lineConfig?.xCol || "",
        yCol: form.values.lineConfig?.yCol || [],
      } as LineChartConfig;
    }

    if (form.values.type === ChartType.BAR) {
      return {
        format: form.values.format || "",
        isStack: !!form.values.barConfig.isStack,
        variant: form.values.barConfig.variant || "",
        xCol: form.values.barConfig?.xCol || "",
        yCol: form.values.barConfig?.yCol || [],
      } as BarChartConfig;
    }

    if (form.values.type === ChartType.PIE) {
      return {
        format: form.values.format || "",
        variant: form.values.pieConfig.variant || "",
        key: form.values.pieConfig.key || "",
        value: form.values.pieConfig?.value || "",
      } as PieChartConfig;
    }

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // 初始配置
  useEffect(() => {
    if (!form.values.clipId) {
      form.setValues(form.initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.chart) {
      const initialValues = {
        ...form.initialValues,
        ...omit(data.chart, [
          "config",
          "createdAt",
          "id",
          "token",
          "updatedAt",
          "__typename",
        ]),
      };

      if (data.chart.type === ChartType.FUNNEL) {
        initialValues.funnelConfig = {
          groupCol: data.chart.config?.groupCol || "",
          valueCol: data.chart.config?.valueCol || "",
        };
      }

      if (data.chart.type === ChartType.METRIC) {
        initialValues.metricConfig = {
          valueCol: data.chart.config?.valueCol || "",
          compareCol: data.chart.config?.compareCol || "",
        };
      }

      if (data.chart.type === ChartType.LINE) {
        initialValues.lineConfig = {
          xCol: data.chart.config?.xCol || "",
          yCol: data.chart.config?.yCol || [],
        };
      }

      if (data.chart.type === ChartType.BAR) {
        initialValues.barConfig = {
          isStack: !!data.chart.config?.isStack,
          variant: data.chart.config?.variant || "",
          xCol: data.chart.config?.xCol || "",
          yCol: data.chart.config?.yCol || [],
        };
      }

      if (data.chart.type === ChartType.PIE) {
        initialValues.pieConfig = {
          variant: data.chart.config?.variant || "",
          key: data.chart.config?.key || "",
          value: data.chart.config?.value || "",
        };
      }

      form.setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (chartId && (loading || isLoading)) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{data?.chart?.name} - 编辑 - 图表</title>
      </Head>

      <Page title={data?.chart?.name}>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <GridItem colSpan={3}>
            <Card>
              <form onSubmit={form.handleSubmit}>
                <Stack spacing={3} direction="row">
                  <FormControl width="30%" isInvalid={!!form.errors.name}>
                    <Input
                      placeholder="请输入图表名称"
                      name="name"
                      onChange={form.handleChange}
                      value={form.values.name}
                    />
                    <FormErrorMessage>请输入图表名字</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!form.errors.clipId}>
                    <Select
                      flex="1"
                      name="clipId"
                      placeholder="请选择数据集"
                      value={form.values.clipId}
                      onChange={form.handleChange}
                    >
                      {clipsData?.clipConnection.edges?.map(
                        ({ node: { id, name } }) => {
                          return (
                            <option key={id} value={id}>
                              {name}
                            </option>
                          );
                        }
                      )}
                    </Select>
                    <FormErrorMessage>请选择数据集</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={updateChartLoading}
                  >
                    保存
                  </Button>
                </Stack>
              </form>
            </Card>
          </GridItem>
          <GridItem colSpan={2}>
            <Box h="500px">
              {result && (
                <Card overflow="hidden" h="full">
                  <ChartResultPreview
                    config={getChartTypePreviewConfig()}
                    type={form.values.type}
                    result={result}
                  />
                </Card>
              )}
            </Box>
          </GridItem>
          <GridItem colSpan={1}>
            <Card>
              <ChartEditTab form={form} result={result} />
            </Card>
          </GridItem>
        </Grid>
      </Page>
    </>
  );
};

ChartEdit.layout = ProjectLayout;

export default ChartEdit;
