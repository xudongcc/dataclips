import ProjectLayout from "../../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
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
import { FunnelChartConfig } from "../../../components/ChartResultPreview/components/FunnelChart";
import { MetricChartConfig } from "../../../components/ChartResultPreview/components/MetricChart";
import { useUpdateEffect } from "react-use";
import { omit } from "lodash";
import { Loading } from "../../../components/Loading";
import { ChartEditTab } from "../../../components/ChartEditTab";
import { ChartResultPreview } from "../../../components/ChartResultPreview";

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
      funnelConfig: { groupCol: "", valueCol: "" },
      metricConfig: { valueCol: "", compareCol: "" },
    },
    isInitialValid: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async () => {
      const input = {
        name: form.values.name,
        type: form.values.type,
        config:
          form.values.type === ChartType.FUNNEL
            ? form.values.funnelConfig
            : form.values.metricConfig,
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
            description: "更新成功",
            status: "success",
            isClosable: true,
          });
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

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 初始配置
  useUpdateEffect(() => {
    if (!form.values.clipId) {
      form.setValues(form.initialValues);
    }
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

      form.setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (chartId && (loading || isLoading)) {
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
              name="name"
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
              name="clipId"
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
            isLoading={updateChartLoading}
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

ChartEdit.layout = ProjectLayout;

export default ChartEdit;
