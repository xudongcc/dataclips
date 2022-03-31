import {
  Stack,
  FormControl,
  Input,
  FormErrorMessage,
  Select,
  Button,
  useToast,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { ChartEditTab } from "../../components/ChartEditTab";
import { ChartResultPreview } from "../../components/ChartResultPreview";
import ProjectLayout from "../../layouts/ProjectLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FunnelChartConfig,
  MetricChartConfig,
  LineChartConfig,
  BarChartConfig,
  PieChartConfig,
} from "../../components/ChartResultPreview/components";
import { ChartType } from "../../types";
import { Loading } from "../../components/Loading";
import {
  CreateChartInput,
  useClipConnectionQuery,
} from "../../generated/graphql";

import { useQueryResult } from "../../hooks/useQueryResult";
import { useRouter } from "next/router";
import { useCreateChartMutation } from "../../hooks/useCreateChartMutation";
import { Page } from "../../components/Page";
import Head from "next/head";
import { Card } from "../../components/Card";

const ChartCreate = () => {
  const router = useRouter();
  const toast = useToast();

  const { data: clipsData } = useClipConnectionQuery({
    variables: { first: 100 },
  });

  const [createChart, { loading: createChartLoading }] =
    useCreateChartMutation();

  const form = useFormik({
    initialValues: {
      name: "",
      type: "" as ChartType,
      clipId: "",
      format: "",
      funnelConfig: { groupCol: "", valueCol: "" },
      metricConfig: { valueCol: "", compareCol: "" },
      lineConfig: { xCol: "", yCol: [] },
      barConfig: { isStack: false, variant: "", xCol: "", yCol: [] },
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
        format: form.values.format,
        config: [
          { type: ChartType.FUNNEL, config: form.values.funnelConfig },
          { type: ChartType.METRIC, config: form.values.metricConfig },
          { type: ChartType.LINE, config: form.values.lineConfig },
          { type: ChartType.BAR, config: form.values.barConfig },
          { type: ChartType.PIE, config: form.values.pieConfig },
        ].find((item) => item.type === form.values.type).config,
        clipId: form.values.clipId,
      } as CreateChartInput;

      try {
        const result = await createChart({
          variables: {
            input,
          },
        });
        toast({
          description: "创建成功",
          status: "success",
          isClosable: true,
        });
        if (result.data?.createChart.id) {
          router.push(`/charts/${result.data?.createChart.id}/edit`);
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
        groupCol: form.values.funnelConfig.groupCol || "",
        valueCol: form.values.funnelConfig.valueCol || "",
      } as FunnelChartConfig;
    }

    if (form.values.type === ChartType.METRIC) {
      return {
        format: form.values.format || "",
        valueCol: form.values.metricConfig.valueCol || "",
        compareCol: form.values.metricConfig.compareCol || "",
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
        isStack: !!form.values.barConfig?.isStack,
        variant: form.values.barConfig?.variant || "",
        xCol: form.values.barConfig?.xCol || "",
        yCol: form.values.barConfig?.yCol || [],
      } as BarChartConfig;
    }

    if (form.values.type === ChartType.PIE) {
      return {
        format: form.values.format || "",
        variant: form.values.pieConfig?.variant || "",
        key: form.values.pieConfig?.key || "",
        value: form.values.pieConfig?.value || "",
      } as PieChartConfig;
    }

    return undefined;
  }, [form]);

  // 初始配置
  useEffect(() => {
    if (!form.values.clipId) {
      form.setValues(form.initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>创建 - 图表</title>
      </Head>

      <Page title="创建图表">
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <GridItem colSpan={3}>
            <Card>
              <form onSubmit={form.handleSubmit}>
                <Stack spacing={3} direction="row">
                  <FormControl width="30%" isInvalid={!!form.errors.name}>
                    <Input
                      placeholder="请输入图表名称"
                      {...form.getFieldProps("name")}
                      onChange={form.handleChange}
                      value={form.values.name}
                    />
                    <FormErrorMessage>请输入图表名字</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!form.errors.clipId}>
                    <Select
                      flex="1"
                      {...form.getFieldProps("clipId")}
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
                    isLoading={createChartLoading}
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

ChartCreate.layout = ProjectLayout;

export default ChartCreate;
