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
import { useFormik } from "formik";
import { omit } from "lodash";
import { FC, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateEffect } from "react-use";
import * as Yup from "yup";

import { ChartEditTab } from "../../components/ChartEditTab";
import { ChartResultPreview } from "../../components/ChartResultPreview";
import { Loading } from "../../components/Loading";
import {
  useChartQuery,
  useClipConnectionQuery,
  useCreateChartMutation,
  useUpdateChartMutation,
} from "../../generated/graphql";
import { useQueryResult } from "../../hooks/useQueryResult";
import { ChartType } from "../../types";

const ChartEdit: FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { chartId } = useParams<{ chartId: string }>();

  const { data: clipsData } = useClipConnectionQuery({
    variables: { first: 100 },
  });

  const { data, loading } = useChartQuery({
    variables: { id: chartId! },
    skip: !chartId,
  });

  const [createChart, { loading: createChartLoading }] =
    useCreateChartMutation();

  const [updateChart, { loading: updateChartLoading }] =
    useUpdateChartMutation();

  const form = useFormik({
    initialValues: {
      name: "",
      type: "" as ChartType,
      clipId: "",
      funnelConfig: { groupCol: "", valueCol: "" },
    },
    isInitialValid: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async () => {
      const input = {
        name: form.values.name,
        type: form.values.type,
        config: form.values.funnelConfig,
        clipId: form.values.clipId,
      };

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
        } else {
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
            navigate(`/charts/${result.data?.createChart.id}/edit`);
          }
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
        funnelConfig: {
          groupCol: data.chart.config?.groupCol || "",
          valueCol: data.chart.config?.valueCol || "",
        },
      };

      form.setValues(initialValues);
    }
  }, [data]);

  if (chartId && (loading || isLoading)) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>
          {result?.name ? `${result?.name} | 图表编辑` : `图表编辑`}
        </title>
      </Helmet>

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
            isLoading={updateChartLoading || createChartLoading}
          >
            保存
          </Button>
        </Stack>
      </form>

      <Flex flexWrap="nowrap">
        <Box h="calc(100vh - 152px)" w="70%">
          {result && (
            <ChartResultPreview
              config={
                form.values.type === ChartType.FUNNEL &&
                form.values.funnelConfig
                  ? {
                      keyField: form.values.funnelConfig.groupCol,
                      valueField: form.values.funnelConfig.valueCol,
                    }
                  : { keyField: "", valueField: "" }
              }
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

export default ChartEdit;
