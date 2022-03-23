import {
  Stack,
  FormControl,
  Input,
  FormErrorMessage,
  Select,
  Button,
  useToast,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useUpdateEffect } from "react-use";
import { useCallback } from "react";
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
      funnelConfig: { groupCol: "", valueCol: "" },
      metricConfig: { valueCol: "", compareCol: "" },
      lineConfig: { xCol: "", yCol: [] },
      barConfig: { variant: "", xCol: "", yCol: [] },
    },
    isInitialValid: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async () => {
      const input = {
        name: form.values.name,
        type: form.values.type,
        config: [
          { type: ChartType.FUNNEL, config: form.values.funnelConfig },
          { type: ChartType.METRIC, config: form.values.metricConfig },
          { type: ChartType.LINE, config: form.values.lineConfig },
          { type: ChartType.BAR, config: form.values.barConfig },
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
        groupCol: form.values.funnelConfig.groupCol || "",
        valueCol: form.values.funnelConfig.valueCol || "",
      } as FunnelChartConfig;
    }

    if (form.values.type === ChartType.METRIC) {
      return {
        valueCol: form.values.metricConfig.valueCol || "",
        compareCol: form.values.metricConfig.compareCol || "",
      } as MetricChartConfig;
    }

    if (form.values.type === ChartType.LINE) {
      return {
        xCol: form.values.lineConfig?.xCol || "",
        yCol: form.values.lineConfig?.yCol || [],
      } as LineChartConfig;
    }

    if (form.values.type === ChartType.BAR) {
      return {
        variant: form.values.barConfig?.variant || "",
        xCol: form.values.barConfig?.xCol || "",
        yCol: form.values.barConfig?.yCol || [],
      } as BarChartConfig;
    }

    return undefined;
  }, [form]);

  // 初始配置
  useUpdateEffect(() => {
    if (!form.values.clipId) {
      form.setValues(form.initialValues);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <form onSubmit={form.handleSubmit}>
        <Stack pb={4} spacing={3} direction="row">
          <FormControl width="30%" isInvalid={!!form.errors.name}>
            <Input
              size="sm"
              borderRadius="md"
              placeholder="请输入图表名称"
              {...form.getFieldProps("name")}
              onChange={form.handleChange}
              value={form.values.name}
            />
            <FormErrorMessage>请输入图表名字</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!form.errors.clipId}>
            <Select
              size="sm"
              borderRadius="md"
              flex="1"
              {...form.getFieldProps("clipId")}
              placeholder="请选择数据源"
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
            <FormErrorMessage>请选择数据源</FormErrorMessage>
          </FormControl>

          <Button
            size="sm"
            type="submit"
            colorScheme="blue"
            isLoading={createChartLoading}
          >
            保存
          </Button>
        </Stack>
      </form>

      <Flex flexWrap="nowrap">
        <Box h="calc(100vh - 152px)" w="70%">
          {result && (
            <ChartResultPreview
              config={getChartTypePreviewConfig()}
              type={form.values.type}
              result={result}
            />
          )}
        </Box>

        <Box w="30%">
          <ChartEditTab form={form} result={result}></ChartEditTab>
        </Box>
      </Flex>
    </>
  );
};

ChartCreate.layout = ProjectLayout;

export default ChartCreate;
