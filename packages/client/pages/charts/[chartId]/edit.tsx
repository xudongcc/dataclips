import ProjectLayout from "../../../layouts/ProjectLayout";
import { useRouter } from "next/router";
import { Box, Grid, GridItem, useToast } from "@chakra-ui/react";
import {
  useClipConnectionQuery,
  useChartQuery,
  useUpdateChartMutation,
  UpdateChartInput,
} from "../../../generated/graphql";
import { useCallback, useEffect, useState } from "react";
import { ChartType } from "../../../types";
import { useQueryResult } from "../../../hooks/useQueryResult";
import { omit, isEqual } from "lodash";
import { Loading } from "../../../components/common/Loading";
import {
  ChartEditTab,
  chartTypeToFormFieldMap,
} from "../../../components/chart/ChartEditTab";
import { ChartResultPreview } from "../../../components/chart/ChartResultPreview";
import { Page } from "../../../components/common/Page";
import Head from "next/head";
import { Col, Form, Row, Select, Button, Input } from "antd";
import { Card } from "../../../components/common/Card";
import useContextualSaveBarState from "../../../components/common/ContextualSaveBar/useContextualSaveBarState";
import { ContextualSaveBar } from "../../../components/common/ContextualSaveBar";

const { Option } = Select;

const ChartEdit = () => {
  const toast = useToast();
  const router = useRouter();
  const [form] = Form.useForm();
  const [, setIsChange] = useContextualSaveBarState();
  const { chartId } = router.query as { chartId: string };

  const [selectClipId, setSelectClipId] = useState("");

  const { data: clipsData, loading: clipsLoading } = useClipConnectionQuery({
    variables: { first: 100 },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  const { data, loading } = useChartQuery({
    variables: { id: chartId },
    skip: !chartId,
  });

  const [updateChart, { loading: updateChartLoading }] =
    useUpdateChartMutation();

  const { data: result } = useQueryResult(selectClipId);

  // 保存更新
  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();

      const input = {
        name: values.name,
        type: values.type,
        tags: values?.tags,
        config: [
          { type: ChartType.FUNNEL, config: values.funnelConfig },
          { type: ChartType.METRIC, config: values.metricConfig },
          { type: ChartType.LINE, config: values.lineConfig },
          { type: ChartType.BAR, config: values.barConfig },
          { type: ChartType.PIE, config: values.pieConfig },
          { type: ChartType.MD, config: values.mdConfig },
        ].find((item) => item.type === values.type).config,
        clipId: values.clipId,
      } as UpdateChartInput;

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

      setIsChange(false);

      setTimeout(() => {
        router.push(`/charts/${chartId}`);
      });
    } catch (err) {
      console.error(err);
    }
  }, [chartId, form, router, setIsChange, toast, updateChart]);

  useEffect(() => {
    if (data?.chart?.clip?.id) {
      setSelectClipId(data?.chart?.clip?.id);
    }
  }, [data?.chart?.clip?.id]);

  if (chartId && loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{data?.chart?.name} - 编辑 - 图表</title>
      </Head>

      <Page title={data?.chart?.name}>
        <Form
          form={form}
          onValuesChange={(_, values) => {
            // 不使用 setTimeout 会获取上次的值，待查
            setTimeout(() => {
              if (
                !isEqual(
                  {
                    name: data?.chart?.name,
                    tags: data?.chart?.tags,
                    type: data?.chart?.type,
                    clipId: data?.chart?.clip?.id,
                    [chartTypeToFormFieldMap[data?.chart?.type]]:
                      data?.chart?.config,
                  },
                  form.getFieldsValue()
                )
              ) {
                setIsChange(true);
              } else {
                setIsChange(false);
              }
            });
          }}
          layout="vertical"
          initialValues={{
            ...omit(data?.chart, [
              "createdAt",
              "id",
              "token",
              "config",
              "updatedAt",
              "__typename",
            ]),
            clipId: data?.chart?.clip?.id,
            [chartTypeToFormFieldMap[data?.chart?.type]]: data?.chart?.config,
          }}
        >
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem colSpan={3}>
              <Card>
                <Row gutter={[16, 16]} justify="space-between">
                  <Col span={8}>
                    <Form.Item
                      name="name"
                      style={{ marginBottom: 0 }}
                      rules={[{ required: true, message: "请输入图表名称" }]}
                    >
                      <Input placeholder="请输入图表名称" />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item
                      name="clipId"
                      style={{ marginBottom: 0 }}
                      rules={[{ required: true, message: "请选择数据集" }]}
                    >
                      <Select
                        optionFilterProp="children"
                        showSearch
                        loading={clipsLoading}
                        onChange={(clipId) => {
                          setSelectClipId(clipId);

                          if (clipId === data?.chart?.clip?.id) {
                            form.setFieldsValue(
                              omit(data?.chart, [
                                "createdAt",
                                "id",
                                "token",
                                "config",
                                "updatedAt",
                                "__typename",
                              ])
                            );
                          } else {
                            form.setFieldsValue({ type: undefined });
                          }
                        }}
                        placeholder="请选择数据集"
                      >
                        {clipsData?.clipConnection.edges?.map(
                          ({ node: { id, name } }) => {
                            return (
                              <Option key={id} value={id}>
                                {name}
                              </Option>
                            );
                          }
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item noStyle>
                      <Button
                        type="primary"
                        loading={updateChartLoading}
                        onClick={handleSubmit}
                      >
                        保存
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </GridItem>

            <GridItem colSpan={2}>
              <Box h="500px">
                <Card>
                  {result && (
                    <Form.Item
                      shouldUpdate={(prevValues, curValues) => {
                        if (
                          isEqual(
                            omit(prevValues, "name"),
                            omit(curValues, "name")
                          )
                        ) {
                          return false;
                        }
                        return true;
                      }}
                      noStyle
                    >
                      {({ getFieldValue }) => {
                        return (
                          <ChartResultPreview
                            config={getFieldValue(
                              chartTypeToFormFieldMap[getFieldValue("type")]
                            )}
                            type={getFieldValue("type")}
                            result={result}
                          />
                        );
                      }}
                    </Form.Item>
                  )}
                </Card>
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Card>
                <ChartEditTab result={result} />
              </Card>
            </GridItem>
          </Grid>
        </Form>

        <ContextualSaveBar
          onCancel={() => {
            router.push("/charts");
          }}
          okButtonProps={{
            loading: updateChartLoading,
          }}
          onOK={() => {
            handleSubmit();
          }}
        />
      </Page>
    </>
  );
};

ChartEdit.layout = ProjectLayout;

export default ChartEdit;
